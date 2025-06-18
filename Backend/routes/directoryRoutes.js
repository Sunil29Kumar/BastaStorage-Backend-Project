import express from "express";
import validatinoIdMiddleware from "../middleware/validationIdMiddleware.js";
import {
  createDirectory,
  getDirectoryById,
  updateDirectoryById,
  deleteDirectoryById,
} from "../controllers/directoryController.js";

const router = express.Router();

router.param("id", validatinoIdMiddleware);
router.param("parentDirId", validatinoIdMiddleware);

// create dir
router.post("/:parentDirId?", createDirectory);

// Read
router.get("/:id?", getDirectoryById);

// update : rename directory
router.patch("/:id", updateDirectoryById);

// delete directory
router.delete("/:id", deleteDirectoryById);

export default router;
