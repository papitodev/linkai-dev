const { body } = require('express-validator');

exports.createLinkValidator = [
  body('name')
    .notEmpty().withMessage('Link name is required')
    .isLength({ max: 50 }).withMessage('Link name cannot be more than 50 characters'),

  body('url')
    .notEmpty().withMessage('URL is required')
    .matches(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)
    .withMessage('Please provide a valid URL'),

  body('emoji')
    .optional()
    .matches(/^\p{Emoji}$/u)
    .withMessage('Please provide a valid emoji character')
];