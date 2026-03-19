const Privacy = require("../models/privacySchema ");

// Standardized error codes for privacy updates
const errorCodes = {
  UPIR0: "Operation successful",
  UPIR1: "User phone number is required",
  UPIR2: "Invalid boolean value",
  UPIR3: "Invalid language value",
  UPIR4: "Privacy settings not found",
  UPIR5: "Server error"
};

// ================= POST / UPDATE PRIVACY =================
exports.updatePrivacy = async (req, res) => {
  try {
    const { phoneNumber, visibility, privacy, settings } = req.body || {};

    if (!phoneNumber) {
      return res.status(400).json({ code: "UPIR1", message: errorCodes.UPIR1 });
    }

    // Find or create privacy document
    let privacyDoc = await Privacy.findOne({ phoneNumber });
    if (!privacyDoc) {
      privacyDoc = new Privacy({ phoneNumber });
    }

    // --- VALIDATE AND UPDATE VISIBILITY ---
    if (visibility) {
      if (typeof visibility.showMeOnApp !== "undefined") {
        if (typeof visibility.showMeOnApp !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.visibility.showMeOnApp = visibility.showMeOnApp;
      }
      if (typeof visibility.incognitoMode !== "undefined") {
        if (typeof visibility.incognitoMode !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.visibility.incognitoMode = visibility.incognitoMode;
      }
      if (typeof visibility.onlyPremiumVisible !== "undefined") {
        if (typeof visibility.onlyPremiumVisible !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.visibility.onlyPremiumVisible = visibility.onlyPremiumVisible;
      }
    }

    // --- VALIDATE AND UPDATE PRIVACY ---
    if (privacy) {
      if (typeof privacy.showAge !== "undefined") {
        if (typeof privacy.showAge !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.privacy.showAge = privacy.showAge;
      }
      if (typeof privacy.showDistance !== "undefined") {
        if (typeof privacy.showDistance !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.privacy.showDistance = privacy.showDistance;
      }
      if (typeof privacy.showOnlineStatus !== "undefined") {
        if (typeof privacy.showOnlineStatus !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.privacy.showOnlineStatus = privacy.showOnlineStatus;
      }
      if (typeof privacy.showProfileToFriendsOnly !== "undefined") {
        if (typeof privacy.showProfileToFriendsOnly !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.privacy.showProfileToFriendsOnly = privacy.showProfileToFriendsOnly;
      }
    }

    // --- VALIDATE AND UPDATE SETTINGS ---
    if (settings) {
      if (typeof settings.notifications !== "undefined") {
        if (typeof settings.notifications !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.settings.notifications = settings.notifications;
      }
      if (typeof settings.darkMode !== "undefined") {
        if (typeof settings.darkMode !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.settings.darkMode = settings.darkMode;
      }
      if (typeof settings.appLanguage !== "undefined") {
        if (typeof settings.appLanguage !== "string" || !settings.appLanguage.match(/^[a-z]{2}$/i))
          return res.status(400).json({ code: "UPIR3", message: errorCodes.UPIR3 });
        privacyDoc.settings.appLanguage = settings.appLanguage;
      }
      if (typeof settings.autoTranslateChat !== "undefined") {
        if (typeof settings.autoTranslateChat !== "boolean")
          return res.status(400).json({ code: "UPIR2", message: errorCodes.UPIR2 });
        privacyDoc.settings.autoTranslateChat = settings.autoTranslateChat;
      }
    }

    await privacyDoc.save();

    return res.status(200).json({ code: "UPIR0", message: errorCodes.UPIR0, data: privacyDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UPIR5", message: errorCodes.UPIR5 });
  }
};

// ================= GET PRIVACY BY PHONE =================
exports.getPrivacy = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({ code: "UPIR1", message: errorCodes.UPIR1 });
    }

    const privacyDoc = await Privacy.findOne({ phoneNumber });

    if (!privacyDoc) {
      return res.status(404).json({ code: "UPIR4", message: errorCodes.UPIR4 });
    }

    return res.status(200).json({ code: "UPIR0", message: errorCodes.UPIR0, data: privacyDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UPIR5", message: errorCodes.UPIR5 });
  }
};
