const express = require('express');
const { createSocial, getSocials, deleteSocial, updateSocial } = require('../controllers/socialController');
const { createSocialValidator, updateSocialValidator } = require('../validators/socialValidator');
const { validate } = require('../utils/validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createSocialValidator, validate, createSocial);
router.get('/', getSocials);
router.delete('/:id', deleteSocial);
router.put('/:id', updateSocialValidator, validate, updateSocial);


module.exports = router;