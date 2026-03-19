const UserCore = require("../models/userCore");

const errorCodes = {
  UG0: "Field not selected yet",
  UG1: "Phone number missing",
  UG2: "User not found",
  UG3: "Required field missing",
  UG4: "Invalid value",
  SUCCESS: "Operation successful",
  ERR: "Server error"
};


// ================= GET FIELD =================
exports.getField = async (req, res) => {
  try {
    const { phoneNumber, field } = req.params;

    if (!phoneNumber) {
      return res.status(400).json({
        code: "UG1",
        message: errorCodes.UG1
      });
    }

    if (!field) {
      return res.status(400).json({
        code: "UG3",
        message: "Field required"
      });
    }

    const user = await UserCore.findById(phoneNumber);

    if (!user) {
      return res.status(404).json({
        code: "UG2",
        message: errorCodes.UG2
      });
    }

    if (user[field] === undefined || user[field] === null) {
      return res.status(404).json({
        code: "UG0",
        message: `${field} ${errorCodes.UG0}`
      });
    }

    return res.json({
      code: "SUCCESS",
      message: errorCodes.SUCCESS,
      gender: user[field]
    });

  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: error.message
    });
  }
};


// ================= POST FIELD =================
exports.postField = async (req, res) => {
  try {
    const { phoneNumber, field, value } = req.body || {};

    if (!phoneNumber || !field || value === undefined) {
      return res.status(400).json({
        code: "UG3",
        message: errorCodes.UG3
      });
    }

    // ================= GENDER HANDLING =================
    if (field === "gender") {

      if (!value.gender) {
        return res.status(400).json({
          code: "UG4",
          message: "Gender required"
        });
      }

      const allowedGender = ["Male", "Female", "LGBTQ+"];

      if (!allowedGender.includes(value.gender)) {
        return res.status(400).json({
          code: "UG4",
          message: "Invalid gender"
        });
      }

      const updateData = {
        gender: value.gender
      };

      if (value.gender === "LGBTQ+") {

        const allowedSubgender = [
          "Gay",
        "Lesbian",
        "Bisexual",
        "Pansexual",
        "Queer",
        "Asexual"
        ];

        if (!value.subgender || !allowedSubgender.includes(value.subgender)) {
          return res.status(400).json({
            code: "UG4",
            message: "Invalid or missing subgender"
          });
        }

        updateData.subgender = value.subgender;

      } else {
        updateData.subgender = null;
      }

      const updatedUser = await UserCore.findOneAndUpdate(
        { _id: phoneNumber },
        {
          $set: updateData,
          $setOnInsert: { _id: phoneNumber }
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      return res.json({
        code: "SUCCESS",
        message: errorCodes.SUCCESS,
        data: {
          gender: updatedUser.gender,
          subgender: updatedUser.subgender
        }
      });
    }

    // ================= AGE VALIDATION =================
    if (field === "age" && (value < 18 || value > 100)) {
      return res.status(400).json({
        code: "UG4",
        message: "Invalid age"
      });
    }

    // ================= NORMAL FIELD UPDATE =================
    const updatedUser = await UserCore.findOneAndUpdate(
      { _id: phoneNumber },
      {
        $set: { [field]: value },
        $setOnInsert: { _id: phoneNumber }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return res.json({
      code: "SUCCESS",
      message: errorCodes.SUCCESS,
      data: updatedUser[field]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: "ERR",
      message: error.message
    });
  }
};