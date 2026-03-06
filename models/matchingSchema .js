const mongoose = require("mongoose");

const matchingSchema = new mongoose.Schema({
  phoneNumber: String,

  matchingScore: {
    popularityScore: Number,
    responseRate: Number,
    compatibilityTags: [String]
  },

  ai: {
    embeddingVector: [Number],
    interestClusters: [String],
    compatibilityScoreGlobal: Number
  }

});

module.exports = mongoose.model("Matching", matchingSchema);
