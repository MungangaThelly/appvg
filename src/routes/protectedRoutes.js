const express = require('express');
const requireAuth = require('../middleware/authMiddleware');
const router = express.Router();

// A protected endpoint - requiring authentication using the requireAuth middleware
router.get('/', requireAuth, (req, res) => {
  // Send a response with a message and the authenticated user's information
  res.status(200).json({
    message: 'Welcome to the protected route',
    user: req.user  // Assuming req.user is set by requireAuth middleware
  });
});

module.exports = router;
