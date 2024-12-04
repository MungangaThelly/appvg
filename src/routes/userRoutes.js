const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

// Create a new user (validation and authentication are optional here depending on your needs)
router.post('/', createUser);

// Get all users - You can add authentication here if needed
router.get('/', getAllUsers);

// Get a user by ID
router.get('/:id', getUserById);

// Update a user by ID (validation and authentication)
router.put('/:id', updateUser);

// Delete a user by ID (authentication required)
router.delete('/:id', deleteUser);

module.exports = router;
