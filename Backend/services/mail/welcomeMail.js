import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeMail = async (userEmail, userName) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'BastaStorage <hello@bastastorage.me>',
            to: userEmail,
            subject: 'Welcome to the Future of Storage! ☁️',
            html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden;">
          <div style="background-color: #4CAF50; padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to BastaStorage, ${userName}!</h1>
          </div>
          
          <div style="padding: 30px; color: #333; line-height: 1.6;">
            <p style="font-size: 16px;">We're excited to have you on board. Your account is now active and ready for action.</p>
            
            <h3 style="color: #4CAF50;">What can you do next?</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Upload Files:</strong> Start saving your documents securely.</li>
              <li><strong>Share Safely:</strong> Use password-protected links for your files.</li>
              <li><strong>Go Pro:</strong> Upgrade your plan for more space anytime.</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}/login" style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started Now</a>
            </div>

            <p style="font-size: 14px; color: #777;">Need help? Just reply to this email, we are here for you.</p>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999;">
            <p>&copy; ${new Date().getFullYear()} BastaStorage. All rights reserved.</p>
          </div>
        </div>
      `,
        });
        if (error) {
            return console.error({ error });
        }
    } catch (error) {
        console.error("❌ Crash in sendWelcomeMail:", error.message);
        return { success: false, error: error.message };
    }
};