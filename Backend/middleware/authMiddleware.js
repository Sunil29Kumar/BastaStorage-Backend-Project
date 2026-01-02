import rediclient from "../database/redis.js";
import Session from "../models/sessionModel.js";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";
import crypto from "crypto";

export default async function checkAuth(req, res, next) {
  const { sid } = req.signedCookies;
  if (!sid) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    const session = await rediclient.json.get(`session:${sid}`);

    if (!session) {
      res.clearCookie("sid");
      return res.status(401).json({ error: "User not found" });
    }
    const user = await User.findOne({ _id: session.userId }).lean();
    const subscription = await Subscription.findOne({ userId: session.userId }).lean();

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    req.subscription = subscription;
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
}
