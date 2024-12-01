const mongoose = require('mongoose');

// Ensure environment variables are loaded (only necessary if you aren't already doing it elsewhere)
require('dotenv').config();

const connectDB = async () => {
  try {
    // Get MongoDB connection URI from environment variables
    const mongoURI = process.env.MONGO_CONNECTION_STRING;

    // Check if the connection string is defined
    if (!mongoURI) {
      throw new Error('MONGO_CONNECTION_STRING is not defined');
    }

    // Log the MongoDB URI for debugging (optional)
    console.log('Connecting to MongoDB with URI:', mongoURI);

    // Connect to MongoDB using mongoose (no need for deprecated options)
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw new Error('Failed to connect to MongoDB');
  }
};

module.exports = connectDB;
