const express = require('express');
const { createLink, getLinks, deleteLink } = require('../controllers/linkController');
const { createLinkValidator } = require('../validators/linkValidator');
const { validate } = require('../utils/validator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createLinkValidator, validate, createLink);
router.get('/', getLinks);
router.delete('/:id', deleteLink);

module.exports = router;