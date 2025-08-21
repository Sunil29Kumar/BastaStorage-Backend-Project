import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {
  adminUser,
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

const router = express.Router();

// authintication 

router.post("/register", registerLimiter, registerUser);

// login route
router.post("/login", loginLimiter, loginUser);

// logout
router.get("/logout", checkAuth, logoutUser);

// logout From all device
router.get("/logoutAllDevice", checkAuth, logoutAllDevice);

// sending user email, name to frontend
router.get("/profile", checkAuth, userProfile);

//update user profile
router.post("/profile", checkAuth, upload.single("userPhoto"), updateUserProfile);


// Authorization 
router.get("/", adminUser)

export default router;
