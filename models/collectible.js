const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CollectibleSchema = new Schema({
    wallet: {
      type: String,
      required: true
    },
    name: {
      type: String,
    },
    externalLink: {
      type: String,
    },
    description: {
      type: String,
    },
    collection_name: {
      type: String,
    },
    properties: {
      type: String,
    },
    levels: {
      type: String
    },
    stats: {
      type: String,
    },
    category: {
      type: String
    },
    unlockContent: {
      type: String
    },
    sensitiveContent: {
      type: String
    },
    supply: {
      type: String
    },
    chain: {
      type: String
    },
    freeze: {
      type: String
    },
    make: {
      type: Number
    },
    price: {
      type: Number
    },
    file_path: {
      type: String
    },
    auctionDate: {
      type: Date
    },
    bidder : {
      type: Object
    },
    onSale: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  });
  
  module.exports = Collectible = mongoose.model("collectible", CollectibleSchema);