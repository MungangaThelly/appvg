// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Adjust the path according to your project structure

const requireAuth = async (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token is provided, deny access
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user associated with the decoded token ID
    const user = await User.findById(decoded.id);
    
    // If no user is found with the ID from the token, deny access
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Attach the user object to the request for later use in the route
    req.user = user;
    
    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors (e.g., invalid or expired token)
    console.error(error);
    res.status(400).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = requireAuth;
