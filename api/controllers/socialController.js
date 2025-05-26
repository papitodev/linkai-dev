const SocialProfile = require('../models/SocialProfile');

// Define base URLs for each supported platform
const platformBaseUrls = {
  GitHub: 'https://github.com/',
  Instagram: 'https://instagram.com/',
  LinkedIn: 'https://linkedin.com/in/'
};

// @desc    Create social profile
// @route   POST /api/socials
// @access  Private
exports.createSocial = async (req, res, next) => {
  try {
    const { platform, username } = req.body;
    const userId = req.user.id;

    // Generate URL based on platform
    const url = platformBaseUrls[platform] + username;

    // Check if this platform already exists for user
    const existingSocial = await SocialProfile.findOne({
      user: userId,
      platform
    });

    if (existingSocial) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${platform} profile set up`
      });
    }

    // Create social profile
    const social = await SocialProfile.create({
      user: userId,
      platform,
      username,
      url
    });

    res.status(201).json({
      success: true,
      social
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all social profiles for current user
// @route   GET /api/socials
// @access  Private
exports.getSocials = async (req, res, next) => {
  try {
    const socials = await SocialProfile.find({ user: req.user.id });

    res.json({
      success: true,
      count: socials.length,
      socials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete social profile
// @route   DELETE /api/socials/:id
// @access  Private
exports.deleteSocial = async (req, res, next) => {
  try {
    const social = await SocialProfile.findById(req.params.id);

    if (!social) {
      return res.status(404).json({
        success: false,
        message: 'Social profile not found'
      });
    }

    // Check if social belongs to user
    if (social.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this social profile'
      });
    }

    await social.deleteOne();

    res.json({
      success: true,
      message: 'Social profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update social profile
// @route   PUT /api/socials/:id
// @access  Private
exports.updateSocial = async (req, res, next) => {
  try {
    const { platform, username } = req.body;
    const socialId = req.params.id;

    // Verifica se o social profile existe
    const social = await SocialProfile.findById(socialId);

    if (!social) {
      return res.status(404).json({
        success: false,
        message: 'Social profile not found'
      });
    }

    // Verifica se o social profile pertence ao usuário
    if (social.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this social profile'
      });
    }

    // Atualiza a URL com base na nova plataforma/username se fornecidos
    if (platform && username) {
      if (!platformBaseUrls[platform]) {
        return res.status(400).json({
          success: false,
          message: 'Unsupported platform'
        });
      }
      social.platform = platform;
      social.url = platformBaseUrls[platform] + username;
      social.username = username
    } else if (username) {
      social.url = platformBaseUrls[social.platform] + username;
    }

    await social.save();

    res.json({
      success: true,
      social
    });
  } catch (error) {
    next(error);
  }
};
