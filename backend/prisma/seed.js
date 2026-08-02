const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding from seed.sql...');
  
  const seedSqlPath = path.join(__dirname, '../../database/seed.sql');
  if (!fs.existsSync(seedSqlPath)) {
    console.error('❌ seed.sql not found at:', seedSqlPath);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(seedSqlPath, 'utf8');

  // Split statements by semicolon while ignoring comments
  const statements = sqlContent
    .split(/;(?=(?:[^']*'[^']*')*[^']*$)/) // Split on semicolon not inside quotes
    .map(s => s.trim())
    .filter(s => s.length > 5);

  for (const stmt of statements) {
    // Filter out comment lines
    const cleanStmt = stmt.split('\n').filter(line => !line.trim().startsWith('--')).join('\n').trim();
    if (cleanStmt) {
      try {
        await prisma.$executeRawUnsafe(cleanStmt);
      } catch (err) {
        console.warn('⚠️ Seeding statement note:', err.message);
      }
    }
  }

  console.log('✅ Database seeding process finished!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
