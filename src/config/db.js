const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      connectTimeoutMS: 30000,  // Set timeout to 30 seconds
      socketTimeoutMS: 30000    // Set socket timeout to 30 seconds
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit the process if connection fails
  }
};

module.exports = connectDB;