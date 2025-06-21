import mongoose, {Schema} from "mongoose";

const directorySchema = new Schema(
  {
    parentDirId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorie",
      default: null, // top-level folders
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      minlength: 1,
      maxlength: 255,
    },
    folderTimeStamp: {
      folderCreatedAt: {
        type: Date,
      },
      opened: {
        type: [Date],
      },
      lastModified: {
        type: [Date],
      },
      lastDownload: {
        type: [Date],
      },
    },
  },
  {timestamps: false, statics: "throw"}
); // since you're managing your own timestamps

const Directorie = mongoose.model("Directorie", directorySchema);

export default Directorie;
