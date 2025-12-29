import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {
  createDirectory,
  getDirectoryById,
  updateDirectoryById,
  deleteDirectoryById,
} from "../controllers/directoryController.js";
import { blockIfPaused } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

router.param("id", validatinoIdMiddleware);
router.param("parentDirId", validatinoIdMiddleware);

// create dir
router.post("/:parentDirId?", blockIfPaused, createDirectory);

// Read
router.get("/:id?", getDirectoryById);

// update : rename directory
router.patch("/:id", blockIfPaused, updateDirectoryById);

// delete directory
router.delete("/:id", blockIfPaused, deleteDirectoryById);

export default router;
