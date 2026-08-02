# AgriConnect Architecture & System Specification

## 1. System Overview

AgriConnect follows a modern decoupled client-server architecture built for low-latency responsiveness and accessibility for farmers in Tamil Nadu.

```
                    ┌─────────────────────────┐
                    │    React 18 Frontend    │
                    │   (Vite + Tailwind)     │
                    └────────────┬────────────┘
                                 │ HTTP / REST API
                                 ▼
                    ┌─────────────────────────┐
                    │    Node/Express Server  │
                    │ (JWT, Multer, Helmet)   │
                    └────┬───────┬───────┬────┘
                         │       │       │
       ┌─────────────────┘       │       └─────────────────┐
       ▼                         ▼                         ▼
┌──────────────┐       ┌──────────────────┐      ┌──────────────────┐
│ PostgreSQL   │       │ External Cloud   │      │ AI Vision Engine │
│  (Neon DB)   │       │ Services         │      │ (Hugging Face)   │
└──────────────┘       │  • Cloudinary    │      └──────────────────┘
                       │  • OpenWeather   │
                       │  • Razorpay      │
                       └──────────────────┘
```

---

## 2. Component Architecture

### 2.1 Backend Modules
- **Authentication Service**: Issue JWT tokens upon bcrypt password verification.
- **Disease Diagnostics Module**: Receives uploaded leaf image via Multer -> Cloudinary URL -> Hugging Face Inference API -> Parses confidence & maps to Tamil Nadu treatment guidelines.
- **Marketplace Module**: Manages Equipment CRUD, location filtering, and double-booking prevention.
- **Payment & Booking Workflow**: Handles Razorpay order creation, payment signature verification, and booking state transitions (`pending` -> `confirmed`).
- **Weather Advisory Engine**: Queries OpenWeatherMap API for district coordinates (Coimbatore, Karur, Salem, Madurai, Thanjavur) and generates automated farming recommendations.

### 2.2 Database ER Model (Prisma ORM)
```
  +--------------+         1:N          +------------------+
  |     User     | -------------------> |    Equipment     |
  +--------------+                      +------------------+
    │        │ 1:N                        │ 1:N
    │        └────────────────────────┐   │
    │ 1:N                             ▼   ▼
    │                           +------------------+
    │                           |     Booking      |
    │                           +------------------+
    ▼                                     │ 1:1
  +--------------+                        ▼
  | AIDetection  |                      +------------------+
  +--------------+                      |      Review      |
                                        +------------------+
```

---

## 3. Data Flow Pathways

1. **Leaf Disease Diagnosis Workflow:**
   Farmer uploads photo -> Express Multer receives payload -> Cloudinary stores image & returns URL -> Hugging Face analyzes image tensor -> Controller matches disease entity in `CropDisease` database -> Combines AI output + DB treatment advice -> Returns response to React client.

2. **Equipment Booking Workflow:**
   Farmer chooses dates & equipment -> Express calculates pricing -> Razorpay creates order ID -> Client completes test payment -> Express verifies cryptographic HMAC signature -> Booking status set to `confirmed` in PostgreSQL.

---

## 4. Tamil Nadu Regional Localization Strategy
- District geo-coordinates hardcoded/mapped for precision weather fetching (e.g. Coimbatore 11.0168° N, 76.9558° E; Madurai 9.9252° N, 78.1198° E).
- Seed disease repository tailored for regional crops: Paddy (Rice), Sugarcane, Cotton, Banana, Groundnut.
- Dual language support in treatment recommendations (English + Tamil terminology).
