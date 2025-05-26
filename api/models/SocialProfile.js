const mongoose = require('mongoose');

const SocialProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['GitHub', 'Instagram', 'LinkedIn']
  },
  username: {
    type: String,
    required: [true, 'Please provide your username for this platform'],
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one platform per user
SocialProfileSchema.index({ user: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('SocialProfile', SocialProfileSchema);