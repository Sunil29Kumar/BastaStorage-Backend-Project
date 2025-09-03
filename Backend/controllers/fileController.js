import { createWriteStream } from "fs";
import { rm } from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import SharedLink from "../models/SharedLinks.js";
import crypto from "crypto";

export const createFile = async (req, res) => {
  const parentDirId = req.params.parentDirId || req.user.rootDirId;
  const userId = req.user._id;

  console.log(req.headers);
  

  const parentDirData = await Directorie.findOne({
    _id: new ObjectId(parentDirId),
    userId
  });

  if (!parentDirData) {
    return res
      .status(400)
      .json({ message: "Parent Directory Data is undefined" });
  }

  const filename = req.headers.filename || "untitled";
  if (!filename) {
    return res.status(400).json({ error: "Filename is required." });
  }
  const size = parseInt(req.headers.size);
  const extension = path.extname(filename);
  const type = req.headers.type;


  // find user 
  const user = await User.findById(userId);

  if (user.usedSpace + size > user.totalSpace) {
    return res.status(400).json({ message: "You have exceeded your storage limit." });
  }


  const fileData = await File.create({
    parentDirId: parentDirData._id,
    userId: req.user._id,
    name: filename,
    extension,
    size,
    type,
    timeStamp: {
      fileCreatedAt: new Date(),
      opened: [],
      lastModified: [],
      lastDownload: [],
    },
  });

  const fileID = fileData._id.toString();
  const fullFileName = `${fileID}${extension}`;

  const writeStream = createWriteStream(`./storage/${fullFileName}`);
  req.pipe(writeStream);


  req.on("end", async () => {
    // update size in User 
    user.usedSpace += size;
    await user.save();
    return res.status(200).json({ message: "File Uploaded" });
  });
  req.on("error", async () => {
    await File.deleteOne({ _id: fileData.insertedId });
    return res.status(400).json({ message: "Failed to Upload" });
  });
};


export const getFile = async (req, res) => {
  const id = req.params.id || res.user.rootDirId;

  // file ko database se find kar rahe hain
  const fileData = await File.findOne({
    _id: new ObjectId(id),
    userId: req.user._id,
  });

  if (!fileData) {
    return res.status(404).json({ message: "file not found" });
  }

  const fullPath = `${process.cwd()}/storage/${id}${fileData.extension}`;

  // agar user download karna chahta hai
  if (req.query.action === "download") {
    // download time ko database me push kar rahe hain
    await File.updateOne(
      { _id: new ObjectId(id) },
      { $push: { "timeStamp.lastDownload": new Date() } }
    );

    // response me header set kar rahe hain ki file download ho
    res.setHeader("content-Disposition", "attachment");
    return res.download(fullPath, fileData.name);
  }

  // agar simple file dekh raha hai (download nahi)
  await File.updateOne(
    { _id: new ObjectId(id) },
    {
      $push: { "timeStamp.opened": new Date() },
    }
  );

  // file ko browser me send kar rahe hain
  res.sendFile(fullPath, (err) => {
    if (!res.headersSent && err) {
      return res.status(404).json({ error: "File not found!" });
    }
  });
};

export const renameFile = async (req, res) => {
  const id = req.params.id || req.user.rootDirId;
  const newFileName = req.body.newFilename;

  if (!newFileName) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    await File.updateOne(
      { _id: new ObjectId(id), userId: req.user._id },
      {
        $set: { name: newFileName },
        $push: { "timeStamp.lastModified": new Date() },
      }
    );

    return res.status(200).json({ message: "File Renamed" });
  } catch (error) {
    return res.status(404).json({ error: "File not renamed" });
  }
};

export const deleteFile = async (req, res) => {
  const id = req.params.id || req.user.rootDirId;
  const userId = req.user._id;

  try {

    const user = await User.findById(userId);

    const fileData = await File.findOne({
      _id: new ObjectId(id),
      userId: req.user._id,
    });

    await rm(`./storage/${id}${fileData.extension}`);
    await File.deleteOne({ _id: new ObjectId(id), userId: req.user._id });

    // update size in User
    user.usedSpace -= fileData.size;
    await user.save();


    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};


export const shareFile = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = req.user

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate a shareable link (you can customize this logic)
  const token = crypto.randomUUID()
  const shareableLink = `http://localhost:5173/share/${token}`;

  await SharedLink.create({
    fileId: id,
    token: token,
  })

  return res.status(200).json({ message: "Share Link Generated", link: shareableLink });
}


export const sharefileViewer = async (req, res) => {
  const token = req.params.token
  const shared = await SharedLink.findOne({ token })
  if (!shared) return res.status(404).json({ message: "Share link not found" });

  const file = await File.findById(shared.fileId)
  if (!file) return res.status(404).json({ error: "File not found" });

  res.json({
    name: file.name,
    type: file.type,
    viewUrl: `http://localhost:2000/storage/${file._id}${file.extension}`,
  });

}