import { createWriteStream } from "fs";
import { rm } from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import SharedLink from "../models/SharedLinksModel.js";
import crypto from "crypto";
import inviteUserByEmail from "../utils/inviteUserByEmail.js";

export const createFile = async (req, res) => {
  const parentDirId = req.params.parentDirId || req.user.rootDirId;
  const userId = req.user._id;

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
    fileFrom: "local",
    timeStamp: {
      fileCreatedAt: new Date(),
      opened: [],
      lastModified: [],
      lastDownload: [],
    },
  });

  const fileID = fileData._id.toString();
  const fullFileName = `${fileID}${extension}`;

  const writeStream = createWriteStream(`./storage/local-files/${fullFileName}`);
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
  const id = req.params.id || req.user.rootDirId;

  // file ko database se find kar rahe hain
  const fileData = await File.findOne({
    _id: new ObjectId(id),
    userId: req.user._id,
  });

  if (!fileData) {
    return res.status(404).json({ message: "file not found" });
  }

  const localFileFullPath = `${process.cwd()}/storage/local-files/${id}${fileData.extension}`;
  const googleDriveFileFullPath = `${process.cwd()}/storage/google-drive-files/${id}${fileData.extension}`;

  const fullPath = fileData.fileFrom === "local" ? localFileFullPath : googleDriveFileFullPath

  // agar user download karna chahta hai
  if (req.query.action === "download") {
    // download time ko database me push kar rahe hain
    await File.updateOne(
      { _id: new ObjectId(id) },
      { $push: { "timeStamp.lastDownload": new Date() } }
    );

    // response me header set kar rahe hain ki file download ho
    res.setHeader("Content-Disposition", `attachment; filename="${fileData.name}"`);
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
    return res.status(404).json({ message: "New filename is required" });
  }

  try {

    const file = await File.findOne({ _id: new ObjectId(id) });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // check owner 
    if (file.userId.toString() === req.user._id.toString()) {
      file.name = newFileName;
      file.timeStamp.lastModified.push(new Date());
      file.save();
      return res.status(200).json({ message: "File Renamed" });
    }

    // check shared with edit permission 
    const sharedWithEntries = file.sharedWith.find((entry) => entry.userId.toString() === req.user._id.toString() && entry.permission === "Edit");

    if (!sharedWithEntries) {
      return res.status(404).json({ error: "You do not have permission to rename this file." });
    }

    file.name = newFileName;
    file.timeStamp.lastModified.push(new Date());
    file.save();

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


    const localFileFullPath = `./storage/local-files/${id}${fileData.extension}`;
    const googleDriveFileFullPath = `./storage/google-drive-files/${id}${fileData.extension}`;

    const fullPath = fileData.fileFrom === "local" ? localFileFullPath : googleDriveFileFullPath

    // await rm(`./storage/${id}${fileData.extension}`);
    await rm(fullPath);
    await File.deleteOne({ _id: new ObjectId(id), userId: req.user._id });

    // update size in User
    user.usedSpace -= fileData.size;
    await user.save();

    return res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};


// share file - copy link
export const shareFile = async (req, res) => {
  const id = req.params.id;
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

// view share file 
export const sharefileViewer = async (req, res) => {
  const token = req.params.token
  const shared = await SharedLink.findOne({ token })
  if (!shared) return res.status(404).json({ message: "Share link not found" });

  const file = await File.findById(shared.fileId)

  if (!file) return res.status(404).json({ error: "File not found" });

  const localFileFullPath = `/storage/local-files/${file._id}${file.extension}`;
  const googleDriveFileFullPath = `/storage/google-drive-files/${file._id}${file.extension}`;

  const fullPath = file.fileFrom === "local" ? localFileFullPath : googleDriveFileFullPath

  res.json({
    name: file.name,
    type: file.type,
    viewUrl: `http://localhost:2000${fullPath}`,
  });

}

// share file thwough email with permission (invite user)
export const shareFileThroughEmail = async (req, res) => {
  const { email, permission } = req.body;
  const fileId = req.params.id

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "Enter valid email" });

    const file = await File.findOne({ _id: fileId, userId: req.user._id });
    if (!file) return res.status(404).json({ error: "File not found" });

    const existingShare = file.sharedWith.find((shared) => shared.userId.toString() === user._id.toString())

    if (existingShare) {
      existingShare.permission = permission
    }
    else {
      const token = crypto.randomUUID();
      file.sharedWith.push({ userId: user._id, permission, token });
    }
    await file.save();

    // invite by email 
    await inviteUserByEmail(req.user.email,
      email, fileId,
      file.name,
      permission,
      req.user.name,
      file.sharedWith.find(shared => shared.userId.toString() === user._id.toString()).token)

    return res.status(200).json({ message: `File shared successfully with ${user.email}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error });
  }
}

// getSharedUsers 
export const getSharedUsers = async (req, res) => {
  const fileId = req.params.id;
  try {
    const file = await File.findById(fileId).populate("sharedWith.userId", "email name picture userId");
    if (!file) return res.status(404).json({ message: "File not found" });
    const sharedUserData = file.sharedWith;

    return res.status(200).json(sharedUserData);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
}

// private share 
export const privateShare = async (req, res) => {
  const token = req.params.token;
  const fileId = req.params.id;

  const file = await File.findOne({ _id: fileId, "sharedWith.token": token, })

  if (!file) return res.status(404).json({ error: "File not found" });

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }

  const sharedWithEntry = file.sharedWith.find((entry) => entry.token == token)

  if (sharedWithEntry.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: "You do not have access to this file" });
  }

  const localFileFullPath = `/storage/local-files/${file._id}${file.extension}`;
  const googleDriveFileFullPath = `/storage/google-drive-files/${file._id}${file.extension}`;

  const fullPath = file.fileFrom === "local" ? localFileFullPath : googleDriveFileFullPath

  const fileUrl = `http://localhost:2000${fullPath}`

  const fileData = {
    name: file.name,
    type: file.type,
    viewUrl: fileUrl,
    permission: sharedWithEntry.permission,
    userId: sharedWithEntry.userId,
  }

  return res.status(200).json({ message: "Private Share Working", fileData });
}

// update share file permission 
export const updateSharedFilePermission = async (req, res) => {
  const { fileId } = req.params;
  const { email, updatePermission } = req.body;

  try {

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: "Email not found" });

    const file = await File.findOne({ _id: fileId, userId: req.user._id });

    if (!file) return res.status(404).json({ error: "File not found" });

    const sharedWithEntry = file.sharedWith.find((shared) => shared.userId.toString() === user.id.toString());

    if (!sharedWithEntry) {
      return res.status(404).json({ error: "This file is not shared with the user." });
    }

    sharedWithEntry.permission = updatePermission
    file.save()

    return res.status(200).json({ message: "Permission Updated" })

  } catch (error) {
    return res.status(400).json({ error: "Permission Updated" })

  }

}

// removeSharedUser 
export const removeSharedUser = async (req, res) => {
  const { fileId, userId } = req.params;

  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: "User not found" });
    const file = await File.findById(fileId)

    // owner remove share 
    if (file.userId.toString() === req.user._id.toString()) {
      file.sharedWith.pull({ userId })
      await file.save();
      return res.status(200).json({ message: `Access removed for ${user.email}.` })
    }

    // user own remove share with  
    if (req.user._id.toString() === userId.toString()) {
      file.sharedWith.pull({ userId });
      await file.save()
      return res.status(200).json({ message: "You no longer have access to this file." })
    }

    return res.status(200).json({ message: "you cannot remove access for this user" })

  } catch (error) {
    return res.status(400).json({ error: "file Shared not removed" })
  }
}

