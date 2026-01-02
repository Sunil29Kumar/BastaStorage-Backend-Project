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
import { blockIfExpired, blockIfPaused } from "../middleware/subscriptionMiddleware.js";



const router = express.Router();

router.param("id", checkAuth, validatinoIdMiddleware);
router.param("parentDirId", checkAuth, validatinoIdMiddleware);

// Create 
router.post("/:parentDirId?", checkAuth, blockIfExpired, blockIfPaused, createFile);


// Read
// route to read/download a file
router.get("/:id?", checkAuth, getFile);

// complete file
router.post("/complete/:id", checkAuth, markFileUploaded)

// route to rename a file
router.patch("/:id", checkAuth, blockIfExpired, blockIfPaused, renameFile);

// ---------------------- Delete -------------------------
router.delete("/:id", checkAuth, blockIfExpired, blockIfPaused, deleteFile);

// share file link
router.post("/:id/share-link", checkAuth, blockIfExpired, blockIfPaused, shareFile);

// share file viewer
router.get("/share/:token", sharefileViewer)

// share file thwough email with permission
router.post("/:id/share", checkAuth, blockIfExpired, blockIfPaused, shareFileThroughEmail);

// fetch shared users
router.get("/:id/shared-users", checkAuth, getSharedUsers);

// private share 
router.get("/:id/share/private/:token", checkAuth, blockIfExpired, blockIfPaused, privateShare)

// update shared file permission
router.patch("/:fileId/share", checkAuth, blockIfExpired, blockIfPaused, updateSharedFilePermission)

// remove shared user
router.delete("/:fileId/share/:userId", checkAuth, blockIfExpired, blockIfPaused, removeSharedUser)

export default router;
