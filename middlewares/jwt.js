const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/config');

exports.generateToken = (userId) => {
    const expires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

    const payload = {
        userId,
        iat: moment().unix(),
        exp: expires.unix(),
    };
    const secret = config.jwt.secret;
    return jwt.sign(payload, secret);
};


exports.verifyToken = async (token) => {
    const payload = jwt.verify(token, config.jwt.secret);
    if (!payload) {
        throw new Error('Token not found');
    }
    return payload;
};