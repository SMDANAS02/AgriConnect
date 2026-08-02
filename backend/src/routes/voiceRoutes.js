/**
 * AgriConnect Tamil Voice Routes
 * @desc   Minimal public route for Tamil farming Q&A
 * @route  POST /api/voice/query
 * @access Public (no JWT required — same as weather routes)
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { queryTamilAssistant } = require('../controllers/voiceController');

router.post(
  '/query',
  [
    body('text')
      .trim()
      .notEmpty()
      .withMessage('text field is required')
      .isLength({ max: 1000 })
      .withMessage('Query text too long (max 1000 chars)')
  ],
  queryTamilAssistant
);

module.exports = router;
