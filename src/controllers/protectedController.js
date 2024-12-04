const User = require('../models/User');

// Protected route to get secret data
const getProtectedData = (req, res) => {
  // Ensure the user is authenticated and their details are in req.user (populated by authentication middleware)
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
  }

  // Respond with secret data and user info (you can customize what user info to send)
  res.status(200).json({
    message: 'This is some secret data',
    user: req.user, // Sending back user info (ensure that you do not expose sensitive data like password)
  });
};

module.exports = {
  getProtectedData,
};
