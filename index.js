require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db'); // Path to your db.js file
const authRoutes = require('./src/routes/authRoutes');  // or wherever the auth routes are
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./src/models/User'); // Import your User model

const app = express();
const port = 5000;

app.use(cors());   // Enable CORS for all routes
app.use(bodyParser.json());

connectDB();       // Connect to MongoDB
app.use(express.json()); // Middleware and routes setup

// Middleware to set CSP headers globally
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self' data:;");
  next();
});

// JWT secret key (this should be kept in .env or an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// **Create User Route**
app.post('/users', async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({ username, password: hashedPassword });
    
    // Save the new user to the database
    await newUser.save();

    // Respond with the created user
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

// **Login Route**
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request for username:', username);

  // Input validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful, token:', token);
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update User Route (PUT)
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update username and/or password if provided
    if (username) user.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// **Get User by ID Route**
app.get('/users/:id', async (req, res) => {
  console.log('Request ID:', req.params.id); // Log the ID to see what ID is being passed
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Delete User Route (DELETE)
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});

// **Protected Route** - Only accessible with a valid token
app.get('/protected', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ secretData: 'This is some secret data', user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token', error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
