import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
  {
    rootDirId: {
      type: mongoose.Schema.Types.ObjectId,
      description: "Must be an ObjectId and is required",
      ref: "User",
    },
    name: {
      type: String,
      minLength: 3,
      maxLength: 255,
      description: "Name Must contain minimun 3 character",
    },
    email: {
      type: String,
      pattern: "^[\\w\\.-]+@([\\w\\-]+\\.)+[\\w]{2,4}$",
      description: "Must be a valid email address",
    },
    password: {
      type: String,
      pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&]).{6,}$",
      description:
        "Password must have 6+ characters with uppercase, lowercase, number and special character",
    },
    userTimeStamp: {
      userCreatedAt: {
        type: Date,
      },
      userLoginAt: {
        type: [Date],
      },
      userLogoutAt: {
        type: [Date],
      },
    },
  },
  {
    strict: "throw",
    timestamps: false,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
