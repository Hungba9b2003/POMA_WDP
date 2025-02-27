const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Middleware giảm kích thước ảnh trước khi upload
const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  const filePath = req.file.path;
  const newPath = path.join(__dirname, "uploads", `resized-${Date.now()}.jpeg`);

  await sharp(filePath)
    .resize(500, 500) // Resize ảnh trước khi upload
    .jpeg({ quality: 80 }) // Giảm chất lượng ảnh để tăng tốc upload
    .toFile(newPath);

  req.file.path = newPath;
  next();
};
module.exports = { resizeImage };
