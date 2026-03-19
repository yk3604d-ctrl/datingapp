const express = require("express");
const router = express.Router();
const genderController = require("../controllers/GenderController");

router.get("/:phoneNumber/:field", genderController.getField);
router.post("/", genderController.postField);

module.exports = router;