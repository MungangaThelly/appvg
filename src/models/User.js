const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema definition
const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 3 // Example: Minimum length for username
  },
  password: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true, 
    required: false, 
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'] 
  },
  role: { 
    type: String, 
    default: 'user'  // Optional: You can add roles like 'admin', 'user', etc.
  }
});

// Pre-save middleware to hash the password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords (for authentication)
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Export the model
module.exports = mongoose.model('User', UserSchema);
