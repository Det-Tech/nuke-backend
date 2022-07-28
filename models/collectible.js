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
    file_path: {
      type: String
    },
    onSale: {
      type: Boolean,
      default: false
    }
  });
  
  module.exports = Collectible = mongoose.model("collectible", CollectibleSchema);