import fs from "fs";
import path from "path";
import File from "../models/fileModel.js";
import Directorie from "../models/directoryModel.js";
import { google } from "googleapis";
import { oauth2Client } from "../utils/googleDriveAuthService.js";
import User from "../models/userModel.js";
import { ObjectId } from "mongodb";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Client } from "../services/s3.js";

// import z from "zod/v4";
import { sendGoogleDriveFileSchema } from "../validators/googleDriveSchema.js";
import { z } from "zod/v4";
import Subscription from "../models/subscriptionModel.js";


// upload google drive file by downloading from Google
export const sendGoogleDriveFile = async (req, res) => {
  try {

    // schema 
    const { success, data, error } = sendGoogleDriveFileSchema.safeParse(req.body)
    if (!success) {
      // return res.status(400).json({ error: z.flattenError(error).fieldErrors })
      return res.status(400).json({ error: "Invalid data format" })
    }

    const { file } = data; // frontend se metadata aayega (id, name, mimeType, size)

    const parentDirId = req.params.parentDirId || req.user.rootDirId;
    const userId = req.user._id;

    // user check
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
    const size = file.size || 0;

    // check storage limit
    // if (user.usedSpace + size > user.totalSpace) {
    //   return res.status(400).json({ error: "You have exceeded your storage limit." });
    // }

    // ----- File upload From Google Drive restrictions based on user plan
    // check subscription status
    const subscription = await Subscription.findOne({ userId: req.user._id });
    if (subscription?.status.includes("created", "paused", "cancelled", "expired", "pending", "failed")) {
      return res.status(403).json({ error: `Your Subscription is ${subscription.status}. File upload is not allowed.` });
    }


    // File upload From Google Drive restrictions based on user plan
    const GD_FILE_AND_SIZE_LIMITS = {
      free: {
        maxFiles: 20,
        maxSize: 50 * 1024 * 1024
      },
      starter: {
        maxFiles: 100,
        maxSize: 1 * 1024 * 1024 * 1024
      },
      pro: {
        maxFiles: 500,
        maxSize: Infinity
      },
      ultimate: {
        maxFiles: Infinity,
        maxSize: Infinity
      }
    }

    // count existing Google Drive files
    const googleDriveFilesCount = await File.countDocuments({ userId: req.user._id, uploadedFrom: { source: "Google Drive" } });

    const planKey = user.userIs === "free" || req.subscription.subscriptionTier === "expired" ? "free" : user.subscriptionTier || "ultimate";
    const { maxFiles, maxSize } = GD_FILE_AND_SIZE_LIMITS[planKey];

    // max files limit
    if (googleDriveFilesCount >= maxFiles) {
      return res.status(403).json({
        error: `${planKey} plan users can upload only ${maxFiles} files from Google Drive.`,
      });
    }

    // file size limit
    if (size > maxSize) {
      const sizeLabel =
        maxSize === Infinity ? "any size" : maxSize >= 1024 * 1024 * 1024 ? `${maxSize / (1024 * 1024 * 1024)} GB` : `${maxSize / (1024 * 1024)} MB`;

      return res.status(403).json({
        error: `${planKey} plan users can upload files up to ${sizeLabel} from Google Drive.`,
      });
    }


    // db entry create
    const googleDriveFileData = await File.create({
      parentDirId: parentDirData._id,
      userId,
      name: file.name,
      extension,
      size: size,
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
      { $inc: { usedSpace: size } }
    );

    return res.status(200).json({ message: `Your file ${file.name} has been added to BastaStorage from Google Drive` });

  } catch (error) {

    res.status(500).json({ error: "Failed to upload file from Google Drive" });
  }
};
