import dotenv from "dotenv";
dotenv.config();

import OTP from "../models/otpModel.js";
import { sendOTP, sendOTPResend } from "../utils/sendOTP.js";
import { verifyIdToken } from "../utils/googleAuthService.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import Directory from "../models/directoryModel.js";
import { fetchGithubUser } from "../utils/githubAuthService.js";
import { google } from "googleapis";
import { oauth2Client } from "../utils/googleDriveAuthService.js";
import GoogleTokens from "../models/googleTokensModel.js";
import { getNewAccessToken } from "../utils/getNewAccessToken.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import RecoveryEmail from "../models/recoveryEmailModel.js";

// redis 
import rediclient from "../database/redis.js";

// zod 
import z, { promise } from "zod/v4";
import { otpSchema, sendOtpSchema, setGooglePasswordSchema } from "../validators/authSchema.js";


// send otp 
export const sendOTPUser = async (req, res, next) => {

  // schema 
  const { success, data, error } = sendOtpSchema.safeParse(req.body)
  if (!success) return res.status(400).json({
    detail: {
      email: z.flattenError(error).fieldErrors.email,
      password: z.flattenError(error).fieldErrors.password,
      name: z.flattenError(error).fieldErrors.name
    }
  })

  const { email } = data;
  if (!email) return res.status(400).json({ error: "enter email" });

  // check email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already in use" });
  }

  try {
    const otp = await OTP.findOne({ email: email });
    // sendOTP(email);
    await sendOTPResend(email);
    return res.status(200).json({ message: `OTP Send to ${email}` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// verify otp
export const verifyOtp = async (req, res, next) => {

  // schema 
  const { success, data, error } = otpSchema.safeParse(req.body)

  if (!success) {
    return res.status(400).json({ error: "Invalid Credentials" });
  }

  const { email, otp } = data;

  try {
    const otpModel = await OTP.findOne({ email: email });
    if (!otpModel) {
      return res.status(400).json({ error: "OTP expired Please Resend the OTP" });
    }
    if (otpModel.otp != otp) {
      return res.status(400).json({ error: "OTP does not Match" });
    }

    return res.status(200).json({ message: "OTP Succesfully Match" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


// login with github 
export const loginWithGithub = async (req, res, next) => {
  const params = new URLSearchParams({
    client_id: "Ov23liPF52IMctxkH6Jm",
    redirect_uri: `${process.env.BASE_URL || "http://localhost:2000"}/auth/github/callback`,
    scope: "read:user user:email",
    allow_signup: true,
  }).toString();

  const githubAuthURL = `https://github.com/login/oauth/authorize?${params}`;
  return res.redirect(githubAuthURL);
};
// Callback handler for GitHub OAuth
export const githubCallback = async (req, res, next) => {
  const { code } = req.query;

  if (!code) return res.status(400).send("No code provided");

  const { userData, email } = await fetchGithubUser(code);
  const { id, name, avatar_url } = userData;

  const user = await User.findOne({ email }).lean();

  // redis session & key 
  const sessionId = crypto.randomUUID()
  const redisKey = `session:${sessionId}`;
  const sessionExpiry = 1000 * 60 * 60 * 24 * 7


  if (user) {

    //  active session 
    const activeSessions = await rediclient.ft.search("userIdIdx", `@userId:{${user._id.toString()}}`, {
      RETURN: []
    })

    // ---->> login device limit
    const DEVICE_LIMITS = {
      free: 1,
      starter: 2,
      pro: 4,
      ultimate: 8
    }

    const deviceLimit = user.userIs === "free" || user.subscriptionTier === "expired" ? DEVICE_LIMITS.free : DEVICE_LIMITS[user.subscriptionTier] || DEVICE_LIMITS.free;

    if (activeSessions.total >= deviceLimit) {
      await rediclient.del(activeSessions.documents[0].id);
    }

    // redis session 
    await rediclient.json.set(redisKey, "$", { userId: user._id.toString() })
    await rediclient.expire(redisKey, sessionExpiry / 1000)

    // user session
    await rediclient.sAdd(`userSession:${user._id.toString()}`, sessionId)

    res.cookie("sid", sessionId, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
      sameSite: "none",
      secure: true
    });
    await User.updateOne({ email }, { $set: { loginWith: "github" } });

    return res.redirect(process.env.CLIENT_URL || "http://localhost:5173");

  }

  const session = await mongoose.startSession();

  try {
    const userId = new mongoose.Types.ObjectId();
    const rootDirId = new mongoose.Types.ObjectId();

    session.startTransaction();

    const user = new User(
      {
        _id: userId,
        rootDirId,
        name,
        email,
        picture: avatar_url,
        loginWith: "github",
        userTimeStamp: {
          userCreatedAt: new Date(),
          userLoginAt: [],
          userLogoutAt: [],
        },
      },
    );
    await user.save({ session });

    const directory = new Directory(
      {
        _id: rootDirId,
        parentDirId: null,
        userId,
        name: `root-${email}`,
        folderTimeStamp: {
          folderCreatedAt: new Date(),
          opened: [],
          lastModified: [],
          lastDownload: [],
        },
      },
    );
    await directory.save({ session });

    // redis session 
    await rediclient.json.set(redisKey, "$", { userId: user._id.toString() })
    await rediclient.expire(redisKey, sessionExpiry / 1000)

    // user session
    await rediclient.sAdd(`userSession:${user._id.toString()}`, sessionId)


    res.cookie("sid", sessionId, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
      sameSite: "none",
      secure: true
    });

    await session.commitTransaction();

    return res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
  }
  catch (err) {
    await session.abortTransaction();
    return res.status(400).json({ error: "invalid fields", details: err });
  }
}

// Google login handler
export const loginWithGoogle = async (req, res, next) => {

  const idToken = req.body.credential
  const { sub, email, name, picture } = await verifyIdToken(idToken)
  const user = await User.findOne({ email }).lean();

  // redis keys & expiery 
  const sessionId = crypto.randomUUID()
  const redisKey = `session:${sessionId}`;
  const sessionExpiry = 1000 * 60 * 60 * 24 * 7

  if (user) {

    if (user.isDeleted) {
      return res.status(403).json({ error: "Your account has been deleted. Please contact support." });
    }

    // check active session and limit to 2 login
    const activeSessions = await rediclient.ft.search("userIdIdx", `@userId:{${user._id.toString()}}`, {
      RETURN: [],
    })

    // ---->> login device limit
    const DEVICE_LIMITS = {
      free: 1,
      starter: 2,
      pro: 4,
      ultimate: 8
    }

    const deviceLimit = user.userIs === "free" || user.subscriptionTier === "expired" ? DEVICE_LIMITS.free : DEVICE_LIMITS[user.subscriptionTier] || DEVICE_LIMITS.free;

    if (activeSessions.total >= deviceLimit) {
      await rediclient.del(activeSessions.documents[0].id);
    }

    // create redis session and cookie
    await rediclient.json.set(redisKey, "$", { userId: user._id })
    await rediclient.expire(redisKey, sessionExpiry / 1000)

    // user session
    await rediclient.sAdd(`userSession:${user._id.toString()}`, sessionId)

    res.cookie("sid", sessionId, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
      sameSite: "none",
      secure: true
    });

    if (!user.password) {
      return res.status(206).json({ message: "User Logged In, Please set your password", email });
    }

    await User.updateOne({ email }, { $set: { loginWith: "google" } });
    return res.status(200).json({ message: "User Logged In" });
  }

  const session = await mongoose.startSession();

  try {
    const userId = new mongoose.Types.ObjectId();
    const rootDirId = new mongoose.Types.ObjectId();

    session.startTransaction();

    const user = new User(
      {
        _id: userId,
        rootDirId,
        name,
        email,
        picture,
        loginWith: "google",
        userTimeStamp: {
          userCreatedAt: new Date(),
          userLoginAt: [],
          userLogoutAt: [],
        },
      },
    );
    await user.save({ session });

    const directory = new Directory(
      {
        _id: rootDirId,
        parentDirId: null,
        userId,
        name: `root-${email}`,
        folderTimeStamp: {
          folderCreatedAt: new Date(),
          opened: [],
          lastModified: [],
          lastDownload: [],
        },
      },
    );
    await directory.save({ session });


    // create redis session 
    await rediclient.json.set(redisKey, "$", { userId: user._id })
    await rediclient.expire(redisKey, sessionExpiry / 1000)

    // user session
    await rediclient.sAdd(`userSession:${user._id.toString()}`, sessionId)

    res.cookie("sid", sessionId, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
      sameSite: "none",
      secure: true
    });

    await session.commitTransaction();

    // if user dont have password while login with google
    if (!user.password) {
      return res.status(206).json({ message: "User Logged In, Please set your password", email });
    }

    return res.status(200).json({ message: "User Logged In" });

  } catch (err) {
    session.abortTransaction();
    // console.log(err);
    return res.status(400).json({ error: "invalid fields", details: err });
  }

}
// set google password 
export const setGooglePassword = async (req, res) => {

  // schema 
  const { success, data, error } = setGooglePasswordSchema.safeParse(req.body)
  if (!success) return res.status(400).json({
    detail: {
      password: z.flattenError(error).fieldErrors.password,
      confirmPassword: z.flattenError(error).fieldErrors.confirmPassword
    }
  })


  const { password, confirmPassword } = data;

  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, error: "Password and confirm password are required." });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, error: "Passwords do not match." });
  }

  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found." });
    }

    if (user.password) {
      return res
        .status(409) // 409 Conflict (already exists)
        .json({ success: false, message: "Password is already set for this account." });
    }

    user.password = password; // ⚠️ yaha hash karna mat bhoolna bcrypt se
    await user.save();

    return res
      .status(201) // 201 Created (new password created)
      .json({ success: true, message: "Password has been set successfully." });

  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong. Please try again later." });
  }
};


// google Drive callback 
export const googleCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const userId = req.user._id;

    if (req.query.error) {
      return res.send(`
        <script>
          window.opener.postMessage({ success: false, error: "User cancelled" }, "*");
          window.close();
        </script>
      `);
    }

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const { tokens } = await oauth2Client.getToken(code);

    // check if already saved
    const existingGoogleToken = await GoogleTokens.findOne({ userId }).lean();

    // basic token fields
    const updateData = {
      "tokens.access_token": tokens.access_token,
      "tokens.scope": tokens.scope,
      "tokens.token_type": tokens.token_type,
      "tokens.expiry_date": tokens.expiry_date
    };


    // only set refresh_token if it's provided by Google
    if (tokens.refresh_token) {
      updateData["tokens.refresh_token"] = tokens.refresh_token;
    }

    await GoogleTokens.updateOne(
      { userId },
      { $set: updateData },
      { upsert: true }
    );


    if (existingGoogleToken) {
      if (existingGoogleToken?.tokens.expiry_date <= Date.now()) {
        const newAccessToken = await getNewAccessToken(existingGoogleToken?.tokens?.refresh_token)
        await GoogleTokens.updateOne(
          { userId },
          {
            $set: {
              "tokens.access_token": newAccessToken.access_token,
              "tokens.expiry_date": newAccessToken.expiry_date
            }
          }
        )
      }
    }

    return res.send(`
      <script>
        window.opener.postMessage({ success: true }, "*");
        window.close();
      </script>
    `);
  } catch (err) {
    // console.error("Error in Google Callback:", err);
    res.status(500).send("Google auth failed");
  }
};

// fetch files and folder
export const googleDriveFilesFolder = async (req, res) => {
  const userId = req.user._id;
  try {

    const googleToken = await GoogleTokens.findOne({ userId });
    // console.log(googleToken);

    oauth2Client.setCredentials(googleToken.tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const result = await drive.files.list({
      pageSize: 1000,
      fields: "files(id, name, size, mimeType, webViewLink, thumbnailLink, createdTime)"
    });

    // console.log("Files in folder:", result.data.files);
    return res.status(200).json({ files: result.data.files });

  } catch (err) {
    // console.error("Error in Google Drive Files Folder:", err);
    res.status(500).send("Google Drive API failed");
  }
};


// get google drive file blob by file id 
export const getGoogleDriveFileBlob = async (req, res) => {
  const userId = req.user._id;
  const fileId = req.params.fileId;

  try {
    const googleToken = await GoogleTokens.findOne({ userId });
    oauth2Client.setCredentials(googleToken.tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // 1. Pehle file ka metadata lein (taaki MimeType pata chale)
    const metadata = await drive.files.get({ fileId: fileId, fields: "mimeType, name , size" });

    // 2. Ab media fetch karein
    const driveResponse = await drive.files.get(
      { fileId: fileId, alt: "media" },
      { responseType: "stream" }
    );

    // 3. Headers set karein (Zaroori Fix)
    res.setHeader("Content-Type", metadata.data.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${metadata.data.name}"`);
    res.setHeader("Content-Length", metadata.data.size);
    // res.setHeader("token", "google-drive");

    driveResponse.data.pipe(res);

  } catch (err) {
    // console.error("Error in Google Drive File Blob:", err);
    res.status(500).send("Google Drive API failed");
  }
};

// request recovery  
export const requestRecovery = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email, isDeleted: true });
    if (!user) return res.status(400).json({ error: `No deleted account found for ${email}` });

    const token = crypto.randomBytes(32).toString("hex");

    await RecoveryEmail.create({ email, token });


    const link = `${process.env.CLIENT_URL || "http://localhost:5173"}/recover-account?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"BastaStorage" <sunil.kksdk@gmail.com>',
      to: email,
      subject: "Recover Your BastaStorage Account",
      html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #4f46e5; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">BastaStorage</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px; text-align: center;">
        <h2 style="color: #333;">Recover Your Account</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6;">
          We noticed that your BastaStorage account is marked for recovery.  
          To restore access, please click the button below.
        </p>

        <a href="${link}" 
           style="display: inline-block; margin-top: 20px; padding: 12px 24px; 
                  background: #4f46e5; color: #fff; text-decoration: none; 
                  border-radius: 8px; font-weight: bold;">
          Recover Account
        </a>

        <p style="margin-top: 20px; font-size: 13px; color: #888;">
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} BastaStorage. All rights reserved.
      </div>
    </div>
  </div>
  `,
    });


    return res.status(200).json({ message: `Recovery email sent to ${email}` });
  }
  catch {
    return res.status(500).json({ error: "Internal server error" });
  }
}
// recover account 
export const recoverAccount = async (req, res) => {
  const { token } = req.body;
  const recoveryData = await RecoveryEmail.findOne({ token })
  if (!recoveryData) {
    return res.status(400).json({ error: `Invalid ${recoveryData.email}` })
  }
  await User.updateOne({ email: recoveryData.email }, { isDeleted: false })
  await RecoveryEmail.deleteOne({ token })

  return res.status(200).json({ message: `Your ${recoveryData.email} account has been successfully recovered. You can now log in.` })
}
