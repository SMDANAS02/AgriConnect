const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const voiceRoutes = require('./routes/voiceRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Allow Vercel frontend & local dev
  credentials: true
}));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'AgriConnect Backend API is healthy and operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/voice', voiceRoutes); // Tamil Voice Assistant
app.use('/api/whatsapp', whatsappRoutes); // WhatsApp Disease Detection

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`🌾 AgriConnect Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
