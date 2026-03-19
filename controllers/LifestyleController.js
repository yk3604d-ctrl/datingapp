const Lifestyle = require("../models/lifestyle");

exports.updateLifestyle = async (req, res) => {
  try {
    const {
      phoneNumber,
      education,
      profession,
      company,
      religion,
      smoking,
      drinking,
      workout,
      diet,
      pets,
      hobbies,
      interests
    } = req.body;

    // ================= PHONE VALIDATION =================

    if (!phoneNumber) {
      return res.status(400).json({
        code: "UL01",
        message: "Phone number is required"
      });
    }

    if (typeof phoneNumber !== "string" || phoneNumber.length < 8) {
      return res.status(400).json({
        code: "UL02",
        message: "Invalid phone number"
      });
    }

    // ================= FIELD PRESENCE =================

    const hasAnyField =
      education ||
      profession ||
      company ||
      religion ||
      smoking ||
      drinking ||
      workout ||
      diet ||
      pets ||
      hobbies ||
      interests;

    if (!hasAnyField) {
      return res.status(400).json({
        code: "UL03",
        message: "At least one field is required"
      });
    }

    // ================= ENUM VALIDATION =================

    const SMOKING = ["No", "Occasionally", "Regular"];
    const DRINKING = ["No", "Occasionally", "Regular"];
    const WORKOUT = ["Never", "Sometimes", "Regular"];
    const DIET = ["Veg", "Non-Veg", "Vegan", "Other"];

    if (smoking && !SMOKING.includes(smoking)) {
      return res.status(400).json({
        code: "UL04",
        message: "Invalid smoking value"
      });
    }

    if (drinking && !DRINKING.includes(drinking)) {
      return res.status(400).json({
        code: "UL05",
        message: "Invalid drinking value"
      });
    }

    if (workout && !WORKOUT.includes(workout)) {
      return res.status(400).json({
        code: "UL06",
        message: "Invalid workout value"
      });
    }

    if (diet && !DIET.includes(diet)) {
      return res.status(400).json({
        code: "UL07",
        message: "Invalid diet value"
      });
    }

    // ================= STRING VALIDATION =================

    const validateString = (value, field, code) => {
      if (value && typeof value !== "string") {
        throw { code, message: `${field} must be a string` };
      }
      if (value && value.length > 100) {
        throw { code, message: `${field} too long` };
      }
    };

    try {
      validateString(education, "Education", "UL08");
      validateString(profession, "Profession", "UL09");
      validateString(company, "Company", "UL10");
      validateString(religion, "Religion", "UL11");
      validateString(pets, "Pets", "UL12");
    } catch (err) {
      return res.status(400).json(err);
    }

    // ================= ARRAY VALIDATION =================

    const validateArray = (arr, field, code) => {
      if (!Array.isArray(arr)) {
        throw { code, message: `${field} must be an array` };
      }
      if (arr.length > 20) {
        throw { code, message: `${field} too many items` };
      }
      for (const item of arr) {
        if (typeof item !== "string") {
          throw { code, message: `${field} values must be string` };
        }
      }
    };

    try {
      if (hobbies !== undefined) validateArray(hobbies, "Hobbies", "UL13");
      if (interests !== undefined) validateArray(interests, "Interests", "UL14");
    } catch (err) {
      return res.status(400).json(err);
    }

    // ================= FIND OR CREATE =================

    let lifestyle = await Lifestyle.findOne({ phoneNumber });

    if (!lifestyle) {
      lifestyle = new Lifestyle({ phoneNumber });
    }

    // ================= UPDATE =================

    if (education !== undefined) lifestyle.education = education;
    if (profession !== undefined) lifestyle.profession = profession;
    if (company !== undefined) lifestyle.company = company;

    if (religion !== undefined) lifestyle.religion = religion;
    if (smoking !== undefined) lifestyle.smoking = smoking;
    if (drinking !== undefined) lifestyle.drinking = drinking;
    if (workout !== undefined) lifestyle.workout = workout;
    if (diet !== undefined) lifestyle.diet = diet;

    if (pets !== undefined) lifestyle.pets = pets;
    if (hobbies !== undefined) lifestyle.hobbies = hobbies;
    if (interests !== undefined) lifestyle.interests = interests;

    await lifestyle.save();

    return res.json({
      code: "UL00",
      message: "Lifestyle updated successfully",
      data: lifestyle
    });

  } catch (err) {
    return res.status(500).json({
      code: err.code || "UL99",
      message: err.message || "Internal server error"
    });
  }
};
