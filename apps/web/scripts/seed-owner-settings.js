require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Owner Profile & Settings to Database ---');

  const defaultOwnerSettings = {
    ownerName: 'Abdur Rahim',
    ownerTitle: 'Founder & Managing Director',
    ownerBio: 'Passionate entrepreneur dedicated to bringing 100% authentic lifestyle, baby care, fashion, and organic food products directly to households across all 64 districts of Bangladesh.',
    ownerPhoto: '/images/abdur-rahim-owner.jpg',
    ownerPhone: '01915210799',
    ownerEmail: 'jawatamart3@gmail.com',
    aboutStory: 'Jawata Mart was founded by Abdur Rahim with a clear purpose: to bridge the gap between quality and affordability in online shopping across Bangladesh. Operating from Uttara Sector-12, Dhaka, we hand-inspect every product before dispatch, ensuring only genuine, premium-grade items reach you and your family.',
    aboutMission: 'To provide a trustworthy, reliable shopping experience where every Bangladeshi customer receives genuine products, transparent pricing, dedicated support, and swift doorstep delivery.',
    aboutVision: "To be Bangladesh's most respected, customer-centric lifestyle & household shopping brand, celebrated for honesty, authenticity, and unmatched customer delight.",
  };

  for (const [key, value] of Object.entries(defaultOwnerSettings)) {
    const existing = await prisma.setting.findUnique({ where: { key } });
    if (!existing) {
      await prisma.setting.create({
        data: {
          key,
          value: String(value),
        },
      });
      console.log(`Created setting: ${key}`);
    } else {
      console.log(`Setting already exists: ${key} = ${existing.value.substring(0, 30)}...`);
    }
  }

  console.log('✓ Owner settings verified and persisted in DB.');
}

main()
  .catch((e) => {
    console.error('Error seeding owner settings:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
