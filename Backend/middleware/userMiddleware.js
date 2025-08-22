import User from "../models/userModel.js";

export default async function userMiddleware(req, res, next) {
    try {
        if (req.user.role != "user") return next();
        res.status(403).json({ error: "Access denied. Admins only." });
    } catch (error) {
        console.error("Error in userMiddleware:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
