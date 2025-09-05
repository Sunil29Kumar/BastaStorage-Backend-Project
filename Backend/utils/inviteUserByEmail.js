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
          <div style="background:#2563eb; color:white; padding:16px; font-size:18px; font-weight:bold;">
            ${ownerName} shared a file with you
          </div>
          <div style="padding:20px; background:#f9fafb;">
            <p style="margin:0 0 15px;">You’ve been invited to access a file on <b>BastaStorage</b>.</p>
            
            <div style="background:white; border:1px solid #e5e7eb; border-radius:6px; padding:15px; margin-bottom:20px;">
              <p style="margin:5px 0;"><b>File:</b> ${fileName}</p>
              <p style="margin:5px 0;"><b>Permission:</b> ${permission}</p>

              <!-- File Preview Image -->
              <div style="margin-top:12px; text-align:center;">
                // <img src="cid:filePreview" 
                //      alt="File Preview" 
                //      style="max-width:100%; height:auto; border-radius:6px; border:1px solid #ddd;" />
              </div>
            </div>

            <p style="margin:0 0 20px;">Click the button below to open the file:</p>
            <a href="http://localhost:5173/share/${fileId}/view/${token}" target="_blank"
               style="display:inline-block; padding:12px 20px; background:#2563eb; color:#fff; text-decoration:none; border-radius:6px; font-weight:bold;">
              Open File
            </a>
          </div>
          <div style="background:#f3f4f6; padding:12px; font-size:12px; text-align:center; color:#6b7280;">
            This is an automated message. Please do not reply.
          </div>
        </div>
      `,
      // attachments: [
      //   {
      //     filename: fileName,
      //     path: filePath,   // local ya server file path (absolute hona chahiye)
      //     cid: "filePreview" // 👈 HTML ke <img src="cid:filePreview"> se match karega
      //   }
      // ]
    });

    console.log(`Invitation sent: ${info.messageId}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

export default inviteUserByEmail;
