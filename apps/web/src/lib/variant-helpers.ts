import { ProductItem, ProductVariant, VariantColor } from './types';
import { parseRobustPrice, formatPrice } from './formatters';

/**
 * Returns all active variants of a product, sorted by order / index.
 */
export function getActiveVariants(product?: ProductItem | null): ProductVariant[] {
  if (!product || !Array.isArray(product.variants) || product.variants.length === 0) {
    return [];
  }
  return product.variants
    .filter((v) => v && v.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Find a variant by SKU (case-insensitive).
 */
export function getVariantBySku(
  product?: ProductItem | null,
  sku?: string | null
): ProductVariant | undefined {
  if (!product || !sku || !Array.isArray(product.variants)) return undefined;
  const target = sku.trim().toUpperCase();
  return product.variants.find((v) => v.sku && v.sku.trim().toUpperCase() === target);
}

/**
 * Find a variant by its ID.
 */
export function getVariantById(
  product?: ProductItem | null,
  id?: string | null
): ProductVariant | undefined {
  if (!product || !id || !Array.isArray(product.variants)) return undefined;
  return product.variants.find((v) => v.id === id);
}

/**
 * Calculate total stock for a product:
 * If it has active variants, the total is the sum of active variant stocks.
 * Otherwise, falls back to the parent product's own stock.
 */
export function getProductTotalStock(product?: ProductItem | null): number {
  if (!product) return 0;
  const activeVariants = getActiveVariants(product);
  if (activeVariants.length > 0) {
    return activeVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  }
  return Number(product.stock) || 0;
}

export interface PriceRangeResult {
  minPrice: number;
  maxPrice: number;
  hasRange: boolean;
  displayPrice: string;
  minRegularPrice?: number;
  maxRegularPrice?: number;
  hasRegularPrice: boolean;
  displayRegularPrice?: string;
  maxDiscountPercent: number;
}

/**
 * Computes price information and price range:
 * - If product has active variants with different prices: "৳2,100 – ৳2,300"
 * - If product has active variants with same price or no variants: "৳2,100"
 * - Also computes regular price range and maximum discount percentage.
 */
export function getProductPriceRange(product?: ProductItem | null): PriceRangeResult {
  if (!product) {
    return {
      minPrice: 0,
      maxPrice: 0,
      hasRange: false,
      displayPrice: formatPrice(0),
      hasRegularPrice: false,
      maxDiscountPercent: 0,
    };
  }

  const activeVariants = getActiveVariants(product);

  if (activeVariants.length === 0) {
    const price = product.price || 0;
    const regular = product.originalPrice && product.originalPrice > price ? product.originalPrice : undefined;
    const discount = regular ? Math.round(((regular - price) / regular) * 100) : (product.discount || 0);

    return {
      minPrice: price,
      maxPrice: price,
      hasRange: false,
      displayPrice: formatPrice(price),
      minRegularPrice: regular,
      maxRegularPrice: regular,
      hasRegularPrice: Boolean(regular),
      displayRegularPrice: regular ? formatPrice(regular) : undefined,
      maxDiscountPercent: discount,
    };
  }

  // Has active variants
  const prices = activeVariants.map((v) => Number(v.price) || 0);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasRange = minPrice !== maxPrice;

  // Regular prices
  const regularPrices = activeVariants
    .map((v) => (v.regularPrice && v.regularPrice > v.price ? Number(v.regularPrice) : null))
    .filter((p): p is number => p !== null);

  const minRegularPrice = regularPrices.length > 0 ? Math.min(...regularPrices) : undefined;
  const maxRegularPrice = regularPrices.length > 0 ? Math.max(...regularPrices) : undefined;
  const hasRegularPrice = regularPrices.length > 0;

  // Calculate maximum discount percentage among variants
  let maxDiscountPercent = 0;
  for (const v of activeVariants) {
    if (v.regularPrice && v.regularPrice > v.price) {
      const d = Math.round(((v.regularPrice - v.price) / v.regularPrice) * 100);
      if (d > maxDiscountPercent) maxDiscountPercent = d;
    }
  }

  const displayPrice = hasRange
    ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
    : formatPrice(minPrice);

  const displayRegularPrice = hasRegularPrice
    ? minRegularPrice !== maxRegularPrice && minRegularPrice && maxRegularPrice
      ? `${formatPrice(minRegularPrice)} – ${formatPrice(maxRegularPrice)}`
      : minRegularPrice
      ? formatPrice(minRegularPrice)
      : undefined
    : undefined;

  return {
    minPrice,
    maxPrice,
    hasRange,
    displayPrice,
    minRegularPrice,
    maxRegularPrice,
    hasRegularPrice,
    displayRegularPrice,
    maxDiscountPercent,
  };
}

/**
 * Validates SKU uniqueness for all variants of a product.
 * Ensures:
 * 1. Every variant has a non-empty SKU.
 * 2. No two variants within the same product share the same SKU.
 * 3. No variant SKU collides with another product's SKU or another product's variant SKU.
 * 4. Variant SKU does not collide with its own parent product's SKU unless it's the sole variant.
 */
export function validateVariantSkus(
  variants: ProductVariant[],
  currentProductId: string,
  allProducts: ProductItem[],
  parentProductSku?: string | null
): { valid: boolean; error?: string } {
  if (!Array.isArray(variants) || variants.length === 0) {
    return { valid: true };
  }

  const seenInside = new Set<string>();
  const parentSkuClean = parentProductSku ? parentProductSku.trim().toUpperCase() : null;

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    if (!v.name || !v.name.trim()) {
      return { valid: false, error: `Variant #${i + 1} must have a name.` };
    }

    if (!v.sku || !v.sku.trim()) {
      return { valid: false, error: `Variant "${v.name}" must have a SKU.` };
    }

    const skuUpper = v.sku.trim().toUpperCase();

    // Check duplicate within the same product's variants
    if (seenInside.has(skuUpper)) {
      return {
        valid: false,
        error: `Duplicate SKU "${skuUpper}" within variants. Each variant must have a unique SKU.`,
      };
    }
    seenInside.add(skuUpper);

    // Check collision with parent product's own SKU if multiple variants exist
    if (variants.length > 1 && parentSkuClean && skuUpper === parentSkuClean) {
      return {
        valid: false,
        error: `Variant "${v.name}" SKU "${skuUpper}" cannot be identical to the parent product SKU.`,
      };
    }

    // Check collision across other products and their variants
    for (const prod of allProducts) {
      if (prod.id === currentProductId) continue;

      if (prod.sku && prod.sku.trim().toUpperCase() === skuUpper) {
        return {
          valid: false,
          error: `SKU "${skuUpper}" is already in use by product "${prod.name}". SKUs must be globally unique.`,
        };
      }

      if (Array.isArray(prod.variants)) {
        for (const otherV of prod.variants) {
          if (otherV.sku && otherV.sku.trim().toUpperCase() === skuUpper) {
            return {
              valid: false,
              error: `SKU "${skuUpper}" is already in use by variant "${otherV.name}" of product "${prod.name}". SKUs must be globally unique.`,
            };
          }
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Normalizes an array of raw variant inputs into clean, typed ProductVariant items.
 */
export function normalizeVariants(
  rawVariants: any[] | undefined,
  defaultImage: string = '',
  defaultPrice: number = 0
): ProductVariant[] {
  if (!Array.isArray(rawVariants) || rawVariants.length === 0) {
    return [];
  }

  return rawVariants.map((raw, idx) => {
    const parsedPrice = parseRobustPrice(raw.price);
    if (parsedPrice === null || parsedPrice <= 0) {
      throw new Error(`Variant "${raw.name || idx + 1}" must have a valid positive price.`);
    }

    let parsedRegularPrice: number | null | undefined = undefined;
    if (raw.regularPrice !== undefined && raw.regularPrice !== null) {
      const parsedReg = parseRobustPrice(raw.regularPrice);
      if (parsedReg !== null && parsedReg > 0) {
        parsedRegularPrice = parsedReg;
      }
    } else if (raw.originalPrice !== undefined && raw.originalPrice !== null) {
      const parsedReg = parseRobustPrice(raw.originalPrice);
      if (parsedReg !== null && parsedReg > 0) {
        parsedRegularPrice = parsedReg;
      }
    }

    const sku =
      typeof raw.sku === 'string' && raw.sku.trim()
        ? raw.sku.trim().toUpperCase()
        : `JM-VAR-${Date.now().toString(36).toUpperCase()}-${idx + 1}`;

    const variantImage = raw.image || (Array.isArray(raw.images) && raw.images[0]) || defaultImage;
    const variantImages = Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : variantImage
      ? [variantImage]
      : [];

    let cleanColors: VariantColor[] | undefined = undefined;
    if (Array.isArray(raw.colors) && raw.colors.length > 0) {
      cleanColors = raw.colors
        .filter((c: any) => c && c.name && String(c.name).trim())
        .map((c: any, cIdx: number) => ({
          id: c.id || `col_${Date.now()}_${cIdx}_${Math.random().toString(36).slice(2, 6)}`,
          name: String(c.name).trim(),
          swatch: typeof c.swatch === 'string' && c.swatch.trim() ? c.swatch.trim() : undefined,
          image: typeof c.image === 'string' && c.image.trim() ? c.image.trim() : undefined,
          images: Array.isArray(c.images) ? c.images.filter((img: any) => typeof img === 'string' && img.trim()) : undefined,
          sku: typeof c.sku === 'string' && c.sku.trim() ? c.sku.trim().toUpperCase() : undefined,
          stock: c.stock !== undefined && c.stock !== null && c.stock !== '' ? Math.max(0, parseInt(c.stock, 10) || 0) : undefined,
        }));
    }

    return {
      id: raw.id || `var_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      productId: raw.productId || undefined,
      name: String(raw.name || `Variant ${idx + 1}`).trim(),
      value: raw.value || raw.name,
      sku,
      price: parsedPrice,
      regularPrice: parsedRegularPrice ?? null,
      stock: Number(raw.stock) >= 0 ? Number(raw.stock) : 0,
      image: variantImage,
      images: variantImages,
      isActive: raw.isActive !== false,
      order: typeof raw.order === 'number' ? raw.order : idx,
      colors: cleanColors && cleanColors.length > 0 ? cleanColors : undefined,
    };
  });
}

/**
 * Finds a product by its slug or by a merged-from slug.
 * Returns the matching product and the variant that matches the slug if merged.
 */
export function findProductBySlugOrMergedSlug(
  slug: string,
  products: ProductItem[]
): { product: ProductItem; matchedVariant?: ProductVariant; isMergedRedirect: boolean } | null {
  if (!slug) return null;
  const cleanSlug = slug.trim().toLowerCase();

  // 1. Direct match by slug
  const direct = products.find((p) => p.slug && p.slug.toLowerCase() === cleanSlug);
  if (direct) {
    return { product: direct, isMergedRedirect: false };
  }

  // 2. Merged-from slug match
  for (const prod of products) {
    if (Array.isArray(prod.mergedFromSlugs)) {
      const foundIdx = prod.mergedFromSlugs.findIndex((s) => s.toLowerCase() === cleanSlug);
      if (foundIdx > -1) {
        // Find which variant was created from this merged product
        let matchedVariant: ProductVariant | undefined = undefined;
        if (Array.isArray(prod.variants) && prod.variants[foundIdx]) {
          matchedVariant = prod.variants[foundIdx];
        }
        return { product: prod, matchedVariant, isMergedRedirect: true };
      }
    }
  }

  // 3. Match by variant SKU
  for (const prod of products) {
    if (Array.isArray(prod.variants)) {
      const v = prod.variants.find((item) => item.sku && item.sku.toLowerCase() === cleanSlug);
      if (v) {
        return { product: prod, matchedVariant: v, isMergedRedirect: true };
      }
    }
  }

  return null;
}

/**
 * Returns active colors of a variant.
 */
export function getVariantColors(variant?: ProductVariant | null): VariantColor[] {
  if (!variant || !Array.isArray(variant.colors)) return [];
  return variant.colors.filter((c) => c && c.name && c.name.trim());
}

/**
 * Computes effective stock for an item with optional variant and color.
 * If color has a specific stock defined (number), returns color.stock.
 * Otherwise returns variant.stock.
 */
export function getVariantEffectiveStock(
  variant?: ProductVariant | null,
  color?: VariantColor | null
): number {
  if (!variant) return 0;
  if (color && typeof color.stock === 'number') {
    return color.stock;
  }
  return Number(variant.stock) || 0;
}
