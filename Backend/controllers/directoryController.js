import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { rm } from "fs/promises";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";
import { deleteFilesFromS3 } from "../services/s3.js";


// create directory
export const createDirectory = async (req, res) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const dirname = req.headers.dirname || "folder";

  try {
    // get parent directory
    const parentDir = await Directorie.findOne({
      _id: new ObjectId(parentDirId),
    });
    if (!parentDir) {
      return res.status(404).json({ error: "parentdir is undefinde" });
    }

    // create path array
    const path = [
      ...(parentDir.path || []), // existing ancestors
      { dirName: dirname, dirPathId: parentDir._id }, // parent itself
    ];

    // check storage limit
    if (user.usedSpace > user.totalSpace) {
      return res.status(400).json({ error: "You have exceeded your storage limit." });
    }

    // ------>> directory restrictions based on user plan
    const DIRECTORY_LIMITS = {
      free: 20,
      starter: 100,
      pro: 500,
      ultimate: Infinity
    };

    const userDirectoriesCount = await Directorie.countDocuments({ userId: user._id });
    const directoryLimit = user.userIs === "free" ? DIRECTORY_LIMITS.free : DIRECTORY_LIMITS[user.subscriptionTier] || Infinity;
    if (userDirectoriesCount > directoryLimit) {
      return res.status(403).json({ error: `You have reached the maximum number of Folders allowed for your plan.` });
    }


    // db entry create
    await Directorie.insertOne({
      parentDirId: parentDir._id,
      userId: user._id,
      name: dirname,
      size: 0,
      path,
      uploadedUnderPlan: user.userIs === "pro" ? "pro" : "free",
      folderTimeStamp: {
        folderCreatedAt: new Date(),
        opened: [], 
        lastModified: [],
        lastDownload: [],
      },
    });

    return res.status(200).json({ message: ` ${dirname} Directory Created` });
  } catch (err) {
    return res.status(404).json({ err: err.message });
  }
};

// get directory by id
export const getDirectoryById = async (req, res) => {
  const user = req.user;
  const id = req.params.id || user.rootDirId;

  try {

    const currentUser = await User.findById(req.user._id);

    const directoryData = await Directorie.findOne({
      _id: new ObjectId(id),
    }).lean();

    if (!directoryData) {
      return res
        .status(404)
        .json({ error: "Directory not found or you do not have access to it!" });
    }

    const files = await File.find({ parentDirId: directoryData._id }).lean();


    if (!files) {
      return res.status(404).json({ error: "files is undefind" });
    }

    const directories = await Directorie.find({
      parentDirId: new ObjectId(id),
    }).lean();

    // updating directory opened date
    await Directorie.updateOne(
      { _id: new ObjectId(id), userId: req.user._id },
      { $push: { "folderTimeStamp.opened": new Date() } }
    );




    if (!directories) {
      return res.status(404).json({ error: "directories is undefind" });
    } else {

      return res.status(200).json({
        ...directoryData,
        files: files.map((file) => ({ ...file, id: file._id })),
        directories: directories.map((dir) => ({ ...dir, id: dir._id })),
        storageData: { totalSpace: currentUser.totalSpace, usedSpace: currentUser.usedSpace, remainingSpace: currentUser.remainingSpace, },
        path: directoryData.path || []
      });
    }
  } catch (error) {
    return res.status(404).json({ error: "Directory not found" });
  }
};


// ------- update directories
export const updateDirectoryById = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const { newDirName } = req.body;

  try {
    const dirData = await Directorie.updateOne(
      { _id: new ObjectId(id), userId: user._id },
      {
        $set: { name: newDirName },
        $push: { "folderTimeStamp.lastModified": new Date() },
      }
    );

    return res.status(200).json({ message: `Directory Renamed to ${newDirName}` });
  } catch (error) {
    return res.status(404).json({ error: "Directory not Renamed" });
  }
};

// ------- delete directories 
export const deleteDirectoryById = async (req, res) => {
  const id = req.params.id || req.user.rootDirId;
  const userId = req.user._id;
  try {
    const checkIsUserDirectory = await Directorie.findOne({
      _id: new ObjectId(id),
      userId: req.user._id,
    }).select("_id");
    if (!checkIsUserDirectory) {
      return res.json({ error: "Directory not found or you do not have access to it!" });
    }

    async function deleteDirectoriesRecursive(dirId) {
      let files = await File.find(
        { parentDirId: new ObjectId(dirId) }
      )
        .select("_id extension size")
        .lean();
      let directory = await Directorie.find(
        { parentDirId: new ObjectId(dirId) },

      )
        .select("_id name")
        .lean();

      for (const subDir of directory) {
        let { files: childFiles, directory: childDirectories } =
          await deleteDirectoriesRecursive(subDir._id);
        files = [...files, ...childFiles];
        directory = [...directory, ...childDirectories];
      }

      return { files, directory };
    }

    const { files, directory } = await deleteDirectoriesRecursive(id);

    const totalDeletedSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

    // Delete from S3
    const fileKeys = files.map(({ _id, extension }) => `${_id}${extension}`);
    if (fileKeys.length > 0) await deleteFilesFromS3(fileKeys);

    // delete from data base
    await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } });
    await Directorie.deleteMany({
      _id: { $in: [...directory.map(({ _id }) => _id), new ObjectId(id)] },
    });

    // update user usedSpace and remainingSpace
    const user = await User.findById(userId);
    user.usedSpace = - totalDeletedSize;
    await user.save();

    return res.status(200).json({ message: `Directory deleted successfully` });

  } catch (error) {
    return res.status(404).json({ error: "Directory not deleted" });
  }
};
