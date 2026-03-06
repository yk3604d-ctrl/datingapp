const express = require("express");
const router = express.Router();

const { upload, validateFileSize } = require("../middleware/upload");

const { uploadProfilePhoto,uploadGalleryMedia } = require("../controllers/Upload_Profile");

// POST /api/uploadmedia
router.post(
  "/",
  upload.single("file"),
  validateFileSize,
  uploadProfilePhoto
);

module.exports = router;

// ================= PROFILE MEDIA =================
// POST /api/uploadmedia
router.post(
  "/",
  upload.single("file"),
  validateFileSize,
  uploadProfilePhoto
);


// ================= GALLERY MEDIA =================
// POST /api/uploadmedia/media
router.post(
  "/media",
  upload.single("file"),
  validateFileSize,
  uploadGalleryMedia
);

module.exports = router;