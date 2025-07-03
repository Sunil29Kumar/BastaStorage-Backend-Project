import {ObjectId} from "mongodb";
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";
import crypto from "crypto";

// register user
export const registerUser = async (req, res, next) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({error: "All files are required"});
  }

  const session = await mongoose.startSession();

  const hashPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64url");

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
        password: hashPassword,
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

  const newHasePassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("base64url");
  

  const user = await User.findOne(
    {email, password:newHasePassword},
    {projection: {password: 1}}
  ).lean();

  if (!user) {
    return res.status(404).json({error: "Invalid email or password"});
  }

  const cookiepayload = JSON.stringify({
    id: user._id.toString(),
    expiry: Math.floor(Date.now() / 1000 + 10),
  });

  res.cookie("token", cookiepayload, {
    httpOnly: true,
    signed: true,
<<<<<<< HEAD
    maxAge: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
=======
    maxAge: 1000 * 60 * 60 * 24 * 365,
>>>>>>> 5aefed5712a71a556aad1fd24ee8e2b4978b438a
  });

  await User.updateOne(
    {email},
    {$push: {"userTimeStamp.userLoginAt": new Date()}}
  );

  return res.json({message: "login success"});
};

// logout use
export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  await User.updateOne(
    {_id: new ObjectId(req.user._id)},
    {$push: {"userTimeStamp.userLogoutAt": new Date()}}
  );
  return res.status(200).json({message: "user log out"});
};
