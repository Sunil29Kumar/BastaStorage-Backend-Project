import fs from "fs";
import path from "path";
import File from "../models/fileModel.js";
import Directorie from "../models/directoryModel.js";
import { google } from "googleapis";
import { oauth2Client } from "../utils/googleDriveAuthService.js";
import User from "../models/userModel.js";

// upload google drive file by downloading from Google
export const sendGoogleDriveFile = async (req, res) => {
  try {
    const { file } = req.body; // frontend se metadata aayega (id, name, mimeType, size)
    const parentDirId = req.params.parentDirId || req.user.rootDirId;
    const userId = req.user._id;


    if (!file || !file.name) {
      return res.status(400).json({ message: "File name is missing in request" });
    }

    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // parent dir check
    const parentDirData = await Directorie.findOne({
      _id: parentDirId,
      userId,
    });

    if (!parentDirData) {
      return res.status(400).json({ message: "Parent Directory not found" });
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
      fileFrom: "googleDrive",
      timeStamp: {
        fileCreatedAt: new Date(file.createdTime),
        opened: [],
        lastModified: [],
        lastDownload: [],
      },
    });



    const fullFileName = `${googleDriveFileData._id}${extension}`;
    const destPath = `./storage/google-drive-files/${fullFileName}`;

    // Google Drive API client
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // download file from Google Drive
    const driveResponse = await drive.files.get(
      { fileId: file.id, alt: "media" },
      { responseType: "stream" }
    );

    const dest = fs.createWriteStream(destPath);

    await new Promise((resolve, reject) => {
      driveResponse.data
        .on("end", async () => {
          // update size in User
          await User.findByIdAndUpdate(
            { _id: userId },
            { $inc: { usedSpace: file.size } }
          );
          resolve();
        })
        .on("error", async (err) => {
          console.error("Download error:", err);
          await File.deleteOne({ _id: googleDriveFileData._id });
          reject(err);
        })
        .pipe(dest);
    });

    res.status(200).json({ message: "Your file has been added to BastaStorage from Google Drive" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload file" });
  }
};
