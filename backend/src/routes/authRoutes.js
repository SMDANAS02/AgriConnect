const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['farmer', 'equipment_owner']).withMessage('Role must be farmer or equipment_owner'),
  body('phone').optional().isString(),
  body('location').optional().isString()
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

const profileUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isString(),
  body('location').optional().isString()
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getProfile);
router.put('/profile', protect, profileUpdateValidation, updateProfile);

module.exports = router;
