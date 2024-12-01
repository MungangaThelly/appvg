const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./src/models/User'); // Importera din User-modell
const app = express();

app.use(express.json());

// JWT secret key (denna ska vara hemlig, använd miljövariabler i en riktig applikation)
const JWT_SECRET = 'your_jwt_secret';

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
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
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
    res.status(200).json({ secretData: 'This is some secret data', user });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
