const User = require('../models/User');
const Link = require('../models/Link');
const SocialProfile = require('../models/SocialProfile');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, username, email, bio } = req.body;
    const userId = req.user.id;

    // Check if username or email already exists (if changing)
    if (username || email) {
      const fieldsToCheck = {};
      if (username) fieldsToCheck.username = username;
      if (email) fieldsToCheck.email = email;

      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          { $or: Object.keys(fieldsToCheck).map(key => ({ [key]: fieldsToCheck[key] })) }
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username or email already in use'
        });
      }
    }

    // Update user
    const updateFields = {};
    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;

    const user = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/users
// @access  Private
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Delete all user's links
    await Link.deleteMany({ user: userId });
    
    // Delete all user's social profiles
    await SocialProfile.deleteMany({ user: userId });
    
    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};