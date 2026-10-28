import fs from 'fs';
import path from 'path';
import { ProductItem, ProductGroup } from '../src/lib/types';

const DATA_DIR = path.join(process.cwd(), 'apps/web/data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const GROUPS_FILE = path.join(DATA_DIR, 'groups.json');

function runPilotSplit() {
  console.log('=== PILOT SPLIT: EAR MUFF ===');

  if (!fs.existsSync(PRODUCTS_FILE)) {
    throw new Error('products.json not found at ' + PRODUCTS_FILE);
  }

  const rawProducts: ProductItem[] = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const rawGroups: ProductGroup[] = fs.existsSync(GROUPS_FILE)
    ? JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'))
    : [];

  // 1. Calculate BEFORE stats
  const beforeProductCount = rawProducts.length;
  const beforeUnits = rawProducts.reduce((sum, p) => {
    if (p.variants && p.variants.length > 0) {
      return sum + p.variants.reduce((vSum, v) => vSum + (v.stock || 0), 0);
    }
    return sum + (p.stock || 0);
  }, 0);

  console.log(`[BEFORE] Total Products: ${beforeProductCount}`);
  console.log(`[BEFORE] Total Units: ${beforeUnits}`);

  // 2. Find target product: p-drv-wnt-rabbit-earmuffs-airbag
  const targetId = 'p-drv-wnt-rabbit-earmuffs-airbag';
  const target = rawProducts.find((p) => p.id === targetId);

  if (!target) {
    throw new Error(`Target product ${targetId} not found`);
  }

  if (!target.variants || target.variants.length === 0) {
    console.log('Target product has no variants or already split.');
    return;
  }

  console.log(`Target found: "${target.name}" (${target.id}) with ${target.variants.length} variants`);

  // Define proposed names based on specs / images / styles
  const styleNames: Record<string, string> = {
    'JM-VAR-MVMPS74Z-3': 'Kids Edition',
    'JM-VAR-MVMPTY5O-4': 'Airbag Moving Ears',
    'JM-VAR-MVMS8NDI-3': 'Hello Kitty Edition',
    'JM-VAR-MVMSC3QR-4': 'Velvet Warm Plush',
  };

  const splitProducts: ProductItem[] = [];
  const groupSlug = target.slug || 'moving-airbag-rabbit-ears-plush-winter-earmuffs';
  const groupId = `group_${target.id}`;

  target.variants.forEach((v, index) => {
    const styleLabel = styleNames[v.sku] || `Style ${index + 1}`;
    const newName = `${target.name} — ${styleLabel}`;
    const slugSuffix = styleLabel
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');
    const newSlug = `ear-muff-${slugSuffix}-${v.sku.toLowerCase()}`;

    // Collect all gallery images: main variant image + all color images
    const allImages: string[] = [];
    if (v.image) allImages.push(v.image);
    if (v.images) {
      v.images.forEach((img) => {
        if (!allImages.includes(img)) allImages.push(img);
      });
    }
    if (v.colors) {
      v.colors.forEach((col) => {
        if (col.image && !allImages.includes(col.image)) allImages.push(col.image);
        if (col.images) {
          col.images.forEach((img) => {
            if (!allImages.includes(img)) allImages.push(img);
          });
        }
      });
    }

    const newProduct: ProductItem = {
      id: `prod_split_${v.id}`,
      name: newName,
      slug: newSlug,
      categoryId: target.categoryId,
      categoryName: target.categoryName,
      categorySlug: target.categorySlug,
      categories: target.categories || [target.categoryName || 'Winter Items'],
      subCategoryId: target.subCategoryId,
      subCategoryName: target.subCategoryName,
      subCategorySlug: target.subCategorySlug,
      brand: target.brand || 'Jawata Mart',
      price: v.price,
      originalPrice: v.regularPrice || target.originalPrice || null,
      discount:
        v.regularPrice && v.regularPrice > v.price
          ? Math.round(((v.regularPrice - v.price) / v.regularPrice) * 100)
          : target.discount || 0,
      stock: v.stock || 20,
      sku: v.sku, // MUST PRESERVE EXACT SKU
      image: v.image || allImages[0] || target.image,
      images: allImages.length > 0 ? allImages : [target.image],
      description: target.description,
      specifications: {
        ...(target.specifications || {}),
        Style: styleLabel,
      },
      badge: target.badge || null,
      isFeatured: target.isFeatured || false,
      isBestSeller: target.isBestSeller || false,
      isNew: target.isNew || false,
      isActive: true,
      rating: target.rating || 5,
      reviewCount: target.reviewCount || 0,
      groupId: groupId,
      groupSlug: groupSlug,
      oldVariantId: v.id,
      variants: [], // Simple product: NO variants!
      mergedFromSlugs: [],
    };

    splitProducts.push(newProduct);
    console.log(
      `  -> Created Split Product: "${newProduct.name}" | SKU: ${newProduct.sku} | Price: ৳${newProduct.price} | Stock: ${newProduct.stock}`
    );
  });

  // 3. Create or update the Group
  const minPrice = Math.min(...splitProducts.map((p) => p.price));
  const maxPrice = Math.max(...splitProducts.map((p) => p.price));
  const regPrices = splitProducts
    .map((p) => p.originalPrice || 0)
    .filter((p) => p > 0);
  const minReg = regPrices.length > 0 ? Math.min(...regPrices) : null;
  const maxReg = regPrices.length > 0 ? Math.max(...regPrices) : null;

  const newGroup: ProductGroup = {
    id: groupId,
    name: 'Ear Muff Collection',
    slug: groupSlug,
    description: target.description,
    image: target.image || splitProducts[0].image,
    images: splitProducts.map((p) => p.image),
    categoryId: target.categoryId,
    categoryName: target.categoryName,
    categorySlug: target.categorySlug,
    categories: target.categories || [target.categoryName || 'Winter Items'],
    productIds: splitProducts.map((p) => p.id),
    minPrice,
    maxPrice,
    minRegularPrice: minReg,
    maxRegularPrice: maxReg,
    totalStyles: splitProducts.length,
    isActive: true,
    isFeatured: target.isFeatured,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const groupIndex = rawGroups.findIndex((g) => g.id === groupId || g.slug === groupSlug);
  if (groupIndex >= 0) {
    rawGroups[groupIndex] = newGroup;
  } else {
    rawGroups.push(newGroup);
  }

  // 4. Update the target product: it is now a non-sellable group placeholder with 0 stock
  target.stock = 0;
  target.variants = [];
  target.isGroupPlaceholder = true;
  target.groupId = groupId;
  target.groupSlug = groupSlug;

  // Add the newly split products
  const finalProducts = rawProducts.filter((p) => !p.id.startsWith('prod_split_var_1792865'));
  finalProducts.push(...splitProducts);

  // 5. Calculate AFTER stats
  const afterProductCount = finalProducts.length;
  const afterUnits = finalProducts.reduce((sum, p) => {
    if (p.variants && p.variants.length > 0) {
      return sum + p.variants.reduce((vSum, v) => vSum + (v.stock || 0), 0);
    }
    return sum + (p.stock || 0);
  }, 0);

  console.log(`[AFTER] Total Products: ${afterProductCount}`);
  console.log(`[AFTER] Total Units: ${afterUnits}`);

  if (beforeUnits !== afterUnits) {
    throw new Error(
      `UNITS MISMATCH! Before: ${beforeUnits}, After: ${afterUnits}. Operation aborted.`
    );
  }

  console.log(`RECONCILIATION SUCCESSFUL: 0 mismatch (Exact match: ${afterUnits} units)`);

  // 6. Save files safely
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(finalProducts, null, 2), 'utf8');
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(rawGroups, null, 2), 'utf8');
  console.log('Successfully written products.json and groups.json');
}

runPilotSplit();
