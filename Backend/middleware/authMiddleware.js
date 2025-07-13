import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import crypto from "crypto";

export default async function checkAuth(req, res, next) {
  const {sid} = req.signedCookies;
  try {
    if (!sid) {
      return res.status(401).json({error: "User not logged in"});
    }

    const activeSessions = await Session.find({userId: user._id});
    if (activeSessions.length >= 2) {
      activeSessions[0].deleteOne()
      return res
        .status(401)
        .json({error: "Accoutn already use in anothre device"});
    }
    const session = await Session.findById(sid);
    if (!session) {
      res.clearCookie("sid");
      return res.status(401).json({error: "User not found"});
    }

    const user = await User.findById(session.userId).lean();

    if (!user) {
      return res.status(401).json({error: "User not found"});
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({error: "Invalid user ID"});
  }
}
