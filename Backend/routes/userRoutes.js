import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  hardDeleteUserById,
  loginUser,
  logoutAllDevice,
  logoutUser,
  logoutUserById,
  registerUser,
  softDeleteUserById,
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

// logout user by id throw admin and manager
router.post("/users/logout", checkAuth, userMiddleware, logoutUserById);

// delete user using id  by admin 
// hard delete 
router.post("/users/delete/hard", checkAuth, userMiddleware, hardDeleteUserById);

// soft delete
router.post("/users/delete/soft", checkAuth, userMiddleware, softDeleteUserById);

export default router;
