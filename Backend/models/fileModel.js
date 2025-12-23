import mongoose from "mongoose";

const fileSchema = await mongoose.Schema(
  {
    parentDirId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
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
      type: mongoose.Schema.Types.Long || Number,
    },
    type: {
      type: String,
    },
    URL: {
      type: String,
    },

    sharedWith: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["View", "Edit", "Remove Access"],
          default: "View",
        },
        token: {
          type: String,
        }
      },
    ],

    uploadedFrom: {
      source: {
        type: String,
        enum: ["Local Storage", "Google Drive", "Dropbox", "One Drive", "Web Upload"],
        required: true,
        default: "Local Storage",
      },

      providerFileId: {
        type: String,
      },

      providerPath: {
        type: String,
      },
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
  { timestamps: false, statics: "throw" }
);

const File = mongoose.model("File", fileSchema);
export default File;
