const axios = require('axios');

// District coordinate mappings for Tamil Nadu agricultural belts
const DISTRICT_COORDINATES = {
  coimbatore: { lat: 11.0168, lng: 76.9558, name: 'Coimbatore', defaultTemp: 31 },
  salem: { lat: 11.6643, lng: 78.1469, name: 'Salem', defaultTemp: 34 },
  karur: { lat: 10.9601, lng: 78.1627, name: 'Karur', defaultTemp: 33 },
  madurai: { lat: 9.9252, lng: 78.1198, name: 'Madurai', defaultTemp: 35 },
  thanjavur: { lat: 10.7870, lng: 79.1378, name: 'Thanjavur', defaultTemp: 32 },
  trichy: { lat: 10.7905, lng: 78.7047, name: 'Trichy', defaultTemp: 34 },
  erode: { lat: 11.3410, lng: 77.7172, name: 'Erode', defaultTemp: 33 },
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai', defaultTemp: 34 }
};

/**
 * Fetch weather forecast data from OpenWeatherMap API using Current & Forecast endpoints
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {string} district - District Name fallback
 */
const getForecast = async (lat, lng, district = 'Coimbatore') => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY || process.env.OPENWEATHER_API_KEY;
  const targetDistrictKey = (district || 'coimbatore').toLowerCase().trim();
  const districtInfo = DISTRICT_COORDINATES[targetDistrictKey] || DISTRICT_COORDINATES.coimbatore;

  lat = lat || districtInfo.lat;
  lng = lng || districtInfo.lng;

  if (!apiKey) {
    console.warn('⚠️ OpenWeatherMap API key not found, returning realistic mock weather data');
    return getMockWeatherData(districtInfo.name);
  }

  try {
    // 1. Fetch Current Weather Data API
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentWeatherUrl, { timeout: 8000 }),
      axios.get(forecastUrl, { timeout: 8000 })
    ]);

    const currentData = currentRes.data;
    const currentMetrics = {
      date: new Date().toISOString().split('T')[0],
      temp: Math.round(currentData.main.temp),
      tempMin: Math.round(currentData.main.temp_min),
      tempMax: Math.round(currentData.main.temp_max),
      humidity: currentData.main.humidity,
      rainProbability: currentData.rain ? Math.min(95, Math.round((currentData.rain['1h'] || 1) * 20)) : 15,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
      description: currentData.weather[0]?.main || currentData.weather[0]?.description || 'Clear Sky',
      icon: currentData.weather[0]?.icon || '01d'
    };

    const forecastList = forecastRes.data.list || [];
    const forecastDays = forecastList
      .filter((_, idx) => idx % 8 === 0)
      .slice(0, 5)
      .map(item => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        date: item.dt_txt.split(' ')[0],
        tempHigh: Math.round(item.main.temp_max),
        tempLow: Math.round(item.main.temp_min),
        humidity: item.main.humidity,
        rainProb: Math.round((item.pop || 0) * 100),
        condition: item.weather[0]?.main || 'Sunny'
      }));

    return {
      district: districtInfo.name,
      coordinates: { lat, lng },
      current: currentMetrics,
      forecast: forecastDays
    };
  } catch (error) {
    console.error('❌ OpenWeatherMap API Error:', error.message);
    return getMockWeatherData(districtInfo.name);
  }
};

const getMockWeatherData = (districtName) => {
  const key = (districtName || 'coimbatore').toLowerCase().trim();
  const info = DISTRICT_COORDINATES[key] || DISTRICT_COORDINATES.coimbatore;
  const temp = info.defaultTemp;

  return {
    district: info.name,
    coordinates: { lat: info.lat, lng: info.lng },
    current: {
      date: new Date().toISOString().split('T')[0],
      temp: temp,
      tempMin: temp - 6,
      tempMax: temp + 2,
      humidity: 72,
      rainProbability: 20,
      windSpeed: 14,
      description: 'Partly Cloudy',
      icon: '02d'
    },
    forecast: [
      { day: 'Mon', date: '2026-08-03', tempHigh: temp + 1, tempLow: temp - 7, condition: 'Sunny', rainProb: 15 },
      { day: 'Tue', date: '2026-08-04', tempHigh: temp, tempLow: temp - 8, condition: 'Cloudy', rainProb: 35 },
      { day: 'Wed', date: '2026-08-05', tempHigh: temp - 2, tempLow: temp - 9, condition: 'Rain', rainProb: 75 },
      { day: 'Thu', date: '2026-08-06', tempHigh: temp + 1, tempLow: temp - 7, condition: 'Sunny', rainProb: 10 },
      { day: 'Fri', date: '2026-08-07', tempHigh: temp + 2, tempLow: temp - 6, condition: 'Clear Sky', rainProb: 5 }
    ]
  };
};

module.exports = {
  getForecast,
  DISTRICT_COORDINATES
};
