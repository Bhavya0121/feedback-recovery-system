const jwt = require('jsonwebtoken');

const generateSurveyToken = (customerId, orderId) => {
    return jwt.sign(
        { customerId, orderId, channel: 'email' },
        process.env.JWT_SECRET || 'secret_key',
        { expiresIn: '72h' } // 72 hours expiry
    );
};

module.exports = { generateSurveyToken };