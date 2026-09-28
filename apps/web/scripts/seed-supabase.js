const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Initialize Prisma
const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Supabase Database for TrackOps ---');

  // 1. Admin
  const adminEmail = 'admin@trackops.dev';
  const passwordHash = await bcrypt.hash('admin123456', 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'TrackOps Administrator', role: 'SUPERADMIN' },
    create: {
      email: adminEmail,
      name: 'TrackOps Administrator',
      passwordHash,
      role: 'SUPERADMIN',
    },
  });
  console.log('✓ Admin user verified:', adminEmail);

  // 2. Load Sample Data via require or tsx
  // Let's import sample-data directly or read categories
  // We can write a script that imports from prisma and sample data
}

main().catch(console.error).finally(() => prisma.$disconnect());
