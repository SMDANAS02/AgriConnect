-- AgriConnect PostgreSQL Seed Data
-- Regional Data tailored for Tamil Nadu Farmers (Coimbatore, Karur, Salem, Madurai, Thanjavur)

-- 1. USERS (Farmers & Equipment Owners)
-- Password for all test users is: Password123 (hashed representation)
INSERT INTO "User" ("id", "name", "email", "password", "phone", "role", "location", "createdAt") VALUES
(1, 'Muthusamy K', 'muthu.salem@agriconnect.tn', '$2a$10$wQ7rT80N8J5q8H71v8cXe.2A5/y6K2v8lW1z6e8h9i0j1k2l3m4n5', '+919842101234', 'equipment_owner', 'Salem', NOW()),
(2, 'Ponnusamy R', 'ponnu.coimbatore@agriconnect.tn', '$2a$10$wQ7rT80N8J5q8H71v8cXe.2A5/y6K2v8lW1z6e8h9i0j1k2l3m4n5', '+919443212345', 'farmer', 'Coimbatore', NOW()),
(3, 'Selvakumar V', 'selva.karur@agriconnect.tn', '$2a$10$wQ7rT80N8J5q8H71v8cXe.2A5/y6K2v8lW1z6e8h9i0j1k2l3m4n5', '+919789012345', 'equipment_owner', 'Karur', NOW()),
(4, 'Ramasamy M', 'rama.madurai@agriconnect.tn', '$2a$10$wQ7rT80N8J5q8H71v8cXe.2A5/y6K2v8lW1z6e8h9i0j1k2l3m4n5', '+919629012345', 'farmer', 'Madurai', NOW()),
(5, 'Anbarasan S', 'anbu.thanjavur@agriconnect.tn', '$2a$10$wQ7rT80N8J5q8H71v8cXe.2A5/y6K2v8lW1z6e8h9i0j1k2l3m4n5', '+919944012345', 'equipment_owner', 'Thanjavur', NOW());

-- Reset sequence for User table
ALTER SEQUENCE "User_id_seq" RESTART WITH 6;

-- 2. EQUIPMENT LISTINGS
INSERT INTO "Equipment" ("id", "ownerId", "name", "category", "description", "pricePerHour", "pricePerDay", "pricePerWeek", "locationLat", "locationLng", "availabilityStatus", "rating", "images", "createdAt") VALUES
(1, 1, 'Mahindra 575 DI Tractor 45HP', 'Tractor', 'Includes 36-blade rotavator attachment. Excellent for wetland paddy tilling in Salem & Attur belt.', 350.00, 2200.00, 12000.00, 11.6643, 78.1460, 'available', 4.8, ARRAY['https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&q=80&w=800'], NOW()),
(2, 3, 'Kubota Paddy Transplanter 4-Row', 'Transplanter', 'Self-propelled walking type transplanter ideal for Cauvery basin rice fields in Karur and Kulithalai.', 400.00, 2600.00, 15000.00, 10.9601, 78.0766, 'available', 4.9, ARRAY['https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800'], NOW()),
(3, 1, 'Swaraj 744 FE Tractor with Cultivator', 'Tractor', 'Heavy duty 48 HP tractor suitable for dryland plowing and groundnut harvest preparation in Salem region.', 320.00, 2000.00, 11000.00, 11.6643, 78.1460, 'available', 4.7, ARRAY['https://images.unsplash.com/photo-1530267981608-bc70a316081e?auto=format&fit=crop&q=80&w=800'], NOW()),
(4, 5, 'Class Combined Harvester (Paddy/Corn)', 'Harvester', 'High speed track harvester for fast paddy harvesting in Thanjavur delta district. Reduces grain loss.', 900.00, 6500.00, 38000.00, 10.7870, 79.1378, 'available', 5.0, ARRAY['https://images.unsplash.com/photo-1595839099955-47e10c7104b2?auto=format&fit=crop&q=80&w=800'], NOW()),
(5, 3, '5HP Solar Water Pump with Trailer', 'Irrigation', 'Portable solar powered water pumping system. Great for drip irrigation in Pollachi & Coimbatore farms.', 150.00, 900.00, 5000.00, 11.0168, 76.9558, 'available', 4.6, ARRAY['https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=800'], NOW());

-- Reset sequence for Equipment table
ALTER SEQUENCE "Equipment_id_seq" RESTART WITH 6;

-- 3. BOOKINGS
INSERT INTO "Booking" ("id", "equipmentId", "farmerId", "startDate", "endDate", "totalPrice", "paymentStatus", "bookingStatus", "createdAt") VALUES
(1, 1, 2, NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days', 4400.00, 'completed', 'completed', NOW() - INTERVAL '6 days'),
(2, 2, 4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 2600.00, 'completed', 'completed', NOW() - INTERVAL '3 days'),
(3, 4, 2, NOW() + INTERVAL '2 days', NOW() + INTERVAL '4 days', 13000.00, 'completed', 'confirmed', NOW() - INTERVAL '1 day');

-- Reset sequence for Booking table
ALTER SEQUENCE "Booking_id_seq" RESTART WITH 4;

-- 4. REVIEWS
INSERT INTO "Review" ("id", "bookingId", "userId", "rating", "comment", "createdAt") VALUES
(1, 1, 2, 5, 'Excellent tractor performance! Muthusamy delivered the tractor on time with full fuel. Highly recommended for Salem farmers.', NOW() - INTERVAL '2 days'),
(2, 2, 4, 5, 'Saved us 4 days of labor costs for paddy transplanting in Madurai. Clean machine.', NOW() - INTERVAL '1 day');

-- Reset sequence for Review table
ALTER SEQUENCE "Review_id_seq" RESTART WITH 3;

-- 5. CROP DISEASE DATABASE
INSERT INTO "CropDisease" ("id", "cropName", "diseaseName", "symptoms", "treatment", "preventiveMeasures", "imageUrl") VALUES
(1, 'Rice / Paddy (நெல்)', 'Paddy Blast (Pyricularia oryzae)', 'Spindle-shaped lesions with grey centres on leaves, neck rot, and node blast.', 'Spray Tricyclazole 75% WP @ 0.6 g/litre or Isoprothiolane 40% EC @ 1.5 ml/litre of water.', 'Use resistant varieties like CO 47, ADT 43. Avoid excessive nitrogen fertilizer applications.', 'https://images.unsplash.com/photo-1536053464738-4e892c9060b9?auto=format&fit=crop&q=80&w=800'),
(2, 'Groundnut (நிலக்கடலை)', 'Tikka Leaf Spot (Cercospora arachidicola)', 'Circular dark brown to black spots surrounded by a yellow halo on leaves.', 'Spray Carbendazim 12% + Mancozeb 63% WP (SAAF) @ 2g/litre of water.', 'Maintain crop rotation with maize or sorghum. Destroy crop residue after harvest.', 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19655?auto=format&fit=crop&q=80&w=800'),
(3, 'Sugarcane (கரும்பு)', 'Red Rot (Colletotrichum falcatum)', 'Yellowing and drying of leaves from margin to center. Stalk exhibits red lesions with white cross bands inside.', 'Dip setts in Carbendazim 0.1% solution before planting. Remove and destroy infected clumps.', 'Plant disease-free setts from nursery. Avoid field flooding from infected to healthy fields.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'),
(4, 'Cotton (பருத்தி)', 'Bacterial Blight (Xanthomonas citri)', 'Water-soaked angular spots on leaves, veins turning black, boll rot.', 'Spray Copper Oxychloride 50% WP @ 2.5g + Streptocycline @ 0.1g per litre of water.', 'Delint seed with concentrated sulphuric acid before sowing.', 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=800');

-- Reset sequence for CropDisease table
ALTER SEQUENCE "CropDisease_id_seq" RESTART WITH 5;

-- 6. SAMPLE AI DETECTIONS
INSERT INTO "AIDetection" ("id", "userId", "uploadedImageUrl", "detectedDisease", "confidenceScore", "recommendedTreatment", "createdAt") VALUES
(1, 2, 'https://res.cloudinary.com/agriconnect/image/upload/v1/leaf_paddy_blast.jpg', 'Paddy Blast (Pyricularia oryzae)', 0.945, 'Spray Tricyclazole 75% WP @ 0.6 g/litre of water.', NOW() - INTERVAL '1 day'),
(2, 4, 'https://res.cloudinary.com/agriconnect/image/upload/v1/leaf_groundnut_tikka.jpg', 'Tikka Leaf Spot (Cercospora arachidicola)', 0.912, 'Spray Carbendazim 12% + Mancozeb 63% WP @ 2g/litre of water.', NOW());

-- Reset sequence for AIDetection table
ALTER SEQUENCE "AIDetection_id_seq" RESTART WITH 3;
