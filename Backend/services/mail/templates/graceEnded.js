export const graceEndedTemplate = ({ name }) => {
  const neutralColor = '#4b5563'; // Slate gray for finality
  const brandColor = '#111827';

  return `
    <div style="background-color: #f3f4f6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: ${neutralColor}; padding: 30px; text-align: center;">
          <span style="font-size: 40px;">📂</span>
          <h1 style="color: #ffffff; margin-top: 10px; font-size: 22px; font-weight: 700;">Storage Status Updated</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          
          <p>This email is to confirm that the grace period for your expired subscription has now <strong>ended</strong>.</p>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin: 25px 0;">
            <h3 style="margin-top: 0; font-size: 14px; color: #111827; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">Account Changes:</h3>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="padding-bottom: 12px; font-size: 15px;">
                  <span style="color: #ef4444; margin-right: 10px;">✕</span> 
                  Files exceeding the Free Plan limit have been <strong>permanently removed</strong>.
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 12px; font-size: 15px;">
                  <span style="color: #10b981; margin-right: 10px;">✓</span> 
                  Files within the <strong>Free Plan</strong> limits remain safe and accessible.
                </td>
              </tr>
              <tr>
                <td style="font-size: 15px;">
                  <span style="color: #3b82f6; margin-right: 10px;">ℹ</span> 
                  Your account is now officially on the <strong>Free Plan</strong>.
                </td>
              </tr>
            </table>
          </div>

          <p>While your premium storage has been cleared, you can upgrade at any time in the future to restore premium features and higher storage limits for new uploads.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/plans" 
               style="border: 2px solid ${brandColor}; color: ${brandColor}; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
               View Available Plans
            </a>
          </div>

          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            If you believe this was an error or need assistance, please reach out to our support team.
          </p>
          
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
          
          <p style="font-size: 14px; margin: 0; text-align: center;">Best regards,<br/><strong>The BastaStorage Team</strong></p>
        </div>

        <div style="padding: 20px; background-color: #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af;">
          &copy; ${new Date().getFullYear()} BastaStorage. All rights reserved.
        </div>
      </div>
    </div>
  `;
};