const mongoose = require("mongoose");

const lifestyleSchema = new mongoose.Schema({
  phoneNumber: String,

  education: String,
  profession: String,
  company: String,

  religion: String,
  smoking: String,
  drinking: String,
  workout: String,
  diet: String,

  pets: String,
  hobbies: [String],
  interests: [String]

});

module.exports = mongoose.model("Lifestyle", lifestyleSchema);
