# AgriConnect Backend API Manual Testing Guide

Follow this step-by-step guide to perform comprehensive end-to-end testing of all AgriConnect REST APIs using Postman.

---

## Step 1: Start the Backend Server

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd e:\Projects\Placement_Project\AgriConnect\backend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Confirm server startup output:
   ```text
   🌾 AgriConnect Server running on port 5000 in development mode
   ```

---

## Step 2: Import Postman Collection & Setup Environment

1. Launch **Postman**.
2. Click **Import** (top-left) and select `backend/AgriConnect_API.postman_collection.json`.
3. Verify that the collection `AgriConnect API` appears in your left sidebar with 5 folders:
   - `01_Authentication`
   - `02_Equipment_Marketplace`
   - `03_Bookings`
   - `04_AI_Disease_Detection`
   - `05_Weather_Advisory`
4. Set the collection or environment variable:
   - `BASE_URL` = `http://localhost:5000/api`

---

## Step 3: Test Authentication Flow

1. Open request: **`01_Authentication` -> `Register Farmer`**.
   - Click **Send**.
   - Expected Output: `201 Created`. The test script will automatically save `JWT_TOKEN` to your environment/collection variables.
2. Open request: **`01_Authentication` -> `Get Profile`**.
   - Click **Send**.
   - Expected Output: `200 OK` returning profile details for `Karthikeyan R`.
3. Open request: **`01_Authentication` -> `Login`**.
   - Click **Send**.
   - Expected Output: `200 OK` with a newly generated JWT token.

---

## Step 4: Test Equipment Marketplace APIs

1. Open request: **`01_Authentication` -> `Register Equipment Owner`**.
   - Click **Send** to register `Senthil Kumar M` as an `equipment_owner`.
2. Login as the owner to capture their JWT token.
3. Open request: **`02_Equipment_Marketplace` -> `Create Equipment`**.
   - Use JSON sample:
     ```json
     {
       "name": "Mahindra 575 DI Tractor",
       "category": "Tractor",
       "description": "45 HP, 4WD, perfect for paddy fields",
       "pricePerHour": 500,
       "pricePerDay": 3000,
       "pricePerWeek": 18000,
       "locationLat": 11.0168,
       "locationLng": 76.9558,
       "availabilityStatus": "available"
     }
     ```
   - Click **Send**. Expected Output: `201 Created`.
4. Open request: **`02_Equipment_Marketplace` -> `Get All Equipment`**.
   - Click **Send**. Verify the newly created tractor appears in the response array with calculated ratings.
5. Open request: **`02_Equipment_Marketplace` -> `Get Equipment by ID`** (`GET /api/equipment/1`).
   - Click **Send**. Verify owner details and reviews are returned.

---

## Step 5: Test Booking APIs

1. Ensure you are logged in as a `farmer`.
2. Open request: **`03_Bookings` -> `Create Booking`**.
   - Request Body:
     ```json
     {
       "equipmentId": 1,
       "startDate": "2026-08-05T00:00:00Z",
       "endDate": "2026-08-08T00:00:00Z"
     }
     ```
   - Click **Send**. Expected Output: `201 Created`.
   - Verify `totalPrice` = `3 days * 3000 = 9000.00`.
3. Open request: **`03_Bookings` -> `Get Farmer Bookings`**.
   - Click **Send**. Verify the reservation appears under `pending` status.
4. Login as the `equipment_owner`.
5. Open request: **`03_Bookings` -> `Confirm Booking`**.
   - Click **Send**. Verify `bookingStatus` updates to `confirmed` and equipment `availabilityStatus` changes to `booked`.

---

## Step 6: Test AI Disease Detection APIs

1. Ensure JWT token is set in headers.
2. Open request: **`04_AI_Disease_Detection` -> `Detect Disease`**.
   - Select **Body -> form-data** and select a leaf image file, or provide `cropName`: `"Paddy / Rice"`.
   - Click **Send**.
   - Expected Output: `200 OK` with diagnosis (e.g. `Paddy Blast`), confidence score (`~94%`), symptoms, and recommended treatment.
3. Open request: **`04_AI_Disease_Detection` -> `Get Detection History`**.
   - Click **Send**. Verify your diagnosis log is saved with date timestamp.

---

## Step 7: Test Weather Advisory & Crop Calendar APIs

1. Open request: **`05_Weather_Advisory` -> `Get Weather Forecast`** (`GET /api/weather/forecast?district=Coimbatore`).
   - Click **Send**. Verify 5-day forecast data with temperature, rain probability, and humidity.
2. Open request: **`05_Weather_Advisory` -> `Get Crop Advisory`** (`GET /api/weather/advisory?district=Salem&cropType=Paddy`).
   - Click **Send**. Verify automated weather-driven farming recommendations.
3. Open request: **`05_Weather_Advisory` -> `Get Crop Calendar`** (`GET /api/weather/calendar?district=Karur`).
   - Click **Send**. Verify Tamil Nadu crop seasons (Kuruvai, Samba, etc.).

---

## Step 8: Test Error Handling & Edge Cases

1. **Duplicate Registration**: Send `POST /api/auth/register` with `karthi.farmer@example.com` again -> Expect `400 Bad Request` ("User with this email already exists").
2. **Invalid Password**: Send `POST /api/auth/login` with wrong password -> Expect `401 Unauthorized`.
3. **Missing Auth Header**: Call `GET /api/auth/me` without Bearer token -> Expect `401 Unauthorized` ("Authentication failed: Bearer token missing").
4. **Role Authorization Guard**: Try creating equipment (`POST /api/equipment`) with a `farmer` JWT -> Expect `403 Forbidden` ("Role 'farmer' is not authorized to access this resource").
5. **Invalid Date Range**: Send `POST /api/bookings` with `endDate` before `startDate` -> Expect `400 Bad Request` ("End date must be after start date").
