import OTP from "../models/otpModel.js";
import { sendOTP } from "../utils/sendOTP.js";
import { verifyIdToken } from "../utils/googleAuthService.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import Directory from "../models/directoryModel.js";
import Session from "../models/sessionModel.js";

export const sendOTPUser = async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({ error: "enter email" });
  }
  const otp = await OTP.findOne({ email: email });
  sendOTP(email);

  return res.json({ message: `OTP Send to ${email}` });
};

// verify otp
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(email, otp);

  try {
    const otpModel = await OTP.findOne({ email: email });
    if (otpModel.otp != otp) {
      return res.status(400).json({ error: "OTP not Match" });
    }

    return res.status(200).json({ message: "OTP Succesfully Match" });
  } catch (error) {
    console.log(error);
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
      maxAge: 60 * 10000 * 60 * 24 * 7,
    });

    return res.status(200).json({ message: "User Logged In" });
  }

  const session = await mongoose.startSession();

  try {
    const userId = new mongoose.Types.ObjectId();
    const rootDirId = new mongoose.Types.ObjectId();

    session.startTransaction();

    const user = await User.insertOne(
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


    const createSession = await Session.create({ userId });

    res.cookie("sid", createSession.id, {
      httpOnly: true,
      signed: true,
      maxAge: 60 * 10000 * 60 * 24 * 7,
    });

    await session.commitTransaction();

    return res.status(200).json({ message: "User Logged In" });
  } catch (err) {
    session.abortTransaction();

    next(err);
    return res.status(400).json({ error: "invalid fields", details: err });


  }

}