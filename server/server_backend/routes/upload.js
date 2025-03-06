const express = require("express");
const { upload, deleteImage } = require("./../controllers/upload");

const router = express.Router();

// Hàm lấy đúng đường dẫn file từ Cloudinary URL
function getImageNameFromUrl(url) {
  if (!url) return null;
  const parts = url.split("/");
  return `${parts[parts.length - 2]}/${parts[parts.length - 1].split(".")[0]}`;
}

router.post("/upload", async (req, res) => {
  try {
    const oldAvatar = req.body.oldAvatar;
    console.log("oldAvatar" + oldAvatar);
    if (oldAvatar) {
      const imageName = getImageNameFromUrl(oldAvatar);
      if (imageName) {
        console.log("Deleting old image:", imageName);
        await deleteImage(imageName);
      }
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
