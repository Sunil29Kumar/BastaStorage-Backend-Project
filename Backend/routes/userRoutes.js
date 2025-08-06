import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import {
  loginUser,
  logoutAllDevice,
  logoutUser,
  registerUser,
} from "../controllers/userController.js";
import { registerLimiter } from "../middleware/registerLimiter.js";
import { loginLimiter } from "../middleware/loginLimiter.js";

const router = express.Router();

router.post("/register",registerLimiter, registerUser);

// login route
router.post("/login",loginLimiter, loginUser);

// sending user email, name to frontend
router.get("/", checkAuth, (req, res) => {
  return res.status(200).json({ name: req.user.name, email: req.user.email, picture: req.user.picture });
});

// logout
router.get("/logout", checkAuth, logoutUser);

// logout From all device
router.get("/logoutAllDevice", checkAuth, logoutAllDevice);
export default router;
