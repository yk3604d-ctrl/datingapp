const mongoose = require("mongoose");
const mediaSchema = require("./mediaSchema");

const userCoreSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // phoneNumber as primary key
      required: true
    },

    email: String,

    firstName: String,
    lastName: String,
    nickname: String,
    username: String,
    bio: String,

    profileCompletion: {
      type: Number,
      default: 0
    },

    gender: String,
    interestedIn: [String],
    relationshipGoal: String,

    dateOfBirth: Date,
    age: Number,

    height: Number,
    weight: Number,
    bodyType: String,

    profilePhoto: mediaSchema,
    introVideo: mediaSchema
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserCore", userCoreSchema);