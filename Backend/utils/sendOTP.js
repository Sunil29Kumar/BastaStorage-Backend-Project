import nodemailer from "nodemailer";
import OTP from "../models/otpModel.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sunil.kksdk@gmail.com",
    pass: "agez qdcw eodm wxzb",
  },
});

export async function sendOTP(email) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await OTP.findOneAndUpdate(
    { email },
    { otp: otp, createdAt: new Date() },
    { upsert: true }
  );

  const info = await transporter.sendMail({
    from: '"BastaStorage" <sunil.kksdk@gmail.com>',
    to: email,
    subject: "Your One-Time Password (OTP) - BastaStorage",
    html: `
      <div style="
        max-width: 480px; 
        margin: auto; 
        padding: 20px; 
        font-family: Arial, sans-serif; 
        border: 1px solid #e0e0e0; 
        border-radius: 10px; 
        background-color: #ffffff;
      ">
        <h2 style="text-align: center; color: #4CAF50;">BastaStorage Verification</h2>
        <p style="font-size: 16px; color: #333333;">
          Hi there,
        </p>
        <p style="font-size: 16px; color: #333333;">
          Your one-time password (OTP) to verify your email is:
        </p>
        <div style="
          text-align: center; 
          margin: 20px 0; 
          padding: 10px 20px; 
          display: inline-block; 
          font-size: 24px; 
          letter-spacing: 8px; 
          font-weight: bold; 
          color: #ffffff; 
          background-color: #4CAF50; 
          border-radius: 6px;
        ">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #777777;">
          Please enter this code on the website. This OTP will expire in 10 minutes.
        </p>
        <hr style="margin: 20px 0;">
        <p style="font-size: 12px; color: #999999; text-align: center;">
          If you did not request this code, you can safely ignore this email.
        </p>
        <p style="font-size: 12px; color: #999999; text-align: center;">
          &copy; ${new Date().getFullYear()} BastaStorage
        </p>
      </div>
    `,
  });

  console.log("Message sent: %s", info.messageId);
}
