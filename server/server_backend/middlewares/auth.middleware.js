const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const morgan = require("morgan");
const bcrypt = require('bcrypt');
const db = require('../models');

async function verifyAccessToken(req, res, next) {
    if (!req.headers['authorization']) {
        return next(createError.Unauthorized)
    }
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1];

    if (!token) {
        throw createError.NotFound("Token is not provided!")
    }
    JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createError.Unauthorized(message))
        }
        req.payload = payload;
        next();
    })
}


module.exports = {
    verifyAccessToken
}