const express = require("express");
const router = express.Router();
const privacyController = require("../controllers/PrivacyController");

// ================== ROUTES ==================

// Update privacy settings (POST /privacy/update)
router.post("/update", privacyController.updatePrivacy);

// Get privacy settings by phone number (GET /privacy/:phoneNumber)
router.get("/:phoneNumber", privacyController.getPrivacy);

module.exports = router;
