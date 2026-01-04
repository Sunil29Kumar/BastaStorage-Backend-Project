export const subscriptionExpiredTemplate = ({ name, graceDays }) => {
  const alertColor = '#dc2626'; // Red for "Expired/Urgent"
  const brandColor = '#111827';

  return `
    <div style="background-color: #f3f4f6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #fee2e2; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: ${alertColor}; padding: 30px; text-align: center;">
          <div style="font-size: 40px; margin-bottom: 10px;">⛔</div>
          <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Subscription Expired</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p>Your subscription has officially expired, and your account has been transitioned to our <strong>Free Plan</strong>.</p>

          ${
            graceDays
              ? `
              <div style="background-color: #fffaf0; border: 1px solid #feebc8; border-radius: 8px; padding: 25px; margin: 25px 0;">
                <h3 style="margin-top: 0; font-size: 14px; color: #9c4221; text-transform: uppercase; letter-spacing: 0.5px;">Action Required: ${graceDays}-Day Grace Period</h3>
                <p style="font-size: 15px; color: #7b341e;">Your files are safe for now, but your access is currently limited:</p>
                
                <table role="presentation" width="100%" style="margin: 15px 0;">
                  <tr>
                    <td style="padding: 5px 0; font-size: 14px;"><span style="color: #10b981; margin-right: 8px;">✅</span> View and download existing files</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-size: 14px;"><span style="color: #ef4444; margin-right: 8px;">✕</span> Upload, share, or edit content</td>
                  </tr>
                </table>

                <p style="margin: 15px 0 0; font-size: 13px; color: #9b2c2c; font-weight: 600; padding: 10px; background: #fff5f5; border-radius: 4px;">
                  ⚠️ Important: Files exceeding free storage limits may be permanently deleted after the grace period ends.
                </p>
              </div>
              `
              : `
              <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <p style="margin: 0; color: #4b5563;">All premium features and extended storage have been disabled.</p>
              </div>
              `
          }

          <p>Renew your subscription now to restore full access and ensure your data remains safe. </p>

          <div style="text-align: center; margin: 35px 0;">
            <a href="http://localhost:5173/plans" 
               style="background-color: ${brandColor}; color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">
               Renew Subscription Now
            </a>
          </div>

          <p style="margin-top: 40px; font-size: 14px; color: #9ca3af; text-align: center;">
            Thanks for choosing BastaStorage,<br/>
            <strong>The Team</strong>
          </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            If you believe this is an error, please <a href="#" style="color: ${alertColor}; text-decoration: none;">contact support</a> immediately.
          </p>
        </div>
      </div>
    </div>
  `;
};