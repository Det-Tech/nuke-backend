const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  email: {
    type: String
  },
  bio: {
    type: String
  },
  site: {
    type: String,
  },  
  facebook: {
    type: String
  },
  twitter: {
    type: String
  },
  instagram: {
    type: String
  },
  linkedin: {
    type: String,
  },
  discord: {
    type: String,
  },
  file_path: {
    type: String
  },
  customUrl: {
    type: String,
  },
  public: {
    type: String,
  },
  following: {
    type: String,
  },
  followers: {
    type: String,
  },
  like: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
