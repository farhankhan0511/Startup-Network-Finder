export const creditExhaustTemplate = (email:string) => {
    const rechargeEmail = process.env.EMAIL_USER; 
    const subject = encodeURIComponent("recharge 5 credits");
    const body = encodeURIComponent(`Hello,\n\nI would like to recharge my account with 5 credits.\n\nThanks,\n${email}`);
  
    return `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h3 style="color: #ff4c4c;">⚠️ Low Credits Alert</h3>
          <p>Dear ${email},</p>
          <p>Your account is running low on credits.</p>
          <p><b>To recharge:</b> Click the button below to send an email request.</p>
          <a href="mailto:${rechargeEmail}?subject=${subject}&body=${body}" 
             style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
             Recharge Now
          </a>
          <p>Or send an email to <a href="mailto:${rechargeEmail}">${rechargeEmail}</a> with the subject <b>"recharge 5 credits"</b>.</p>
          <p>Thank you!</p>
        </body>
      </html>
    `;
  };
  