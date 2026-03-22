const getEmailHtml = (firstName, brandName, orderId, surveyLink) => {
    return `
    <div style="font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #333;">Hi ${firstName},</h2>
        <p>We'd love to hear your feedback on your recent order <b>#${orderId}</b> from <b>${brandName}</b>.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${surveyLink}" style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Share Your Feedback
            </a>
        </div>
        <p style="font-size: 12px; color: #666;">If the button doesn't work, copy this link: <br> ${surveyLink}</p>
        <hr>
        <p style="font-size: 10px; color: #999;">If you'd like to opt-out, <a href="#">Unsubscribe here</a>.</p>
    </div>
    `;
};

module.exports = { getEmailHtml };