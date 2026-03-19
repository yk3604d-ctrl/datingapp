const express = require("express");
const router = express.Router();

const { sendTestMessage } = require("../controllers/chatController");

router.post("/send", sendTestMessage);

module.exports = router;
