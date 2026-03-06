const Theme = require("../models/ThemeList");

// ✅ Create Theme
exports.createTheme = async (req, res) => {
  try {
    const theme = await Theme.create(req.body);

    res.status(201).json({
      success: true,
      message: "Theme created",
      data: theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get All Themes
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: themes.length,
      data: themes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Single Theme
exports.getThemeByName = async (req, res) => {
  try {
    const theme = await Theme.findOne({ name: req.params.name });

    if (!theme) {
      return res.status(404).json({
        success: false,
        message: "Theme not found",
      });
    }

    res.status(200).json({
      success: true,
      data: theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update Theme
exports.updateTheme = async (req, res) => {
  try {
    const theme = await Theme.findOneAndUpdate(
      { name: req.params.name },
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Theme updated",
      data: theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete Theme
exports.deleteTheme = async (req, res) => {
  try {
    await Theme.findOneAndDelete({ name: req.params.name });

    res.status(200).json({
      success: true,
      message: "Theme deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};