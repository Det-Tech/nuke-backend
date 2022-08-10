const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserLeadSchema = new Schema({
  wallet: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String
  },
  title: {
    type: String
  },
  phone: {
    type: String
  },
  mobile: {
    type: String
  },
  site: {
    type: String
  },
  secEmail: {
    type: String,
  },
  twitter: {
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
  file_path: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = UserLead = mongoose.model("userslead", UserLeadSchema);
