export const subscriptionCancelledTemplate = ({ name, endDate }) => {
  const alertColor = '#ef4444'; // Red for cancellation/expiry
  const brandColor = '#4b5563'; // Neutral gray for a serious tone

  return `
    <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
        
        <div style="background-color: #fef2f2; padding: 30px; text-align: center; border-bottom: 1px solid #fee2e2;">
          <div style="font-size: 40px; margin-bottom: 10px;">❌</div>
          <h1 style="margin: 0; color: ${alertColor}; font-size: 24px; font-weight: 700;">Subscription Cancelled</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
          <p>We're reaching out to confirm that your subscription has been cancelled. We're sorry to see you go!</p>

          <div style="background-color: #f8fafc; border-left: 4px solid ${brandColor}; padding: 20px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Premium Access Until</p>
            <p style="margin: 5px 0 0; font-size: 20px; font-weight: 700; color: #1e293b;">${endDate}</p>
          </div>

          <h3 style="font-size: 16px; color: #111827; margin-bottom: 15px;">What happens after ${endDate}?</h3>
          <ul style="padding-left: 20px; margin: 0 0 25px 0; color: #4b5563;">
            <li style="margin-bottom: 8px;">Your account will transition to our <strong>Free Tier</strong>.</li>
            <li style="margin-bottom: 8px;">Premium features (like advanced sharing) will be availabel until ${endDate}.</li>
          </ul>

          <p style="margin-top: 40px; font-size: 14px; color: #9ca3af; text-align: center;">
            Thank you for being part of BastaStorage.<br/>
            <strong>The Team</strong>
          </p>
        </div>

      </div>
    </div>
  `;
};