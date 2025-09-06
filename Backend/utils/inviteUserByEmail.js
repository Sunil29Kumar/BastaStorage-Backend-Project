import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function inviteUserByEmail(
  ownerEmail,
  receiverEmail,
  fileId,
  fileName,
  permission,
  ownerName,
  token
) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD, // Gmail App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"${ownerName} via BastaStorage" <${process.env.USER_EMAIL}>`,
      to: receiverEmail,
      subject: `${ownerEmail} shared a file with you`,
      html: `
        <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
  <div style="background:linear-gradient(90deg,#2563eb,#1e40af); color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
    📁 BastaStorage - File Invitation
  </div>
  
  <div style="padding:20px; background:#f9fafb;">
    <p style="margin:0 0 15px;"><b>${ownerName}</b> has shared a file with you via <b>BastaStorage</b>.</p>
    
    <div style="background:white; border:1px solid #e5e7eb; border-radius:6px; padding:15px; margin-bottom:20px;">
      <p style="margin:5px 0;"><b>📄 File:</b> ${fileName}</p>
      <p style="margin:5px 0;"><b>🔑 Permission:</b> ${permission}</p>
    </div>

    <p style="margin:0 0 20px;">Click the button below to view the file securely:</p>
    <a href="http://localhost:5173/share/${fileId}/view/${token}" target="_blank"
       style="display:inline-block; padding:12px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
      Open File
    </a>
    <p style="font-size:12px; color:#6b7280; margin-top:15px;">If the button doesn’t work, copy and paste this link into your browser: <br>
      <a href="http://localhost:5173/share/${fileId}/view/${token}" style="color:#2563eb;">http://localhost:5173/share/${fileId}/view/${token}</a>
    </p>
  </div>

  <div style="background:#f3f4f6; padding:12px; font-size:12px; text-align:center; color:#6b7280;">
    This is an automated message. Please do not reply. <br>
    © 2025 BastaStorage
  </div>
</div>

      `,

    });

    console.log(`Invitation sent: ${info.messageId}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

export default inviteUserByEmail;
