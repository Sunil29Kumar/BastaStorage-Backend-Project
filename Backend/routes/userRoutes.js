import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {ObjectId} from "mongodb";
import {client} from "../database/db.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const {name, email, password} = req.body;
  const db = req.db;

  if (!name || !email || !password) {
    return res.status(400).json({error: "All files are required"});
  }

  const userCollection = await db.collection("users");
  const directoriesCollection = await db.collection("directories");

  // checking user is already exist
  const alreadyUserExist = await userCollection.findOne({email});
  if (alreadyUserExist) {
    console.log("Email is already in use");

    return res.status(400).json({error: "Email is already in use"});
  }

  const session = client.startSession();

  try {
    const userId = new ObjectId();
    const rootDirId = new ObjectId();

    session.startTransaction();

    await userCollection.insertOne(
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

    await directoriesCollection.insertOne(
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

    session.commitTransaction();

    return res.status(200).json({message: "User Register!"});
  } catch (err) {
    session.abortTransaction();
    if (err.code === 121) {
      return res.status(400).json({error: "invalid fields", details: err});
    }
    next(err);
  }
});

// login route
router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const db = req.db;
  const userCollection = await db.collection("users");

  const user = await userCollection.findOne(
    {email, password},
    {projection: {password: 1}}
  );

  if (!user) {
    return res.status(404).json({error: "Invalid email or password"});
  }

  res.cookie("uid", user._id, {
    httpOnly: true,
  });

  await userCollection.updateOne(
    {email},
    {$push: {"userTimeStamp.userLoginAt": new Date()}}
  );

  return res.json({message: "login success"});
});

// sending user email, name to frontend
router.get("/", checkAuth, (req, res) => {
  return res.status(200).json({name: req.user.name, email: req.user.email});
});

// logout
router.get("/logout", checkAuth, async (req, res) => {
  const db = req.db;

  const userCollection = await db.collection("users");

  res.clearCookie("uid", "");
  await userCollection.updateOne(
    {_id: new ObjectId(req.user._id)},
    {$push: {"userTimeStamp.userLogoutAt": new Date()}}
  );
  return res.status(200).json({message: "user log out"});
});

export default router;
