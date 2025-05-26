const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for the link'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  url: {
    type: String,
    required: [true, 'Please provide a URL'],
    match: [
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      'Please provide a valid URL'
    ]
  },
  emoji: {
    type: String,
    maxlength: [2, 'Emoji must be a single emoji character'],
    default: '🔗' // link emoji como padrão
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate maximum of 5 links per user
LinkSchema.statics.checkLinkLimit = async function(userId) {
  const count = await this.countDocuments({ user: userId });
  return count < 5;
};

module.exports = mongoose.model('Link', LinkSchema);
