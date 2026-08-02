const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  createBooking,
  getFarmerBookings,
  getOwnerBookings,
  confirmBooking,
  cancelBooking,
  completeBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const bookingValidation = [
  body('equipmentId').isInt().withMessage('Valid equipment ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date (ISO string) is required'),
  body('endDate').isISO8601().withMessage('Valid end date (ISO string) is required')
];

// All booking endpoints require JWT protection
router.use(protect);

router.post('/', bookingValidation, createBooking);
router.get('/farmer/:farmerId', getFarmerBookings);
router.get('/owner/:ownerId', getOwnerBookings);
router.put('/:id/confirm', confirmBooking);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/complete', completeBooking);

module.exports = router;
