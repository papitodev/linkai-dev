const express = require('express');
const { updateProfile, deleteAccount } = require('../controllers/userController');
const { updateProfileValidator } = require('../validators/userValidator');
const { validate } = require('../utils/validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.put('/profile', updateProfileValidator, validate, updateProfile);
router.delete('/', deleteAccount);

module.exports = router;