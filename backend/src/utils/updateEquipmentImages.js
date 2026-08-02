const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SPECIFIC_IMAGES = [
  {
    category: 'Tractor',
    nameContains: 'Mahindra',
    image: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?w=800&auto=compress&cs=tinysrgb'
  },
  {
    category: 'Tractor',
    nameContains: 'Swaraj',
    image: 'https://images.pexels.com/photos/2889440/pexels-photo-2889440.jpeg?w=800&auto=compress&cs=tinysrgb'
  },
  {
    category: 'Harvester',
    nameContains: 'Harvester',
    image: 'https://images.pexels.com/photos/2804327/pexels-photo-2804327.jpeg?w=800&auto=compress&cs=tinysrgb'
  },
  {
    category: 'Transplanter',
    nameContains: 'Transplanter',
    image: 'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?w=800&auto=compress&cs=tinysrgb'
  },
  {
    category: 'Irrigation',
    nameContains: 'Pump',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'
  }
];

async function updateImages() {
  console.log('🔄 Updating DB equipment items with unique real machinery images...');
  const equipment = await prisma.equipment.findMany();

  for (const item of equipment) {
    let chosenImage = 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?w=800&auto=compress&cs=tinysrgb';

    for (const spec of SPECIFIC_IMAGES) {
      if (item.name.toLowerCase().includes(spec.nameContains.toLowerCase()) || item.category.toLowerCase().includes(spec.category.toLowerCase())) {
        chosenImage = spec.image;
        break;
      }
    }

    await prisma.equipment.update({
      where: { id: item.id },
      data: {
        images: [chosenImage]
      }
    });
    console.log(`✅ Updated Equipment ID ${item.id} (${item.name}) -> ${chosenImage}`);
  }

  console.log('🎉 Database images updated with specific machinery photos!');
}

updateImages()
  .catch(err => {
    console.error('❌ Error updating DB images:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
