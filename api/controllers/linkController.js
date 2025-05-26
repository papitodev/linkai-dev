const Link = require('../models/Link');

// @desc    Create new link
// @route   POST /api/links
// @access  Private
exports.createLink = async (req, res, next) => {
  try {
    const { name, url, emoji } = req.body;
    const userId = req.user.id;

    // Check if user has reached the limit of 5 links
    const canAddLink = await Link.checkLinkLimit(userId);
    
    if (!canAddLink) {
      return res.status(400).json({
        success: false,
        message: 'You have reached the maximum limit of 5 links'
      });
    }

    // Create link
    const link = await Link.create({
      user: userId,
      name,
      url,
      emoji: emoji || '🔗'
    });

    res.status(201).json({
      success: true,
      link
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all links for current user
// @route   GET /api/links
// @access  Private
exports.getLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: links.length,
      links
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete link
// @route   DELETE /api/links/:id
// @access  Private
exports.deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Check if link belongs to user
    if (link.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this link'
      });
    }

    await link.deleteOne();

    res.json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
