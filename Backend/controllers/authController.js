import OTP from "../models/otpModel.js";
import { sendOTP } from "../utils/sendOTP.js";
import { verifyIdToken } from "../utils/googleAuthService.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import Directory from "../models/directoryModel.js";
import Session from "../models/sessionModel.js";
import { fetchGithubUser } from "../utils/githubAuthService.js";

export const sendOTPUser = async (req, res, next) => {
  const { email } = req.body;
try {
  
  if (!email) {
    return res.status(400).json({ error: "enter email" });
  }
  const otp = await OTP.findOne({ email: email });
  sendOTP(email);
  return res.json({ message: `OTP Send to ${email}` });
} catch (error) {
  return res.status(400).json({ error: error.message });
}
};

// verify otp
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;


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

// Google login handler
export const loginWithGoogle = async (req, res, next) => {
  const idToken = req.body.credential

  const { sub, email, name, picture } = await verifyIdToken(idToken)

  const user = await User.findOne({ email }).lean();

  if (user) {
    const activeSessions = await Session.find({ userId: user._id }).sort({
      createdAt: 1,
    });

    if (activeSessions.length >= 2) {
      await Session.findByIdAndDelete(activeSessions[0]._id);
    }
    const createSession = await Session.create({ userId: user._id });
    res.cookie("sid", createSession.id, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });

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


    const createSession = await Session.create({ userId });

    res.cookie("sid", createSession.id, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });

    await session.commitTransaction();

    return res.status(200).json({ message: "User Logged In" });

  } catch (err) {
    session.abortTransaction();
    return res.status(400).json({ error: "invalid fields", details: err });
  }

}


// login with github 
export const loginWithGithub = async (req, res, next) => {
  const params = new URLSearchParams({
    client_id: "Ov23liPF52IMctxkH6Jm",
    redirect_uri: "http://localhost:2000/auth/github/callback",
    scope: "read:user user:email",
    allow_signup: true,
  }).toString();

  const githubAuthURL = `https://github.com/login/oauth/authorize?${params}`;
  res.redirect(githubAuthURL);
};

// Callback handler for GitHub OAuth
export const githubCallback = async (req, res, next) => {
  const { code } = req.query;

  if (!code) return res.status(400).send("No code provided");

  const { userData, email } = await fetchGithubUser(code);
  const { id, name, avatar_url } = userData;

  const user = await User.findOne({ email }).lean();

  if (user) {
    const activeSessions = await Session.find({ userId: user._id }).sort({
      createdAt: 1,
    });

    if (activeSessions.length >= 2) {
      await Session.findByIdAndDelete(activeSessions[0]._id);
    }
    const createSession = await Session.create({ userId: user._id });
    res.cookie("sid", createSession.id, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });

    return res.redirect("http://localhost:5173/");

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


    const createSession = await Session.create({ userId });

    res.cookie("sid", createSession.id, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 1000 * 60 * 24 * 7,
    });

    await session.commitTransaction();

    return res.redirect("http://localhost:5173/");
  }
  catch (err) {
    await session.abortTransaction();
    return res.status(400).json({ error: "invalid fields", details: err });
  }
}