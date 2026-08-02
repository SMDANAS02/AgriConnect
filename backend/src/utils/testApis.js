const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting AgriConnect API Automated Verification Suite...\n');
  let testCount = 0;
  let passedCount = 0;

  const testEndpoint = async (name, fn) => {
    testCount++;
    try {
      await fn();
      passedCount++;
      console.log(`✅ [PASS] ${name}`);
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.response?.data || err.message);
    }
  };

  // Test 1: Health Endpoint
  await testEndpoint('GET /api/health', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.data.status !== 'UP') throw new Error('Health status is not UP');
  });

  // Test 2: User Registration
  let testToken = '';
  let userId = null;
  const testEmail = `test_farmer_${Date.now()}@agriconnect.in`;

  await testEndpoint('POST /api/auth/register', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Murugan Farmer',
      email: testEmail,
      password: 'password123',
      phone: '9876543210',
      role: 'farmer',
      location: 'Coimbatore'
    });
    if (!res.data.success || !res.data.data.token) throw new Error('Registration failed');
    testToken = res.data.data.token;
    userId = res.data.data.user.id;
  });

  // Test 3: User Login
  await testEndpoint('POST /api/auth/login', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    if (!res.data.success || !res.data.data.token) throw new Error('Login failed');
  });

  // Test 4: Protected Profile (GET /api/auth/me)
  await testEndpoint('GET /api/auth/me (JWT Protected)', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${testToken}` }
    });
    if (res.data.data.user.email !== testEmail) throw new Error('Profile mismatch');
  });

  // Test 5: Equipment Marketplace Listings
  let firstEquipmentId = 1;
  await testEndpoint('GET /api/equipment', async () => {
    const res = await axios.get(`${BASE_URL}/equipment`);
    if (!res.data.success || !Array.isArray(res.data.data.equipment)) throw new Error('Equipment list invalid');
    if (res.data.data.equipment.length > 0) {
      firstEquipmentId = res.data.data.equipment[0].id;
      console.log(`   ℹ️ Found equipment ID: ${firstEquipmentId} (${res.data.data.equipment[0].name})`);
    }
  });

  // Test 6: Equipment Detail
  await testEndpoint('GET /api/equipment/:id', async () => {
    const res = await axios.get(`${BASE_URL}/equipment/${firstEquipmentId}`);
    if (!res.data.success || !res.data.data.equipment) throw new Error('Equipment detail invalid');
  });

  // Test 7: Create Booking (JWT Protected)
  await testEndpoint('POST /api/bookings (JWT Protected)', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 3);

    const res = await axios.post(
      `${BASE_URL}/bookings`,
      {
        equipmentId: firstEquipmentId,
        startDate: tomorrow.toISOString(),
        endDate: nextDay.toISOString()
      },
      { headers: { Authorization: `Bearer ${testToken}` } }
    );
    if (!res.data.success || !res.data.data.booking) throw new Error('Booking creation failed');
  });

  // Test 8: AI Disease Diagnosis
  await testEndpoint('POST /api/disease/detect (JWT Protected)', async () => {
    const res = await axios.post(
      `${BASE_URL}/disease/detect`,
      {
        cropName: 'Paddy / Rice',
        imageUrl: 'https://images.unsplash.com/photo-1536053464738-4e892c9060b9?auto=format&fit=crop&q=80&w=800'
      },
      { headers: { Authorization: `Bearer ${testToken}` } }
    );
    if (!res.data.success || !res.data.data.detectedDisease) throw new Error('AI Diagnosis failed');
  });

  // Test 9: Weather Forecast API
  await testEndpoint('GET /api/weather/forecast', async () => {
    const res = await axios.get(`${BASE_URL}/weather/forecast?district=Coimbatore`);
    if (!res.data.success || !res.data.data.forecast) throw new Error('Weather forecast invalid');
  });

  // Test 10: Crop Advisory API
  await testEndpoint('GET /api/weather/advisory', async () => {
    const res = await axios.get(`${BASE_URL}/weather/advisory?district=Salem&cropType=Paddy`);
    if (!res.data.success || !Array.isArray(res.data.data.recommendations)) throw new Error('Crop advisory invalid');
  });

  // Test 11: Crop Diseases Knowledge Base
  await testEndpoint('GET /api/diseases', async () => {
    const res = await axios.get(`${BASE_URL}/diseases`);
    if (!res.data.success || !Array.isArray(res.data.data.diseases)) throw new Error('Crop diseases list invalid');
  });

  console.log(`\n🎉 Verification Complete: ${passedCount}/${testCount} API Endpoints Passed Successfully!`);
}

runTests();
