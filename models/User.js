const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    // unique: true,
    // dropDups: true
  },
  count: {
    type: String,
  },
  role: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
