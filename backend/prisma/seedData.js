const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const VERIFIED_IMAGES = {
  Tractor: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?w=800&auto=compress&cs=tinysrgb',
  Harvester: 'https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?w=800&auto=compress&cs=tinysrgb',
  Transplanter: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?w=800&auto=compress&cs=tinysrgb',
  Irrigation: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?w=800&auto=compress&cs=tinysrgb',
  Pump: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?w=800&auto=compress&cs=tinysrgb',
  Plough: 'https://images.pexels.com/photos/2165924/pexels-photo-2165924.jpeg?w=800&auto=compress&cs=tinysrgb',
  Cultivator: 'https://images.pexels.com/photos/2165924/pexels-photo-2165924.jpeg?w=800&auto=compress&cs=tinysrgb',
  default: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?w=800&auto=compress&cs=tinysrgb'
};

async function main() {
  console.log('🌱 Seeding AgriConnect Database via Prisma Client...');

  const hashedPassword = await bcrypt.hash('Password123', 10);

  // 1. Seed Users
  const user1 = await prisma.user.upsert({
    where: { email: 'muthu.salem@agriconnect.tn' },
    update: {},
    create: {
      name: 'Muthusamy K',
      email: 'muthu.salem@agriconnect.tn',
      password: hashedPassword,
      phone: '+919842101234',
      role: 'equipment_owner',
      location: 'Salem'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'ponnu.coimbatore@agriconnect.tn' },
    update: {},
    create: {
      name: 'Ponnusamy R',
      email: 'ponnu.coimbatore@agriconnect.tn',
      password: hashedPassword,
      phone: '+919443212345',
      role: 'farmer',
      location: 'Coimbatore'
    }
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'selva.karur@agriconnect.tn' },
    update: {},
    create: {
      name: 'Selvakumar V',
      email: 'selva.karur@agriconnect.tn',
      password: hashedPassword,
      phone: '+919789012345',
      role: 'equipment_owner',
      location: 'Karur'
    }
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'rama.madurai@agriconnect.tn' },
    update: {},
    create: {
      name: 'Ramasamy M',
      email: 'rama.madurai@agriconnect.tn',
      password: hashedPassword,
      phone: '+919629012345',
      role: 'farmer',
      location: 'Madurai'
    }
  });

  const user5 = await prisma.user.upsert({
    where: { email: 'anbu.thanjavur@agriconnect.tn' },
    update: {},
    create: {
      name: 'Anbarasan S',
      email: 'anbu.thanjavur@agriconnect.tn',
      password: hashedPassword,
      phone: '+919944012345',
      role: 'equipment_owner',
      location: 'Thanjavur'
    }
  });

  console.log('✅ Users seeded successfully');

  // 2. Seed Equipment
  const eqCount = await prisma.equipment.count();
  if (eqCount === 0) {
    await prisma.equipment.createMany({
      data: [
        {
          ownerId: user1.id,
          name: 'Mahindra 575 DI Tractor 45HP',
          category: 'Tractor',
          description: 'Includes 36-blade rotavator attachment. Excellent for wetland paddy tilling in Salem & Attur belt.',
          pricePerHour: 350.0,
          pricePerDay: 2200.0,
          pricePerWeek: 12000.0,
          locationLat: 11.6643,
          locationLng: 78.146,
          availabilityStatus: 'available',
          rating: 4.8,
          images: [VERIFIED_IMAGES.Tractor]
        },
        {
          ownerId: user3.id,
          name: 'Kubota Paddy Transplanter 4-Row',
          category: 'Transplanter',
          description: 'Self-propelled walking type transplanter ideal for Cauvery basin rice fields in Karur and Kulithalai.',
          pricePerHour: 400.0,
          pricePerDay: 2600.0,
          pricePerWeek: 15000.0,
          locationLat: 10.9601,
          locationLng: 78.0766,
          availabilityStatus: 'available',
          rating: 4.9,
          images: [VERIFIED_IMAGES.Transplanter]
        },
        {
          ownerId: user1.id,
          name: 'Swaraj 744 FE Tractor with Cultivator',
          category: 'Tractor',
          description: 'Heavy duty 48 HP tractor suitable for dryland plowing and groundnut harvest preparation in Salem region.',
          pricePerHour: 320.0,
          pricePerDay: 2000.0,
          pricePerWeek: 11000.0,
          locationLat: 11.6643,
          locationLng: 78.146,
          availabilityStatus: 'available',
          rating: 4.7,
          images: [VERIFIED_IMAGES.Tractor]
        },
        {
          ownerId: user5.id,
          name: 'Class Combined Harvester (Paddy/Corn)',
          category: 'Harvester',
          description: 'High speed track harvester for fast paddy harvesting in Thanjavur delta district. Reduces grain loss.',
          pricePerHour: 900.0,
          pricePerDay: 6500.0,
          pricePerWeek: 38000.0,
          locationLat: 10.787,
          locationLng: 79.1378,
          availabilityStatus: 'available',
          rating: 5.0,
          images: [VERIFIED_IMAGES.Harvester]
        },
        {
          ownerId: user3.id,
          name: '5HP Solar Water Pump with Trailer',
          category: 'Irrigation',
          description: 'Portable solar powered water pumping system. Great for drip irrigation in Pollachi & Coimbatore farms.',
          pricePerHour: 150.0,
          pricePerDay: 900.0,
          pricePerWeek: 5000.0,
          locationLat: 11.0168,
          locationLng: 76.9558,
          availabilityStatus: 'available',
          rating: 4.6,
          images: [VERIFIED_IMAGES.Irrigation]
        }
      ]
    });
    console.log('✅ Equipment seeded successfully');
  }

  // 3. Seed Crop Diseases
  const diseaseCount = await prisma.cropDisease.count();
  if (diseaseCount === 0) {
    await prisma.cropDisease.createMany({
      data: [
        {
          cropName: 'Rice / Paddy (நெல்)',
          diseaseName: 'Paddy Blast (Pyricularia oryzae)',
          symptoms: 'Spindle-shaped lesions with grey centres on leaves, neck rot, and node blast.',
          treatment: 'Spray Tricyclazole 75% WP @ 0.6 g/litre or Isoprothiolane 40% EC @ 1.5 ml/litre of water.',
          preventiveMeasures: 'Use resistant varieties like CO 47, ADT 43. Avoid excessive nitrogen fertilizer applications.',
          imageUrl: 'https://images.unsplash.com/photo-1535379453347-1ffd615e2e08?auto=format&fit=crop&q=80&w=800'
        },
        {
          cropName: 'Groundnut (நிலக்கடலை)',
          diseaseName: 'Tikka Leaf Spot (Cercospora arachidicola)',
          symptoms: 'Circular dark brown to black spots surrounded by a yellow halo on leaves.',
          treatment: 'Spray Carbendazim 12% + Mancozeb 63% WP (SAAF) @ 2g/litre of water.',
          preventiveMeasures: 'Maintain crop rotation with maize or sorghum. Destroy crop residue after harvest.',
          imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800'
        }
      ]
    });
    console.log('✅ Crop Diseases seeded successfully');
  }

  console.log('🎉 Full database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
