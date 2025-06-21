import {createWriteStream} from "fs";
import {rm} from "fs/promises";
import path from "path";
import {ObjectId} from "mongodb";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";

export const createFile = async (req, res) => {
  const parentDirId = req.params.parentDirId || req.user.rootDirId;

  const parentDirData = await Directorie.findOne({
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

  const fileData = await File.create({
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

  const fileID = fileData._id.toString();

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
    await File.deleteOne({_id: fileData.insertedId});
    return res.status(400).json({message: "Failed to Upload"});
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
    return res.status(404).json({message: "file not found"});
  }

  const fullPath = `${process.cwd()}/storage/${id}${fileData.extension}`;

  // agar user download karna chahta hai
  if (req.query.action === "download") {
    // download time ko database me push kar rahe hain
    await File.updateOne(
      {_id: new ObjectId(id)},
      {$push: {"timeStamp.lastDownload": new Date()}}
    );

    // response me header set kar rahe hain ki file download ho
    res.setHeader("content-Disposition", "attachment");

    return res.download(fullPath, fileData.name);
  }

  // agar simple file dekh raha hai (download nahi)
  await File.updateOne(
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
};

export const renameFile = async (req, res) => {
  const id = req.params.id || req.user.rootDirId;
  const newFileName = req.body.newFilename;

  if (!newFileName) {
    return res.status(404).json({message: "File not found"});
  }

  try {
    await File.updateOne(
      {_id: new ObjectId(id), userId: req.user._id},
      {
        $set: {name: newFileName},
        $push: {"timeStamp.lastModified": new Date()},
      }
    );

    return res.status(200).json({message: "File Renamed"});
  } catch (error) {
    return res.status(404).json({error: "File not renamed"});
  }
};

export const deleteFile = async (req, res) => {
  const id = req.params.id || req.user.rootDirId;

  try {
    const fileData = await File.findOne({
      _id: new ObjectId(id),
      userId: req.user._id,
    });

    await rm(`./storage/${id}${fileData.extension}`);

    await File.deleteOne({_id: new ObjectId(id), userId: req.user._id});

    return res.status(200).json({message: "File Deleted Successfully"});
  } catch (err) {
    return res.status(404).json({message: err.message});
  }
};
