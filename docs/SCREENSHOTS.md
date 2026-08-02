# AgriConnect UI & Workflow Showcase

This document outlines the visual layout specifications and user interface architecture for **AgriConnect**.

---

## 1. Landing Page & Hero Section
- **Theme**: Deep Forest Green (`agri-900`) & Emerald Accents (`agri-500`).
- **Hero Title**: "Smart Farming for Modern India" (Dual Language Toggle: English / தமிழ்).
- **Core Action Cards**:
  1. 🌿 **AI Leaf Doctor**: Drag-and-drop crop leaf diagnosis.
  2. 🚜 **Equipment Rental**: Search & rent tractors, harvesters & rotavators.
  3. 🌤 **Crop Advisory**: Hyperlocal weather & pest alerts for Tamil Nadu.

---

## 2. AI Crop Disease Detection Interface
- **Dropzone**: Upload leaf photo with drag-and-drop file support.
- **Progress Animation**: Uploading -> Analyzing Tensor Data -> Matching Diagnostic Database.
- **Results Modal / Card**:
  - Identified Disease (e.g. *Paddy Blast / Pyricularia oryzae*)
  - Confidence Score Bar (e.g. 94.2% accuracy)
  - Recommended Treatment Plan (Organic Neem Oil spray & Chemical Fungicide dosages)
  - Regional Tamil guidance.

---

## 3. Equipment Rental Marketplace
- **Filter Bar**: District Selection (Coimbatore, Karur, Salem, Madurai, Thanjavur), Category (Tractors, Harvesters, Irrigation, Tillage), Daily Price Slider.
- **Equipment Card**:
  - Image carousel
  - Price per hour / per day (₹ / day)
  - Equipment Owner Badge & Star Rating
  - "Book Now" CTA with date picker modal.

---

## 4. Hyperlocal Weather & Farming Advisory Dashboard
- **Current District Weather Widget**: Temperature, Humidity, Wind speed, Rainfall probability.
- **Agricultural Alerts**: High humidity alert -> warnings for fungal crop risks in Paddy & Groundnut fields.
