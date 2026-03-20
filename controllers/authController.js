const bcrypt = require("bcryptjs");
const User = require("../models/User");
const UserCore = require("../models/userCore");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { phone, password } = req.body || {};

    if (!phone || !password) {
      return res.json({
        code: "UA0",
        message: "Phone and password required"
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.json({
        code: "UA1",
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      phone,
      password: hashedPassword
    });

    const token = User.generateToken();
    newUser.token = token;
    newUser.tokenExpiresAt = User.getTokenExpiry(24);

    await newUser.save();

    // ⭐ CREATE USER PROFILE
    await UserCore.create({
      _id: phone
    });

    return res.json({
      code: "SUCCESS",
      message: "Account created successfully",
      data: newUser
    });

  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: error.message
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { phone, password, token } = req.body || {};

    if (!phone) {
      return res.json({
        code: "UA0",
        message: "Phone required"
      });
    }

    const existingUser = await User.findOne({ phone });

    if (!existingUser) {
      return res.json({
        code: "UA3",
        message: "Phone number not registered"
      });
    }

    const now = new Date();

    // ------------------ Token-based login ------------------
    if (token && existingUser.token === token) {
      if (existingUser.tokenExpiresAt && existingUser.tokenExpiresAt > now) {
        return res.json({
          code: "UA5",
          message: "Login successful via token",
          data: existingUser
        });
      } else {
        // Token expired
        existingUser.token = null;
        existingUser.tokenExpiresAt = null;
        await existingUser.save();
        return res.json({
          code: "UA4",
          message: "Token expired, please login with password"
        });
      }
    }

    // ------------------ Password login ------------------
    if (!password) {
      return res.json({
        code: "UA0",
        message: "Password required"
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.json({
        code: "UA2",
        message: "Wrong password"
      });
    }

    // Generate new token and expiry after successful password login
    const newToken = User.generateToken();
    existingUser.token = newToken;
    existingUser.tokenExpiresAt = User.getTokenExpiry(24); // valid for 24 hours
    await existingUser.save();

    return res.json({
      code: "UA5",
      message: "Login successful",
      data: existingUser
    });

  } catch (error) {
    return res.status(500).json({
      code: "ERR",
      message: error.message
    });
  }
};