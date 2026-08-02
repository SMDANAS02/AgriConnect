# AgriConnect Backend API Manual Testing Checklist

---

## 01. Authentication Module

### 1. Register Farmer
- **Endpoint**: `POST /api/auth/register`
- **Description**: Registers a new farmer account.
- **Request Body Example**:
  ```json
  {
    "name": "Karthikeyan R",
    "email": "karthi.farmer@example.com",
    "password": "Test123!",
    "phone": "9876543210",
    "role": "farmer",
    "location": "Coimbatore"
  }
  ```
- **Expected Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": { "user": { "id": 1, "email": "karthi.farmer@example.com" }, "token": "JWT_STRING" }
  }
  ```
- **Test Checklist**:
  - [ ] **Success Case**: Valid registration returns 201 Created and JWT token.
  - [ ] **Validation Error**: Missing `email` or short `password` returns 400 Bad Request.
  - [ ] **Conflict Error**: Existing email registration returns 400 Bad Request.

---

### 2. Register Equipment Owner
- **Endpoint**: `POST /api/auth/register`
- **Description**: Registers a new equipment owner account.
- **Request Body Example**:
  ```json
  {
    "name": "Senthil Kumar M",
    "email": "senthil.equipment@example.com",
    "password": "Test123!",
    "phone": "9876543211",
    "role": "equipment_owner",
    "location": "Salem"
  }
  ```
- **Expected Response**: `201 Created`
- **Test Checklist**:
  - [ ] **Success Case**: Owner account created with role `equipment_owner`.
  - [ ] **Validation Error**: Invalid role returns 400 Bad Request.

---

### 3. User Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticates existing user and returns JWT token.
- **Request Body Example**:
  ```json
  {
    "email": "karthi.farmer@example.com",
    "password": "Test123!"
  }
  ```
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: Valid credentials return 200 OK & new JWT token.
  - [ ] **Auth Error**: Incorrect password returns 401 Unauthorized.
  - [ ] **Auth Error**: Non-existent email returns 401 Unauthorized.

---

### 4. Get Current Profile
- **Endpoint**: `GET /api/auth/me`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: Valid token returns profile object without password hash.
  - [ ] **Auth Error**: Missing header or invalid token returns 401 Unauthorized.

---

### 5. Update Profile
- **Endpoint**: `PUT /api/auth/profile`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Request Body**:
  ```json
  {
    "name": "Karthikeyan Ramasamy",
    "location": "Coimbatore North"
  }
  ```
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: Profile fields updated successfully.
  - [ ] **Auth Error**: Missing JWT returns 401 Unauthorized.

---

## 02. Equipment Marketplace Module

### 6. Get All Equipment
- **Endpoint**: `GET /api/equipment`
- **Query Params**: `location`, `category`, `minPrice`, `maxPrice`, `availability`, `search`, `page`, `limit`
- **Expected Response**: `200 OK` with paginated list and calculated average ratings.
- **Test Checklist**:
  - [ ] **Success Case**: Returns all equipment list with owner info.
  - [ ] **Filtering**: Query parameter filters (e.g. `location=Coimbatore`) work accurately.

---

### 7. Get Equipment by ID
- **Endpoint**: `GET /api/equipment/:id`
- **Expected Response**: `200 OK` with full equipment details and reviews array.
- **Test Checklist**:
  - [ ] **Success Case**: Valid equipment ID returns details.
  - [ ] **Not Found**: Invalid ID returns 404 Not Found.

---

### 8. Create Equipment Listing
- **Endpoint**: `POST /api/equipment`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Role Requirement**: `equipment_owner`
- **Request Body**:
  ```json
  {
    "name": "Mahindra 575 DI Tractor",
    "category": "Tractor",
    "description": "45 HP, 4WD, perfect for paddy fields",
    "pricePerHour": 500,
    "pricePerDay": 3000
  }
  ```
- **Expected Response**: `201 Created`
- **Test Checklist**:
  - [ ] **Success Case**: Equipment Owner can post equipment.
  - [ ] **Authorization Error**: Non-owner role attempt returns 403 Forbidden.

---

### 9. Update Equipment Listing
- **Endpoint**: `PUT /api/equipment/:id`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: Owner can update their own equipment.
  - [ ] **Authorization Error**: Updating equipment belonging to another owner returns 403 Forbidden.

---

### 10. Delete Equipment Listing
- **Endpoint**: `DELETE /api/equipment/:id`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: Owner deletes equipment listing.
  - [ ] **Authorization Error**: Non-owner returns 403 Forbidden.

---

## 03. Bookings Module

### 11. Create Booking Reservation
- **Endpoint**: `POST /api/bookings`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Request Body**:
  ```json
  {
    "equipmentId": 1,
    "startDate": "2026-08-05T00:00:00Z",
    "endDate": "2026-08-08T00:00:00Z"
  }
  ```
- **Expected Response**: `201 Created`
- **Test Checklist**:
  - [ ] **Success Case**: Booking created and total price automatically calculated.
  - [ ] **Validation Error**: End date before start date returns 400 Bad Request.
  - [ ] **Conflict Error**: Overlapping date range booking returns 400 Bad Request.

---

### 12. Get Farmer / Owner Bookings
- **Endpoints**: `GET /api/bookings/farmer/:farmerId`, `GET /api/bookings/owner/:ownerId`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: Returns relevant bookings list.
  - [ ] **Authorization Error**: Accessing another user's bookings returns 403 Forbidden.

---

### 13. Confirm / Cancel / Complete Booking
- **Endpoints**:
  - `PUT /api/bookings/:id/confirm`
  - `PUT /api/bookings/:id/cancel`
  - `PUT /api/bookings/:id/complete`
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: Equipment owner confirms booking, changing equipment status to `booked`.
  - [ ] **Success Case**: Cancel frees equipment status back to `available`.

---

## 04. AI Disease Detection Module

### 14. Detect Crop Disease
- **Endpoint**: `POST /api/disease/detect`
- **Header**: `Authorization: Bearer {{JWT_TOKEN}}`
- **Request Body**: Form Data with `image` file or JSON `imageUrl`.
- **Expected Response**: `200 OK` with disease name, confidence score, and treatment.
- **Test Checklist**:
  - [ ] **Success Case**: AI detection returns prediction and treatment advice.
  - [ ] **Auth Error**: Missing JWT returns 401 Unauthorized.

---

### 15. Get Disease History & Crop Database
- **Endpoints**: `GET /api/disease/history`, `GET /api/diseases`
- **Test Checklist**:
  - [ ] **Success Case**: History returns user's past detections.
  - [ ] **Success Case**: Public crop database search returns matching plant diseases.

---

## 05. Weather Advisory Module

### 16. Weather Forecast & Crop Advisory & Crop Calendar
- **Endpoints**:
  - `GET /api/weather/forecast?district=Coimbatore`
  - `GET /api/weather/advisory?district=Salem&cropType=Paddy`
  - `GET /api/weather/calendar?district=Karur`
- **Expected Response**: `200 OK`
- **Test Checklist**:
  - [ ] **Success Case**: 5-day weather forecast returned.
  - [ ] **Success Case**: Rain and humidity advisory recommendations generated.
  - [ ] **Success Case**: Tamil Nadu seasonal crop calendar returned.
