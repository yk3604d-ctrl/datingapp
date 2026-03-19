const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.post("/personal_info", controller.updatePersonalInfo);

module.exports = router;
