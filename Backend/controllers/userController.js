import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import OTP from "../models/otpModel.js";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";

import rediclient from "../database/redis.js";

// zod 
import z from "zod/v4";
import { loginSchema, registerSchema, updateUserRoleSchema } from "../validators/userSchema.js";



// ----------- ) register user
export const registerUser = async (req, res, next) => {

  // schema 
  const { success, data, error } = registerSchema.safeParse(req.body)
  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors })
  }

  // verify all field 
  const { name, email, password, otp } = data;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All files are required" });
  }

  // verify otp 
  const otpRecord = await OTP.findOne({ email, otp });
  if (!otpRecord) {
    return res.status(400).json({ message: "invalide otp enter again" });
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

// ----------- ) login user
export const loginUser = async (req, res) => {

  // login schema 
  const { success, data, error } = loginSchema.safeParse(req.body)
  if (!success) {
    return res.status(400).json({ error: "Invalid Credentials" });
  }

  const { email, password } = data;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Invalid email or password" });

    if (user.isDeleted) {
      return res.status(403).json({ error: "Your account has been deleted. Please contact support." });
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

    if (activeSessions.total >= 2) await rediclient.del(activeSessions.documents[0].id);

    // create redis session and cookie
    const sessionId = crypto.randomUUID()
    const redisKey = `session:${sessionId}`;
    const sessionExpiry = 1000 * 60 * 60 * 24 * 7

    const pipeline = rediclient.multi()

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
      sameSite: "none",
      secure: true
    });

    // update user timestamp 
    await User.updateOne(
      { email },
      { $push: { "userTimeStamp.userLoginAt": new Date() } }
    );

    return res.status(200).json({ message: "login success" });
  } catch (error) {
    return res.status(500).json({ error: error.message })
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

// user profile 
export const userProfile = async (req, res) => {

  const userData = { name: req.user.name, email: req.user.email, picture: req.user.picture, role: req.user.role, isPasswordSet: req.user.password ? true : false, };
  return res.status(200).json(userData);
}

// update user profile 
export const updateUserProfile = async (req, res) => {

  const userId = req.user._id;
  const { sid } = req.signedCookies;
  const { name } = req.body;

  console.log(req.file);


  if (name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters long" });
  }

  try {
    // match session
    const session = await rediclient.json.get(`session:${sid}`)
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    // update fields
    let updateData = { name };
    if (req.file) {
      updateData.picture = req.file.path;
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      updateUser
    });
  } catch (error) {
    console.log("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


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