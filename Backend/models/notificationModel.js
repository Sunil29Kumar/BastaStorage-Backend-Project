import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    title: { type: String },
    message: { type: String },
    type: {
        type: String,
        enum: ["info", "warning", "danger", "success"]
    },
    read: { type: Boolean, default: false },
}, { timestamps: true });


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;