const { validationResult } = require('express-validator');
const prisma = require('../utils/prismaClient');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { uploadImage } = require('../services/cloudinaryService');

/**
 * @desc   Get all equipment listings with filtering, searching & pagination
 * @route  GET /api/equipment
 */
const getAllEquipment = async (req, res, next) => {
  try {
    const {
      location,
      category,
      minPrice,
      maxPrice,
      availability,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Construct Prisma dynamic filter conditions
    const where = {};

    if (location) {
      where.owner = {
        location: { contains: location, mode: 'insensitive' }
      };
    }

    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (availability) {
      where.availabilityStatus = availability;
    }

    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch total count and paginated items concurrently
    const [totalItems, equipmentList] = await Promise.all([
      prisma.equipment.count({ where }),
      prisma.equipment.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              location: true
            }
          },
          reviews: {
            select: {
              rating: true,
              comment: true
            }
          }
        }
      })
    ]);

    // Format equipment data with calculated average rating
    const formattedEquipment = equipmentList.map((item) => {
      const reviewCount = item.reviews.length;
      const calculatedRating =
        reviewCount > 0
          ? parseFloat(
              (item.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
            )
          : item.rating || 4.5;

      return {
        ...item,
        rating: calculatedRating,
        reviewCount
      };
    });

    return successResponse(res, 200, 'Equipment list retrieved successfully', {
      equipment: formattedEquipment,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single equipment details by ID
 * @route  GET /api/equipment/:id
 */
const getEquipmentById = async (req, res, next) => {
  try {
    const equipmentId = parseInt(req.params.id, 10);
    if (isNaN(equipmentId)) {
      return errorResponse(res, 400, 'Invalid equipment ID format');
    }

    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true,
            createdAt: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!equipment) {
      return errorResponse(res, 404, 'Equipment not found');
    }

    return successResponse(res, 200, 'Equipment details retrieved successfully', {
      equipment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new equipment listing (Equipment Owner only)
 * @route  POST /api/equipment
 */
const createEquipment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 400, 'Validation failed', errors.array());
    }

    const {
      name,
      category,
      description,
      pricePerHour,
      pricePerDay,
      pricePerWeek,
      locationLat,
      locationLng
    } = req.body;

    let imageUrls = [];

    // Handle Cloudinary image uploads from Multer
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadImage(file.buffer, 'agriconnect/equipment')
      );
      const uploadResults = await Promise.all(uploadPromises);
      imageUrls = uploadResults.map((result) => result.url);
    } else if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'agriconnect/equipment');
      imageUrls.push(uploadResult.url);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (imageUrls.length === 0) {
      imageUrls.push('https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&q=80&w=800');
    }

    const newEquipment = await prisma.equipment.create({
      data: {
        ownerId: req.user.id,
        name,
        category,
        description: description || null,
        pricePerHour: parseFloat(pricePerHour),
        pricePerDay: parseFloat(pricePerDay),
        pricePerWeek: pricePerWeek ? parseFloat(pricePerWeek) : null,
        locationLat: locationLat ? parseFloat(locationLat) : null,
        locationLng: locationLng ? parseFloat(locationLng) : null,
        availabilityStatus: 'available',
        rating: 5.0,
        images: imageUrls
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            location: true
          }
        }
      }
    });

    return successResponse(res, 201, 'Equipment listing created successfully', {
      equipment: newEquipment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update equipment listing (Owner only)
 * @route  PUT /api/equipment/:id
 */
const updateEquipment = async (req, res, next) => {
  try {
    const equipmentId = parseInt(req.params.id, 10);
    if (isNaN(equipmentId)) {
      return errorResponse(res, 400, 'Invalid equipment ID format');
    }

    const existingEquipment = await prisma.equipment.findUnique({
      where: { id: equipmentId }
    });

    if (!existingEquipment) {
      return errorResponse(res, 404, 'Equipment listing not found');
    }

    // Verify ownership
    if (existingEquipment.ownerId !== req.user.id) {
      return errorResponse(res, 403, 'Forbidden: You can only update your own equipment listings');
    }

    const {
      name,
      category,
      description,
      pricePerHour,
      pricePerDay,
      pricePerWeek,
      availabilityStatus
    } = req.body;

    const updatedEquipment = await prisma.equipment.update({
      where: { id: equipmentId },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(pricePerHour && { pricePerHour: parseFloat(pricePerHour) }),
        ...(pricePerDay && { pricePerDay: parseFloat(pricePerDay) }),
        ...(pricePerWeek !== undefined && { pricePerWeek: pricePerWeek ? parseFloat(pricePerWeek) : null }),
        ...(availabilityStatus && { availabilityStatus })
      }
    });

    return successResponse(res, 200, 'Equipment updated successfully', {
      equipment: updatedEquipment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete equipment listing (Owner only)
 * @route  DELETE /api/equipment/:id
 */
const deleteEquipment = async (req, res, next) => {
  try {
    const equipmentId = parseInt(req.params.id, 10);
    if (isNaN(equipmentId)) {
      return errorResponse(res, 400, 'Invalid equipment ID format');
    }

    const existingEquipment = await prisma.equipment.findUnique({
      where: { id: equipmentId }
    });

    if (!existingEquipment) {
      return errorResponse(res, 404, 'Equipment listing not found');
    }

    if (existingEquipment.ownerId !== req.user.id) {
      return errorResponse(res, 403, 'Forbidden: You can only delete your own equipment listings');
    }

    await prisma.equipment.delete({
      where: { id: equipmentId }
    });

    return successResponse(res, 200, 'Equipment listing deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
};
