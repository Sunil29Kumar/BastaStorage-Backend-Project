import OTP from "../models/otpModel.js";
import {sendOTP} from "../utils/sendOTP.js";

export const sendOTPUser = async (req, res, next) => {
  const {email} = req.body;
  console.log(email);
  if (!email) {
    return res.status(400).json({error: "enter email"});
  }
  const otp = await OTP.findOne({email: email});
  sendOTP(email);

  return res.json({message: `OTP Send to ${email}`});
};

// verify otp
export const verifyOtp = async (req, res, next) => {
  const {email, otp} = req.body;
  console.log(email, otp);

  try {
    const otpModel = await OTP.findOne({email: email});
    if (otpModel.otp != otp) {
      return res.status(400).json({error: "OTP not Match"});
    }

    return res.status(200).json({message: "OTP Succesfully Match"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error: error.message});
  }
};
