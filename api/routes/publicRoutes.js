const express = require('express');
const { getPublicProfile } = require('../controllers/publicController');

const router = express.Router();

// Public routes
router.get('/:username', getPublicProfile);

module.exports = router;