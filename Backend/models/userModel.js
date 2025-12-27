
import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
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
      unique: true,
    },
    password: {
      type: String,
      // pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&]).{6,}$",
      description:
        "Password must have 6+ characters with uppercase, lowercase, number and special character",
    },
    pictureKey: {
      type: String,
    },
    picture: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/037/336/395/non_2x/user-profile-flat-illustration-avatar-person-icon-gender-neutral-silhouette-profile-picture-free-vector.jpg"
    },

    totalSpace: {
      type: Number,
      default: 1024 * 1024 * 500  // 500mb
    },
    usedSpace: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      enum: ["owner", "user", "admin", "manager"],
      default: "user"
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    darekMode: {
      type: Boolean,
      default: false
    },
    loginWith: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email"
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


// auto calculate hoga 
userSchema.virtual("remainingSpace").get(function () {
  return this.totalSpace - this.usedSpace;
});

const User = mongoose.model("User", userSchema);
export default User;
