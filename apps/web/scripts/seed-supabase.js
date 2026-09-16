const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Initialize Prisma
const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Supabase Database for Jawata Mart ---');

  // 1. Admin
  const adminEmail = 'jawatamart@gmail.com';
  const passwordHash = await bcrypt.hash('admin123456', 10);
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: 'Md. Abdur Rahim (Jawata Mart)', role: 'SUPERADMIN' },
    create: {
      email: adminEmail,
      name: 'Md. Abdur Rahim (Jawata Mart)',
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
