import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserFileDirectories,
  getUserProfile,
  hardDeleteUserById,
  loginUser,
  logoutAllDevice,
  logoutUser,
  logoutUserById,
  registerUser,
  softDeleteUserById,
  updateUserProfile,
  updateUserRole,
} from "../controllers/userController.js";
import { registerLimiter } from "../middleware/registerLimiter.js";
import { loginLimiter } from "../middleware/loginLimiter.js";
import userMiddleware from "../middleware/userMiddleware.js";
import upload from "../middleware/multerMiddleware.js";
import { blockIfExpired, blockIfPaused } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();


// authintication 
router.post("/user/register", registerLimiter, registerUser);

// list user all files and directories
router.get("/user/files-directories/list", checkAuth, getUserFileDirectories);

// login route
router.post("/user/login", loginLimiter, loginUser);

// logout
router.get("/user/logout", checkAuth, logoutUser);

// logout From all device
router.get("/user/logoutAllDevice", checkAuth, logoutAllDevice);

//update user profile
router.post("/user", checkAuth, blockIfPaused,blockIfExpired, upload.single("userProfile"), updateUserProfile);

router.get("/user/profile", checkAuth, getUserProfile);

// Authorization List all users
router.get("/users", checkAuth, userMiddleware, getAllUsers)

// logout user by id throw admin and manager
router.post("/users/logout", checkAuth, userMiddleware, logoutUserById);

// delete user using id  by admin 
// hard delete 
router.post("/users/delete/hard", checkAuth, userMiddleware, hardDeleteUserById);

// soft delete
router.post("/users/delete/soft", checkAuth, userMiddleware, softDeleteUserById);

// change role 
router.patch("/users/changeRole", checkAuth, userMiddleware, updateUserRole);

export default router;
