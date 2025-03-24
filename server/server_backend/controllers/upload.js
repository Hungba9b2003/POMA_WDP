const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Thêm cấu hình fileFilter để kiểm tra loại file
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Save failed avartar is not image!"), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "POMA",
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Thêm các định dạng được phép
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Tùy chọn
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // giới hạn 5MB
  },
});

const deleteImage = async (fileName) => {
  try {
    const result = await cloudinary.uploader.destroy(`POMA/${fileName}`);
    if (result.result === "ok") {
      console.log("Deleted successfully:", fileName);
      return { success: true, message: "Image deleted successfully" };
    } else {
      throw new Error("Image deletion failed");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, message: error.message };
  }
};

module.exports = { upload, cloudinary, deleteImage };
