const express = require("express");
const router = express.Router();

const {
  toggleStarMessage,
  getStarMessages
} = require("../controllers/starController");

router.post("/toggle", toggleStarMessage);
router.get("/:ownerPhone", getStarMessages);

module.exports = router;
