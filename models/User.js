const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  tokenExpiresAt: {
    type: Date
  }
}, { timestamps: true });

// Static method to generate 10-character alphanumeric token
userSchema.statics.generateToken = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 10; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Static method to calculate token expiration date
userSchema.statics.getTokenExpiry = function(hours = 24) {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now;
};

module.exports = mongoose.model("User", userSchema);