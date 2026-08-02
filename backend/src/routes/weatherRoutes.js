const express = require('express');
const router = express.Router();
const {
  getWeatherForecast,
  getCropAdvisory,
  getCropCalendar
} = require('../controllers/weatherController');

// Public weather & advisory endpoints
router.get('/forecast', getWeatherForecast);
router.get('/advisory', getCropAdvisory);
router.get('/calendar', getCropCalendar);

module.exports = router;
