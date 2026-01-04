export const subscriptionActivatedTemplate = ({ name, plan }) => {
  const brandColor = '#3b82f6'; // Professional blue
  const bgColor = '#f9fafb';
  
  return `
    <div style="background-color: ${bgColor}; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: ${brandColor}; padding: 30px; text-align: center;">
          <span style="font-size: 48px;">🚀</span>
          <h1 style="color: #ffffff; margin-top: 10px; font-size: 24px; font-weight: 700;">Subscription Activated</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p style="font-size: 18px; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
          
          <p style="margin-bottom: 20px;">We are excited to let you know that your <strong>${plan}</strong> plan is now active. You have successfully unlocked all premium features and extended storage capabilities.</p>
          
          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
            <p style="margin: 0; color: #1e40af; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Active Plan</p>
            <p style="margin: 5px 0 0; font-size: 22px; font-weight: bold; color: #1e3a8a;">${plan}</p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://bastastorage.com/dashboard" 
               style="background-color: ${brandColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
               Start Using Your Account
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280;">Need help getting started? Check out our <a href="https://bastastorage.com/help" style="color: ${brandColor}; text-decoration: none;">Help Center</a> or contact our support team.</p>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="font-size: 14px; margin: 0;">Best regards,<br/><strong>The BastaStorage Team</strong></p>
        </div>

        <div style="padding: 20px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} BastaStorage. All rights reserved. <br/>
          You are receiving this email because you subscribed to a plan on our platform.
        </div>
      </div>
    </div>
  `;
};