const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    type: String,
    duration: Number
  },
  { _id: false }
);

module.exports = mediaSchema;