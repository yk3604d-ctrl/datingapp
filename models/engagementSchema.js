const mongoose = require("mongoose");


const engagementSchema = new mongoose.Schema({
  phoneNumber: String,

  behavior: {
    swipeRightCount: Number,
    swipeLeftCount: Number,
    avgChatResponseTime: Number,
    ghostingScore: Number
  },

  activity: {
    lastActive: Date,
    onlineStatus: Boolean,
    profileViews: Number,
    likesReceived: Number,
    matchesCount: Number,
    appOpens: Number
  }

});

module.exports = mongoose.model("Engagement", engagementSchema);
