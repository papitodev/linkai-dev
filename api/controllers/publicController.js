const User = require('../models/User');
const Link = require('../models/Link');
const SocialProfile = require('../models/SocialProfile');

// @desc    Get public profile by username
// @route   GET /u/:username
// @access  Public
exports.getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's links
    const links = await Link.find({ user: user._id });

    // Get user's social profiles
    const socials = await SocialProfile.find({ user: user._id });

    res.json({
      success: true,
      profile: {
        name: user.name,
        username: user.username,
        bio: user.bio,
        links,
        socials
      }
    });
  } catch (error) {
    next(error);
  }
};