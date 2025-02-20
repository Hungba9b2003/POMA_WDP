const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const db = require("../models");

// verify access token
async function verifyAccessToken(req, res, next) {
  if (!req.headers["authorization"]) {
    return next(createError.Unauthorized);
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  if (!token) {
    throw createError.NotFound("Token is not provided!");
  }
  JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
}
// check admin
async function verifyAdmin(req, res, next) {
  try {
    if (!req.payload || req.payload.role !== "admin") {
      return next(createError.Forbidden("Access denied! Admins only."));
    }
    next();
  } catch (error) {
    next(createError.InternalServerError(error.message));
  }
}

module.exports = {
  verifyAccessToken,
  verifyAdmin,
};
