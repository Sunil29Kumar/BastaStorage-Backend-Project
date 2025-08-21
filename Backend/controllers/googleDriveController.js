import { createWriteStream } from "fs";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import path from "path";
import { downloadFromDrive } from "../utils/downloadFromDrive.js";
import { oauth2Client } from "../utils/googleDriveAuthService.js";


// upload google drive file 
export const sendGoogleDriveFile = async (req, res) => {
  const { file } = req.body
  const parentDirId = req.params.parentDirId || req.user.rootDirId;
  const userId = req.user._id
  console.log(file);

  const parentDirData = await Directorie.findOne({
    _id: parentDirId,
    userId,
  });

  if (!parentDirData) {
    return res
      .status(400)
      .json({ message: "Parent Directory Data is undefined" });
  }

  const extension = path.extname(file.name);

  const googleDriveFileData = await File.create({
    parentDirId: parentDirData._id,
    userId,
    name: file.name,
    extension,
    size: file.size,
    timeStamp: {
      fileCreatedAt: new Date(),
      opened: [],
      lastModified: [],
      lastDownload: [],
    },
  });


  const fullFileName = `${googleDriveFileData._id}${extension}`;
  const destPath = `./storage/${fullFileName}`;


  await downloadFromDrive(oauth2Client, file.id, destPath);
  req.on("end", async () => {
    return res.status(200).json({ message: "File Uploaded" });
  });
  req.on("error", async () => {
    await File.deleteOne({ _id: googleDriveFileData._id });
    return res.status(400).json({ message: "Failed to Upload" });
  });


}