import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import OTP from "../models/otpModel.js";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import { Upload } from "@aws-sdk/lib-storage";

import rediclient from "../database/redis.js";

// zod 
import z from "zod/v4";
import { loginSchema, registerSchema, updateUserRoleSchema } from "../validators/userSchema.js";
import { createGetSignedUrl, deleteFileFromS3, generateSignedUrl, s3Client } from "../services/s3.js";
import path from "path";
import { sendWelcomeMail } from "../services/mail/welcomeMail.js";



// ----------- ) register user
export const registerUser = async (req, res, next) => {

  // schema 
  const { success, data, error } = registerSchema.safeParse(req.body)
  if (!success) {
    return res.status(400).json({
      detail: {
        name: z.flattenError(error).fieldErrors.name,
        email: z.flattenError(error).fieldErrors.email,
        password: z.flattenError(error).fieldErrors.password,
        otp: z.flattenError(error).fieldErrors.otp
      }
    });
  }

  // verify all field 
  const { name, email, password, otp } = data;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All files are required" });
  }

  // check email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already in use" });
  }

  // verify otp 
  const otpRecord = await OTP.findOne({ email, otp });

  if (otpRecord?.email != email) {
    return res.status(400).json({ otpExpiredError: "OTP Expired or Session Timed Out. Please send a new OTP." });
  }
  if (!otpRecord) {
    return res.status(400).json({ error: "Invalid Email" });
  }


  const session = await mongoose.startSession();
  try {
    const userId = new mongoose.Types.ObjectId();
    const rootDirId = new mongoose.Types.ObjectId();

    session.startTransaction();

    // create user 
    const user = new User(
      {
        _id: userId,
        rootDirId,
        name,
        email,
        password,
        picture: "",
        userTimeStamp: {
          userCreatedAt: new Date(),
          userLoginAt: [],
          userLogoutAt: [],
        },
      },

    );
    await user.save({ session });

    // create user directory 
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

    await session.commitTransaction();

    await sendWelcomeMail(email, name);

    return res.status(200).json({ message: "User Register" });

  } catch (err) {
    session.abortTransaction();
    if (err.code === 121) {
      return res.status(400).json({ error: "invalid fields", details: err });
    } else if (err.code === 11000) {
      if (err.keyValue.email) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    } else {
      next(err);
    }
  }
};

// list user all files and directories
export const getUserFileDirectories = async (req, res) => {
  const userId = req.user._id;
  try {

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const directories = await Directorie.find({ userId: user.id }).lean();
    const files = await File.find({ userId: user.id }).lean();
    return res.status(200).json({ directories: directories, files: files });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ----------- ) login user
export const loginUser = async (req, res) => {

  // login schema 
  const { success, data, error } = loginSchema.safeParse(req.body)
  if (!success) {
    return res.status(400).json({ error: "Invalid Credentials" });
  }

  const { email, password } = data;

  try {
    // check user email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Invalid email or password" });

    // check if user is deleted
    if (user.isDeleted) {
      return res.status(403).json({ error: "Your account has been deleted. Please contact support." });
    }

    // check is user login with social link and not set password
    if (!user.password) {
      return res.status(400).json({ error: `This email is linked with ${user.loginWith}. Please login using Social Login or set a password from your profile.` });
    }


    // update login with 
    if (user) {
      user.loginWith = "email";
      await user.save();
    }


    // comparing password 
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(404).json({ error: "Invalid credentials" });

    // check active session and limit to 2 login
    const activeSessions = await rediclient.ft.search("userIdIdx", `@userId:{${user.id}}`, {
      RETURN: [],
    })


    // ---->> login device limit
    const DEVICE_LIMITS = {
      free: 1,
      starter: 2,
      pro: 4,
      ultimate: 8
    }

    const deviceLimit = user.userIs === "free" || req.subscription?.status === "expired" ? DEVICE_LIMITS.free : DEVICE_LIMITS[user.subscriptionTier] || DEVICE_LIMITS.free;

    if (activeSessions.total >= deviceLimit) {
      await rediclient.del(activeSessions.documents[0].id);
    }


    // create redis session and cookie
    const sessionId = crypto.randomUUID()
    const redisKey = `session:${sessionId}`;
    const sessionExpiry = 1000 * 60 * 60 * 24 * 7

    const pipeline = await rediclient.multi()

    // session store userId 
    pipeline.json.set(redisKey, "$", {
      userId: user._id,
    })

    // user session tracker
    pipeline.sAdd(`userSession:${user._id}`, sessionId);
    pipeline.expire(redisKey, sessionExpiry / 1000)

    pipeline.exec()

    res.cookie("sid", sessionId, {
      httpOnly: true,
      signed: true,
      maxAge: sessionExpiry,
      sameSite: "lax",
      secure: true
    });

    // update user timestamp 
    await User.updateOne(
      { email },
      { $push: { "userTimeStamp.userLoginAt": new Date() } }
    );

    return res.status(200).json({ message: "login success" });
  } catch (error) {
    return res.status(500).json({ error: "somethig went wrong" });
  }
};

// logout user
export const logoutUser = async (req, res) => {
  const { sid } = req.signedCookies;

  const pipeline = rediclient.multi();

  // session
  pipeline.del(`session:${sid}`);
  // userSession
  pipeline.sRem(`userSession:${req.user._id.toString()}`, sid);

  await pipeline.exec();

  res.clearCookie("sid");
  await User.updateOne(
    { _id: new mongoose.Types.ObjectId(req.user.id) },
    { $push: { "userTimeStamp.userLogoutAt": new Date() } }
  );

  return res.status(200).json({ message: "user log out" });
};


// logout from all device
export const logoutAllDevice = async (req, res) => {
  const { sid } = req.signedCookies;

  // 2. find all session of user and delete
  const userSessionKey = `userSession:${req.user._id.toString()}`
  const userSessions = await rediclient.sMembers(userSessionKey);

  // delete user session set
  if (userSessions.length > 0) {

    const pipeline = rediclient.multi()
    for (const sessionId of userSessions) {
      pipeline.del(`session:${sessionId}`);
    }
    pipeline.del(userSessionKey);
    await pipeline.exec();

  }

  // 3. Clear cookie
  res.clearCookie("sid");
  return res.status(200).json({ message: "user log out from all device" });
};


// update user profile 
export const updateUserProfile = async (req, res) => {

  const userId = req.user._id;
  const { sid } = req.signedCookies;
  const { name } = req.body;

  let updateData = { name };


  if (name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters long" });
  }
  if (req.file && req.file.size > 5 * 1024 * 1024) {  // 5MB
    return res.status(400).json({ error: "File size should be less than 5MB" });
  }

  try {
    // match session
    const session = await rediclient.json.get(`session:${sid}`)
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    // generate file key
    const extenstion = req.file ? path.extname(req.file.originalname) : null;
    const key = `user-profile-${userId}${extenstion}`

    // delete old photo from s3 if exists
    if (req.file && req.user.picture) {
      deleteFileFromS3(req.user?.pictureKey).catch((err) => {
      })
    }


    if (req.file) {

      // save user photo to s3 
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        }
      })
      await upload.done();

      // update fields
      updateData.pictureKey = key;
    }

    const updateUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    return res.status(200).json({ message: "Profile updated successfully", updateUser, });

  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }

};

// get user profile 
export const getUserProfile = async (req, res) => {

  const userId = req.user._id;
  try {
    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let signedUrl = null;
    if (user.pictureKey) {
      signedUrl = await createGetSignedUrl({ fileKey: user.pictureKey, fileName: user.pictureKey, download: false });
    }
    return res.status(200).json({ picture: signedUrl, name: user.name, email: user.email, role: user.role, isPasswordSet: req.user.password ? true : false, userIs: req.user.userIs, loginWith: user.loginWith });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}


//  ---admin user 
export const getAllUsers = async (req, res) => {

  // get all session keys
  let cursor = "0";
  let allSessionsUserId = []
  do {
    const userSessions = await rediclient.scan(cursor, {
      MATCH: 'userSession:*',
      COUNT: 1000
    });
    cursor = userSessions.cursor;
    allSessionsUserId = allSessionsUserId.concat(userSessions.keys.map(key => key.split(":")[1]))
  } while (cursor !== "0");

  const users = await User.find().lean()

  const userIdNameEmail = users.map(user => {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      isLoggedIn: allSessionsUserId.includes(user._id.toString())
    }
  })


  return res.status(200).json({ users: userIdNameEmail });
}

// logout user using user id by admin or manager 
export const logoutUserById = async (req, res) => {
  const { userId } = req.body;
  const currentUser = req.user

  if (!userId) {
    return res.status(400).json({ success: false, message: "UserId is required" });
  }
  try {

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (currentUser.role === "manager" && targetUser.role === "admin") {
      return res.status(403).json({ success: false, message: "You are Manager not have permission to logout Admin" });
    }

    if (targetUser._id.toString() === currentUser._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot logout yourself" });
    }

    // delete session by userId

    const userSessionKey = `userSession:${userId}`
    const userSession = await rediclient.sMembers(userSessionKey)
    if (userSession.length > 0) {

      const pipeline = rediclient.multi()

      for (const userId of userSession) {
        pipeline.del(`session:${userId}`)
      }

      pipeline.del(userSessionKey)
      await pipeline.exec()
    }



    // push logout timestamp in user
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $push: { "userTimeStamp.userLogoutAt": new Date() } }
    );

    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// delete user using id  by admin 
export const hardDeleteUserById = async (req, res) => {
  const { userId } = req.body
  const currentUser = req.user

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  try {

    const targetUser = await User.findById(userId);


    if (targetUser._id.toString() == currentUser._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot Delete yourself" });
    }
    if (currentUser.role === "manager" && targetUser.role === "admin") {
      return res.status(403).json({ success: false, message: "You are Manager dont have permission to Delete Admin" });
    }

    await User.findByIdAndDelete(userId)
    await Directorie.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })
    await File.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })

    // use key and sessions
    const userSessionKey = `userSession:${userId}`
    const userSession = await rediclient.sMembers(userSessionKey)

    if (userSession.length > 0) {
      const pipeline = rediclient.multi()

      for (const userId of userSession) {
        pipeline.del(`session:${userId}`)
      }
      pipeline.del(userSessionKey)
      await pipeline.exec()
    }

    return res.status(200).json({ message: "user deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// soft delete
export const softDeleteUserById = async (req, res) => {
  const { userId } = req.body;
  const currentUser = req.user;
  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  try {
    const targetUser = await User.findById(userId);

    if (targetUser._id.toString() == currentUser._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot Delete yourself" });
    }
    if (currentUser.role === "manager" && targetUser.role === "admin") {
      return res.status(403).json({ success: false, message: "You are Manager dont have permission to Delete Admin" });
    }

    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { isDeleted: true } }
    );

    // await Session.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })
    const userSessionKey = `userSession:${userId}`
    const userSessions = await rediclient.sMembers(userSessionKey)

    if (userSessions.length > 0) {
      const pipeline = await rediclient.multi()
      for (const useId of userSessions) {
        pipeline.del(`session:${useId}`)
      }
      pipeline.del(userSessionKey)
      await pipeline.exec()
    }

    return res.status(200).json({ success: true, message: "User soft deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// update user role 
export const updateUserRole = async (req, res) => {

  const { success, data, error } = updateUserRoleSchema.safeParse(req.body)
  if (!success) return res.status(400).json({ error: z.flattenError(error).fieldErrors })

  const { userId, newRole } = data;

  const currentUser = req.user;

  const targetUser = await User.findById(userId);
  if (!targetUser) {
    return res.status(400).json({ success: false, error: "User not found" });
  }

  if (currentUser.role == "manager" && targetUser.role == "admin") {
    return res.status(400).json({ success: false, error: "You are Manager not have permission to update Admin" });
  }

  await User.findByIdAndUpdate(userId, { role: newRole });

  res.status(200).json({ success: true, message: "user role updated" })

}