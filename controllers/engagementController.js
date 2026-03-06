const Engagement = require("../models/engagementSchema");

// Standardized error codes
const errorCodes = {
  UENG0: "Operation successful",
  UENG1: "User phone number is required",
  UENG2: "Invalid value type",
  UENG3: "Engagement record not found",
  UENG4: "Server error"
};

// ================= POST / UPDATE ENGAGEMENT =================
exports.updateEngagement = async (req, res) => {
  try {
    const { phoneNumber, behavior, activity } = req.body || {};

    if (!phoneNumber) {
      return res.status(400).json({ code: "UENG1", message: errorCodes.UENG1 });
    }

    // Find or create document
    let engagementDoc = await Engagement.findOne({ phoneNumber });
    if (!engagementDoc) {
      engagementDoc = new Engagement({ phoneNumber });
    }

    // --- VALIDATE AND UPDATE BEHAVIOR ---
    if (behavior) {
      const behaviorKeys = ["swipeRightCount", "swipeLeftCount", "avgChatResponseTime", "ghostingScore"];
      behaviorKeys.forEach(key => {
        if (typeof behavior[key] !== "undefined") {
          if (typeof behavior[key] !== "number")
            return res.status(400).json({ code: "UENG2", message: `behavior.${key} ${errorCodes.UENG2}` });
          engagementDoc.behavior[key] = behavior[key];
        }
      });
    }

    // --- VALIDATE AND UPDATE ACTIVITY ---
    if (activity) {
      if (typeof activity.lastActive !== "undefined") {
        const date = new Date(activity.lastActive);
        if (isNaN(date.getTime()))
          return res.status(400).json({ code: "UENG2", message: "activity.lastActive " + errorCodes.UENG2 });
        engagementDoc.activity.lastActive = date;
      }

      if (typeof activity.onlineStatus !== "undefined") {
        if (typeof activity.onlineStatus !== "boolean")
          return res.status(400).json({ code: "UENG2", message: "activity.onlineStatus " + errorCodes.UENG2 });
        engagementDoc.activity.onlineStatus = activity.onlineStatus;
      }

      const numericKeys = ["profileViews", "likesReceived", "matchesCount", "appOpens"];
      numericKeys.forEach(key => {
        if (typeof activity[key] !== "undefined") {
          if (typeof activity[key] !== "number")
            return res.status(400).json({ code: "UENG2", message: `activity.${key} ${errorCodes.UENG2}` });
          engagementDoc.activity[key] = activity[key];
        }
      });
    }

    await engagementDoc.save();

    return res.status(200).json({ code: "UENG0", message: errorCodes.UENG0, data: engagementDoc });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UENG4", message: errorCodes.UENG4 });
  }
};

// ================= GET ENGAGEMENT BY PHONE =================
exports.getEngagement = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({ code: "UENG1", message: errorCodes.UENG1 });
    }

    const engagementDoc = await Engagement.findOne({ phoneNumber });

    if (!engagementDoc) {
      return res.status(404).json({ code: "UENG3", message: errorCodes.UENG3 });
    }

    return res.status(200).json({ code: "UENG0", message: errorCodes.UENG0, data: engagementDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UENG4", message: errorCodes.UENG4 });
  }
};
