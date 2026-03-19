const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  phoneNumber: String,

  subscription: {
    isPremium: Boolean,
    planType: String,
    startDate: Date,
    endDate: Date,
    features: [String]
  },

  boost: {
    isBoostActive: Boolean,
    boostEndTime: Date
  },

  coins: Number,
  superLikes: Number

});

module.exports = mongoose.model("Wallet", walletSchema);
