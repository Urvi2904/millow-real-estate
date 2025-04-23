/**
 * Property.js file
 * Mongoose model for property documents.
 * Defines schema for name, address, image, tokenId, owner, traits, etc.
 * Used throughout the backend for CRUD operations.
 */

const mongoose = require('mongoose');

// Schema to define structure of each property document
const propertySchema = new mongoose.Schema({
  name: String,
  address: String,
  description: String,
  image: String, //Path to upload image file
  id: String, //Unique identifier for the property
  tokenId: String, //Token ID for the property
  owner: String, //Wallet address of the owner
  attributes: [
    {
      trait_type: String,
      value: mongoose.Schema.Types.Mixed, //Supports string, number
    },
  ],
  listedAt: {
    type: Date,
    default: Date.now, //Timestamp when the property was listed
  },
});

// Export model for CRUD operations
module.exports = mongoose.model('Property', propertySchema);
