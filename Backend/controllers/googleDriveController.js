import fs from "fs";
import path from "path";
import File from "../models/fileModel.js";
import Directorie from "../models/directoryModel.js";
import { google } from "googleapis";
import { oauth2Client } from "../utils/googleDriveAuthService.js";
import User from "../models/userModel.js";
import { ObjectId } from "mongodb";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../utils/s3.js";

// import z from "zod/v4";
import { sendGoogleDriveFileSchema } from "../validators/googleDriveSchema.js";
import { generateSignedUrl } from "../utils/s3.js";
import { z } from "zod/v4";

// upload google drive file by downloading from Google
export const sendGoogleDriveFile = async (req, res) => {
  try {

    // schema 
    const { success, data, error } = sendGoogleDriveFileSchema.safeParse(req.body)
    if (!success) {
      // return res.status(400).json({ error: z.flattenError(error).fieldErrors })
      return res.status(400).json({ error: z.flattenError(error).fieldErrors })
    }

    const { file } = data; // frontend se metadata aayega (id, name, mimeType, size)
    // console.log("req.file:", req.file);

    const parentDirId = req.params.parentDirId || req.user.rootDirId;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // parent dir check
    const parentDirData = await Directorie.findOne({
      _id: new ObjectId(parentDirId),
      userId,
    });

    if (!parentDirData) {
      return res.status(400).json({ error: "Parent Directory not found" });
    }

    // extension
    const extension = path.extname(file.name) || "";

    // db entry create
    const googleDriveFileData = await File.create({
      parentDirId: parentDirData._id,
      userId,
      name: file.name,
      extension,
      size: file.size,
      type: file.mimeType,
      status: "uploaded",
      uploadedFrom: {
        source: "Google Drive",
      },
      timeStamp: {
        fileCreatedAt: new Date(file.createdTime),
        opened: [],
        lastModified: [],
        lastDownload: [],
      },
    });


    const fullFileName = `${googleDriveFileData._id}${extension}`;

    // Google Drive API client
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // download file from Google Drive
    const driveResponse = await drive.files.get(
      { fileId: file.id, alt: "media" },
      { responseType: "stream" }
    );

    // upload to S3
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fullFileName,
        Body: driveResponse.data, //  Google Drive stream
        ContentType: file.mimeType,
      },
    });

    await upload.done();

    // update size in User
    await User.findByIdAndUpdate(
      { _id: userId },
      { $inc: { usedSpace: file.size } }
    );

    return res.status(200).json({ message: `Your file ${file.name} has been added to BastaStorage from Google Drive` });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Failed to upload file from Google Drive" });
  }
};
