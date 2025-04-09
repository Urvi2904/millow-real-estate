const mongoose = require('mongoose');

// Schema to define structure of each property document
const propertySchema = new mongoose.Schema({
  name: String,
  address: String,
  description: String,
  image: String,
  id: String,
  tokenId: String,
  owner: String,
  attributes: [
    {
      trait_type: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  listedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Property', propertySchema);
