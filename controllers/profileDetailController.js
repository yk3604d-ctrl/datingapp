const UserCore = require("../models/userCore");

// Standardized in-depth error codes
const errorCodes = {
  UP0: "Operation successful",

  // General
  UP1: "Phone number missing",
  UP2: "User not foundjjj",
  UP3: "Required field missing",
  UP5: "Server error",

  // Email
  UP10: "Email missing",
  UP11: "Email must be a string",
  UP12: "Email format invalid (@ missing or wrong format)",

  // Names
  UP20: "First name missing",
  UP21: "First name must be a string",
  UP22: "First name contains invalid characters or too long",
  UP23: "Last name missing",
  UP24: "Last name must be a string",
  UP25: "Last name contains invalid characters or too long",

  // Username
  UP30: "Username missing",
  UP31: "Username must be a string",
  UP32: "Username invalid (only letters, numbers, . _ allowed, 3-30 chars)",
  UP33: "Username already taken",

  // Profile Completion
  UP40: "Profile completion must be a number",
  UP41: "Profile completion out of range (0-100)",

  // Date of Birth
  UP50: "Date of birth missing",
  UP51: "Invalid date of birth format",
  UP52: "Date of birth cannot be in the future",

  // Age
  UP60: "Age missing",
  UP61: "Age must be a number",
  UP62: "Age out of allowed range (18-100)",
  UP63: "Age does not match date of birth"
};

// Regex patterns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z\s]{1,50}$/;
const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;

// ================= POST / UPDATE PROFILE DETAILS =================
exports.updateProfileDetails = async (req, res) => {
  try {
    const {
      phoneNumber,
      email,
      firstName,
      lastName,
      username,
      profileCompletion,
      dateOfBirth,
      age
    } = req.body || {};

    // ---------------- Validate phoneNumber ----------------
    if (!phoneNumber) {
      return res.status(400).json({ code: "UP1", message: errorCodes.UP1 });
    }

   const user = await UserCore.findById(phoneNumber);

if (!user) {
  return res.status(404).json({
    code: "UP2",
    message: errorCodes.UP2
  });
}
    // ---------------- Validate Email ----------------
    if (email !== undefined) {
      if (typeof email !== "string") {
        return res.status(400).json({ code: "UP11", message: errorCodes.UP11 });
      }
      if (!emailRegex.test(email)) {
        return res.status(400).json({ code: "UP12", message: errorCodes.UP12 });
      }
    }

    // ---------------- Validate First Name ----------------
    if (firstName !== undefined) {
      if (typeof firstName !== "string") {
        return res.status(400).json({ code: "UP21", message: errorCodes.UP21 });
      }
      if (!nameRegex.test(firstName)) {
        return res.status(400).json({ code: "UP22", message: errorCodes.UP22 });
      }
    }

    // ---------------- Validate Last Name ----------------
    if (lastName !== undefined) {
      if (typeof lastName !== "string") {
        return res.status(400).json({ code: "UP24", message: errorCodes.UP24 });
      }
      if (!nameRegex.test(lastName)) {
        return res.status(400).json({ code: "UP25", message: errorCodes.UP25 });
      }
    }

    // ---------------- Validate Username ----------------
    if (username !== undefined) {
      if (typeof username !== "string") {
        return res.status(400).json({ code: "UP31", message: errorCodes.UP31 });
      }
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ code: "UP32", message: errorCodes.UP32 });
      }
      const existing = await UserCore.findOne({ username, _id: { $ne: phoneNumber } });
      if (existing) {
        return res.status(400).json({ code: "UP33", message: errorCodes.UP33 });
      }
    }

    // ---------------- Validate Profile Completion ----------------
    if (profileCompletion !== undefined) {
      if (typeof profileCompletion !== "number") {
        return res.status(400).json({ code: "UP40", message: errorCodes.UP40 });
      }
      if (profileCompletion < 0 || profileCompletion > 100) {
        return res.status(400).json({ code: "UP41", message: errorCodes.UP41 });
      }
    }

    // ---------------- Validate Date of Birth ----------------
    if (dateOfBirth !== undefined) {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob)) {
        return res.status(400).json({ code: "UP51", message: errorCodes.UP51 });
      }
      const now = new Date();
      if (dob > now) {
        return res.status(400).json({ code: "UP52", message: errorCodes.UP52 });
      }
    }

    // ---------------- Validate Age ----------------
    if (age !== undefined) {
      if (typeof age !== "number") {
        return res.status(400).json({ code: "UP61", message: errorCodes.UP61 });
      }
      if (age < 18 || age > 100) {
        return res.status(400).json({ code: "UP62", message: errorCodes.UP62 });
      }

      // Cross-check with DOB if provided
      if (dateOfBirth !== undefined) {
        const dob = new Date(dateOfBirth);
        const calculatedAge = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
        if (calculatedAge !== age) {
          return res.status(400).json({ code: "UP63", message: errorCodes.UP63 });
        }
      }
    }

    // ---------------- Update User Fields ----------------
    user.email = email ?? user.email;
    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.username = username ?? user.username;
    user.profileCompletion = profileCompletion ?? user.profileCompletion;
    user.dateOfBirth = dateOfBirth ?? user.dateOfBirth;
    user.age = age ?? user.age;

    await user.save();

    return res.json({
      code: "UP0",
      message: errorCodes.UP0,
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profileCompletion: user.profileCompletion,
        dateOfBirth: user.dateOfBirth,
        age: user.age
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ code: "UP5", message: errorCodes.UP5 });
  }
};
// ================= GET PROFILE DETAILS =================
exports.getProfileDetails = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    // Validate phone number
    if (!phoneNumber) {
      return res.status(400).json({ code: "UP1", message: errorCodes.UP1 });
    }

   const user = await UserCore.findById(phoneNumber);

    if (!user) {
      return res.status(404).json({ code: "UP2f", message: errorCodes.UP2 });
    }

    return res.json({
      code: "UP0",
      message: errorCodes.UP0,
      data: {
        phoneNumber: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        nickname: user.nickname,
        bio: user.bio,
        profileCompletion: user.profileCompletion,
        gender: user.gender,
        interestedIn: user.interestedIn,
        relationshipGoal: user.relationshipGoal,
        dateOfBirth: user.dateOfBirth,
        age: user.age,
        height: user.height,
        weight: user.weight,
        bodyType: user.bodyType,
        profilePhoto: user.profilePhoto,
        introVideo: user.introVideo
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ code: "UP5", message: errorCodes.UP5 });
  }
};