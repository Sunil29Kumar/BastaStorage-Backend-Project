import {ObjectId} from "mongodb";

export default async function checkAuth(req, res, next) {
  const {uid} = req.cookies;
  const db = req.db;

  if (!uid) {
    return res.status(401).json({error: "User not logged in"});
  }

  try {
    const user = await db.collection("users").findOne({_id: new ObjectId(uid)});

    if (!user) {
      return res.status(401).json({error: "User not found"});
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({error: "Invalid user ID"});
  }
}
