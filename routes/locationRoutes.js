const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

// Update location (POST /location/update)
router.post("/update", locationController.updateLocation);

// Get location by phone number (GET /location/:phoneNumber)
router.get("/:phoneNumber", locationController.getLocation);

module.exports = router;
