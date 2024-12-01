const express = require('express');
const connectDB = require('./src/config/db'); // Path to your db.js file
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./src/models/User'); // Importera din User-modell

const app = express();
const port = 5000;

// Load environment variables from .env file
require('dotenv').config(); // Load environment variables from .env file

// Check if JWT_SECRET is loaded properly
console.log('JWT_SECRET:', process.env.JWT_SECRET);  // This will log the value of JWT_SECRET

// Connect to MongoDB
connectDB();

// Middleware and routes setup (your other code)
app.use(express.json());

// Check if JWT_SECRET is defined in environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined. Please set it in your .env file.');
  process.exit(1); // Exit the process if JWT_SECRET is not found
}

// **Create** - POST request to create a new user
app.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ username, password });

    // Hash the password before saving
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

// **Login** - POST request to authenticate and return a JWT
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create a JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Example route
app.get('/', (req, res) => {
  res.send('WELCOME INTO MY GALAXY!');
});

// **Protected Route** - Only accessible with a valid token
app.get('/protected', async (req, res) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.status(200).json({ secretData: 'This is some secret data', user });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
