const mongoose = require("mongoose");


const accountSchema = new mongoose.Schema({
  phoneNumber: String,

  verification: {
    phoneVerified: Boolean,
    emailVerified: Boolean,
    selfieVerified: Boolean,
    idVerified: Boolean,
    badge: String
  },

  trust: {
    trustScore: Number,
    accountStatus: String,
    fakeProbability: Number
  },

  moderation: {
    lastReviewed: Date,
    flaggedContent: Boolean
  }

});

module.exports = mongoose.model("Account", accountSchema);
