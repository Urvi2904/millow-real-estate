const mongoose = require('mongoose');

// Connects to MongoDB using the connection string from .env
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Export to use in server.js
module.exports = connectDB;
