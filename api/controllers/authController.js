const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendEmail } = require('../config/email');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with that email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
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

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
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

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with that email does not exist'
      });
    }

    // Generate reset code
    const resetCode = user.generateResetCode();
    await user.save();

    // Send email
    const resetEmail = {
      to: user.email,
      subject: 'Password Reset - Link.aí',
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset for your Link.aí account.</p>
        <p>Your verification code is: <strong>${resetCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await sendEmail(resetEmail);

    res.json({
      success: true,
      message: 'Password reset code sent to email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+resetPasswordCode +resetPasswordExpire');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with that email does not exist'
      });
    }

    // Verify reset code
    if (!user.resetPasswordCode || !user.resetPasswordExpire) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    const isValid = user.verifyResetCode(code);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset code'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

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