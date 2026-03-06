const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const validateNotification = require("../middleware/validateNotification");

router.post("/", validateNotification, notificationController.sendNotification);

module.exports = router;