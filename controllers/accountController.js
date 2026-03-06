const Account = require("../models/accountSchema ");

// Standardized error codes for account updates
const errorCodes = {
  UAC0: "Operation successful",
  UAC1: "User phone number is required",
  UAC2: "Invalid boolean value",
  UAC3: "Invalid number value",
  UAC4: "Invalid date value",
  UAC5: "Account not found",
  UAC6: "Server error"
};

// ================= POST / UPDATE ACCOUNT =================
exports.updateAccount = async (req, res) => {
  try {
    const { phoneNumber, verification, trust, moderation } = req.body || {};

    if (!phoneNumber) {
      return res.status(400).json({ code: "UAC1", message: errorCodes.UAC1 });
    }

    // Find or create account document
    let accountDoc = await Account.findOne({ phoneNumber });
    if (!accountDoc) {
      accountDoc = new Account({ phoneNumber });
    }

    // --- VALIDATE AND UPDATE VERIFICATION ---
    if (verification) {
      for (const key of ["phoneVerified","emailVerified","selfieVerified","idVerified"]) {
        if (typeof verification[key] !== "undefined") {
          if (typeof verification[key] !== "boolean")
            return res.status(400).json({ code: "UAC2", message: `${key} ${errorCodes.UAC2}` });
          accountDoc.verification[key] = verification[key];
        }
      }
      if (typeof verification.badge !== "undefined") {
        if (typeof verification.badge !== "string")
          return res.status(400).json({ code: "UAC2", message: `badge ${errorCodes.UAC2}` });
        accountDoc.verification.badge = verification.badge;
      }
    }

    // --- VALIDATE AND UPDATE TRUST ---
    if (trust) {
      if (typeof trust.trustScore !== "undefined") {
        if (typeof trust.trustScore !== "number")
          return res.status(400).json({ code: "UAC3", message: "trustScore " + errorCodes.UAC3 });
        accountDoc.trust.trustScore = trust.trustScore;
      }
      if (typeof trust.accountStatus !== "undefined") {
        if (typeof trust.accountStatus !== "string")
          return res.status(400).json({ code: "UAC2", message: "accountStatus " + errorCodes.UAC2 });
        accountDoc.trust.accountStatus = trust.accountStatus;
      }
      if (typeof trust.fakeProbability !== "undefined") {
        if (typeof trust.fakeProbability !== "number")
          return res.status(400).json({ code: "UAC3", message: "fakeProbability " + errorCodes.UAC3 });
        accountDoc.trust.fakeProbability = trust.fakeProbability;
      }
    }

    // --- VALIDATE AND UPDATE MODERATION ---
    if (moderation) {
      if (typeof moderation.lastReviewed !== "undefined") {
        const date = new Date(moderation.lastReviewed);
        if (isNaN(date.getTime()))
          return res.status(400).json({ code: "UAC4", message: "lastReviewed " + errorCodes.UAC4 });
        accountDoc.moderation.lastReviewed = date;
      }
      if (typeof moderation.flaggedContent !== "undefined") {
        if (typeof moderation.flaggedContent !== "boolean")
          return res.status(400).json({ code: "UAC2", message: "flaggedContent " + errorCodes.UAC2 });
        accountDoc.moderation.flaggedContent = moderation.flaggedContent;
      }
    }

    await accountDoc.save();
    return res.status(200).json({ code: "UAC0", message: errorCodes.UAC0, data: accountDoc });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UAC6", message: errorCodes.UAC6 });
  }
};

// ================= GET ACCOUNT BY PHONE =================
exports.getAccount = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    if (!phoneNumber) {
      return res.status(400).json({ code: "UAC1", message: errorCodes.UAC1 });
    }

    const accountDoc = await Account.findOne({ phoneNumber });
    if (!accountDoc) {
      return res.status(404).json({ code: "UAC5", message: errorCodes.UAC5 });
    }

    return res.status(200).json({ code: "UAC0", message: errorCodes.UAC0, data: accountDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UAC6", message: errorCodes.UAC6 });
  }
};
