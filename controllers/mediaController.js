const Media = require("../models/media");

// Standardized error codes
const errorCodes = {
  UMED0: "Operation successful",
  UMED1: "User phone number is required",
  UMED2: "Invalid value type",
  UMED3: "Media not found",
  UMED4: "Server error"
};

// ================= POST / UPDATE MEDIA =================
exports.updateMedia = async (req, res) => {
  try {
    const { phoneNumber, items, voiceIntro } = req.body || {};

    if (!phoneNumber) {
      return res.status(400).json({ code: "UMED1", message: errorCodes.UMED1 });
    }

    // Find or create document
    let mediaDoc = await Media.findOne({ phoneNumber });
    if (!mediaDoc) {
      mediaDoc = new Media({ phoneNumber });
    }

    // --- Update items array ---
    if (Array.isArray(items)) {
      for (const item of items) {
        const { url, type, thumbnail, isProfile, uploadedAt } = item;

        // Validation
        if (url && typeof url !== "string")
          return res.status(400).json({ code: "UMED2", message: "item.url " + errorCodes.UMED2 });
        if (type && typeof type !== "string")
          return res.status(400).json({ code: "UMED2", message: "item.type " + errorCodes.UMED2 });
        if (thumbnail && typeof thumbnail !== "string")
          return res.status(400).json({ code: "UMED2", message: "item.thumbnail " + errorCodes.UMED2 });
        if (typeof isProfile !== "undefined" && typeof isProfile !== "boolean")
          return res.status(400).json({ code: "UMED2", message: "item.isProfile " + errorCodes.UMED2 });
        if (uploadedAt && isNaN(new Date(uploadedAt).getTime()))
          return res.status(400).json({ code: "UMED2", message: "item.uploadedAt " + errorCodes.UMED2 });

        // Push to array
        mediaDoc.items.push({
          url,
          type,
          thumbnail,
          isProfile,
          uploadedAt: uploadedAt ? new Date(uploadedAt) : new Date()
        });
      }
    }

    // --- Update voiceIntro ---
    if (voiceIntro) {
      const { url, duration } = voiceIntro;

      if (url && typeof url !== "string")
        return res.status(400).json({ code: "UMED2", message: "voiceIntro.url " + errorCodes.UMED2 });
      if (typeof duration !== "undefined" && typeof duration !== "number")
        return res.status(400).json({ code: "UMED2", message: "voiceIntro.duration " + errorCodes.UMED2 });

      mediaDoc.voiceIntro = {
        url: url || mediaDoc.voiceIntro.url,
        duration: typeof duration !== "undefined" ? duration : mediaDoc.voiceIntro.duration
      };
    }

    await mediaDoc.save();

    return res.status(200).json({ code: "UMED0", message: errorCodes.UMED0, data: mediaDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UMED4", message: errorCodes.UMED4 });
  }
};

// ================= GET MEDIA BY PHONE =================
exports.getMedia = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({ code: "UMED1", message: errorCodes.UMED1 });
    }

    const mediaDoc = await Media.findOne({ phoneNumber });

    if (!mediaDoc) {
      return res.status(404).json({ code: "UMED3", message: errorCodes.UMED3 });
    }

    return res.status(200).json({ code: "UMED0", message: errorCodes.UMED0, data: mediaDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "UMED4", message: errorCodes.UMED4 });
  }
};
