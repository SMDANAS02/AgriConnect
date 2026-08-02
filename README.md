# AgriConnect 🌾🚜⚡

> **Tagline:** Smart Farming for Modern India  
> **Target Audience:** Smallholder Farmers in Tamil Nadu, India  
> **Hackathon Timeline:** 8-Hour Production-Ready Build  

AgriConnect is a comprehensive full-stack Web Application engineered to empower Indian smallholder farmers through accessible AI crop diagnostics, a peer-to-peer farm equipment rental marketplace, and a hyperlocal weather-driven crop advisory system.

---

## 🌟 Key Features

1. **AI-Powered Crop Disease Detection**
   - Instant leaf photo upload & AI vision diagnosis using Hugging Face Inference API.
   - Immediate disease identification, confidence scoring, and tailored organic/chemical treatment recommendations in English & Tamil.
   
2. **Farm Equipment Rental Marketplace**
   - "Airbnb for Agriculture" connecting equipment owners with local farmers.
   - Rent tractors, harvesters, seed transplanters, and solar water pumps hourly or daily.
   - Razorpay test-mode integration for instant booking confirmations.

3. **Weather-Based Hyperlocal Crop Advisory**
   - Real-time OpenWeatherMap data tailored to Tamil Nadu farming districts (Coimbatore, Karur, Salem, Madurai, Thanjavur).
   - Automated crop advice based on temperature, rainfall, and humidity thresholds.

---

## 🏗 Project Architecture & Directory Layout

```
AgriConnect/
├── backend/            # Express.js REST API with Prisma ORM & PostgreSQL
├── frontend/           # React 18 + Vite + Tailwind CSS Single Page App
├── docs/               # Comprehensive Architecture, API, and Deployment Guides
├── database/           # PostgreSQL seeding scripts (Tamil Nadu regional dataset)
└── README.md
```

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS (`agri-*` custom palette), React Router v6, React Query, Axios, Lucide Icons
- **Backend:** Node.js 18, Express.js, JWT Authentication, bcrypt, Multer, Helmet, Rate Limiter
- **Database:** PostgreSQL hosted on Neon, Prisma ORM
- **Cloud APIs:** Hugging Face Inference API, OpenWeatherMap API, Cloudinary (Media storage), Razorpay (Payment Gateway - Test Mode)
- **Deployment Target:** Vercel (Frontend), Railway (Backend)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.x
- PostgreSQL database URL or Neon PostgreSQL instance

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update DATABASE_URL, JWT_SECRET, CLOUDINARY, and HUGGINGFACE keys in .env
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Database Seeding
```bash
# Execute seed SQL script on your PostgreSQL instance
psql -d <DATABASE_URL> -f ../database/seed.sql
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📚 Documentation Links
- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Specifications](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [UI & Workflow Specs](docs/SCREENSHOTS.md)

---

## 👥 Hackathon Team
Designed and developed for high-impact agricultural empowerment.
