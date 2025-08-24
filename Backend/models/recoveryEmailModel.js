
import mongoose from "mongoose";

const recoveryEmailSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    token: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5, // 5 minutes
    },
});

const RecoveryEmail = new mongoose.model("RecoveryEmail", recoveryEmailSchema)

export default RecoveryEmail
