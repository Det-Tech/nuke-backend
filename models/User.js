const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
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
  public: {
    type: String,
  },
  follwingCount: {
    type: String,
  },
  following: {
    type: Object,
  },
  followers: {
    type: Object,
  },
  like: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
