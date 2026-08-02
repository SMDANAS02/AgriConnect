const express = require('express');
const router = express.Router();
const { handleWebhook, verifyWebhook } = require('../controllers/whatsappController');

// Meta Cloud API verification route
router.get('/webhook', verifyWebhook);

// Primary webhook route for incoming WhatsApp business messages
router.post('/webhook', handleWebhook);

// UI interactive demo simulation route for front-end testers
router.post('/simulate', handleWebhook);

module.exports = router;
