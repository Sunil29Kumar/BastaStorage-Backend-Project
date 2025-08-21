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
      { session }
    );
    await user.save();

    await Directory.insertOne(
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
      { session }
    );

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
    console.log("matchpassword = ", isPsswordValid);

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
      maxAge: 60 * 10000 * 60 * 24 * 7,
    });

    await User.updateOne(
      { email },
      { $push: { "userTimeStamp.userLoginAt": new Date() } }
    );

    return res.json({ message: "login success" });
  } catch (error) {
    return res.json({ error: error.message })
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
  const userData = { name: req.user.name, email: req.user.email, picture: req.user.picture }
  return res.status(200).json(userData);
}

// update user profile 
export const updateUserProfile = async (req, res) => {
  const userId = req.user._id;
  const { sid } = req.signedCookies;
  const { name } = req.body;

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
export const adminUser = async (req, res) => {
  console.log("admin user");
  return res.status(200).json({ message: "Admin access granted" });
}
