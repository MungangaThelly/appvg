require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Path to your db.js file
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./src/models/User'); // Import your User model

const app = express();
const port = 5000;

// Middleware and routes setup
app.use(express.json());

// Enable CORS for all routes
const corsOptions = {
  origin: 'http://localhost:5000',  // Restrict to specific domains in production
  methods: ['GET', 'POST'],
};


// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {

})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// JWT secret key (this should be kept in .env or an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// **Create User Route**
app.post('/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    
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

  try {
    const user = await User.findOne({ username });
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

// **Read** - GET request to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users); // Respond with all users
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
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

// **Update** - PUT request to update a user's name by id
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, // Find user by _id
      { username: req.body.username }, // Update username (you can also use other fields like `name`)
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser); // Respond with the updated user
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

// **Delete** - DELETE request to delete a user by id 
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await User.deleteOne({ _id: req.params.id }); // Use _id to find the user

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});


// **Protected Route** - Only accessible with a valid token
app.get('/protected', async (req, res) => {
  const token = req.header('Authorization');
  
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
