import mongoose, {Schema} from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800, // 7 days in seconds
  },
});

const Session = mongoose.model("session", sessionSchema);
export default Session;
