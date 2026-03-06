const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  phoneNumber: String,

  country: String,
  state: String,
  city: String,

  coordinates: {
    lat: Number,
    lng: Number
  }

});

module.exports = mongoose.model("Location", locationSchema);
