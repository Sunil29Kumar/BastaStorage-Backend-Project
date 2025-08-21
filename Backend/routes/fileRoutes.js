import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {
  createFile,
  deleteFile,
  getFile,
  renameFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.param("id", validatinoIdMiddleware);
router.param("parentDirId", validatinoIdMiddleware);

// Create
router.post("/:parentDirId?", createFile);

// Read
// route to read/download a file
router.get("/:id?", getFile);

// route to rename a file
router.patch("/:id", renameFile);

// ---------------------- Delete -------------------------
router.delete("/:id", deleteFile);



export default router;
