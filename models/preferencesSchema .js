const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema({
  phoneNumber: String,

  ageRange: {
    min: Number,
    max: Number
  },

  distance: Number,
  genderPreference: [String],
  religionPreference: [String],
  languagePreference: [String],
  lifestylePreference: [String],
  relationshipType: String

});

module.exports = mongoose.model("Preferences", preferencesSchema);
