const express = require("express");
const router = express.Router();

const { updatePreferences } = require("../controllers/PreferencesController");

// POST /api/preferences
router.post("/", updatePreferences);

module.exports = router;
