const Location = require("../models/location");

// Standardized error codes
const errorCodes = {
  ULOC0: "Operation successful",
  ULOC1: "User phone number is required",
  ULOC2: "Invalid value type",
  ULOC3: "Location not found",
  ULOC4: "Server error"
};

// ================= POST / UPDATE LOCATION =================
exports.updateLocation = async (req, res) => {
  try {
    const { phoneNumber, country, state, city, coordinates } = req.body || {};

    if (!phoneNumber) {
      return res.status(400).json({ code: "ULOC1", message: errorCodes.ULOC1 });
    }

    // Find or create document
    let locDoc = await Location.findOne({ phoneNumber });
    if (!locDoc) {
      locDoc = new Location({ phoneNumber });
    }

    // --- Update country, state, city ---
    if (typeof country !== "undefined") {
      if (typeof country !== "string")
        return res.status(400).json({ code: "ULOC2", message: "country " + errorCodes.ULOC2 });
      locDoc.country = country;
    }
    if (typeof state !== "undefined") {
      if (typeof state !== "string")
        return res.status(400).json({ code: "ULOC2", message: "state " + errorCodes.ULOC2 });
      locDoc.state = state;
    }
    if (typeof city !== "undefined") {
      if (typeof city !== "string")
        return res.status(400).json({ code: "ULOC2", message: "city " + errorCodes.ULOC2 });
      locDoc.city = city;
    }

    // --- Update coordinates ---
    if (coordinates) {
      if (typeof coordinates.lat !== "undefined") {
        if (typeof coordinates.lat !== "number")
          return res.status(400).json({ code: "ULOC2", message: "coordinates.lat " + errorCodes.ULOC2 });
        locDoc.coordinates.lat = coordinates.lat;
      }
      if (typeof coordinates.lng !== "undefined") {
        if (typeof coordinates.lng !== "number")
          return res.status(400).json({ code: "ULOC2", message: "coordinates.lng " + errorCodes.ULOC2 });
        locDoc.coordinates.lng = coordinates.lng;
      }
    }

    await locDoc.save();

    return res.status(200).json({ code: "ULOC0", message: errorCodes.ULOC0, data: locDoc });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "ULOC4", message: errorCodes.ULOC4 });
  }
};

// ================= GET LOCATION BY PHONE =================
exports.getLocation = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({ code: "ULOC1", message: errorCodes.ULOC1 });
    }

    const locDoc = await Location.findOne({ phoneNumber });

    if (!locDoc) {
      return res.status(404).json({ code: "ULOC3", message: errorCodes.ULOC3 });
    }

    return res.status(200).json({ code: "ULOC0", message: errorCodes.ULOC0, data: locDoc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ code: "ULOC4", message: errorCodes.ULOC4 });
  }
};
