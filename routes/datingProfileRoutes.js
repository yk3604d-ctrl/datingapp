const express = require("express");
const router = express.Router();
const profileController = require("../controllers/datingProfileController");

// Profiles CRUD
router.get("/", profileController.getAllProfiles);
router.get("/:phoneNumber", profileController.getProfileByPhone);
router.post("/", profileController.createProfile);
router.delete("/:phoneNumber", profileController.deleteProfile);

// Prompts, Tags, Dating Intent
router.post("/:phoneNumber/prompts", profileController.addPrompt);
router.post("/:phoneNumber/tags", profileController.addTags);
router.put("/:phoneNumber/datingIntent", profileController.updateDatingIntent);

module.exports = router;