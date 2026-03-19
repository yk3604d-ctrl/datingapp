const express = require("express");
const router = express.Router();
const themeController = require("../controllers/themeController");

router.get("/theme", themeController.getTheme);
router.post("/theme", themeController.updateTheme);

module.exports = router;