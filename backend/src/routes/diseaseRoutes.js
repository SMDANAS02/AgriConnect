const express = require('express');
const router = express.Router();
const {
  detectDisease,
  getDetectionHistory,
  getCropDiseases
} = require('../controllers/diseaseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route for browsing reference crop disease database
router.get('/', getCropDiseases);

// Protected routes
router.post('/detect', protect, upload.single('image'), detectDisease);
router.get('/history', protect, getDetectionHistory);

module.exports = router;
