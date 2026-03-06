const UserCore = require("../models/userCore");

exports.updatePersonalInfo = async (req, res) => {
  try {
    const { phoneNumber, height, weight, bodyType, relationshipGoal } = req.body;

    // ================= VALIDATION =================

    if (!phoneNumber) {
      return res.status(400).json({
        code: "UPE01",
        message: "Phone number is required"
      });
    }

    if (
      height === undefined &&
      weight === undefined &&
      !bodyType &&
      !relationshipGoal
    ) {
      return res.status(400).json({
        code: "UPE02",
        message: "At least one field is required"
      });
    }

    // Optional numeric validation
    if (height && (height < 50 || height > 300)) {
      return res.status(400).json({
        code: "UPE03",
        message: "Invalid height value"
      });
    }

    if (weight && (weight < 20 || weight > 300)) {
      return res.status(400).json({
        code: "UPE04",
        message: "Invalid weight value"
      });
    }

    // ================= FIND USER =================

    const user = await UserCore.findById(phoneNumber);

    if (!user) {
      return res.status(404).json({
        code: "UPE05",
        message: "User not found"
      });
    }

    // ================= UPDATE FIELDS =================

    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (bodyType !== undefined) user.bodyType = bodyType;
    if (relationshipGoal !== undefined)
      user.relationshipGoal = relationshipGoal;

    // ================= PROFILE COMPLETION (OPTIONAL) =================

    let completionFields = [
      user.height,
      user.weight,
      user.bodyType,
      user.relationshipGoal
    ].filter(Boolean).length;

    user.profileCompletion = Math.max(user.profileCompletion, completionFields * 5);

    await user.save();

    return res.json({
      code: "UPE00",
      message: "Personal info updated successfully",
      data: user
    });

  } catch (err) {
    return res.status(500).json({
      code: "UPE99",
      message: err.message
    });
  }
};
