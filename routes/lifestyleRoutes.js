const express = require("express");
const router = express.Router();
const controller = require("../controllers/LifestyleController");

router.post("/lifestyle", controller.updateLifestyle);

module.exports = router;
