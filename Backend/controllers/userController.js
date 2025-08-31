import { ObjectId } from "mongodb";
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Session from "../models/sessionModel.js";
import { sendOTP } from "../utils/sendOTP.js";
import OTP from "../models/otpModel.js";
import multer from "multer";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";



// register user
export const registerUser = async (req, res, next) => {
  const { name, email, password, otp } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All files are required" });
  }

  const otpRecord = await OTP.findOne({ email, otp });
  if (!otpRecord) {
    return res.status(400).json({ message: "invalide otp enter again" });
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

    return res.status(200).json({ message: "User Register!" });
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

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    const isPsswordValid = await user.comparePassword(password);
    // console.log("matchpassword = ", isPsswordValid);

    if (!isPsswordValid) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const activeSessions = await Session.find({ userId: user._id }).sort({
      createdAt: 1,
    });

    if (activeSessions.length >= 2) {
      await Session.findByIdAndDelete(activeSessions[0]._id);
    }

    const session = await Session.create({ userId: user._id });

    res.cookie("sid", session.id, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 1000 * 60 * 24 * 7, // 
    });

    await User.updateOne(
      { email },
      { $push: { "userTimeStamp.userLoginAt": new Date() } }
    );

    return res.status(200).json({ message: "login success" });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
};

// logout use
export const logoutUser = async (req, res) => {
  const { sid } = req.signedCookies;

  await Session.findByIdAndDelete(sid);
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
  const session = await Session.findById(sid);
  await Session.deleteMany({ userId: session.userId });
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


  if (name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 characters long" });
  }

  try {
    // match session
    const session = await Session.findById(sid);
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    // update fields
    let updateData = { name };
    if (req.file) {
      updateData.picture = `/upload/${req.file.filename}`;
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

// admin user 
export const getAllUsers = async (req, res) => {

  const allSessions = await Session.find().lean();
  const allSessionsUserId = allSessions.map(session => session.userId.toString());

  // const users = await User.find({isDeleted: false}).lean()
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
    await Session.deleteMany({ userId: new mongoose.Types.ObjectId(targetUser._id) });

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
  try {

    const targetUser = await User.findById(userId);
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (targetUser._id.toString() == currentUser._id.toString()) {
      return res.status(403).json({ success: false, message: "You cannot Delete yourself" });
    }
    if (currentUser.role === "manager" && targetUser.role === "admin") {
      return res.status(403).json({ success: false, message: "You are Manager dont have permission to Delete Admin" });
    }


    await User.findByIdAndDelete(userId)
    await Directorie.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })
    await Session.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })
    await File.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })
    console.log(userId);

    res.json({ message: "user deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


// soft delete
export const softDeleteUserById = async (req, res) => {
  const { userId } = req.body;
  const currentUser = req.user;
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

    await Session.deleteMany({ userId: new mongoose.Types.ObjectId(userId) })
    res.status(200).json({ success: true, message: "User soft deleted successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}


export const updateUserRole = async (req, res) => {
  const { userId, newRole } = req.body;
  console.log(req.body);

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