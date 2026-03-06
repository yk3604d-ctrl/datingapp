const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({});

// Allowed mime types
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/mov"];

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const mime = file.mimetype;

    if (IMAGE_TYPES.includes(mime)) {
      req.fileType = "image";
      return cb(null, true);
    }

    if (VIDEO_TYPES.includes(mime)) {
      req.fileType = "video";
      return cb(null, true);
    }

    return cb(new Error("Invalid file type"), false);
  }
});


// Custom size validation middleware
const validateFileSize = (req, res, next) => {
  if (!req.file) return next();

  const size = req.file.size;

  if (req.fileType === "image" && size > 500 * 1024) {
    return res.status(400).json({
      code: "UPV1",
      message: "Image must be less than 500KB"
    });
  }

  if (req.fileType === "video" && size > 5 * 1024 * 1024) {
    return res.status(400).json({
      code: "UPV2",
      message: "Video must be less than 5MB"
    });
  }

  next();
};

module.exports = {
  upload,
  validateFileSize
};
