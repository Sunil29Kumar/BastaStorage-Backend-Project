export const subscriptionPausedTemplate = ({ name }) => {
  const accentColor = '#f59e0b'; // Amber for "Paused/Warning" status
  const brandColor = '#1f2937'; // Dark gray/black for a professional feel
  
  return `
    <div style="background-color: #f3f4f6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border-top: 6px solid ${accentColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background-color: #fffbeb; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; margin: 0 auto 15px; font-size: 30px; display: inline-block;">⏸</div>
            <h1 style="margin: 0; color: #111827; font-size: 24px; font-weight: 700;">Subscription Paused</h1>
          </div>

          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p>Your subscription has been successfully paused. You will not be charged while your account is in this state.</p>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 25px; margin: 25px 0;">
            <h3 style="margin-top: 0; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">Your Current Access:</h3>
            
            <div style="margin-bottom: 12px; display: flex; align-items: center;">
              <span style="color: #10b981; margin-right: 12px; font-size: 18px;">✓</span>
              <span style="font-size: 15px; color: #374151;">View and download your existing files</span>
            </div>
            
            <div style="display: flex; align-items: center;">
              <span style="color: #ef4444; margin-right: 12px; font-size: 18px;">✕</span>
              <span style="font-size: 15px; color: #374151;">Upload, delete, or share new content</span>
            </div>
          </div>

          <div style="background-color: #ecfdf5; color: #065f46; padding: 12px 20px; border-radius: 8px; font-size: 14px; text-align: center; font-weight: 500;">
            No recurring charges will be applied during this pause period.
          </div>


          <p style="margin-top: 40px; font-size: 14px; color: #9ca3af; text-align: center;">
            Thanks,<br/>
            <strong>The BastaStorage Team</strong>
          </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0; font-size: 12px; color: #9ca3af;">
            Questions? <a href="#" style="color: ${accentColor}; text-decoration: none;">Contact Support</a>.
            <br/>&copy; ${new Date().getFullYear()} BastaStorage
          </p>
        </div>
      </div>
    </div>
  `;
};