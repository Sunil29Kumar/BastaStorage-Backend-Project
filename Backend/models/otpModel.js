import mongoose, {Schema} from "mongoose";

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
      expires: 600,
    },
    // verified: {
    //   type: Boolean,
    //   default: false,
    // },
    // attempts: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

const OTP = mongoose.model("Otp", otpSchema);
export default OTP;
