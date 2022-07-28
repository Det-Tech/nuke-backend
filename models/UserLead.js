const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserLeadSchema = new Schema({
  wallet: {
    type: String,
    required: true
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
  fax: {
    type: String
  },
  mobile: {
    type: String
  },
  site: {
    type: String
  },
  source: {
    type: String
  },
  status: {
    type: String,
  },
  industry: {
    type: String,
  },
  employes: {
    type: String,
  },
  revenue: {
    type: String,
  },
  rating: {
    type: String,
  },
  skype: {
    type: String,
  },  
  secEmail: {
    type: String,
  },
  twitter: {
    type: String,
  },
  emailOpt: {
    type: String,
  },
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  country: {
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
