export const graceReminderTemplate = ({ name, days }) => {
  const warningColor = '#f59e0b'; // Amber for warning
  const brandColor = '#111827';

  return `
    <div style="background-color: #fefce8; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #fef3c7; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: ${warningColor}; padding: 25px; text-align: center;">
          <span style="font-size: 40px;">⚠️</span>
          <h1 style="color: #ffffff; margin-top: 10px; font-size: 22px; font-weight: 700; text-transform: uppercase;">Action Required</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          
          <p>Your subscription has expired, and your account is now in a <strong>grace period</strong>. We are reaching out to help you secure your data before it is permanently removed.</p>

          <div style="background-color: #fffbeb; border: 2px dashed ${warningColor}; border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px; text-transform: uppercase; font-weight: 700;">Time Remaining</p>
            <p style="margin: 5px 0 0; font-size: 32px; font-weight: 800; color: #b45309;">${days} Day${days > 1 ? 's' : ''} Left</p>
          </div>

          <div style="background-color: #fff1f2; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
            <p style="margin: 0; color: #9f1239; font-size: 14px;">
              <strong>Note:</strong> Once this period ends, any files exceeding the free storage limit will be <strong>permanently deleted</strong> to comply with our storage policy.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="http://localhost:5173/plans" 
               style="background-color: ${brandColor}; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">
               Renew Subscription
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Don't lose your work. Renew today to restore full access instantly.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="font-size: 14px; margin: 0; text-align: center;">Best regards,<br/><strong>The BastaStorage Team</strong></p>
        </div>

        <div style="padding: 20px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} BastaStorage. All rights reserved.
        </div>
      </div>
    </div>
  `;
};