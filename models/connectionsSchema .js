const mongoose = require("mongoose");


const connectionsSchema = new mongoose.Schema({
  phoneNumber: String,

  friends: [
    {
      name: String,
      phoneNumber: String,
      addedAt: Date
    }
  ],

  partners: [
    {
      userId: String,
      name: String,
      phoneNumber: String,
      status: String,
      startedAt: Date
    }
  ]

});

module.exports = mongoose.model("Connections", connectionsSchema);
