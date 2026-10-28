import fs from 'fs';
import path from 'path';
import { ProductItem, ProductGroup } from '../src/lib/types';

const DATA_DIR = path.join(process.cwd(), 'apps/web/data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const GROUPS_FILE = path.join(DATA_DIR, 'groups.json');

function runCompleteConversion() {
  console.log('=== COMPLETE VARIANT CONVERSION TO GROUP MODEL ===');

  const rawProducts: ProductItem[] = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  const rawGroups: ProductGroup[] = fs.existsSync(GROUPS_FILE)
    ? JSON.parse(fs.readFileSync(GROUPS_FILE, 'utf8'))
    : [];

  const beforeUnits = rawProducts.reduce((sum, p) => {
    if (p.variants && p.variants.length > 0) {
      return sum + p.variants.reduce((vSum, v) => vSum + (v.stock || 0), 0);
    }
    return sum + (p.stock || 0);
  }, 0);

  console.log(`[BEFORE] Total Products in file: ${rawProducts.length}`);
  console.log(`[BEFORE] Total Units across all products: ${beforeUnits}`);

  const newlyAddedProducts: ProductItem[] = [];

  // 1. Process prod_1792605471898 (Ear Muff 2-variant duplicate)
  const earMuff2 = rawProducts.find((p) => p.id === 'prod_1792605471898');
  if (earMuff2 && earMuff2.variants && earMuff2.variants.length > 0) {
    console.log(`Splitting duplicate Ear Muff: ${earMuff2.id}`);
    const earGroup = rawGroups.find((g) => g.id === 'group_p-drv-wnt-rabbit-earmuffs-airbag') || rawGroups[0];

    earMuff2.variants.forEach((v, idx) => {
      const styleName = idx === 0 ? 'Hello Kitty Sweetie' : 'Winter Fluffy Ear Warmer';
      const newSlug = `ear-muff-${idx === 0 ? 'hello-kitty-sweetie' : 'winter-fluffy'}-${v.sku.toLowerCase()}`;

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
        });
      }

      const newProd: ProductItem = {
        id: `prod_split_${v.id}`,
        name: `Ear Muff — ${styleName}`,
        slug: newSlug,
        categoryId: earMuff2.categoryId,
        categoryName: earMuff2.categoryName,
        categorySlug: earMuff2.categorySlug,
        categories: earMuff2.categories || ['Winter Items', 'Baby Items'],
        subCategoryId: earMuff2.subCategoryId,
        subCategoryName: earMuff2.subCategoryName,
        subCategorySlug: earMuff2.subCategorySlug,
        brand: earMuff2.brand || 'Jawata Mart',
        price: v.price,
        originalPrice: v.regularPrice || 699,
        discount: v.regularPrice && v.regularPrice > v.price ? Math.round(((v.regularPrice - v.price) / v.regularPrice) * 100) : 0,
        stock: v.stock || 20,
        sku: v.sku, // PRESERVE EXACT SKU
        image: v.image || allImages[0] || earMuff2.image,
        images: allImages.length > 0 ? allImages : [earMuff2.image],
        description: earMuff2.description,
        specifications: {
          ...(earMuff2.specifications || {}),
          Style: styleName,
        },
        badge: null,
        isFeatured: false,
        isBestSeller: false,
        isNew: false,
        isActive: true,
        rating: 5,
        reviewCount: 0,
        groupId: earGroup?.id || 'group_p-drv-wnt-rabbit-earmuffs-airbag',
        groupSlug: earGroup?.slug || 'moving-airbag-rabbit-ears-plush-winter-earmuffs',
        oldVariantId: v.id,
        variants: [],
        mergedFromSlugs: [],
      };

      newlyAddedProducts.push(newProd);
      if (earGroup && !earGroup.productIds.includes(newProd.id)) {
        earGroup.productIds.push(newProd.id);
        earGroup.totalStyles = earGroup.productIds.length;
      }
      console.log(`  -> Created: "${newProd.name}" | SKU: ${newProd.sku} | Stock: ${newProd.stock}`);
    });

    earMuff2.stock = 0;
    earMuff2.variants = [];
    earMuff2.isGroupPlaceholder = true;
    earMuff2.groupSlug = earGroup?.slug;
  }

  // 2. Process p-drv-bsh-fishnet-bow-socks (8-variant Socks product)
  const socks = rawProducts.find((p) => p.id === 'p-drv-bsh-fishnet-bow-socks');
  if (socks && socks.variants && socks.variants.length > 0) {
    console.log(`Splitting Socks product: ${socks.id} (${socks.variants.length} variants)`);
    const socksGroupId = `group_${socks.id}`;
    const socksGroupSlug = socks.slug || 'baby-toddler-bowtie-fishnet-socks';

    const socksSplitIds: string[] = [];

    socks.variants.forEach((v, idx) => {
      const styleName = `Style ${idx + 1}`;
      const newSlug = `kids-baby-stylist-socks-style-${idx + 1}-${v.sku.toLowerCase()}`;

      const allImages: string[] = [];
      if (v.image) allImages.push(v.image);
      if (v.images) {
        v.images.forEach((img) => {
          if (!allImages.includes(img)) allImages.push(img);
        });
      }

      const newProd: ProductItem = {
        id: `prod_split_${v.id}`,
        name: `Kids & Baby Stylist Socks — ${styleName}`,
        slug: newSlug,
        categoryId: socks.categoryId,
        categoryName: socks.categoryName,
        categorySlug: socks.categorySlug,
        categories: socks.categories || [socks.categoryName || 'Baby Items'],
        subCategoryId: socks.subCategoryId,
        subCategoryName: socks.subCategoryName,
        subCategorySlug: socks.subCategorySlug,
        brand: socks.brand || 'Jawata Mart',
        price: v.price || 399,
        originalPrice: v.regularPrice || 450,
        discount: v.regularPrice && v.regularPrice > v.price ? Math.round(((v.regularPrice - v.price) / v.regularPrice) * 100) : 11,
        stock: v.stock || 20,
        sku: v.sku, // PRESERVE EXACT SKU
        image: v.image || allImages[0] || socks.image,
        images: allImages.length > 0 ? allImages : [socks.image],
        description: socks.description,
        specifications: {
          ...(socks.specifications || {}),
          Style: styleName,
        },
        badge: socks.badge || null,
        isFeatured: socks.isFeatured || false,
        isBestSeller: socks.isBestSeller || false,
        isNew: socks.isNew || false,
        isActive: true,
        rating: socks.rating || 5,
        reviewCount: socks.reviewCount || 0,
        groupId: socksGroupId,
        groupSlug: socksGroupSlug,
        oldVariantId: v.id,
        variants: [],
        mergedFromSlugs: [],
      };

      newlyAddedProducts.push(newProd);
      socksSplitIds.push(newProd.id);
      console.log(`  -> Created: "${newProd.name}" | SKU: ${newProd.sku} | Stock: ${newProd.stock}`);
    });

    // Create Socks Group
    const socksPrices = newlyAddedProducts
      .filter((p) => socksSplitIds.includes(p.id))
      .map((p) => p.price);
    const socksRegPrices = newlyAddedProducts
      .filter((p) => socksSplitIds.includes(p.id))
      .map((p) => p.originalPrice || 450);

    const socksGroup: ProductGroup = {
      id: socksGroupId,
      name: 'Kids & Baby Stylist Socks Collection',
      slug: socksGroupSlug,
      description: socks.description,
      image: socks.image || newlyAddedProducts[0]?.image,
      images: newlyAddedProducts.filter((p) => socksSplitIds.includes(p.id)).map((p) => p.image),
      categoryId: socks.categoryId,
      categoryName: socks.categoryName,
      categorySlug: socks.categorySlug,
      categories: socks.categories || ['Baby Items'],
      productIds: socksSplitIds,
      minPrice: Math.min(...socksPrices),
      maxPrice: Math.max(...socksPrices),
      minRegularPrice: Math.min(...socksRegPrices),
      maxRegularPrice: Math.max(...socksRegPrices),
      totalStyles: socksSplitIds.length,
      isActive: true,
      isFeatured: socks.isFeatured,
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const gIdx = rawGroups.findIndex((g) => g.id === socksGroupId || g.slug === socksGroupSlug);
    if (gIdx >= 0) {
      rawGroups[gIdx] = socksGroup;
    } else {
      rawGroups.push(socksGroup);
    }

    socks.stock = 0;
    socks.variants = [];
    socks.isGroupPlaceholder = true;
    socks.groupSlug = socksGroupSlug;
  }

  // Combine products
  const finalProducts = rawProducts.filter(
    (p) => !newlyAddedProducts.some((np) => np.id === p.id)
  );
  finalProducts.push(...newlyAddedProducts);

  // Validate after units
  const afterUnits = finalProducts.reduce((sum, p) => {
    if (p.variants && p.variants.length > 0) {
      return sum + p.variants.reduce((vSum, v) => vSum + (v.stock || 0), 0);
    }
    return sum + (p.stock || 0);
  }, 0);

  console.log(`[AFTER] Total Products in file: ${finalProducts.length}`);
  console.log(`[AFTER] Total Groups in file: ${rawGroups.length}`);
  console.log(`[AFTER] Total Units: ${afterUnits}`);

  if (beforeUnits !== afterUnits) {
    throw new Error(`UNITS MISMATCH! Before: ${beforeUnits}, After: ${afterUnits}. Reverting.`);
  }

  console.log(`RECONCILIATION SUCCESSFUL: 0 mismatch (Exact match: ${afterUnits} units)`);

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(finalProducts, null, 2), 'utf8');
  fs.writeFileSync(GROUPS_FILE, JSON.stringify(rawGroups, null, 2), 'utf8');
  console.log('Successfully written updated products.json and groups.json');
}

runCompleteConversion();
