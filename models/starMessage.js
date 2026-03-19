const mongoose = require("mongoose");

const starMessageSchema = new mongoose.Schema(
  {
    ownerPhone: {
      type: String,
      required: true,
      index: true
    },

    chatWith: {
      type: String,
      required: true,
      index: true
    },

    messageId: {
      type: String,
      required: true
    },

    sender: String,

    message: String,

    mediaUrl: String,

    messageType: {
      type: String,
      enum: ["text", "image", "video", "audio"],
      default: "text"
    },

    reaction: {
      type: String,
      enum: ["star", "heart"],
      default: "star"
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StarMessage", starMessageSchema);
