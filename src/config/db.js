const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    throw new Error('Failed to connect to MongoDB')
  }
};

// Graceful shutdown of the MongoDB connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  });
});

module.exports = connectDB;
