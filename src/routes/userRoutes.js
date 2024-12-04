const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { validateUser, validateUpdateUser } = require('../middlewares/validation');  // Add validation middleware
const { authenticate } = require('../middlewares/authenticate');  // Optional: Authentication middleware

// Create a new user (validation and authentication are optional here depending on your needs)
router.post('/', validateUser, createUser);

// Get all users - You can add authentication here if needed
router.get('/', authenticate, getAllUsers);

// Get a user by ID
router.get('/:id', authenticate, getUserById);

// Update a user by ID (validation and authentication)
router.put('/:id', authenticate, validateUpdateUser, updateUser);

// Delete a user by ID (authentication required)
router.delete('/:id', authenticate, deleteUser);

module.exports = router;
