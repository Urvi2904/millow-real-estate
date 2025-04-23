/**
 * db.js file
 * Handles MongoDB connection using Mongoose.
 * Loads the connection string from environment variables (.env).
 * Called from server.js at start.
 */

const mongoose = require('mongoose');

// Connects to MongoDB using the connection string from .env
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); //connect using MONGO_URI
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); //exit if connection fails
  }
};

// Export connection function to use in server.js
module.exports = connectDB;
