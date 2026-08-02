const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getForecast, DISTRICT_COORDINATES } = require('../services/weatherService');

/**
 * Static Tamil Nadu Crop Calendar Knowledge Base
 */
const TAMIL_NADU_CROP_CALENDAR = [
  {
    cropName: 'Paddy / Rice (நெல் - Kuruvai)',
    season: 'Kuruvai (Short duration)',
    sowingMonths: ['June', 'July'],
    harvestMonths: ['September', 'October'],
    suitableDistricts: ['Thanjavur', 'Karur', 'Salem', 'Madurai'],
    waterRequirement: 'High',
    tips: 'Ensure proper transplanting density and early weed management.'
  },
  {
    cropName: 'Paddy / Rice (நெல் - Samba)',
    season: 'Samba (Main season)',
    sowingMonths: ['August', 'September'],
    harvestMonths: ['January', 'February'],
    suitableDistricts: ['Thanjavur', 'Coimbatore', 'Salem', 'Karur', 'Madurai'],
    waterRequirement: 'Very High',
    tips: 'Monitor for blast disease during high humidity monsoon period.'
  },
  {
    cropName: 'Groundnut (நிலக்கடலை)',
    season: 'Kharif / Rabi',
    sowingMonths: ['June', 'July', 'December', 'January'],
    harvestMonths: ['October', 'November', 'April', 'May'],
    suitableDistricts: ['Coimbatore', 'Salem', 'Karur'],
    waterRequirement: 'Medium',
    tips: 'Apply gypsum @ 400 kg/ha at 45 days after sowing during peg formation stage.'
  },
  {
    cropName: 'Sugarcane (கரும்பு)',
    season: 'Perennial (10-12 months)',
    sowingMonths: ['December', 'January', 'February'],
    harvestMonths: ['December', 'January', 'February'],
    suitableDistricts: ['Salem', 'Karur', 'Coimbatore'],
    waterRequirement: 'High',
    tips: 'Drip irrigation reduces water consumption by up to 40%.'
  },
  {
    cropName: 'Cotton (பருத்தி)',
    season: 'Kharif',
    sowingMonths: ['August', 'September'],
    harvestMonths: ['February', 'March'],
    suitableDistricts: ['Coimbatore', 'Madurai', 'Salem'],
    waterRequirement: 'Medium',
    tips: 'Watch for pink bollworm during boll development.'
  }
];

/**
 * @desc   Get hyperlocal weather forecast
 * @route  GET /api/weather/forecast
 */
const getWeatherForecast = async (req, res, next) => {
  try {
    const { lat, lng, district } = req.query;
    const targetDistrict = district || 'Coimbatore';

    const weatherData = await getForecast(
      lat ? parseFloat(lat) : null,
      lng ? parseFloat(lng) : null,
      targetDistrict
    );

    return successResponse(res, 200, 'Weather forecast retrieved successfully', weatherData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get weather-driven automated crop advisory
 * @route  GET /api/weather/advisory
 */
const getCropAdvisory = async (req, res, next) => {
  try {
    const { district = 'Coimbatore', cropType = 'Paddy' } = req.query;

    const weatherData = await getForecast(null, null, district);
    const { current, forecast } = weatherData;

    // Generate weather-driven agricultural advisories
    const recommendations = [];

    if (current.humidity > 75) {
      recommendations.push(
        `High humidity (${current.humidity}%) recorded in ${district}. Inspect ${cropType} crops for fungal infections (Blast or Leaf Spot).`
      );
      recommendations.push('Postpone pesticide spraying if rain probability exceeds 50%.');
    } else {
      recommendations.push(
        `Favorable ambient humidity (${current.humidity}%). Ideal conditions for fertilizer application in ${cropType} fields.`
      );
    }

    if (current.rainProbability > 40) {
      recommendations.push(
        `Rain probability is ${current.rainProbability}%. Postpone threshing, drying, and chemical spraying for 24-48 hours.`
      );
      recommendations.push('Ensure field drainage channels are clear to prevent waterlogging.');
    } else {
      recommendations.push(
        `Low rain probability (${current.rainProbability}%). Provide light irrigation in early morning or late evening hours.`
      );
    }

    if (current.temp > 34) {
      recommendations.push(
        `Elevated temperatures (${current.temp}°C). Provide soil mulching to conserve root zone moisture.`
      );
    }

    return successResponse(res, 200, 'Crop advisory generated successfully', {
      district: weatherData.district,
      cropType,
      currentWeather: current,
      recommendations,
      weeklyForecastSummary: forecast
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get Tamil Nadu crop calendar
 * @route  GET /api/weather/calendar
 */
const getCropCalendar = async (req, res, next) => {
  try {
    const { district, cropType } = req.query;

    let calendar = TAMIL_NADU_CROP_CALENDAR;

    if (district) {
      calendar = calendar.filter((item) =>
        item.suitableDistricts.some(
          (d) => d.toLowerCase() === district.toLowerCase()
        )
      );
    }

    if (cropType) {
      calendar = calendar.filter((item) =>
        item.cropName.toLowerCase().includes(cropType.toLowerCase())
      );
    }

    return successResponse(res, 200, 'Tamil Nadu crop calendar retrieved', {
      calendar
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeatherForecast,
  getCropAdvisory,
  getCropCalendar,
  getWeatherAdvisory: getCropAdvisory
};
