const Preferences = require("../models/preferences");

exports.updatePreferences = async (req, res) => {
  try {
    const {
      phoneNumber,
      ageRange,
      distance,
      genderPreference,
      religionPreference,
      languagePreference,
      lifestylePreference,
      relationshipType
    } = req.body;

    // ================= PHONE VALIDATION =================

    if (!phoneNumber) {
      return res.status(400).json({
        code: "UP01",
        message: "Phone number is required"
      });
    }

    if (typeof phoneNumber !== "string" || phoneNumber.length < 8) {
      return res.status(400).json({
        code: "UP02",
        message: "Invalid phone number"
      });
    }

    // ================= FIELD PRESENCE =================

    const hasAnyField =
      ageRange ||
      distance !== undefined ||
      genderPreference ||
      religionPreference ||
      languagePreference ||
      lifestylePreference ||
      relationshipType;

    if (!hasAnyField) {
      return res.status(400).json({
        code: "UP03",
        message: "At least one field is required"
      });
    }

    // ================= AGE RANGE =================

    if (ageRange) {
      if (
        typeof ageRange.min !== "number" ||
        typeof ageRange.max !== "number"
      ) {
        return res.status(400).json({
          code: "UP04",
          message: "Age range must contain min and max numbers"
        });
      }

      if (ageRange.min < 18 || ageRange.max > 100) {
        return res.status(400).json({
          code: "UP05",
          message: "Age range must be between 18 and 100"
        });
      }

      if (ageRange.min > ageRange.max) {
        return res.status(400).json({
          code: "UP06",
          message: "Min age cannot be greater than max age"
        });
      }
    }

    // ================= DISTANCE =================

    if (distance !== undefined) {
      if (typeof distance !== "number") {
        return res.status(400).json({
          code: "UP07",
          message: "Distance must be a number"
        });
      }

      if (distance < 1 || distance > 500) {
        return res.status(400).json({
          code: "UP08",
          message: "Distance must be between 1 and 500 km"
        });
      }
    }

    // ================= ARRAY VALIDATION =================

    const validateArray = (arr, field, code) => {
      if (!Array.isArray(arr)) {
        throw { code, message: `${field} must be an array` };
      }
      if (arr.length > 20) {
        throw { code, message: `${field} too many values` };
      }
      for (const item of arr) {
        if (typeof item !== "string") {
          throw { code, message: `${field} values must be string` };
        }
      }
    };

    try {
      if (genderPreference !== undefined)
        validateArray(genderPreference, "Gender preference", "UP09");

      if (religionPreference !== undefined)
        validateArray(religionPreference, "Religion preference", "UP10");

      if (languagePreference !== undefined)
        validateArray(languagePreference, "Language preference", "UP11");

      if (lifestylePreference !== undefined)
        validateArray(lifestylePreference, "Lifestyle preference", "UP12");
    } catch (err) {
      return res.status(400).json(err);
    }

    // ================= RELATIONSHIP TYPE =================

    const REL_TYPES = [
      "Friendship",
      "Dating",
      "Serious",
      "Marriage",
      "Casual"
    ];

    if (relationshipType && !REL_TYPES.includes(relationshipType)) {
      return res.status(400).json({
        code: "UP13",
        message: "Invalid relationship type"
      });
    }

    // ================= FIND OR CREATE =================

    let preferences = await Preferences.findOne({ phoneNumber });

    if (!preferences) {
      preferences = new Preferences({ phoneNumber });
    }

    // ================= UPDATE =================

    if (ageRange !== undefined) preferences.ageRange = ageRange;
    if (distance !== undefined) preferences.distance = distance;
    if (genderPreference !== undefined)
      preferences.genderPreference = genderPreference;
    if (religionPreference !== undefined)
      preferences.religionPreference = religionPreference;
    if (languagePreference !== undefined)
      preferences.languagePreference = languagePreference;
    if (lifestylePreference !== undefined)
      preferences.lifestylePreference = lifestylePreference;
    if (relationshipType !== undefined)
      preferences.relationshipType = relationshipType;

    await preferences.save();

    return res.json({
      code: "UP00",
      message: "Preferences updated successfully",
      data: preferences
    });

  } catch (err) {
    return res.status(500).json({
      code: err.code || "UP99",
      message: err.message || "Internal server error"
    });
  }
};
