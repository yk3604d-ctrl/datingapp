const express = require("express");
const router = express.Router();
const profileDetail=require("../controllers/profileDetailController");

router.post("/", profileDetail.updateProfileDetails);
// GET profile by phoneNumber
router.get("/:phoneNumber", profileDetail.getProfileDetails);
module.exports = router;
