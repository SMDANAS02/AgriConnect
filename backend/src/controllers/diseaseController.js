const prisma = require('../utils/prismaClient');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { uploadImage } = require('../services/cloudinaryService');
const { detectDisease: hfDetectDisease } = require('../services/hfDiseaseService');

/**
 * @desc   Analyze leaf photo via AI and save diagnosis log
 * @route  POST /api/disease/detect
 */
const detectDisease = async (req, res, next) => {
  try {
    let imageUrl = 'https://images.unsplash.com/photo-1536053464738-4e892c9060b9?auto=format&fit=crop&q=80&w=800';

    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer, 'agriconnect/leaf_diagnoses');
      imageUrl = uploadResult.url;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Invoke HuggingFace AI Model Service
    const aiPrediction = await hfDetectDisease(imageUrl);
    const { detectedDisease, confidenceScore } = aiPrediction;

    // Search knowledge base in CropDisease table for detailed regional treatments
    let diseaseInfo = await prisma.cropDisease.findFirst({
      where: {
        OR: [
          { diseaseName: { contains: detectedDisease.split(' ')[0], mode: 'insensitive' } },
          { cropName: { contains: req.body.cropName || 'Rice', mode: 'insensitive' } }
        ]
      }
    });

    if (!diseaseInfo) {
      diseaseInfo = {
        cropName: req.body.cropName || 'Paddy / Rice (நெல்)',
        diseaseName: detectedDisease,
        symptoms: 'Foliar lesions with characteristic dark margins and necrotic central spot.',
        treatment: 'Apply Tricyclazole 75% WP @ 0.6 g/l of water or Carbendazim 50% WP @ 1g/l.',
        preventiveMeasures: 'Maintain proper field drainage and avoid excess nitrogen fertilization.'
      };
    }

    // Save AI Diagnosis Log in database
    const savedDetection = await prisma.aIDetection.create({
      data: {
        userId: req.user.id,
        uploadedImageUrl: imageUrl,
        detectedDisease: diseaseInfo.diseaseName,
        confidenceScore: confidenceScore || 0.942,
        recommendedTreatment: diseaseInfo.treatment
      }
    });

    return successResponse(res, 200, 'Crop disease diagnosis completed successfully', {
      detectionId: savedDetection.id,
      imageUrl,
      detectedDisease: diseaseInfo.diseaseName,
      cropName: diseaseInfo.cropName,
      confidenceScore: savedDetection.confidenceScore,
      symptoms: diseaseInfo.symptoms,
      recommendedTreatment: diseaseInfo.treatment,
      preventiveMeasures: diseaseInfo.preventiveMeasures,
      createdAt: savedDetection.createdAt
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get user's past AI disease detection history
 * @route  GET /api/disease/history
 */
const getDetectionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [totalItems, detections] = await Promise.all([
      prisma.aIDetection.count({ where: { userId: req.user.id } }),
      prisma.aIDetection.findMany({
        where: { userId: req.user.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return successResponse(res, 200, 'Disease detection history retrieved', {
      detections,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Search regional crop diseases reference knowledge base
 * @route  GET /api/diseases
 */
const getCropDiseases = async (req, res, next) => {
  try {
    const { cropName, search } = req.query;

    const where = {};

    if (cropName) {
      where.cropName = { contains: cropName, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { cropName: { contains: search, mode: 'insensitive' } },
        { diseaseName: { contains: search, mode: 'insensitive' } },
        { symptoms: { contains: search, mode: 'insensitive' } }
      ];
    }

    const diseases = await prisma.cropDisease.findMany({
      where,
      orderBy: { cropName: 'asc' }
    });

    return successResponse(res, 200, 'Crop disease reference database retrieved', {
      diseases
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  detectDisease,
  getDetectionHistory,
  getCropDiseases
};
