const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Validation rules
const equipmentValidation = [
  body('name').trim().notEmpty().withMessage('Equipment name is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('pricePerHour').isNumeric().withMessage('Price per hour must be a valid number'),
  body('pricePerDay').isNumeric().withMessage('Price per day must be a valid number')
];

// Public routes
router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

// Protected routes (Equipment Owner only for creation)
router.post(
  '/',
  protect,
  authorize('equipment_owner', 'farmer'),
  upload.array('images', 5),
  equipmentValidation,
  createEquipment
);

router.put('/:id', protect, updateEquipment);
router.delete('/:id', protect, deleteEquipment);

module.exports = router;
