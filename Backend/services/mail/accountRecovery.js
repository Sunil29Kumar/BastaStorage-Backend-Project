
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export async function sendAccountRecoveryEmail(email, link) {

    try {

        const { data, error } = await resend.emails.send({
            from: '"BastaStorage" <recovery@bastastorage.me>',
            to: email,
            subject: "Recover Your BastaStorage Account",
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
                <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: #4f46e5; padding: 20px; text-align: center;">
                <h1 style="color: #fff; margin: 0;">BastaStorage</h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px; text-align: center;">
                <h2 style="color: #333;">Recover Your Account</h2>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">
                We noticed that your BastaStorage account is marked for recovery.  
                To restore access, please click the button below.
                </p>

                <a href="${link}" 
                style="display: inline-block; margin-top: 20px; padding: 12px 24px; 
                        background: #4f46e5; color: #fff; text-decoration: none; 
                        border-radius: 8px; font-weight: bold;">
                Recover Account
                </a>

                <p style="margin-top: 20px; font-size: 13px; color: #888;">
                If you didn’t request this, you can safely ignore this email.
                </p>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #999;">
                © ${new Date().getFullYear()} BastaStorage. All rights reserved.
            </div>
            </div>
        </div>
  `,
        });

        if (error) {
            return console.error({ error });
        }

    } catch (error) {
        console.error("❌ Crash in sendAccountRecoveryEmail:", error.message);
        return { success: false, error: error.message };
    }

}