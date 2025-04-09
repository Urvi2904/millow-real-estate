//Handles all API endpoints to create, read, update, delete properties (CRUD)

const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Configure file storage for property images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); //Uploaded images stroed in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST (upload) new property with image, metadata + tokenId
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const propertyData = JSON.parse(req.body.data);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    //Save to MongoDB first (without tokenId)
    const newProperty = new Property({ ...propertyData, image: imagePath });
    const savedProperty = await newProperty.save();

    // Generate tokenId
    const tokenId = Date.now().toString();
    savedProperty.tokenId = tokenId;
    await savedProperty.save();

    // Return the tokenId to frontend
    res.status(201).json({ ...savedProperty.toObject(), tokenId });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Failed to save property' });
  }
});

// GET all properties (required by homepage, inspections, etc.)
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (err) {
    console.error('❌ Error loading properties:', err);
    res.status(500).json({ message: 'Failed to load properties' });
  }
});

// DELETE property and its image
router.delete('/:id', async (req, res) => {
  try {
    const { account } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (!property.owner) {
      return res
        .status(403)
        .json({ message: 'Unauthorized: No owner field set' });
    }
    if (property.owner.toLowerCase() !== account.toLowerCase()) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to delete this property.' });
    }

    // Delete image from server
    if (property.image) {
      const imagePath = path.join(__dirname, '..', property.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.warn('⚠️ Failed to delete image file:', err.message);
        }
      });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ message: 'Failed to delete property' });
  }
});

// PUT - update property
router.put('/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedProperty);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update property' });
  }
});

module.exports = router;
