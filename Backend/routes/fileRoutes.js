import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {
  createFile,
  deleteFile,
  getFile,
  renameFile,
  shareFile,
  sharefileViewer,
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


export default router;
