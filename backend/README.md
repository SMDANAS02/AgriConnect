# AgriConnect Backend API

Express.js REST API providing AI Crop Disease Classification, Equipment Rental Marketplace backend services, and Weather Advisories.

## 🚀 Setup & Execution

1. Install Dependencies:
   ```bash
   npm install
   ```

2. Environment Setup:
   ```bash
   cp .env.example .env
   # Edit database connection and cloud keys
   ```

3. Prisma Database Setup:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run Development Server:
   ```bash
   npm run dev
   ```

Server will run on `http://localhost:5000`.

## 📁 Architecture Overview
- `src/controllers`: Request handlers for Auth, Disease, Equipment, Weather.
- `src/routes`: Express routing modules.
- `src/services`: Integration handlers (Hugging Face, OpenWeather, Cloudinary, Razorpay).
- `src/middleware`: JWT authentication, error handling, file uploads.
- `src/prisma`: Database access via Prisma Client.
