import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    title: { type: String },
    type: {
        type: String,
        enum: ["info", "danger", "success","subscription", "system", "warning"]
    },
    message: { type: String },
    read: { type: Boolean, default: false },
    meta: Object
}, { timestamps: true });


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;