const { validationResult } = require('express-validator');
const prisma = require('../utils/prismaClient');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc   Create equipment rental booking reservation
 * @route  POST /api/bookings
 */
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const { equipmentId, startDate, endDate } = req.body;
    const farmerId = req.user.id;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return errorResponse(res, 400, 'End date must be after start date');
    }

    // Check if equipment exists
    const equipment = await prisma.equipment.findUnique({
      where: { id: parseInt(equipmentId, 10) }
    });

    if (!equipment) {
      return errorResponse(res, 404, 'Equipment not found');
    }

    // Calculate total price in INR
    const diffTime = Math.abs(end - start);
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const totalPrice = parseFloat((diffDays * equipment.pricePerDay).toFixed(2));

    // Check for conflicting overlapping confirmed bookings
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        equipmentId: equipment.id,
        bookingStatus: { in: ['confirmed', 'pending'] },
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } }
        ]
      }
    });

    if (conflictingBooking) {
      return errorResponse(
        res,
        400,
        'Equipment is already reserved or booked for the selected date range'
      );
    }

    // Create booking record
    const booking = await prisma.booking.create({
      data: {
        equipmentId: equipment.id,
        farmerId,
        startDate: start,
        endDate: end,
        totalPrice,
        paymentStatus: 'pending',
        bookingStatus: 'pending'
      },
      include: {
        equipment: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                phone: true,
                location: true
              }
            }
          }
        }
      }
    });

    return successResponse(res, 201, 'Booking reservation created successfully', {
      booking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all bookings for a farmer
 * @route  GET /api/bookings/farmer/:farmerId
 */
const getFarmerBookings = async (req, res, next) => {
  try {
    const farmerId = parseInt(req.params.farmerId, 10);

    if (isNaN(farmerId)) {
      return errorResponse(res, 400, 'Invalid farmer ID format');
    }

    // Verify authorized user
    if (req.user.id !== farmerId && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You can only view your own bookings');
    }

    const bookings = await prisma.booking.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
      include: {
        equipment: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                location: true
              }
            }
          }
        },
        review: true
      }
    });

    return successResponse(res, 200, 'Farmer bookings retrieved successfully', {
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all bookings for equipment owned by an owner
 * @route  GET /api/bookings/owner/:ownerId
 */
const getOwnerBookings = async (req, res, next) => {
  try {
    const ownerId = parseInt(req.params.ownerId, 10);

    if (isNaN(ownerId)) {
      return errorResponse(res, 400, 'Invalid owner ID format');
    }

    if (req.user.id !== ownerId && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You can only view bookings for your equipment');
    }

    const bookings = await prisma.booking.findMany({
      where: {
        equipment: { ownerId }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        equipment: true,
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true
          }
        },
        review: true
      }
    });

    return successResponse(res, 200, 'Owner equipment bookings retrieved successfully', {
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Confirm booking reservation (Owner only)
 * @route  PUT /api/bookings/:id/confirm
 */
const confirmBooking = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id, 10);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { equipment: true }
    });

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    if (booking.equipment.ownerId !== req.user.id) {
      return errorResponse(res, 403, 'Forbidden: Only the equipment owner can confirm bookings');
    }

    // Update booking & equipment status concurrently using a transaction
    const [updatedBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          bookingStatus: 'confirmed',
          paymentStatus: 'completed'
        }
      }),
      prisma.equipment.update({
        where: { id: booking.equipmentId },
        data: { availabilityStatus: 'booked' }
      })
    ]);

    return successResponse(res, 200, 'Booking confirmed successfully', {
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Cancel booking reservation (Owner or Farmer)
 * @route  PUT /api/bookings/:id/cancel
 */
const cancelBooking = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id, 10);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { equipment: true }
    });

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    const isFarmer = booking.farmerId === req.user.id;
    const isOwner = booking.equipment.ownerId === req.user.id;

    if (!isFarmer && !isOwner) {
      return errorResponse(res, 403, 'Forbidden: You cannot cancel this booking');
    }

    const [updatedBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { bookingStatus: 'cancelled' }
      }),
      prisma.equipment.update({
        where: { id: booking.equipmentId },
        data: { availabilityStatus: 'available' }
      })
    ]);

    return successResponse(res, 200, 'Booking cancelled successfully', {
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Mark booking as completed (Owner only)
 * @route  PUT /api/bookings/:id/complete
 */
const completeBooking = async (req, res, next) => {
  try {
    const bookingId = parseInt(req.params.id, 10);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { equipment: true }
    });

    if (!booking) {
      return errorResponse(res, 404, 'Booking not found');
    }

    if (booking.equipment.ownerId !== req.user.id) {
      return errorResponse(res, 403, 'Forbidden: Only the equipment owner can complete bookings');
    }

    const [updatedBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id: bookingId },
        data: { bookingStatus: 'completed' }
      }),
      prisma.equipment.update({
        where: { id: booking.equipmentId },
        data: { availabilityStatus: 'available' }
      })
    ]);

    return successResponse(res, 200, 'Booking marked as completed', {
      booking: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getFarmerBookings,
  getOwnerBookings,
  confirmBooking,
  cancelBooking,
  completeBooking
};
