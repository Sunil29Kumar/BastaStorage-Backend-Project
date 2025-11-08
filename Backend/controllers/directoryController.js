import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { rm } from "fs/promises";
import Directorie from "../models/directoryModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";

export const createDirectory = async (req, res) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const dirname = req.headers.dirname || "folder";

  try {
    const parentDir = await Directorie.findOne({
      _id: new ObjectId(parentDirId),
    });

    if (!parentDir) {
      return res.status(404).json({ message: "parentdir is undefinde" });
    }

    const path = [
      ...(parentDir.path || []), // existing ancestors
      { dirName: dirname, dirPathId: parentDir._id }, // parent itself
    ];

    await Directorie.insertOne({
      parentDirId: parentDir._id,
      userId: user._id,
      name: dirname,
      size: 0,
      path,
      folderTimeStamp: {
        folderCreatedAt: new Date(),
        opened: [],
        lastModified: [],
        lastDownload: [],
      },
    });

    return res.status(200).json({ message: "Directory Created!" });
  } catch (err) {
    return res.status(404).json({ err: err.message });
  }
};

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
      return res.status(404).json({ message: "files is undefind" });
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
      // console.log("dd = ", directoryData.path);
      // console.log("d = ", directories);

      return res.status(200).json({
        ...directoryData,
        files: files.map((file) => ({ ...file, id: file._id })),
        directories: directories.map((dir) => ({ ...dir, id: dir._id })),
        storageData: { totalSpace: currentUser.totalSpace, usedSpace: currentUser.usedSpace, remainingSpace: currentUser.remainingSpace, },
        path: directoryData.path || []
      });
    }
  } catch (error) {
    console.log(error);
  }
};

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

    return res.status(200).json({ message: "Directory Renamed" });
  } catch (error) {
    return res.status(404).json({ message: "Directory not Renamed" });
  }
};

// ------- delete directories 
export const deleteDirectoryById = async (req, res) => {
  const id = req.params.id || req.user.rootDirId;

  try {
    const checkIsUserDirectory = await Directorie.findOne({
      _id: new ObjectId(id),
      userId: req.user._id,
    }).select("_id");
    if (!checkIsUserDirectory) {
      return res.json({ message: "id not matach" });
    }

    async function deleteDirectoriesRecursive(dirId) {
      let files = await File.find(
        { parentDirId: new ObjectId(dirId) }
      )
        .select("extension")
        .lean();
      let directory = await Directorie.find(
        { parentDirId: new ObjectId(dirId) },

      )
        .select("name")
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


    for (const { _id, extension } of files) {
      const localPath = `./storage/local-files/${_id.toString()}${extension}`;
      const drivePath = `./storage/google-drive-files/${_id.toString()}${extension}`;

      // remove file from local `storage`
      try {
        await rm(localPath)
      } catch (error) {
        if (error.code !== "ENOENT") console.log(error);
      }

      // remove file from google drive `storage`
      try {
        await rm(drivePath)
      } catch (error) {
        if (error.code !== "ENOENT") console.log(error);
      }

    }


    await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } });
    await Directorie.deleteMany({
      _id: { $in: [...directory.map(({ _id }) => _id), new ObjectId(id)] },
    });

    return res.status(200).json({ message: "folder Delete" });

  } catch (error) {
    console.log(error);
  }
};
