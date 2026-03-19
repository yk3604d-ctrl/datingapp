const express = require("express");
const router = express.Router();
const mediaController = require("../controllers/mediaController");

// Update media (POST /media/update)
router.post("/update", mediaController.updateMedia);

// Get media by phone number (GET /media/:phoneNumber)
router.get("/:phoneNumber", mediaController.getMedia);

module.exports = router;
