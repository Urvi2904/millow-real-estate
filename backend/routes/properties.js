// const express = require('express');
// const router = express.Router();
// const Property = require('../models/Property');

// // GET all properties
// router.get('/', async (req, res) => {
//   const properties = await Property.find();
//   res.json(properties);
// });

// // POST new property
// router.post('/', async (req, res) => {
//   const property = new Property(req.body);
//   await property.save();
//   res.status(201).json(property);
// });

// // ✅ DELETE property by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     await Property.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Property deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
 

const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const fs = require('fs');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// POST new property with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const propertyData = JSON.parse(req.body.data);
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProperty = new Property({
      ...propertyData,
      image: imagePath,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: 'Failed to save property' });
  }
});

// GET all properties
router.get('/', async (req, res) => {
  const properties = await Property.find();
  res.json(properties);
});

// DELETE property by ID
// router.delete('/:id', async (req, res) => {
//   try {
//     // await Property.findByIdAndDelete(req.params.id);
//     // res.json({ message: 'Property deleted successfully' });
//     const deleted = await Property.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//          return res.status(404).json({ message: 'Property not found' });
//     }
//     res.json({ message: 'Property deleted successfully' });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

//DELETE property and its image
router.delete('/:id', async (req, res) => {
    try {
      const { account } = req.body; // 🧠 Account from frontend
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
      if (!property.owner) {
        return res.status(403).json({ message: "Unauthorized: No owner field set" });
      }
      if (property.owner.toLowerCase() !== account.toLowerCase()) {
        return res.status(403).json({ message: 'You are not authorized to delete this property.' });
      }
  
      // ✅ Delete image file from uploads folder
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
// PUT - update a property
router.put('/:id', async (req, res) => {
    try {
      const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedProperty);
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: 'Failed to update property' });
    }
  });

module.exports = router;
