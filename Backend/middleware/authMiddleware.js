import User from "../models/userModel.js";
import crypto from "crypto";
import {secretKey} from "../controllers/userController.js";

export default async function checkAuth(req, res, next) {
  const {token} = req.cookies;
  try {
  if (!token) {
    return res.status(401).json({error: "User not logged in"});
  }

  const [payload, oldSignature] = token.split(".");
  const jsonPayload = Buffer.from(payload, "base64").toString();

  const newSignature = crypto
    .createHash("sha256")
    .update(jsonPayload)
    .update(secretKey)
    .digest("base64");

  if (oldSignature != newSignature) {
    res.clearCookie("token");
    console.log("Invalid signature");
    return res.status(401).json({error: "Not logged in!"});
  }

  const {id, expiry} = JSON.parse(jsonPayload);
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
