const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const prisma = require('../utils/prismaClient');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Helper to sign JWT tokens
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'agiconnect-dev-secret-key-change-in-production',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc   Register a new farmer or equipment owner
 * @route  POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { name, email, password, phone, role, location } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return errorResponse(res, 400, 'User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in PostgreSQL database via Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: role || 'farmer',
        location: location || 'Coimbatore'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        location: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    return successResponse(res, 201, 'User registered successfully', {
      user,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Authenticate user & return JWT token
 * @route  POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password credentials');
    }

    // Verify bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid email or password credentials');
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      createdAt: user.createdAt
    };

    return successResponse(res, 200, 'Login successful', {
      user: userProfile,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get current logged-in user profile
 * @route  GET /api/auth/me
 */
const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, 200, 'Profile fetched successfully', {
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update current logged-in user profile
 * @route  PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { name, phone, location } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(location && { location })
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        location: true,
        createdAt: true
      }
    });

    return successResponse(res, 200, 'Profile updated successfully', {
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getMe: getProfile,
  updateProfile,
  registerUser: register,
  loginUser: login
};
