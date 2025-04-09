//Express server with endpoints for handling properties and file uploads

// Load required modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());

// Serve static images from uploads folder
app.use('/uploads', express.static('uploads'));

// Property API routes (includes GET, POST, DELETE etc.)
app.use('/api/properties', require('./routes/properties'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
