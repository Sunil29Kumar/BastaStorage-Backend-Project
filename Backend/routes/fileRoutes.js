import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {
  createFile,
  deleteFile,
  getFile,
  getSharedUsers,
  markFileUploaded,
  privateShare,
  removeSharedUser,
  renameFile,
  shareFile,
  shareFileThroughEmail,
  sharefileViewer,
  updateSharedFilePermission,
} from "../controllers/fileController.js";
import checkAuth from "../middleware/authMiddleware.js";
import { blockIfPaused } from "../middleware/subscriptionMiddleware.js";



const router = express.Router();

router.param("id", checkAuth, validatinoIdMiddleware);
router.param("parentDirId", checkAuth, validatinoIdMiddleware);

// Create 
router.post("/:parentDirId?", checkAuth, blockIfPaused, createFile);


// Read
// route to read/download a file
router.get("/:id?", checkAuth, getFile);

// complete file
router.post("/complete/:id", checkAuth, markFileUploaded)

// route to rename a file
router.patch("/:id", checkAuth, blockIfPaused, renameFile);

// ---------------------- Delete -------------------------
router.delete("/:id", checkAuth, blockIfPaused, deleteFile);

// share file link
router.post("/:id/share-link", checkAuth, blockIfPaused, shareFile);

// share file viewer
router.get("/share/:token", sharefileViewer)

// share file thwough email with permission
router.post("/:id/share", checkAuth, blockIfPaused, shareFileThroughEmail);

// fetch shared users
router.get("/:id/shared-users", checkAuth, getSharedUsers);

// private share 
router.get("/:id/share/private/:token", checkAuth, blockIfPaused, privateShare)

// update shared file permission
router.patch("/:fileId/share", checkAuth, blockIfPaused, updateSharedFilePermission)

// remove shared user
router.delete("/:fileId/share/:userId", checkAuth, blockIfPaused, removeSharedUser)



export default router;
