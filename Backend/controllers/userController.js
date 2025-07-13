import {ObjectId} from "mongodb";
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import Session from "../models/sessionModel.js";


// register user
export const registerUser = async (req, res, next) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({error: "All files are required"});
  }

  const session = await mongoose.startSession();

  const hashStoredPassword = await bcrypt.hash(password, 12);
  console.log(hashStoredPassword);

  try {
    const userId = new mongoose.Types.ObjectId();
    const rootDirId = new mongoose.Types.ObjectId();

    session.startTransaction();

    await User.insertOne(
      {
        _id: userId,
        rootDirId,
        name,
        email,
        password: hashStoredPassword,
        userTimeStamp: {
          userCreatedAt: new Date(),
          userLoginAt: [],
          userLogoutAt: [],
        },
      },
      {session}
    );

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
      {session}
    );

    await session.commitTransaction();

    return res.status(200).json({message: "User Register!"});
  } catch (err) {
    session.abortTransaction();
    if (err.code === 121) {
      return res.status(400).json({error: "invalid fields", details: err});
    } else if (err.code === 11000) {
      if (err.keyValue.email) {
        return res.status(400).json({error: "Email is already in use"});
      }
    } else {
      next(err);
    }
  }
};

// login user
export const loginUser = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});

  if (!user) {
    return res.status(404).json({error: "Invalid email or password"});
  }

  const isPsswordValid = await user.comparePassword(password);
  if (!isPsswordValid) {
    return res.status(404).json({error: "Invalid credentials"});
  }

  const session = await Session.create({userId: user._id});

  res.cookie("sid", session.id, {
    httpOnly: true,
    signed: true,
    maxAge: 60 * 10000 * 60 * 24 * 7,
  });

  await User.updateOne(
    {email},
    {$push: {"userTimeStamp.userLoginAt": new Date()}}
  );

  return res.json({message: "login success"});
};

// logout use
export const logoutUser = async (req, res) => {
  const {sid} = req.signedCookies
  console.log(sid);
  
  await Session.findByIdAndDelete(sid)
  res.clearCookie("sid");
  await User.updateOne(
    {_id: new ObjectId(req.user._id)},
    {$push: {"userTimeStamp.userLogoutAt": new Date()}}
  );

  return res.status(200).json({message: "user log out"});
};
