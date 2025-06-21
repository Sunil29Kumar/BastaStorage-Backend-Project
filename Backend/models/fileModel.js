import mongoose from "mongoose";

const fileSchema = await mongoose.Schema(
  {
    parentDirId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File", // assuming file belongs to a folder
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      minlength: 3,
      maxlength: 255,
    },
    extension: {
      type: String,
    },
    size: {
      type: mongoose.Schema.Types.Long || Number, // if using `long`, need plugin
    },
    timeStamp: {
      fileCreatedAt: {
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
);

const File = mongoose.model("File", fileSchema);
export default File