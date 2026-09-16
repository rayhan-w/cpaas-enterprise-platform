import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
} from '../src/lib/sample-data';

async function seed() {
  console.log('--- Seeding Supabase Database for Jawata Mart ---');

  // 1. Admin
  const adminEmail = 'jawatamart@gmail.com';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123456', salt);

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

  // 2. Categories & Subcategories
  console.log(`Seeding ${INITIAL_CATEGORIES.length} categories...`);
  const catMap = new Map<string, string>();
  const subMap = new Map<string, string>();

  for (const cat of INITIAL_CATEGORIES) {
    const savedCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        image: cat.image,
        description: cat.description,
        icon: cat.icon,
        isFeatured: cat.isFeatured,
        order: cat.order,
        isActive: cat.isActive,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        description: cat.description,
        icon: cat.icon,
        isFeatured: cat.isFeatured,
        order: cat.order,
        isActive: cat.isActive,
      },
    });

    catMap.set(cat.id, savedCat.id);
    catMap.set(cat.slug, savedCat.id);

    if (cat.subCategories && cat.subCategories.length > 0) {
      for (const sub of cat.subCategories) {
        const savedSub = await prisma.subCategory.upsert({
          where: { slug: sub.slug },
          update: {
            name: sub.name,
            categoryId: savedCat.id,
            order: sub.order,
          },
          create: {
            id: sub.id,
            categoryId: savedCat.id,
            name: sub.name,
            slug: sub.slug,
            order: sub.order,
          },
        });
        subMap.set(sub.id, savedSub.id);
        subMap.set(sub.slug, savedSub.id);
      }
    }
  }
  console.log('✓ Categories & Subcategories seeded successfully.');

  // 3. Products
  console.log(`Seeding ${INITIAL_PRODUCTS.length} products...`);
  const seenSkus = new Set<string>();
  const existingProds = await prisma.product.findMany({ select: { id: true, slug: true, sku: true } });
  const existingSkuMap = new Map(existingProds.filter(p => p.sku).map(p => [p.sku!, p.slug]));

  for (const prod of INITIAL_PRODUCTS) {
    const resolvedCatId = catMap.get(prod.categoryId) || catMap.get(prod.categorySlug || '') || prod.categoryId;
    const resolvedSubId = prod.subCategoryId
      ? (subMap.get(prod.subCategoryId) || (prod.subCategorySlug ? subMap.get(prod.subCategorySlug) : null) || null)
      : null;

    let sku = prod.sku || `JM-${prod.slug.toUpperCase()}`;
    if (existingSkuMap.has(sku) && existingSkuMap.get(sku) !== prod.slug) {
      sku = `${sku}-${prod.slug.slice(-6)}`;
    }
    while (seenSkus.has(sku)) {
      sku = `${sku}-D`;
    }
    seenSkus.add(sku);

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        categoryId: resolvedCatId,
        subCategoryId: resolvedSubId,
        brand: prod.brand,
        price: prod.price,
        originalPrice: prod.originalPrice || null,
        discount: prod.discount,
        stock: prod.stock,
        sku: sku,
        image: prod.image,
        images: JSON.stringify(prod.images || [prod.image]),
        description: prod.description,
        specifications: prod.specifications ? JSON.stringify(prod.specifications) : null,
        badge: prod.badge,
        isFeatured: prod.isFeatured,
        isBestSeller: prod.isBestSeller,
        isNew: prod.isNew,
        isActive: prod.isActive,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        categoryId: resolvedCatId,
        subCategoryId: resolvedSubId,
        brand: prod.brand,
        price: prod.price,
        originalPrice: prod.originalPrice || null,
        discount: prod.discount,
        stock: prod.stock,
        sku: sku,
        image: prod.image,
        images: JSON.stringify(prod.images || [prod.image]),
        description: prod.description,
        specifications: prod.specifications ? JSON.stringify(prod.specifications) : null,
        badge: prod.badge,
        isFeatured: prod.isFeatured,
        isBestSeller: prod.isBestSeller,
        isNew: prod.isNew,
        isActive: prod.isActive,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
    });
  }
  console.log('✓ Products seeded successfully.');

  // 4. Banners
  if (INITIAL_BANNERS && INITIAL_BANNERS.length > 0) {
    console.log(`Seeding ${INITIAL_BANNERS.length} banners...`);
    for (const banner of INITIAL_BANNERS) {
      await prisma.banner.upsert({
        where: { id: banner.id },
        update: {
          title: banner.title,
          subtitle: banner.subtitle || null,
          badge: banner.badge || null,
          ctaText: banner.ctaText || 'Shop Now',
          ctaLink: banner.ctaLink || '/products',
          image: banner.image,
          order: banner.order || 0,
          isActive: banner.isActive ?? true,
        },
        create: {
          id: banner.id,
          title: banner.title,
          subtitle: banner.subtitle || null,
          badge: banner.badge || null,
          ctaText: banner.ctaText || 'Shop Now',
          ctaLink: banner.ctaLink || '/products',
          image: banner.image,
          order: banner.order || 0,
          isActive: banner.isActive ?? true,
        },
      });
    }
    console.log('✓ Banners seeded successfully.');
  }

  // 5. Coupons
  if (INITIAL_COUPONS && INITIAL_COUPONS.length > 0) {
    console.log(`Seeding ${INITIAL_COUPONS.length} coupons...`);
    for (const coupon of INITIAL_COUPONS) {
      await prisma.coupon.upsert({
        where: { code: coupon.code },
        update: {
          type: coupon.type,
          value: coupon.value,
          minOrder: coupon.minOrder,
          maxDiscount: coupon.maxDiscount || null,
          isActive: coupon.isActive,
        },
        create: {
          id: coupon.id,
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          minOrder: coupon.minOrder,
          maxDiscount: coupon.maxDiscount || null,
          isActive: coupon.isActive,
        },
      });
    }
    console.log('✓ Coupons seeded successfully.');
  }

  // 6. Settings
  console.log('Seeding settings...');
  for (const [key, value] of Object.entries(INITIAL_SETTINGS)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  console.log('✓ Settings seeded successfully.');

  console.log('--- Supabase Seeding Complete! ---');
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
