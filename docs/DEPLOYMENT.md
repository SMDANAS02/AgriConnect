# AgriConnect Production Deployment Guide

This guide details deploying **AgriConnect** on modern serverless & cloud platforms (Vercel, Railway, Neon PostgreSQL, Cloudinary, Razorpay, Hugging Face).

---

## 1. Database Deployment (Neon PostgreSQL)

1. Create a project at [Neon Tech](https://neon.tech).
2. Create a database named `agriconnect`.
3. Copy the Pooled Connection String (e.g. `postgresql://user:pass@ep-cool-pool-123456.us-east-2.aws.neon.tech/agriconnect?sslmode=require`).
4. Apply Prisma migrations from local backend:
   ```bash
   cd backend
   DATABASE_URL="<NEON_DB_URL>" npx prisma db push
   ```
5. Seed database using `psql` or Prisma Studio.

---

## 2. Backend Deployment (Railway)

1. Connect your GitHub repository to [Railway](https://railway.app).
2. Create a new service pointing to `/backend`.
3. Set Environment Variables in Railway Dashboard:
   - `PORT`: `5000`
   - `DATABASE_URL`: `<NEON_DB_URL>`
   - `JWT_SECRET`: `<RANDOM_SECRET_KEY>`
   - `CLOUDINARY_CLOUD_NAME`: `<YOUR_CLOUD_NAME>`
   - `CLOUDINARY_API_KEY`: `<YOUR_API_KEY>`
   - `CLOUDINARY_API_SECRET`: `<YOUR_API_SECRET>`
   - `HUGGINGFACE_API_KEY`: `<YOUR_HF_TOKEN>`
   - `OPENWEATHER_API_KEY`: `<YOUR_OPENWEATHER_KEY>`
   - `RAZORPAY_KEY_ID`: `<YOUR_RAZORPAY_KEY>`
   - `RAZORPAY_KEY_SECRET`: `<YOUR_RAZORPAY_SECRET>`
4. Deploy service and copy the generated Railway public domain URL (e.g. `https://agriconnect-api.up.railway.app`).

---

## 3. Frontend Deployment (Vercel)

1. Import your GitHub repository into [Vercel](https://vercel.com).
2. Set Root Directory to `frontend`.
3. Framework Preset: `Vite`.
4. Configure Build Command: `npm run build`, Output Directory: `dist`.
5. Set Environment Variables:
   - `VITE_API_BASE_URL`: `https://agriconnect-api.up.railway.app/api`
   - `VITE_RAZORPAY_KEY_ID`: `<YOUR_RAZORPAY_KEY>`
6. Trigger Deployment.

---

## 4. Post-Deployment Verification
1. Access Vercel URL.
2. Test User Registration & Login.
3. Test uploading a sample leaf photo (e.g. rice leaf blast) to verify Hugging Face + Cloudinary flow.
4. Test filtering equipment in Coimbatore / Salem districts.
