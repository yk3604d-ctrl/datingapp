const mongoose = require("mongoose");

const ThemeSchema = new mongoose.Schema(
  {
    singleton: {
      type: String,
      default: "APP_THEME",
      unique: true,
    },

    brandCore: { type: Object, default: {} },
    backgroundSystem: { type: Object, default: {} },
    cardColors: { type: Object, default: {} },
    chatColors: { type: Object, default: {} },
    swipeActions: { type: Object, default: {} },
    premiumSystem: { type: Object, default: {} },
    callingUI: { type: Object, default: {} },
    storyStatus: { type: Object, default: {} },
    searchInterest: { type: Object, default: {} },
    settingsSystem: { type: Object, default: {} },
    textSystem: { type: Object, default: {} },
    disabledStates: { type: Object, default: {} },
    shadows: { type: Object, default: {} },
    glass: { type: Object, default: {} },
    loading: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theme", ThemeSchema);