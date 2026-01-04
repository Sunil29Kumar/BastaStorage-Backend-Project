export const subscriptionResumedTemplate = ({ name, plan }) => {
  const successColor = '#10b981'; // Vibrant Green for "Resume/Success"
  const brandColor = '#3b82f6';   // Brand Blue
  
  return `
    <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        
        <div style="background-color: ${successColor}; padding: 10px; text-align: center;"></div>

        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 50px; margin-bottom: 10px;">⚡</div>
            <h1 style="margin: 0; color: #111827; font-size: 26px; font-weight: 800;">Welcome Back!</h1>
            <p style="color: #6b7280; margin-top: 5px;">Your subscription is now active</p>
          </div>

          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p>Great news! Your <strong>${plan}</strong> subscription has been successfully resumed. You now have full access to your account features again.</p>

          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <h3 style="margin-top: 0; font-size: 14px; color: #166534; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px;">What's restored:</h3>
            
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="padding-bottom: 10px; font-size: 15px; color: #14532d;">
                  <span style="margin-right: 10px;">✅</span> <strong>Full Access:</strong> Upload & manage all files
                </td>
              </tr>
              <tr>
                <td style="padding-bottom: 10px; font-size: 15px; color: #14532d;">
                  <span style="margin-right: 10px;">✅</span> <strong>Collaboration:</strong> Share files and folders instantly
                </td>
              </tr>
              <tr>
                <td style="font-size: 15px; color: #14532d;">
                  <span style="margin-right: 10px;">✅</span> <strong>Unlimited:</strong> Full storage capacity enabled
                </td>
              </tr>
            </table>
          </div>


          <p style="margin-top: 40px; font-size: 14px; color: #6b7280; text-align: center;">
            Thank you for staying with us!<br/>
            <strong>The BastaStorage Team</strong>
          </p>
        </div>

        <div style="background-color: #f3f4f6; padding: 25px; text-align: center; font-size: 12px; color: #9ca3af;">
          <p style="margin: 0 0 10px 0;">
            Need help? <a href="https://bastastorage.com/support" style="color: ${brandColor}; text-decoration: none;">Contact Support</a>
          </p>
          &copy; ${new Date().getFullYear()} BastaStorage. All rights reserved.
        </div>
      </div>
    </div>
  `;
};