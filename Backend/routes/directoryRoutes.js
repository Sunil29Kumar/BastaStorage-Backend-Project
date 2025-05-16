import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {ObjectId} from "mongodb";
import {rm} from "fs/promises";

const router = express.Router();

router.param("id", validatinoIdMiddleware);
router.param("parentDirId", validatinoIdMiddleware);

// create dir
router.post("/:parentDirId?", async (req, res) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const dirname = req.headers.dirname || "folder";
  const db = req.db;

  try {
    const parentDir = await db
      .collection("directories")
      .findOne({_id: new ObjectId(parentDirId)});

    if (!parentDir) {
      return res.status(404).json({message: "parentdir is undefinde"});
    }

    const directoriesData = await db.collection("directories").insertOne({
      parentDirId: parentDir._id,
      userId: user._id,
      name: dirname,
      folderTimeStamp: {
        folderCreatedAt: new Date(),
        opened: [],
        lastModified: [],
        lastDownload: [],
      },
    });

    return res.status(200).json({message: "Directory Created!"});
  } catch (err) {
    return res.status(404).json({err: err.message});
  }
});

// Read
router.get("/:id?", async (req, res) => {
  const user = req.user;
  const id = req.params.id || user.rootDirId;
  const db = req.db;
  const directoriesCollection = db.collection("directories");

  try {
    const directoryData = await directoriesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!directoryData) {
      return res
        .status(404)
        .json({error: "Directory not found or you do not have access to it!"});
    }

    const files = await db
      .collection("files")
      .find({parentDirId: directoryData._id})
      .toArray();
    if (!files) {
      return res.status(404).json({message: "files is undefind"});
    }

    const directories = await directoriesCollection
      .find({
        parentDirId: new ObjectId(id),
      })
      .toArray();

    // updating directory opened date
    await directoriesCollection.updateOne(
      {_id: new ObjectId(id), userId:req.user._id},
      {$push: {"folderTimeStamp.opened": new Date()}}
    );

    if (!directories) {
      return res.status(404).json({error: "directories is undefind"});
    } else {
      return res.status(200).json({
        ...directoryData,
        files: files.map((file) => ({...file, id: file._id})),
        directories: directories.map((dir) => ({...dir, id: dir._id})),
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// update : rename directory
router.patch("/:id", async (req, res) => {
  const {id} = req.params;
  const user = req.user;

  const {newDirName} = req.body;
  const db = req.db;

  try {
    const dirData = await db.collection("directories").updateOne(
      {_id: new ObjectId(id), userId: user._id},
      {
        $set: {name: newDirName},
        $push: {"folderTimeStamp.lastModified": new Date()},
      }
    );

    return res.status(200).json({message: "Directory Renamed"});
  } catch (error) {
    return res.status(404).json({message: "Directory not Renamed"});
  }
});

// delete directory
router.delete("/:id", async (req, res) => {
  const id = req.params.id || req.user.rootDirId;
  const db = req.db;
  let directoriesCollection = db.collection("directories");
  let filesCollection = db.collection("files");

  const checkIsUserDirectory = await directoriesCollection.findOne(
    {_id: new ObjectId(id), userId: req.user._id},
    {projection: {_id: 1}}
  );
  if (!checkIsUserDirectory) {
    return res.json({message: "id not matach"});
  }

  async function deleteDirectoriesRecursive(dirId) {
    let files = await filesCollection
      .find({parentDirId: new ObjectId(dirId)}, {projection: {extension: 1}})
      .toArray();
    let directory = await directoriesCollection
      .find({parentDirId: new ObjectId(dirId)}, {projection: {name: 1}})
      .toArray();

    for (const subDir of directory) {
      // console.log("directory name:", subDir);
      let {files: childFiles, directory: childDirectories} =
        await deleteDirectoriesRecursive(subDir._id);
      files = [...files, ...childFiles];
      directory = [...directory, ...childDirectories];
    }
    return {files, directory};
  }

  try {
    const {files, directory} = await deleteDirectoriesRecursive(id);

    for (const {_id, extension} of files) {
      await rm(`./storage/${_id.toString()}${extension}`);
    }

    await filesCollection.deleteMany({_id: {$in: files.map(({_id}) => _id)}});
    await directoriesCollection.deleteMany({
      _id: {$in: [...directory.map(({_id}) => _id), new ObjectId(id)]},
    });
    return res.status(200).json({message: "folder Delete"});
  } catch (error) {
    console.log(error);
  }
});

export default router;
