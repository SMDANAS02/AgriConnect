# AgriConnect REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Create a new user account (Farmer or Equipment Owner).
- **Request Body:**
  ```json
  {
    "name": "Karthik Raja",
    "email": "karthik@farmer.tn",
    "password": "SecurePassword123",
    "phone": "+919876543210",
    "role": "farmer",
    "location": "Coimbatore"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "token": "JWT_BEARER_TOKEN",
    "user": { "id": 1, "name": "Karthik Raja", "role": "farmer" }
  }
  ```

### `POST /auth/login`
Authenticate user and return JWT.
- **Request Body:**
  ```json
  {
    "email": "karthik@farmer.tn",
    "password": "SecurePassword123"
  }
  ```

---

## 2. Crop Disease Detection Endpoints

### `POST /disease/detect`
Upload leaf image for AI diagnosis (Requires Auth Header: `Bearer <token>`).
- **Content-Type:** `multipart/form-data`
- **Form Data Field:** `image` (File payload)
- **Response (200):**
  ```json
  {
    "success": true,
    "detection": {
      "id": 12,
      "detectedDisease": "Paddy Blast (Pyricularia oryzae)",
      "confidenceScore": 0.942,
      "imageUrl": "https://res.cloudinary.com/agriconnect/image/upload/v12345/leaf.jpg",
      "recommendedTreatment": "Apply Tricyclazole 75% WP @ 0.6 g/l of water. Ensure proper field drainage."
    }
  }
  ```

### `GET /disease/history`
Fetch history of AI detections for logged-in user.

---

## 3. Equipment Marketplace Endpoints

### `GET /equipment`
List available equipment with optional district filter & category filter.
- **Query Params:** `category=Tractor&location=Madurai`

### `GET /equipment/:id`
Get detailed equipment specifications, owner info, and reviews.

### `POST /equipment` (Equipment Owner Only)
List new equipment.
- **Request Body:**
  ```json
  {
    "name": "Mahindra 575 DI Tractor 45HP",
    "category": "Tractor",
    "description": "High performance 45 HP tractor with rotavator attachment.",
    "pricePerHour": 350.00,
    "pricePerDay": 2200.00,
    "locationLat": 11.0168,
    "locationLng": 76.9558,
    "images": ["https://cloudinary.com/tractor1.jpg"]
  }
  ```

### `POST /bookings`
Create equipment booking reservation.
- **Request Body:**
  ```json
  {
    "equipmentId": 1,
    "startDate": "2026-08-10T08:00:00Z",
    "endDate": "2026-08-12T18:00:00Z"
  }
  ```

---

## 4. Weather & Advisory Endpoints

### `GET /weather/advisory?district=Coimbatore`
Get hyperlocal weather forecast and tailored farming advisory.
- **Response (200):**
  ```json
  {
    "success": true,
    "district": "Coimbatore",
    "weather": { "temp": 31.2, "humidity": 78, "description": "Light rain" },
    "advisory": [
      "Moderate rain forecasted for next 48 hours. Postpone pesticide spraying for paddy crops.",
      "Ensure proper runoff channels in low-lying fields."
    ]
  }
  ```
