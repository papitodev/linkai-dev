const { body } = require('express-validator');

exports.updateProfileValidator = [
  body('name')
    .optional()
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters'),
  
  body('username')
    .optional()
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email'),
  
  body('bio')
    .optional()
    .isLength({ max: 160 }).withMessage('Bio cannot be more than 160 characters')
];