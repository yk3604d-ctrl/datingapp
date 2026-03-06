const express = require("express");
const router = express.Router();
const controller = require("../controllers/themeListController");

router.post("/themes", controller.createTheme);
router.get("/themes", controller.getAllThemes);
router.get("/themes/:name", controller.getThemeByName);
router.put("/themes/:name", controller.updateTheme);
router.delete("/themes/:name", controller.deleteTheme);

module.exports = router;