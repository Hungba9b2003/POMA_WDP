const express = require("express");
const { upload, deleteImage } = require("../controllers/upload.controller");

const router = express.Router();

// Hàm lấy đúng đường dẫn file từ Cloudinary URL
function getImageNameFromUrl(url) {
  return url.split("/").pop().split(".")[0]; // Cắt phần cuối, bỏ đuôi file
}

router.post("/upload", async (req, res) => {
  try {
    const oldAvatar = req.query.oldAvatar;

    console.log("oldAvatar:", oldAvatar);

    if (oldAvatar) {
      const imageName = getImageNameFromUrl(oldAvatar);

      if (imageName) {
        console.log("Deleting old image:", imageName);
        await deleteImage(imageName);
      } else {
        console.log("No valid image name extracted, skipping deletion.");
      }
    } else {
      console.log("No old avatar provided, skipping deletion.");
    }

    upload.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded!" });
      }

      res.json({
        success: true,
        message: "Upload successful!",
        imageUrl: req.file.path, // Cloudinary URL
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed!" });
  }
});

module.exports = router;
