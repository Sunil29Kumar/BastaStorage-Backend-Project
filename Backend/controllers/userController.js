import {ObjectId} from "mongodb";
import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import mongoose from "mongoose";

export const registerUser = async (req, res, next) => {
  const {name, email, password} = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({error: "All files are required"});
  }

  // checking user is already exist
  const alreadyUserExist = await User.findOne({email});
  if (alreadyUserExist) {
    return res.status(400).json({error: "Email is already in use"});
  }

  const session = await mongoose.startSession();

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
        password,
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
    }
    next(err);
  }
};

export const loginUser = async (req, res) => {
  const {email, password} = req.body;

  const user = await User.findOne(
    {email, password},
    {projection: {password: 1}}
  ).lean();

  if (!user) {
    return res.status(404).json({error: "Invalid email or password"});
  }

  res.cookie("uid", user._id, {
    httpOnly: true,
  });

  await User.updateOne(
    {email},
    {$push: {"userTimeStamp.userLoginAt": new Date()}}
  );

  return res.json({message: "login success"});
};

export const logoutUser = async (req, res) => {
  res.clearCookie("uid", "");
  await User.updateOne(
    {_id: new ObjectId(req.user._id)},
    {$push: {"userTimeStamp.userLogoutAt": new Date()}}
  );
  return res.status(200).json({message: "user log out"});
};
