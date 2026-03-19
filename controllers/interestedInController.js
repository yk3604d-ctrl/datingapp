const UserCore = require("../models/userCore");

const ERRORS = {
  SUCCESS: { code: "UIS0", message: "Interested preferences saved successfully" },

  PHONE_MISSING: { code: "UIM1", message: "Phone number is required" },
  INTEREST_MISSING: { code: "UIM2", message: "Interested list is required" },

  INVALID_ARRAY: { code: "UIV1", message: "Interested must be an array" },
  INVALID_VALUE: { code: "UIV2", message: "Invalid interested value" },
  EMPTY_SELECTION: { code: "UIV4", message: "Empty selection not allowed" },

  USER_NOT_FOUND: { code: "UIN1", message: "User not found" },

  SERVER_ERROR: { code: "UIE0", message: "Failed to update interested preferences" }
};

const ALLOWED_VALUES = ["Male", "Female", "Non-binary", "Transgender", "Everyone"];

exports.putInterestedIn = async (req, res) => {
  try {
    const { phoneNumber, interestedIn } = req.body || {};

    if (!phoneNumber) {
      return res.status(400).json(ERRORS.PHONE_MISSING);
    }

    if (!interestedIn) {
      return res.status(400).json(ERRORS.INTEREST_MISSING);
    }

    if (!Array.isArray(interestedIn)) {
      return res.status(400).json(ERRORS.INVALID_ARRAY);
    }

    if (interestedIn.length === 0) {
      return res.status(400).json(ERRORS.EMPTY_SELECTION);
    }

    const invalid = interestedIn.filter(v => !ALLOWED_VALUES.includes(v));

    if (invalid.length > 0) {
      return res.status(400).json(ERRORS.INVALID_VALUE);
    }

    const user = await UserCore.findById(phoneNumber);

    if (!user) {
      return res.status(404).json(ERRORS.USER_NOT_FOUND);
    }

    user.interestedIn = interestedIn;
    await user.save();

    return res.json({
      ...ERRORS.SUCCESS,
      data: user.interestedIn
    });

  } catch (err) {
    return res.status(500).json({
      ...ERRORS.SERVER_ERROR,
      error: err.message
    });
  }
};
