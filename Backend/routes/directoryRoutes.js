import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {
  createDirectory,
  getDirectoryById,
  updateDirectoryById,
  deleteDirectoryById,
} from "../controllers/directoryController.js";
import { blockIfExpired, blockIfPaused } from "../middleware/subscriptionMiddleware.js";
import { directoryCreateLimiter, fileFolderDeleteLimiter, fileFolderRenameLimiter } from "../middleware/Rate Limiter/fileFolderLimiter.js";

const router = express.Router();

router.param("id", validatinoIdMiddleware);
router.param("parentDirId", validatinoIdMiddleware);

// create dir
router.post("/:parentDirId?",directoryCreateLimiter, blockIfPaused,blockIfExpired, createDirectory);

// Read
router.get("/:id?", getDirectoryById);

// update : rename directory
router.patch("/:id",fileFolderRenameLimiter, blockIfPaused,blockIfExpired, updateDirectoryById);

// delete directory
router.delete("/:id",fileFolderDeleteLimiter, blockIfPaused, blockIfExpired, deleteDirectoryById);

export default router;
