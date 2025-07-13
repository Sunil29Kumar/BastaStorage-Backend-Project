import mongoose, {Schema} from "mongoose";

const sessionSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

const Session = mongoose.model("session", sessionSchema);
export default Session;
