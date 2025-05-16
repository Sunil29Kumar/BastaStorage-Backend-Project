import express from "express";
import {createWriteStream} from "fs";
import {rm} from "fs/promises";
import path from "path";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {Db, ObjectId} from "mongodb";

const router = express.Router();

router.param("id", validatinoIdMiddleware);
router.param("parentDirId", validatinoIdMiddleware);

// Create
router.post("/:parentDirId?", async (req, res) => {
  const parentDirId = req.params.parentDirId || req.user.rootDirId;
  const db = req.db;
  const fileCollection = await db.collection("files");
  const directoriesCollection = db.collection("directories");

  const parentDirData = await directoriesCollection.findOne({
    _id: new ObjectId(parentDirId),
    userId: req.user._id,
  });

  if (!parentDirData) {
    return res
      .status(400)
      .json({message: "Parent Directory Data is undefined"});
  }

  const filename = req.headers.filename || "untitled";
  const size = parseInt(req.headers.size);
  const extension = path.extname(filename);

  const fileData = await fileCollection.insertOne({
    parentDirId: parentDirData._id,
    userId: req.user._id,
    name: filename,
    extension,
    size,
    timeStamp: {
      fileCreatedAt: new Date(),
      opened: [],
      lastModified: [],
      lastDownload: [],
    },
  });

  const fileID = fileData.insertedId.toString();

  const fullFileName = `${fileID}${extension}`;

  if (!filename) {
    return res.status(400).json({error: "Filename is required."});
  }

  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);
  req.on("end", async () => {
    return res.status(200).json({message: "File Uploaded"});
  });
  req.on("error", async () => {
    await fileCollection.deleteOne({_id: fileData.insertedId});
    return res.status(400).json({message: "Failed to Upload"});
  });
});

// Read
// route to read/download a file
router.get("/:id?", async (req, res) => {
  const id = req.params.id || res.user.rootDirId;
  const db = req.db;

  const fileCollection = db.collection("files");

  // file ko database se find kar rahe hain
  const fileData = await fileCollection.findOne({
    _id: new ObjectId(id),
    userId: req.user._id,
  });

  if (!fileData) {
    return res.status(404).json({message: "file not found"});
  }

  const fullPath = `${process.cwd()}/storage/${id}${fileData.extension}`;

  // agar user download karna chahta hai
  if (req.query.action === "download") {
    // download time ko database me push kar rahe hain
    await fileCollection.updateOne(
      {_id: new ObjectId(id)},
      {$push: {"timeStamp.lastDownload": new Date()}}
    );

    // response me header set kar rahe hain ki file download ho
    res.setHeader("content-Disposition", "attachment");

    return res.download(fullPath, fileData.name);
  }

  // agar simple file dekh raha hai (download nahi)
  await fileCollection.updateOne(
    {_id: new ObjectId(id)},
    {
      $push: {"timeStamp.opened": new Date()},
    }
  );

  // file ko browser me send kar rahe hain
  res.sendFile(fullPath, (err) => {
    if (!res.headersSent && err) {
      return res.status(404).json({error: "File not found!"});
    }
  });
});

// route to rename a file
router.patch("/:id", async (req, res) => {
  const id = req.params.id || req.user.rootDirId;
  const newFileName = req.body.newFilename;
  const db = req.db;

  if (!newFileName) {
    return res.status(404).json({message: "File not found"});
  }

  try {
    // file ka name update kar rahe aur lastModified time ko push kar rahe hain
    const fileData = await db.collection("files").updateOne(
      {_id: new ObjectId(id), userId: req.user._id}, // jis file ka id match kare
      {
        $set: {name: newFileName}, // file ka naam set kar rahe
        $push: {"timeStamp.lastModified": new Date()},
      }
    );

    return res.status(200).json({message: "File Renamed"});
  } catch (error) {
    return res.status(404).json({error: "File not renamed"});
  }
});

// ---------------------- Delete -------------------------
router.delete("/:id", async (req, res) => {
  const id = req.params.id || req.user.rootDirId;
  const db = req.db;

  try {
    const fileData = await db
      .collection("files")
      .findOne({_id: new ObjectId(id), userId: req.user._id});

    await rm(`./storage/${id}${fileData.extension}`);

    await db
      .collection("files")
      .deleteOne({_id: new ObjectId(id), userId: req.user._id});

    return res.status(200).json({message: "File Deleted Successfully"});
  } catch (err) {
    return res.status(404).json({message: err.message});
  }
});

export default router;
