const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema({
  phoneNumber: String,

  visibility: {
    showMeOnApp: Boolean,
    incognitoMode: Boolean,
    onlyPremiumVisible: Boolean
  },

  privacy: {
    showAge: Boolean,
    showDistance: Boolean,
    showOnlineStatus: Boolean,
    showProfileToFriendsOnly: Boolean
  },

  settings: {
    notifications: Boolean,
    darkMode: Boolean,
    appLanguage: String,
    autoTranslateChat: Boolean
  }

});

module.exports = mongoose.model("Privacy", privacySchema);
