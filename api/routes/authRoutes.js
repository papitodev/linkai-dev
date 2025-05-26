const express = require('express');
const { register, login, forgotPassword, resetPassword, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../validators/authValidator');
const { validate } = require('../utils/validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;