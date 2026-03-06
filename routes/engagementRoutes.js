const express = require("express");
const router = express.Router();
const engagementController = require("../controllers/engagementController");

// Update engagement (POST /engagement/update)
router.post("/update", engagementController.updateEngagement);

// Get engagement by phone number (GET /engagement/:phoneNumber)
router.get("/:phoneNumber", engagementController.getEngagement);

module.exports = router;
