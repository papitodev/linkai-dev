const { body } = require('express-validator');

exports.createSocialValidator = [
  body('platform')
    .notEmpty().withMessage('Platform is required')
    .isIn(['GitHub', 'Instagram', 'LinkedIn']).withMessage('Platform must be GitHub, Instagram, or LinkedIn'),
  
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ max: 50 }).withMessage('Username cannot be more than 50 characters'),
];

exports.updateSocialValidator = [
  body('platform')
    .optional()
    .isIn(['GitHub', 'Instagram', 'LinkedIn']).withMessage('Platform must be GitHub, Instagram, or LinkedIn'),
  
  body('username')
    .optional()
    .isLength({ max: 50 }).withMessage('Username cannot be more than 50 characters'),
];
