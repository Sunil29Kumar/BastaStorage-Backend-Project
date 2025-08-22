import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  loginUser,
  logoutAllDevice,
  logoutUser,
  registerUser,
  updateUserProfile,
  userProfile,
} from "../controllers/userController.js";
import { registerLimiter } from "../middleware/registerLimiter.js";
import { loginLimiter } from "../middleware/loginLimiter.js";
import { upload } from "../middleware/uploadUserPhoto.js";
import userMiddleware from "../middleware/userMiddleware.js";

const router = express.Router();

// authintication 

router.post("/user/register", registerLimiter, registerUser);

// login route
router.post("/user/login", loginLimiter, loginUser);

// logout
router.get("/user/logout", checkAuth, logoutUser);

// logout From all device
router.get("/user/logoutAllDevice", checkAuth, logoutAllDevice);

// sending user email, name to frontend
router.get("/user", checkAuth, userProfile);

//update user profile
router.post("/user", checkAuth, upload.single("userPhoto"), updateUserProfile);

// Authorization List all users
router.get("/users", checkAuth, userMiddleware, getAllUsers)

export default router;
