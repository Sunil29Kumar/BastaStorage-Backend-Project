import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {
  createFile,
  deleteFile,
  getFile,
  getSharedUsers,
  privateShare,
  removeSharedUser,
  renameFile,
  shareFile,
  shareFileThroughEmail,
  sharefileViewer,
  updateSharedFilePermission,
} from "../controllers/fileController.js";
import checkAuth from "../middleware/authMiddleware.js";


const router = express.Router();

router.param("id",checkAuth,validatinoIdMiddleware);
router.param("parentDirId",checkAuth,validatinoIdMiddleware);

// Create
router.post("/:parentDirId?",checkAuth,createFile);

// Read
// route to read/download a file
router.get("/:id?",checkAuth,getFile);

// route to rename a file
router.patch("/:id",checkAuth, renameFile);

// ---------------------- Delete -------------------------
router.delete("/:id",checkAuth, deleteFile);


// share file link
router.post("/:id/share-link",checkAuth, shareFile);

// share file viewer
router.get("/share/:token",sharefileViewer)

// share file thwough email with permission
router.post("/:id/share", checkAuth, shareFileThroughEmail);

// fetch shared users
router.get("/:id/shared-users", checkAuth, getSharedUsers);

// private share 
router.get("/:id/share/private/:token",checkAuth,privateShare)

// update shared file permission
router.patch("/:fileId/share",checkAuth,updateSharedFilePermission)


// remove shared user
router.delete("/:fileId/share/:userId",checkAuth,removeSharedUser)



export default router;
