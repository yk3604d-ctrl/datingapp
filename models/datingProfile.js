const mongoose = require("mongoose");

const datingProfileSchema = new mongoose.Schema({
  phoneNumber: { type: String, index: true },

  prompts: [
    {
      question: String,
      answer: String
    }
  ],

  tags: [String],

  datingIntent: {
    lookingFor: String,
    marriageIntent: Boolean,
    openToRelocation: Boolean
  }

}, { timestamps: true });

module.exports = mongoose.model("DatingProfile", datingProfileSchema);
