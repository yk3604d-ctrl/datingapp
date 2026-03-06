const mongoose = require("mongoose");

const ThemeListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    previewColor: {
      type: String, // used for showing theme card preview
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

module.exports = mongoose.model("ThemeList", ThemeListSchema);