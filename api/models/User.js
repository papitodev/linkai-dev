const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [160, 'Bio cannot be more than 160 characters']
  },
  resetPasswordCode: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset code
UserSchema.methods.generateResetCode = function() {
  // Generate a 6-digit code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the code before storing it
  const salt = bcrypt.genSaltSync(10);
  this.resetPasswordCode = bcrypt.hashSync(resetCode, salt);
  
  // Set expiration (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
  return resetCode;
};

// Verify reset code
UserSchema.methods.verifyResetCode = function(enteredCode) {
  // Check if code is expired
  if (Date.now() > this.resetPasswordExpire) {
    return false;
  }
  
  // Verify the code
  return bcrypt.compareSync(enteredCode, this.resetPasswordCode);
};

module.exports = mongoose.model('User', UserSchema);