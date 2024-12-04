require('dotenv').config();

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_CONNECTION_STRING;  // Make sure MONGO_URI is being read
    if (!uri) {
      console.error('MongoDB URI is not defined');
      return;
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDB;
