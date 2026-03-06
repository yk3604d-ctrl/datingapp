const Theme = require("../models/Theme");

// ✅ GET THEME (always returns single document)
exports.getTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne({ singleton: "APP_THEME" }).lean();

    if (!theme) {
      theme = await Theme.create({ singleton: "APP_THEME" });
      theme = theme.toObject();
    }

    // Remove internal fields
    const {
      _id,
      singleton,
      createdAt,
      updatedAt,
      __v,
      ...cleanTheme
    } = theme;

    res.status(200).json({
      success: true,
      data: cleanTheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE THEME (always updates same document)
exports.updateTheme = async (req, res) => {
  try {
    const theme = await Theme.findOneAndUpdate(
      { singleton: "APP_THEME" },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      data: theme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};