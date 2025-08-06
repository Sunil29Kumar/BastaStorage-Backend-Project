import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
  },

  {
    timestamps: true,
  }

);


const OTP = mongoose.model("Otp", otpSchema);
export default OTP;
