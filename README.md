<div align="center">

<img src="https://img.shields.io/badge/Agriculture-AI%20Powered-22c55e?style=for-the-badge&labelColor=14532d" alt="AI Powered"/>
<img src="https://img.shields.io/badge/Built%20For-Smallholder%20Farmers-f59e0b?style=for-the-badge&labelColor=451a03" alt="Target"/>
<img src="https://img.shields.io/badge/Region-Tamil%20Nadu-3b82f6?style=for-the-badge&labelColor=1e1b4b" alt="Region"/>
<img src="https://img.shields.io/badge/Hackathon-8hr%20Production%20Build-e11d48?style=for-the-badge&labelColor=1a0a10" alt="Hackathon"/>

<br/><br/>

<a href="https://github.com/"><img src="https://img.shields.io/badge/React_18_%2B_Vite-61dafb?style=flat-square&logo=react&logoColor=white" alt="React"/></a>
<a href="https://github.com/"><img src="https://img.shields.io/badge/Express.js-8cc84b?style=flat-square&logo=node.js&logoColor=white" alt="Express"/></a>
<a href="https://img.shields.io/badge/"><img src="https://img.shields.io/badge/PostgreSQL_%2B_Prisma-336791?style=flat-square&logo=postgresql&logoColor=white" alt="Postgres"/></a>
<a href="https://github.com/"><img src="https://img.shields.io/badge/HuggingFace-ffcc00?style=flat-square&logo=huggingface&logoColor=black" alt="HF"/></a>
<a href="https://github.com/"><img src="https://img.shields.io/badge/Razorpay-0066ff?style=flat-square&logo=razorpay&logoColor=white" alt="Razorpay"/></a>
<a href="https://github.com/"><img src="https://img.shields.io/badge/OpenWeatherMap-e05d44?style=flat-square&logo=openweathermap&logoColor=white" alt="OWM"/></a>

<br/><br/>

<h1>AgriConnect</h1>

<h3><i>Smart Farming for Modern India</i></h3>

<b>AI Crop Diagnostics</b> · <b>Equipment Rental</b> · <b>Weather Advisory</b>

<br/>

<i>Empowering 78M+ Indian smallholder farmers through accessible technology.</i>

<br/><br/>

<a href="#-key-features"><img src="https://img.shields.io/badge/Features-blue?style=for-the-badge" alt="Features"/></a>
<a href="#-quick-start"><img src="https://img.shields.io/badge/Get_Started-green?style=for-the-badge" alt="Start"/></a>
<a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-purple?style=for-the-badge" alt="Arch"/></a>

</div>

---

## The Problem

> **70% of Indian farmers** are smallholders (under 2 hectares) who lack:
>
> - Timely crop disease diagnosis — losing **15–30% yield** annually
> - Affordable farm equipment — tractor rentals cost **₹800–1,500/hr**
> - Hyperlocal, actionable weather intelligence
>
> **AgriConnect bridges all three gaps in one platform.**

---

## Key Features

<table>
<tr>
<td width="33%" valign="top">

### AI Crop Disease Detection

```
Upload Leaf Photo
       ↓
HuggingFace Vision AI
       ↓
Disease + Confidence
       ↓
Treatment (EN + Tamil)
```

- Instant diagnosis via HF Inference API
- Confidence scoring with breakdown
- Bilingual: English & Tamil
- Organic & chemical remedies

</td>
<td width="33%" valign="top">

### Equipment Rental

```
Farmer needs tractor
       ↓
Browse local listings
       ↓
Razorpay (Test Mode)
       ↓
Booking Confirmed
```

- P2P "Airbnb for Agriculture"
- Tractors, harvesters, pumps
- Hourly & daily pricing
- Razorpay test-mode payments

</td>
<td width="33%" valign="top">

### Weather Crop Advisory

```
Select TN District
       ↓
Real-time Weather
       ↓
Threshold Analysis
       ↓
Automated Crop Advice
```

- Hyperlocal via OpenWeatherMap
- 5 Tamil Nadu farming districts
- Temp, rain, humidity alerts
- Crop recommendation engine

</td>
</tr>
</table>

---

## Architecture

```mermaid
graph LR
    subgraph FE["Frontend"]
        A[React 18 + Vite]
        B[Tailwind CSS]
    end

    subgraph BE["Backend"]
        C[Express.js + JWT]
        D[Prisma ORM]
    end

    subgraph EXT["External APIs"]
        E[HuggingFace]
        F[OpenWeatherMap]
        G[Razorpay]
    end

    subgraph DB["Data"]
        H[(PostgreSQL)]
    end

    A <-->|Axios| C
    C --> E
    C --> F
    C --> G
    D <--> H

    style FE fill:#f0fdf4,stroke:#22c55e,stroke-width:2px
    style BE fill:#fffbeb,stroke:#f59e0b,stroke-width:2px
    style EXT fill:#eff6ff,stroke:#3b82f6,stroke-width:2px
    style DB fill:#fdf2f8,stroke:#e11d48,stroke-width:2px
```

---

## Project Structure

<details>
<summary><b>Click to expand directory tree</b></summary>

```
AgriConnect/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── services/
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── seed.sql
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── SCREENSHOTS.md
└── README.md
```

</details>

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | `React 18` `Vite` `Tailwind CSS` `React Router v6` `React Query` `Axios` `Lucide Icons` |
| **Backend** | `Node.js 18` `Express.js` `JWT` `bcrypt` `Multer` `Helmet` `Rate Limiter` |
| **Database** | `PostgreSQL` (Neon) `Prisma ORM` |
| **AI / APIs** | `HuggingFace Inference` `OpenWeatherMap` `Cloudinary` `Razorpay` (test) |
| **Deploy** | `Vercel` (frontend) `Railway` (backend) |

---

## Quick Start

<img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white"/> &nbsp;
<img src="https://img.shields.io/badge/PostgreSQL-Required-336791?style=flat-square&logo=postgresql&logoColor=white"/> &nbsp;
<img src="https://img.shields.io/badge/API_Keys-9_Required-red?style=flat-square"/>

<details>
<summary><b>Required API Keys</b></summary>

| Key | Service |
|-----|---------|
| `DATABASE_URL` | PostgreSQL / Neon |
| `JWT_SECRET` | Token signing |
| `CLOUDINARY_CLOUD_NAME` | Media storage |
| `CLOUDINARY_API_KEY` | Cloudinary auth |
| `CLOUDINARY_API_SECRET` | Cloudinary auth |
| `HUGGINGFACE_API_KEY` | Vision model |
| `OPENWEATHERMAP_API_KEY` | Weather data |
| `RAZORPAY_KEY_ID` | Payments (test) |
| `RAZORPAY_KEY_SECRET` | Payments (test) |

</details>

### 1. Backend

```bash
git clone https://github.com/<your-org>/AgriConnect.git
cd AgriConnect/backend
npm install
cp .env.example .env
# Fill in API keys in .env
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Seed Database

```bash
psql -d $DATABASE_URL -f ../database/seed.sql
```

> Loads Tamil Nadu districts, crop data, equipment catalog, and weather thresholds.

### 3. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

| Service | Port |
|---------|------|
| Backend | `:5000` |
| Frontend | `:3000` |

---

## Tamil Nadu Coverage

| District | Key Crops | Weather Focus |
|----------|-----------|---------------|
| **Coimbatore** | Cotton, Maize, Turmeric | Temperature & humidity |
| **Karur** | Banana, Sugarcane, Rice | Rainfall patterns |
| **Salem** | Mango, Tapioca, Cotton | Heat stress monitoring |
| **Madurai** | Paddy, Chilli, Banana | Monsoon tracking |
| **Thanjavur** | Rice, Pulses | Flood & drought alerts |

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design & data flow |
| [API Specs](docs/API.md) | REST endpoints with examples |
| [Deployment](docs/DEPLOYMENT.md) | Vercel + Railway guide |
| [UI Specs](docs/SCREENSHOTS.md) | Mockups & user flows |

---

<div align="center">

<img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%20for%20Indian%20Farmers-e11d48?style=for-the-badge"/>

</div>
