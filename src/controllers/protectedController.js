const User = require('../models/User');

// Protected route to get secret data
const getProtectedData = (req, res) => {
  res.status(200).json({ secretData: 'This is some secret data' });
};

module.exports = {
  getProtectedData,
};
