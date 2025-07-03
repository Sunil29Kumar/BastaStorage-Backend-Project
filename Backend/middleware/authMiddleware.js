import User from "../models/userModel.js";
import crypto from "crypto";

export default async function checkAuth(req, res, next) {
  const {token} = req.signedCookies;
  try {
    if (!token) {
      return res.status(401).json({error: "User not logged in"});
    }

    const {id, expiry} = JSON.parse(token);
    const currentTimeInSecond = Math.floor(Date.now() / 1000);

    if (currentTimeInSecond > expiry) {
      res.clearCookie("token");
      console.log("session expired");
      return res.status(401).json({error: "Not logged in Session Expired"});
    }

    const user = await User.findOne({_id: id}).lean();

    if (!user) {
      return res.status(401).json({error: "User not found"});
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({error: "Invalid user ID"});
  }
}
