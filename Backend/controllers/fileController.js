import dotenv from 'dotenv';
dotenv.config();

import path from "path";
import { ObjectId } from "mongodb";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import SharedLink from "../models/SharedLinksModel.js";
import crypto from "crypto";
import inviteUserByEmail from "../utils/inviteUserByEmail.js";
import { createFileSchema, renameFileSchema } from "../validators/fileSchema.js";
import z from "zod/v4";
import { createGetSignedUrl, deleteFileFromS3, generateSignedUrl } from "../utils/s3.js";
import Subscription from '../models/subscriptionModel.js';



// upload file 
export const createFile = async (req, res) => {

  // schema validate
  const { success, data, error } = createFileSchema.safeParse({
    params: req.params,
  });

  if (!success) {
    return res.status(400).json({ error: z.flattenError(error).fieldErrors });
  }

  const { fileName, fileType, fileSize } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "File is required." });
  }

  const parentDirId = data.params.parentDirId || req.user.rootDirId;
  const userId = req.user._id;

  // validate user subscription status is paused or not
  const subscription = await Subscription.findOne({ userId: req.user._id });
  if (subscription?.status === "paused") {
    return res.status(403).json({ error: "Your Subscription is paused. File upload is not allowed." });
  }

  try {
    const parentDirData = await Directorie.findOne({
      _id: new ObjectId(parentDirId),
      userId
    });

    if (!parentDirData) {
      return res
        .status(400)
        .json({ message: "Parent Directory Data is undefined" });
    }

    const filename = fileName || "untitled";
    if (!filename) {
      return res.status(400).json({ error: "Filename is required." });
    }
    const size = parseInt(fileSize) || 0;
    const extension = path.extname(filename);


    const user = await User.findById(userId);

    // check storage limit
    if (user.usedSpace + size > user.totalSpace) {
      return res.status(400).json({ error: "You have exceeded your storage limit." });
    }

    // ckeck user is pro or free for uploaded Under Plan
    const subscription = await Subscription.findOne({ userId: req.user._id });
    if (subscription?.status.includes("created", "paused", "cancelled", "expired", "pending", "failed")) {
      return res.status(403).json({ error: `Your Subscription is ${subscription.status}. File upload is not allowed.` });
    }


    // create file in database
    const fileData = await File.create({
      parentDirId: parentDirData._id,
      userId: req.user._id,
      name: filename,
      extension,
      size: size,
      type: fileType,
      // status: "initiated",
      uploadedFrom: {
        source: "Local Storage",
      },
      uploadedUnderPlan: user.userIs === "pro" ? "pro" : "free",
      timeStamp: {
        fileCreatedAt: new Date(),
        opened: [],
        lastModified: [],
        lastDownload: [],
      },
    });

    //  Get signed URL from s3Controller
    const { uploadURL, fileUrl } = await generateSignedUrl({ fileName: `${fileData._id}${fileData.extension}`, fileType });
    console.log("uurl =", uploadURL);

    return res.status(200).json({ message: "File Uploaded", uploadURL, fileId: fileData._id });

  } catch (error) {
    return res.status(400).json({ message: "Failed to Upload" });

  }
};
// markFileUploaded  
export const markFileUploaded = async (req, res) => {

  const id = req.params.id;
  const userId = req.user._id;

  try {
    const file = await File.findOne({ _id: new ObjectId(id), userId: userId });
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }
    file.status = "uploaded";
    await file.save();

    // update size in User 
    const user = await User.findById(userId);
    user.usedSpace += file.size;
    await user.save();

    // update directory size
    const parentDirData = await Directorie.findById(file.parentDirId);
    parentDirData.size += file.size;
    await parentDirData.save();

    return res.status(200).json({ message: "File upload marked as completed." });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }

}


// ----- get file 
export const getFile = async (req, res) => {
  const id = req.params.id || req.user.rootDirId;

  // file ko database se find kar rahe hain
  const fileData = await File.findOne({
    _id: new ObjectId(id),
    userId: req.user._id,
  });

  if (!fileData) return res.status(404).json({ message: "file not found" });


  // agar user download karna chahta hai
  if (req.query.action === "download") {
    const signedUrl = await createGetSignedUrl({ fileKey: `${fileData._id}${fileData.extension}`, fileName: fileData.name, download: true });
    return res.redirect(signedUrl);
  }

  // file ko browser me send kar rahe hain
  const signedUrl = await createGetSignedUrl({ fileKey: `${fileData._id}${fileData.extension}`, fileName: fileData.name, download: false });


  return res.redirect(signedUrl);

};


// --- rename file 
export const renameFile = async (req, res) => {

  // schema 
  const { success, data, error } = renameFileSchema.safeParse({
    params: req.params,
    body: req.body
  })

  if (!success) return res.status(400).json({ error: z.flattenError(error).fieldErrors });

  const id = data.params.id || req.user.rootDirId;
  const newFileName = data.body.newFilename;


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
      return res.status(200).json({ message: `File Renamed to ${newFileName}` });
    }

    // check shared with edit permission 
    const sharedWithEntries = file.sharedWith.find((entry) => entry.userId.toString() === req.user._id.toString() && entry.permission === "Edit");

    if (!sharedWithEntries) {
      return res.status(404).json({ error: "You do not have permission to rename this file." });
    }

    file.name = newFileName;
    file.timeStamp.lastModified.push(new Date());
    file.save();



    return res.status(200).json({ message: `File Renamed to ${newFileName}` });
  } catch (error) {
    return res.status(404).json({ error: "File not renamed" });
  }
};



// --- delete file 
export const deleteFile = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const fileData = await File.findOne({
      _id: new ObjectId(id),
      userId: req.user._id,
    });

    if (!fileData) {
      return res.status(404).json({ message: "File not found" });
    }
    // Delete from S3
    await deleteFileFromS3(`${fileData._id}${fileData.extension}`);

    // Delete from DB
    await File.deleteOne({ _id: fileData._id });

    // Update used space
    user.usedSpace -= fileData.size;
    await user.save();

    return res.status(200).json({ message: ` ${fileData.name} File Deleted Successfully` });

  } catch (err) {
    console.error("Delete file error:", err);
    return res.status(500).json({ message: err.message });
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
    // check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Enter valid email" });

    // check file
    const file = await File.findOne({ _id: fileId, userId: req.user._id });
    if (!file) return res.status(404).json({ error: "File not found" });


    // File Share limit based on user plan 
    const FILE_SHARE_LIMITS = {
      free: 20,
      starter: 500,
      pro: 100,
      ultimate: Infinity
    };

    const userFilesSharedCount = file.sharedWith.length;
    const fileShareLimit = req.user.userIs === "free" ? FILE_SHARE_LIMITS.free : FILE_SHARE_LIMITS[req.user.subscriptionTier];

    if (userFilesSharedCount > fileShareLimit) {
      return res.status(403).json({ error: `You have reached the maximum number of shared users allowed for your plan.` });
    }


    // check if already shared 
    const existingShare = file.sharedWith.find((shared) => shared.userId.toString() === user._id.toString())

    // update permission if already shared
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

