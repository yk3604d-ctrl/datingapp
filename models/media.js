const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  phoneNumber: String,

  items: [
    {
      url: String,
      type: String,
      thumbnail: String,
      isProfile: Boolean,
      uploadedAt: Date
    }
  ],

  voiceIntro: {
    url: String,
    duration: Number
  }

});

module.exports = mongoose.model("Media", mediaSchema);
