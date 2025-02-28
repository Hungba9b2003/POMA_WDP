const express = require("express");
const { upload } = require("./../controllers/upload");

const router = express.Router();

// API Upload ảnh
router.post("/upload", (req, res, next) => {
  console.log('Files:', req.files);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  
  upload.single("image")(req, res, function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message,
        error: err
      });
    }
    
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng upload file ảnh!",
        });
      }

      res.json({
        success: true,
        message: "Upload ảnh thành công!",
        imageUrl: req.file.path,
        // Thêm thông tin chi tiết về file nếu cần
        fileDetails: {
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("Lỗi upload:", error);
      res.status(500).json({
        success: false,
        message: "Upload thất bại!",
        error: error.message,
      });
    }
  });
});

module.exports = router;
