import fs from 'fs';
import path from 'path';
import prisma from './prisma';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
} from './sample-data';
import {
  CategoryItem,
  SubCategoryItem,
  ProductItem,
  ProductVariant,
  OrderRecord,
  StoreSettings,
  CouponItem,
  BannerItem,
  PaymentStatus,
} from './types';
import { parseRobustPrice } from './formatters';
import {
  normalizeVariants,
  validateVariantSkus,
  getActiveVariants,
  getProductTotalStock,
  findProductBySlugOrMergedSlug,
} from './variant-helpers';

const DATA_DIR = path.join(process.cwd(), 'data');
const DELETED_FILE = path.join(DATA_DIR, 'deleted-products.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Ignore error
  }
}

const DEFAULT_BLOCKED_IDS = [
  'p-fas-mens-panjabi',
  'p-fas-oxford-shirt',
  'p-fas-leather-belt-wallet',
  'p-gift-islamic-box',
  'p-drv-bag-3pc-ladies-set',
  'premium-semi-long-cotton-embroidered-mens-panjabi',
  'mens-smart-casual-100-cotton-oxford-long-sleeve-shirt',
  'genuine-leather-mens-formal-belt-bi-fold-wallet-gift-combo',
  'luxury-velvet-islamic-gift-box',
  'luxury-3-in-1-ladies-backpack-round-crossbody-card-wallet-set',
];

function loadDeletedIds(): Set<string> {
  ensureDataDir();
  try {
    if (fs.existsSync(DELETED_FILE)) {
      const data = JSON.parse(fs.readFileSync(DELETED_FILE, 'utf8'));
      if (Array.isArray(data)) return new Set([...DEFAULT_BLOCKED_IDS, ...data]);
    }
  } catch (err) {
    // Ignore read errors
  }
  return new Set(DEFAULT_BLOCKED_IDS);
}

function saveDeletedId(idOrSlug: string, additionalSlug?: string) {
  ensureDataDir();
  try {
    const current = loadDeletedIds();
    current.add(idOrSlug);
    if (additionalSlug) current.add(additionalSlug);
    fs.writeFileSync(DELETED_FILE, JSON.stringify(Array.from(current), null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving deleted products file:', err);
  }
}

function removeFromDeletedIds(idOrSlug: string, additionalSlug?: string) {
  ensureDataDir();
  try {
    const current = loadDeletedIds();
    current.delete(idOrSlug);
    if (additionalSlug) current.delete(additionalSlug);
    fs.writeFileSync(DELETED_FILE, JSON.stringify(Array.from(current), null, 2), 'utf8');
  } catch (err) {
    console.error('Error removing from deleted products file:', err);
  }
}

function isNotDeleted(p: any): boolean {
  if (!p) return false;
  const del = loadDeletedIds();
  return !del.has(p.id) && !del.has(p.slug);
}

const INITIAL_SAMPLE_ORDERS: OrderRecord[] = [
  {
    id: 'ord-1',
    orderNumber: 'JM-1001',
    customerName: 'Tasnim Akter',
    customerPhone: '01711-234567',
    customerEmail: 'tasnim@example.com',
    division: 'Dhaka',
    district: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 12, Road 4, Dhanmondi, Dhaka',
    deliveryZone: 'INSIDE_DHAKA',
    deliveryCharge: 70,
    subtotal: 3100,
    discount: 0,
    total: 3170,
    paymentMethod: 'BKASH',
    paymentStatus: 'PENDING_VERIFICATION',
    orderStatus: 'PENDING',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    items: [
      {
        id: 'item-1',
        orderId: 'ord-1',
        productName: 'Luxury Velvet Islamic Gift Box',
        productImage: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&h=600&fit=crop',
        price: 2450,
        quantity: 1,
        total: 2450,
      },
    ],
    payments: [
      {
        id: 'pay-1',
        orderId: 'ord-1',
        method: 'BKASH',
        amount: 2510,
        status: 'PENDING_VERIFICATION',
        transactionId: 'BK9912X8A',
        senderNumber: '01711-234567',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: 'JM-1002',
    customerName: 'Mahmud Hossain',
    customerPhone: '01911-456789',
    customerEmail: 'mahmud@example.com',
    division: 'Sylhet',
    district: 'Sylhet',
    area: 'Subidbazar',
    address: 'Block C, House 5, Subidbazar, Sylhet',
    deliveryZone: 'OUTSIDE_DHAKA',
    deliveryCharge: 120,
    subtotal: 1750,
    discount: 100,
    couponCode: 'WELCOME10',
    total: 1770,
    paymentMethod: 'COD',
    paymentStatus: 'PENDING_VERIFICATION',
    orderStatus: 'CONFIRMED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      {
        id: 'item-3',
        orderId: 'ord-2',
        productName: 'Ergonomic U-Shaped Full Body Maternity Pregnancy Pillow',
        productImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',
        price: 1750,
        quantity: 1,
        total: 1750,
      },
    ],
    payments: [],
  },
];

let memoryCoupons: CouponItem[] = [...INITIAL_COUPONS];
let memoryBanners: BannerItem[] = [...INITIAL_BANNERS];

function loadCategoriesFromFile(): CategoryItem[] {
  ensureDataDir();
  try {
    if (fs.existsSync(CATEGORIES_FILE)) {
      const data = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('Error reading categories file:', err);
  }
  const initial = [...INITIAL_CATEGORIES];
  saveCategoriesToFile(initial);
  return initial;
}

function saveCategoriesToFile(cats: CategoryItem[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(cats, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving categories file:', err);
  }
}

function loadProductsFromFile(): ProductItem[] {
  ensureDataDir();
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data.map(normalizeProduct).filter(isNotDeleted);
      }
    }
  } catch (err) {
    console.error('Error reading products file:', err);
  }
  const initial = INITIAL_PRODUCTS.map(normalizeProduct).filter(isNotDeleted);
  saveProductsToFile(initial);
  return initial;
}

function saveProductsToFile(prods: ProductItem[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(prods, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving products file:', err);
  }
}

function loadSettingsFromFile(): StoreSettings {
  ensureDataDir();
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
      if (data && typeof data === 'object') {
        if (data.deliveryInsideDhaka === 60 || data.insideDhakaFee === 60) {
          data.insideDhakaFee = 70;
        }
        if (!data.suburbsDhakaFee) {
          data.suburbsDhakaFee = 100;
        }
        if (!data.outsideDhakaFee || data.outsideDhakaFee === 120 || data.deliveryOutsideDhaka === 120) {
          data.outsideDhakaFee = 130;
        }
        return data;
      }
    }
  } catch (err) {
    console.error('Error reading settings file:', err);
  }
  const initial = { ...INITIAL_SETTINGS };
  saveSettingsToFile(initial);
  return initial;
}

function saveSettingsToFile(settings: StoreSettings) {
  ensureDataDir();
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving settings file:', err);
  }
}

function normalizeOrders(orders: OrderRecord[]): OrderRecord[] {
  let changed = false;
  let prods: any[] = [];
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      prods = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    }
  } catch {}

  const normalized = orders.map((o) => {
    if (!o.items || !Array.isArray(o.items)) return o;
    const items = o.items.map((it: any) => {
      let matched: any = undefined;
      if (it.productId) {
        matched = prods.find((p) => p.id === it.productId || p.slug === it.productId);
      }
      if (!matched && it.productName) {
        matched = prods.find(
          (p) =>
            (p.name && p.name.toLowerCase() === it.productName.toLowerCase()) ||
            (p.title && p.title.toLowerCase() === it.productName.toLowerCase())
        );
      }

      let updatedIt = { ...it };
      if (!updatedIt.productName || updatedIt.productName === 'Product Item' || updatedIt.productName.trim() === '') {
        if (matched) {
          updatedIt.productName = matched.name || matched.title;
          changed = true;
        } else if (updatedIt.productId) {
          updatedIt.productName = `Product (${updatedIt.productId})`;
          changed = true;
        }
      }

      if (!updatedIt.sku || updatedIt.sku.trim() === '') {
        if (matched?.sku) {
          updatedIt.sku = matched.sku;
          changed = true;
        } else if (it.id) {
          updatedIt.sku = it.id.startsWith('item-') ? it.id : (it.productId || it.id);
          changed = true;
        }
      }

      if (!updatedIt.productImage && matched?.image) {
        updatedIt.productImage = matched.image;
        changed = true;
      }

      if (!updatedIt.total || updatedIt.total === 0) {
        updatedIt.total = Number(updatedIt.price || 0) * Number(updatedIt.quantity || 1);
        changed = true;
      }

      return updatedIt;
    });

    return {
      ...o,
      items,
    };
  });

  if (changed) {
    try {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(normalized, null, 2), 'utf8');
    } catch {}
  }
  return normalized;
}

function loadOrdersFromFile(): OrderRecord[] {
  ensureDataDir();
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      if (Array.isArray(data)) {
        return normalizeOrders(data);
      }
    }
  } catch (err) {
    console.error('Error reading orders file:', err);
  }
  const initial = normalizeOrders([...INITIAL_SAMPLE_ORDERS]);
  saveOrdersToFile(initial);
  return initial;
}

function saveOrdersToFile(orders: OrderRecord[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving orders file:', err);
  }
}

const ALLOWED_ORGANIC_IDS = new Set([
  'p-org-pure-cow-ghee',
  'p-org-mustard-oil-1l',
  'p-org-sundarbans-honey',
  'p-org-homemade-pickle',
]);

function isAllowedOrganicProduct(_p: any): boolean {
  // All active organic and catalogue products are allowed to be displayed
  return true;
}

function patchOrganicProduct(p: any): ProductItem {
  if (!p) return p;
  const id = p.id || '';
  const slug = p.slug || '';

  if (id === 'p-org-pure-cow-ghee' || slug.includes('cow-milk-ghee') || slug.includes('danadar-pure-cow-ghee')) {
    if (!p.image) p.image = '/images/organic-pure-ghee.jpg';
    if (!p.images || p.images.length === 0) p.images = ['/images/organic-pure-ghee.jpg'];
    if (!p.name) p.name = 'Jawata Mart Special Offer Danadar Pure Cow Ghee (খাঁটি দানাদার গাওয়া ঘি - ৫০০ গ্রাম)';
    if (!p.badge) p.badge = 'Special Offer 🔥';
  } else if (id === 'p-org-mustard-oil-1l' || slug.includes('mustard-oil') || slug.includes('wood-ghani')) {
    if (!p.image) p.image = '/images/organic-mustard-oil.jpg';
    if (!p.images || p.images.length === 0) p.images = ['/images/organic-mustard-oil.jpg'];
    if (!p.name) p.name = 'Jawata Mart Special Offer Pure Wood Ghani Mustard Oil (জাওয়াটা মার্ট কাঠের ঘানি ভাঙা খাঁটি সরিষার তেল - ১ লিটার)';
    if (!p.badge) p.badge = 'Special Offer 🔥';
  } else if (id === 'p-org-sundarbans-honey' || slug.includes('sundarbans-wild-flower-honey') || slug.includes('pure-natural-raw-honey')) {
    if (!p.image) p.image = '/images/organic-natural-honey.png';
    if (!p.images || p.images.length === 0) p.images = ['/images/organic-natural-honey.png'];
    if (!p.name) p.name = 'Jawata Mart 100% Pure Natural Raw Honey (খাঁটি প্রাকৃতিক সুন্দরবন মধু - ৫০০ গ্রাম)';
    if (!p.badge) p.badge = '100% Pure Raw 🍯';
  } else if (id === 'p-org-homemade-pickle' || slug.includes('homemade-mango-pickle')) {
    if (!p.image) p.image = '/images/organic-homemade-pickle.jpg';
    if (!p.images || p.images.length === 0) p.images = ['/images/organic-homemade-pickle.jpg'];
    if (!p.name) p.name = 'Jawata Mart Traditional Homemade Raw Mango Pickle (টক-ঝাল-মিষ্টি ঘরোয়া আমের আচার - ৫০০ গ্রাম)';
    if (!p.badge) p.badge = 'Homemade Special 🌶️';
  }
  return p;
}

function normalizeProduct(p: any): ProductItem {
  if (!p) return p;
  p = patchOrganicProduct(p);

  // Fallback price protection (never silently show ৳0)
  const validPrice = parseRobustPrice(p.price);
  if (validPrice === null) {
    p.price = p.originalPrice ? (parseRobustPrice(p.originalPrice) || 500) : 500;
  } else {
    p.price = validPrice;
  }

  // Remove invalid or zero originalPrice to prevent stray '0' display bug
  if (p.originalPrice !== undefined && p.originalPrice !== null) {
    const validOrig = parseRobustPrice(p.originalPrice);
    if (validOrig === null || validOrig <= 0) {
      delete p.originalPrice;
    } else {
      p.originalPrice = validOrig;
    }
  }

  // Multi-Category Migration & Normalization
  let cats: string[] = [];
  if (Array.isArray(p.categories) && p.categories.length > 0) {
    cats = p.categories;
  } else if (p.specifications && typeof p.specifications === 'object' && Array.isArray(p.specifications._categories)) {
    cats = p.specifications._categories;
  } else if (typeof p.categoryName === 'string' && p.categoryName.trim()) {
    cats = [p.categoryName.trim()];
  } else if (p.category && typeof p.category.name === 'string') {
    cats = [p.category.name.trim()];
  } else {
    cats = ['General'];
  }
  p.categories = Array.from(new Set(cats.map((c) => String(c).trim()).filter(Boolean)));

  // Variant normalization
  if (Array.isArray(p.variants) && p.variants.length > 0) {
    try {
      p.variants = normalizeVariants(p.variants, p.image, p.price);
      p.stock = p.variants.reduce((sum: number, v: ProductVariant) => sum + (Number(v.stock) || 0), 0);
    } catch {
      // Keep existing variants if normalization threw
    }
  } else {
    p.variants = [];
  }

  if (Array.isArray(p.mergedFromSlugs)) {
    p.mergedFromSlugs = Array.from(new Set(p.mergedFromSlugs.map((s: any) => String(s).trim()).filter(Boolean)));
  } else {
    p.mergedFromSlugs = [];
  }

  return p;
}

const withTimeout = <T>(promise: Promise<T>, ms = 1200): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), ms)),
  ]);

const productCache = new Map<string, { data: ProductItem[]; time: number }>();
const singleProductCache = new Map<string, { data: ProductItem | null; time: number }>();
let categoryCache: { data: CategoryItem[]; time: number } | null = null;
const CACHE_TTL = 1000; // 1 second

export const dbService = {
  // PRODUCTS
  async getProducts(params?: {
    categorySlug?: string;
    subCategorySlug?: string;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNew?: boolean;
    limit?: number;
    includeInactive?: boolean;
  }): Promise<ProductItem[]> {
    const cacheKey = JSON.stringify(params || {});
    const hit = productCache.get(cacheKey);
    if (hit && Date.now() - hit.time < CACHE_TTL) {
      return hit.data;
    }

    try {
      if (process.env.DATABASE_URL && prisma.product) {
        const where: any = {};
        if (!params?.includeInactive) {
          where.isActive = true;
        }
        if (params?.isFeatured !== undefined) where.isFeatured = params.isFeatured;
        if (params?.isBestSeller !== undefined) where.isBestSeller = params.isBestSeller;
        if (params?.isNew !== undefined) where.isNew = params.isNew;
        if (params?.categorySlug) {
          const loadedCats = loadCategoriesFromFile();
          const matchedCat = loadedCats.find((c) => c.slug === params.categorySlug || c.id === params.categorySlug) ||
            INITIAL_CATEGORIES.find((c) => c.slug === params.categorySlug);
          const catNameOrSlug = matchedCat ? matchedCat.name : params.categorySlug;
          where.OR = [
            { category: { slug: params.categorySlug } },
            { category: { name: { equals: catNameOrSlug, mode: 'insensitive' } } },
            { specifications: { contains: params.categorySlug, mode: 'insensitive' } },
            { specifications: { contains: catNameOrSlug, mode: 'insensitive' } },
          ];
        }
        if (params?.subCategorySlug) {
          where.subCategory = { slug: params.subCategorySlug };
        }
        if (params?.search) {
          const searchFilters = [
            { name: { contains: params.search, mode: 'insensitive' } },
            { description: { contains: params.search, mode: 'insensitive' } },
            { sku: { contains: params.search, mode: 'insensitive' } },
            { brand: { contains: params.search, mode: 'insensitive' } },
            { specifications: { contains: params.search, mode: 'insensitive' } },
            { category: { name: { contains: params.search, mode: 'insensitive' } } },
            { subCategory: { name: { contains: params.search, mode: 'insensitive' } } },
            { variants: { some: { OR: [{ name: { contains: params.search, mode: 'insensitive' } }, { sku: { contains: params.search, mode: 'insensitive' } }] } } },
          ];
          if (where.OR) {
            where.AND = [{ OR: where.OR }, { OR: searchFilters }];
            delete where.OR;
          } else {
            where.OR = searchFilters;
          }
        }

        const items = await withTimeout(
          prisma.product.findMany({
            where,
            include: { category: true, subCategory: true, variants: true },
            take: params?.limit || 100,
            orderBy: { createdAt: 'desc' },
          }),
          800
        );

        if (items.length > 0) {
          const mapped = items.map((p) => {
            let specs: any = {};
            try {
              specs = p.specifications ? JSON.parse(p.specifications) : {};
            } catch {}
            return normalizeProduct({
              ...p,
              images: p.images ? JSON.parse(p.images) : [p.image],
              specifications: specs,
              categories: (specs && Array.isArray(specs._categories)) ? specs._categories : undefined,
              categoryName: p.category.name,
              categorySlug: p.category.slug,
              subCategoryName: p.subCategory?.name,
              subCategorySlug: p.subCategory?.slug,
            });
          });

          const result = mapped.filter(isNotDeleted);
          productCache.set(cacheKey, { data: result, time: Date.now() });
          return result;
        }
      }
    } catch {
      // Fall through to file store
    }

    // Disk File Store Filtering
    let list = loadProductsFromFile().map(normalizeProduct).filter(isNotDeleted);
    if (!params?.includeInactive) {
      list = list.filter((p) => p.isActive !== false);
    }
    if (params?.categorySlug) {
      const targetCat = params.categorySlug.toLowerCase();
      list = list.filter((p) =>
        p.categorySlug?.toLowerCase() === targetCat ||
        p.categoryId?.toLowerCase() === targetCat ||
        (Array.isArray(p.categories) &&
          p.categories.some(
            (c) =>
              c.toLowerCase() === targetCat ||
              c.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(targetCat)
          ))
      );
    }
    if (params?.subCategorySlug) {
      const targetSub = params.subCategorySlug.toLowerCase();
      list = list.filter(
        (p) =>
          p.subCategorySlug?.toLowerCase() === targetSub ||
          p.subCategoryId?.toLowerCase() === targetSub ||
          (p.subCategoryName && p.subCategoryName.toLowerCase() === targetSub) ||
          (p.subCategoryName && p.subCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(targetSub)) ||
          (Array.isArray(p.categories) &&
            p.categories.some(
              (c) =>
                c.toLowerCase() === targetSub ||
                c.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(targetSub)
            ))
      );
    }
    if (params?.isFeatured !== undefined) {
      list = list.filter((p) => p.isFeatured === params.isFeatured);
    }
    if (params?.isBestSeller !== undefined) {
      list = list.filter((p) => p.isBestSeller === params.isBestSeller);
    }
    if (params?.isNew !== undefined) {
      list = list.filter((p) => p.isNew === params.isNew);
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      const isHoneySearch = q === 'modhu' || q === 'madhu' || q === 'honey' || q.includes('মধু');
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          (p.subCategoryName && p.subCategoryName.toLowerCase().includes(q)) ||
          (Array.isArray(p.categories) && p.categories.some((c) => c.toLowerCase().includes(q))) ||
          (Array.isArray(p.variants) && p.variants.some((v) =>
            v.name.toLowerCase().includes(q) ||
            v.sku.toLowerCase().includes(q)
          )) ||
          (isHoneySearch && (
            p.slug.includes('honey') ||
            p.slug.includes('modhu') ||
            p.name.toLowerCase().includes('honey') ||
            p.name.toLowerCase().includes('modhu') ||
            p.name.includes('মধু') ||
            (p.subCategoryName && p.subCategoryName.includes('মধু'))
          ))
      );
    }
    if (params?.limit) {
      list = list.slice(0, params.limit);
    }
    productCache.set(cacheKey, { data: list, time: Date.now() });
    return list;
  },

  async getProductBySlug(slug: string): Promise<ProductItem | null> {
    const hit = singleProductCache.get(slug);
    if (hit && Date.now() - hit.time < CACHE_TTL) {
      return hit.data;
    }

    try {
      if (process.env.DATABASE_URL && prisma.product) {
        const item = await withTimeout(
          prisma.product.findUnique({
            where: { slug },
            include: { category: true, subCategory: true, variants: true, reviews: true },
          }),
          800
        );
        if (item && isNotDeleted(item)) {
          const res = patchOrganicProduct({
            ...item,
            images: item.images ? JSON.parse(item.images) : [item.image],
            specifications: item.specifications ? JSON.parse(item.specifications) : {},
            categoryName: item.category.name,
            categorySlug: item.category.slug,
            subCategoryName: item.subCategory?.name,
          });
          singleProductCache.set(slug, { data: res, time: Date.now() });
          return res;
        }
      }
    } catch {
      // Fall through
    }
    const allProds = loadProductsFromFile();
    let mem = allProds.find((p) => p.slug === slug && isNotDeleted(p));
    if (!mem) {
      const match = findProductBySlugOrMergedSlug(slug, allProds);
      if (match && isNotDeleted(match.product)) {
        mem = match.product;
      }
    }
    const fallbackRes = mem ? patchOrganicProduct(mem) : null;
    singleProductCache.set(slug, { data: fallbackRes, time: Date.now() });
    return fallbackRes;
  },

  async addProduct(data: any): Promise<ProductItem> {
    let slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const validPrice = parseRobustPrice(data.price);
    if (validPrice === null || validPrice <= 0) {
      throw new Error('Valid positive product price is required');
    }

    const prods = loadProductsFromFile();
    if (prods.some((p) => p.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // SKU Resolution & Uniqueness Verification
    const resolvedSku =
      typeof data.sku === 'string' && data.sku.trim()
        ? data.sku.trim().toUpperCase()
        : `JM-${Date.now().toString(36).toUpperCase()}`;

    const existingSkuOwner = prods.find((p) => {
      if (p.sku && p.sku.trim().toUpperCase() === resolvedSku) return true;
      if (Array.isArray(p.variants) && p.variants.some((v) => v.sku && v.sku.trim().toUpperCase() === resolvedSku)) return true;
      return false;
    });
    if (existingSkuOwner) {
      throw new Error(
        `SKU "${resolvedSku}" is already in use by product or variant in "${existingSkuOwner.name}". SKUs must be unique.`
      );
    }

    const cleanCategories = Array.isArray(data.categories) && data.categories.length > 0
      ? Array.from(new Set(data.categories.map((c: any) => String(c).trim()).filter(Boolean)))
      : (data.categoryName ? [data.categoryName] : ['General']);

    const specs = data.specifications && typeof data.specifications === 'object'
      ? { ...data.specifications, _categories: cleanCategories }
      : { _categories: cleanCategories };

    let normalizedVariants: ProductVariant[] = [];
    if (Array.isArray(data.variants) && data.variants.length > 0) {
      normalizedVariants = normalizeVariants(data.variants, data.image, validPrice);
      const skuCheck = validateVariantSkus(normalizedVariants, 'new_product', prods, resolvedSku);
      if (!skuCheck.valid) {
        throw new Error(skuCheck.error);
      }
    }

    const calculatedStock = normalizedVariants.length > 0
      ? normalizedVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : (Number(data.stock) || 50);

    const newProduct: ProductItem = normalizeProduct({
      id: `prod_${Date.now()}`,
      name: data.name,
      slug,
      categoryId: data.categoryId || 'cat-general',
      categoryName: data.categoryName || 'General',
      categorySlug: data.categorySlug || 'general',
      categories: cleanCategories,
      subCategoryId: data.subCategoryId || undefined,
      subCategoryName: data.subCategoryName || undefined,
      subCategorySlug: data.subCategorySlug || undefined,
      brand: data.brand || 'Brand',
      price: validPrice,
      originalPrice: data.originalPrice ? parseRobustPrice(data.originalPrice) || undefined : undefined,
      discount: data.discount ? Number(data.discount) : 0,
      stock: calculatedStock,
      sku: resolvedSku,
      image: data.image || (Array.isArray(data.images) && data.images[0]) || '',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : data.image ? [data.image] : [],
      description: data.description || '',
      specifications: specs,
      badge: data.badge || '',
      isFeatured: !!data.isFeatured,
      isBestSeller: !!data.isBestSeller,
      isNew: !!data.isNew,
      isActive: data.isActive !== false,
      rating: 5.0,
      reviewCount: 0,
      variants: normalizedVariants,
    });

    try {
      if (process.env.DATABASE_URL && prisma.product) {
        await withTimeout(
          prisma.product.create({
            data: {
              name: newProduct.name,
              slug: newProduct.slug,
              categoryId: newProduct.categoryId,
              subCategoryId: newProduct.subCategoryId,
              brand: newProduct.brand,
              price: newProduct.price,
              originalPrice: newProduct.originalPrice,
              discount: newProduct.discount,
              stock: newProduct.stock,
              sku: newProduct.sku,
              image: newProduct.image,
              images: JSON.stringify(newProduct.images),
              description: newProduct.description,
              specifications: JSON.stringify(specs),
              badge: newProduct.badge,
              isFeatured: newProduct.isFeatured,
              isBestSeller: newProduct.isBestSeller,
              isNew: newProduct.isNew,
              isActive: newProduct.isActive,
            },
          }),
          800
        );
      }
    } catch (err) {
      console.error('Error creating product in DB, saving to file fallback:', err);
    }

    removeFromDeletedIds(newProduct.id, newProduct.slug);
    prods.unshift(newProduct);
    saveProductsToFile(prods);

    productCache.clear();
    singleProductCache.clear();
    return newProduct;
  },

  async updateProduct(id: string, data: Partial<ProductItem>): Promise<ProductItem | null> {
    const parsed = data.price !== undefined ? parseRobustPrice(data.price) : undefined;
    if (data.price !== undefined && (parsed === null || parsed === undefined || parsed <= 0)) {
      throw new Error('Valid positive product price is required');
    }
    const validPrice: number | undefined = parsed ?? undefined;
    let validOriginalPrice: number | null | undefined = undefined;
    if (data.originalPrice === null) {
      validOriginalPrice = null;
    } else if (data.originalPrice !== undefined) {
      const parsedOrig = parseRobustPrice(data.originalPrice);
      validOriginalPrice = parsedOrig !== null ? parsedOrig : undefined;
    }

    const prods = loadProductsFromFile();
    const idx = prods.findIndex((p) => p.id === id || p.slug === id);

    // Validate SKU uniqueness on edit
    let resolvedSku = prods[idx]?.sku;
    if (typeof data.sku === 'string' && data.sku.trim()) {
      const candidateSku = data.sku.trim().toUpperCase();
      const duplicateSku = prods.find(
        (p) =>
          (p.id !== id && p.slug !== id) &&
          ((p.sku && p.sku.trim().toUpperCase() === candidateSku) ||
           (Array.isArray(p.variants) && p.variants.some((v) => v.sku && v.sku.trim().toUpperCase() === candidateSku)))
      );
      if (duplicateSku) {
        throw new Error(
          `SKU "${candidateSku}" is already in use by product or variant in "${duplicateSku.name}". SKUs must be unique.`
        );
      }
      resolvedSku = candidateSku;
    }

    // Validate and normalize variants if passed
    let normalizedVariants: ProductVariant[] | undefined = undefined;
    if (Array.isArray(data.variants)) {
      normalizedVariants = normalizeVariants(
        data.variants,
        data.image || prods[idx]?.image || '',
        validPrice !== undefined ? validPrice : (prods[idx]?.price || 0)
      );
      const skuCheck = validateVariantSkus(
        normalizedVariants,
        prods[idx]?.id || id,
        prods,
        resolvedSku || prods[idx]?.sku
      );
      if (!skuCheck.valid) {
        throw new Error(skuCheck.error);
      }
    }

    const cleanCategories = Array.isArray(data.categories) && data.categories.length > 0
      ? Array.from(new Set(data.categories.map((c: any) => String(c).trim()).filter(Boolean)))
      : undefined;

    let updatedPrisma: any = null;
    try {
      if (process.env.DATABASE_URL && prisma.product) {
        let currentSpecs: Record<string, any> = {};
        if (data.specifications && typeof data.specifications === 'object') {
          currentSpecs = { ...data.specifications };
        }
        if (cleanCategories) {
          currentSpecs._categories = cleanCategories;
        }

        updatedPrisma = await withTimeout(
          prisma.product.update({
            where: { id },
            data: {
              name: data.name,
              price: validPrice,
              originalPrice: validOriginalPrice,
              stock: data.stock !== undefined ? Number(data.stock) : undefined,
              badge: data.badge,
              image: data.image,
              images: data.images ? JSON.stringify(data.images) : undefined,
              description: data.description,
              categoryId: data.categoryId,
              subCategoryId: data.subCategoryId,
              sku: resolvedSku,
              specifications: Object.keys(currentSpecs).length > 0 ? JSON.stringify(currentSpecs) : undefined,
            },
            include: { category: true, subCategory: true, variants: true }
          }),
          800
        );
      }
    } catch (err) {
      console.error('Error updating product in Prisma:', err);
    }

    productCache.clear();
    singleProductCache.clear();

    if (idx !== -1) {
      const targetOriginalPrice =
        validOriginalPrice === null
          ? undefined
          : validOriginalPrice !== undefined
          ? validOriginalPrice
          : prods[idx].originalPrice;

      const candidateName =
        typeof data.name === 'string' && data.name.trim()
          ? data.name.trim()
          : typeof (data as any)?.title === 'string' && (data as any).title.trim()
          ? (data as any).title.trim()
          : prods[idx].name;

      const candidateVariants = normalizedVariants !== undefined ? normalizedVariants : prods[idx].variants;
      const calculatedStock = Array.isArray(candidateVariants) && candidateVariants.length > 0
        ? candidateVariants.reduce((sum: number, v: ProductVariant) => sum + (Number(v.stock) || 0), 0)
        : (data.stock !== undefined ? Number(data.stock) : prods[idx].stock);

      const updatedRaw: any = {
        ...prods[idx],
        ...data,
        name: candidateName,
        sku: resolvedSku || prods[idx].sku,
        stock: calculatedStock,
        variants: candidateVariants,
        subCategoryId: data.subCategoryId !== undefined ? data.subCategoryId : prods[idx].subCategoryId,
        subCategoryName: data.subCategoryName !== undefined ? data.subCategoryName : prods[idx].subCategoryName,
        subCategorySlug: data.subCategorySlug !== undefined ? data.subCategorySlug : prods[idx].subCategorySlug,
        price: validPrice !== undefined ? validPrice : prods[idx].price,
        originalPrice: targetOriginalPrice,
        categories: cleanCategories || prods[idx].categories,
      };

      if (targetOriginalPrice === undefined) {
        delete updatedRaw.originalPrice;
      }

      prods[idx] = normalizeProduct(updatedRaw);
      saveProductsToFile(prods);
      return prods[idx];
    } else if (updatedPrisma) {
      const normalized = normalizeProduct({
        ...updatedPrisma,
        images: updatedPrisma.images ? JSON.parse(updatedPrisma.images) : [updatedPrisma.image],
        specifications: updatedPrisma.specifications ? JSON.parse(updatedPrisma.specifications) : {},
        categories: cleanCategories || (updatedPrisma.category?.name ? [updatedPrisma.category.name] : ['General']),
        categoryName: updatedPrisma.category?.name,
        categorySlug: updatedPrisma.category?.slug,
        subCategoryName: updatedPrisma.subCategory?.name,
        subCategorySlug: updatedPrisma.subCategory?.slug,
        sku: resolvedSku,
      });
      prods.unshift(normalized);
      saveProductsToFile(prods);
      return normalized;
    }
    return null;
  },

  async mergeProducts(mainProductId: string, productIdsToMerge: string[]): Promise<ProductItem> {
    const prods = loadProductsFromFile();
    const mainIdx = prods.findIndex((p) => p.id === mainProductId || p.slug === mainProductId);
    if (mainIdx === -1) {
      throw new Error(`Main product with ID/slug "${mainProductId}" not found.`);
    }

    const mainProduct = prods[mainIdx];
    let currentVariants: ProductVariant[] = Array.isArray(mainProduct.variants) ? [...mainProduct.variants] : [];
    const mergedFromSlugs: string[] = Array.isArray(mainProduct.mergedFromSlugs) ? [...mainProduct.mergedFromSlugs] : [];

    // If mainProduct had no variants before, create the first variant representing itself
    if (currentVariants.length === 0) {
      currentVariants.push({
        id: `var_${Date.now()}_main`,
        productId: mainProduct.id,
        name: mainProduct.name || 'Default',
        sku: mainProduct.sku || `JM-${Date.now().toString(36).toUpperCase()}`,
        price: mainProduct.price,
        regularPrice: mainProduct.originalPrice || null,
        stock: mainProduct.stock,
        image: mainProduct.image,
        images: mainProduct.images || (mainProduct.image ? [mainProduct.image] : []),
        isActive: mainProduct.isActive !== false,
        order: 0,
      });
    }

    const seenSkus = new Set(currentVariants.map((v) => v.sku?.trim().toUpperCase()).filter(Boolean));

    for (const mergeId of productIdsToMerge) {
      if (mergeId === mainProductId || mergeId === mainProduct.id || mergeId === mainProduct.slug) continue;
      const sIdx = prods.findIndex((p) => p.id === mergeId || p.slug === mergeId);
      if (sIdx === -1) continue;
      const source = prods[sIdx];

      // Record old slug for redirect
      if (source.slug && !mergedFromSlugs.includes(source.slug)) {
        mergedFromSlugs.push(source.slug);
      }

      if (Array.isArray(source.variants) && source.variants.length > 0) {
        for (const sv of source.variants) {
          let varSku = sv.sku ? sv.sku.trim().toUpperCase() : `JM-${Date.now().toString(36).toUpperCase()}`;
          if (seenSkus.has(varSku)) {
            varSku = `${varSku}-M`;
          }
          seenSkus.add(varSku);
          currentVariants.push({
            id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            productId: mainProduct.id,
            name: sv.name,
            sku: varSku,
            price: sv.price,
            regularPrice: sv.regularPrice || null,
            stock: sv.stock,
            image: sv.image || source.image,
            images: sv.images || source.images || [source.image],
            isActive: sv.isActive !== false,
            order: currentVariants.length,
          });
        }
      } else {
        let varSku = source.sku ? source.sku.trim().toUpperCase() : `JM-${Date.now().toString(36).toUpperCase()}`;
        if (seenSkus.has(varSku)) {
          varSku = `${varSku}-M`;
        }
        seenSkus.add(varSku);
        currentVariants.push({
          id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          productId: mainProduct.id,
          name: source.name,
          sku: varSku,
          price: source.price,
          regularPrice: source.originalPrice || null,
          stock: source.stock,
          image: source.image,
          images: source.images || (source.image ? [source.image] : []),
          isActive: source.isActive !== false,
          order: currentVariants.length,
        });
      }

      // Mark source product as deleted/merged so it no longer appears in storefront
      saveDeletedId(source.id, source.slug);
      prods.splice(sIdx, 1);
    }

    mainProduct.variants = currentVariants;
    mainProduct.mergedFromSlugs = mergedFromSlugs;
    mainProduct.stock = currentVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

    saveProductsToFile(prods);
    productCache.clear();
    singleProductCache.clear();

    return mainProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    let productSlug = '';
    const prods = loadProductsFromFile();
    const memItem = prods.find((p) => p.id === id || p.slug === id);
    if (memItem) productSlug = memItem.slug;

    // Block deletion if product is referenced in any customer order
    const orders = loadOrdersFromFile();
    const refOrder = orders.find((o) =>
      o.items &&
      o.items.some(
        (it) =>
          it.productId === id ||
          (memItem && it.productId === memItem.id) ||
          (productSlug && (it as any).productSlug === productSlug)
      )
    );
    if (refOrder) {
      throw new Error(
        `Cannot delete product "${memItem?.name || id}". It is referenced in order #${refOrder.orderNumber}. Products linked to customer orders cannot be deleted.`
      );
    }

    try {
      if (process.env.DATABASE_URL && prisma.product) {
        const existing = await prisma.product.findFirst({
          where: { OR: [{ id }, { slug: id }] },
        });
        if (existing) {
          productSlug = existing.slug;
          await prisma.productVariant.deleteMany({ where: { productId: existing.id } }).catch(() => {});
          await prisma.review.deleteMany({ where: { productId: existing.id } }).catch(() => {});
          await prisma.orderItem.updateMany({
            where: { productId: existing.id },
            data: { productId: null },
          }).catch(() => {});
          await prisma.product.delete({ where: { id: existing.id } });
        }
      }
    } catch (e) {
      console.error('Error permanently deleting product:', e);
    }

    saveDeletedId(id, productSlug);
    const updatedProds = prods.filter(
      (p) => p.id !== id && p.slug !== id && (productSlug ? p.slug !== productSlug : true)
    );
    saveProductsToFile(updatedProds);
    productCache.clear();
    singleProductCache.clear();
    return true;
  },

  // CATEGORIES
  async getCategories(): Promise<CategoryItem[]> {
    if (categoryCache && Date.now() - categoryCache.time < CACHE_TTL) {
      return categoryCache.data;
    }

    const prods = loadProductsFromFile().map(normalizeProduct).filter(isNotDeleted).filter((p) => p.isActive !== false);

    const countProductsForCategory = (cat: { id: string; name: string; slug: string }) => {
      const catNameLower = cat.name.toLowerCase();
      const catSlugLower = cat.slug.toLowerCase();
      return prods.filter(
        (p) =>
          p.categoryId === cat.id ||
          p.categorySlug === cat.slug ||
          (Array.isArray(p.categories) &&
            p.categories.some(
              (c) =>
                c.toLowerCase() === catNameLower ||
                c.toLowerCase() === catSlugLower ||
                c.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(catSlugLower)
            ))
      ).length;
    };

    try {
      if (process.env.DATABASE_URL && prisma.category) {
        const cats = await withTimeout(
          prisma.category.findMany({
            where: { isActive: true },
            include: { subCategories: true },
            orderBy: { order: 'asc' },
          }),
          800
        );
        if (cats && cats.length > 0) {
          const res = cats.map((c) => ({
            ...c,
            productCount: countProductsForCategory(c),
          }));
          categoryCache = { data: res, time: Date.now() };
          return res;
        }
      }
    } catch {
      // Fall through to disk file
    }

    const fileCats = loadCategoriesFromFile();
    const enriched = fileCats.map((c) => ({
      ...c,
      productCount: countProductsForCategory(c),
    }));
    categoryCache = { data: enriched, time: Date.now() };
    return enriched;
  },

  async addCategory(data: any): Promise<CategoryItem> {
    const fileCats = loadCategoriesFromFile();
    const trimmedName = (data.name || '').trim();
    if (!trimmedName) {
      throw new Error('Category name is required.');
    }

    const nameLower = trimmedName.toLowerCase();
    const existing = fileCats.find((c) => c.name.trim().toLowerCase() === nameLower);
    if (existing) {
      throw new Error(`Category "${trimmedName}" already exists.`);
    }

    const slug =
      data.slug ||
      trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const id = data.id || `cat-${slug || Date.now()}`;
    const newCat: CategoryItem = {
      id,
      name: trimmedName,
      slug,
      image: data.image || '',
      description: data.description || '',
      icon: data.icon || null,
      isFeatured: !!data.isFeatured,
      order: fileCats.length + 1,
      isActive: true,
      subCategories: [],
    };

    try {
      if (process.env.DATABASE_URL && prisma.category) {
        await withTimeout(
          prisma.category.create({
            data: {
              id: newCat.id,
              name: newCat.name,
              slug: newCat.slug,
              image: newCat.image,
              description: newCat.description,
              isFeatured: newCat.isFeatured,
              order: newCat.order,
              isActive: newCat.isActive,
            },
          }),
          800
        );
      }
    } catch {
      // Fallback
    }

    fileCats.push(newCat);
    saveCategoriesToFile(fileCats);
    categoryCache = null;
    return newCat;
  },

  async updateCategory(id: string, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
    const fileCats = loadCategoriesFromFile();
    const existingCat = fileCats.find((c) => c.id === id || c.slug === id);
    const newName = data.name ? data.name.trim() : undefined;

    if (newName && existingCat && newName.toLowerCase() !== existingCat.name.trim().toLowerCase()) {
      const duplicate = fileCats.find(
        (c) => c.id !== existingCat.id && c.name.trim().toLowerCase() === newName.toLowerCase()
      );
      if (duplicate) {
        throw new Error(`Category "${newName}" already exists.`);
      }
    }

    const oldName = existingCat ? existingCat.name : null;

    try {
      if (process.env.DATABASE_URL && prisma.category) {
        await withTimeout(
          prisma.category.update({
            where: { id: existingCat ? existingCat.id : id },
            data: {
              name: newName || data.name,
              slug: data.slug,
              image: data.image,
              description: data.description,
              isActive: data.isActive,
            },
          }),
          800
        );
      }
    } catch {
      // Fallback
    }

    const idx = fileCats.findIndex((c) => c.id === id || c.slug === id);
    if (idx !== -1) {
      fileCats[idx] = {
        ...fileCats[idx],
        ...data,
        name: newName || fileCats[idx].name,
      };
      saveCategoriesToFile(fileCats);

      // Rename category on all products referencing oldName
      if (oldName && newName && oldName !== newName) {
        const prods = loadProductsFromFile();
        let prodsChanged = false;
        prods.forEach((p) => {
          if (p.categories && p.categories.includes(oldName)) {
            p.categories = p.categories.map((c) => (c === oldName ? newName : c));
            prodsChanged = true;
          }
          if (p.categoryName === oldName) {
            p.categoryName = newName;
            prodsChanged = true;
          }
        });
        if (prodsChanged) {
          saveProductsToFile(prods);
          productCache.clear();
          singleProductCache.clear();
        }
      }

      categoryCache = null;
      return fileCats[idx];
    }
    return null;
  },

  async deleteCategory(id: string): Promise<boolean> {
    let fileCats = loadCategoriesFromFile();
    const targetCat = fileCats.find((c) => c.id === id || c.slug === id);
    if (!targetCat) return false;

    // Ensure "General" category exists
    let generalCat = fileCats.find((c) => c.name.toLowerCase() === 'general' || c.id === 'cat-general');
    if (!generalCat) {
      generalCat = {
        id: 'cat-general',
        name: 'General',
        slug: 'general',
        image: '',
        description: 'General Category',
        isFeatured: false,
        order: fileCats.length + 1,
        isActive: true,
        subCategories: [],
      };
      fileCats.push(generalCat);
      try {
        if (process.env.DATABASE_URL && prisma.category) {
          await prisma.category.upsert({
            where: { id: 'cat-general' },
            create: {
              id: 'cat-general',
              name: 'General',
              slug: 'general',
              order: 99,
              isActive: true,
            },
            update: {},
          });
        }
      } catch {}
    }

    // 1. Remove category from categories list
    fileCats = fileCats.filter((c) => c.id !== targetCat.id);
    saveCategoriesToFile(fileCats);

    // 2. Move products from deleted category to General (NEVER DELETE PRODUCTS!)
    const prods = loadProductsFromFile();
    let prodsChanged = false;
    prods.forEach((p) => {
      if (p.categoryId === targetCat.id || p.categorySlug === targetCat.slug) {
        p.categoryId = generalCat!.id;
        p.categorySlug = generalCat!.slug;
        p.categoryName = generalCat!.name;
        prodsChanged = true;
      }
      if (Array.isArray(p.categories)) {
        if (p.categories.includes(targetCat.name)) {
          p.categories = p.categories.map((c) => (c === targetCat.name ? 'General' : c));
          p.categories = Array.from(new Set(p.categories.filter(Boolean)));
          if (p.categories.length === 0) {
            p.categories = ['General'];
          }
          prodsChanged = true;
        }
      }
    });
    if (prodsChanged) {
      saveProductsToFile(prods);
      productCache.clear();
      singleProductCache.clear();
    }

    try {
      if (process.env.DATABASE_URL && prisma.category) {
        await prisma.product.updateMany({
          where: { categoryId: targetCat.id },
          data: { categoryId: generalCat.id },
        }).catch(() => {});

        await prisma.subCategory.deleteMany({ where: { categoryId: targetCat.id } }).catch(() => {});
        await prisma.category.delete({ where: { id: targetCat.id } }).catch(() => {});
      }
    } catch (e) {
      console.error('Error deleting category safely:', e);
    }

    fileCats = fileCats.filter((c) => c.id !== targetCat.id && c.slug !== targetCat.slug);
    saveCategoriesToFile(fileCats);
    categoryCache = null;
    productCache.clear();
    singleProductCache.clear();
    return true;
  },

  async addSubCategory(categoryId: string, data: { name: string; slug?: string }): Promise<SubCategoryItem | null> {
    const trimmedName = (data.name || '').trim();
    if (!trimmedName) {
      throw new Error('Subcategory name is required.');
    }

    const fileCats = loadCategoriesFromFile();
    const cat = fileCats.find((c) => c.id === categoryId || c.slug === categoryId);
    if (!cat) {
      throw new Error('Parent category not found.');
    }

    const nameLower = trimmedName.toLowerCase();
    if (cat.subCategories && cat.subCategories.some((s) => s.name.trim().toLowerCase() === nameLower)) {
      throw new Error(`Subcategory "${trimmedName}" already exists under ${cat.name}.`);
    }

    const slug =
      data.slug ||
      trimmedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const id = `sub-${slug || Date.now()}`;
    const newSub: SubCategoryItem = {
      id,
      categoryId: cat.id,
      name: trimmedName,
      slug,
      order: (cat.subCategories?.length || 0) + 1,
    };

    try {
      if (process.env.DATABASE_URL && prisma.subCategory) {
        await withTimeout(
          prisma.subCategory.create({
            data: {
              id: newSub.id,
              categoryId: newSub.categoryId,
              name: newSub.name,
              slug: newSub.slug,
              order: newSub.order,
            },
          }),
          800
        );
      }
    } catch {
      // Fallback
    }

    if (!cat.subCategories) cat.subCategories = [];
    cat.subCategories.push(newSub);
    saveCategoriesToFile(fileCats);
    categoryCache = null;
    return newSub;
  },

  async updateSubCategory(categoryId: string, subCategoryId: string, data: { name: string; slug?: string }): Promise<SubCategoryItem | null> {
    const trimmedName = (data.name || '').trim();
    if (!trimmedName) {
      throw new Error('Subcategory name is required.');
    }

    const fileCats = loadCategoriesFromFile();
    const cat = fileCats.find((c) => c.id === categoryId || c.slug === categoryId);
    if (!cat || !cat.subCategories) {
      throw new Error('Parent category or subcategories not found.');
    }

    const sub = cat.subCategories.find((s) => s.id === subCategoryId || s.slug === subCategoryId);
    if (!sub) {
      throw new Error('Subcategory not found.');
    }

    const oldName = sub.name;
    sub.name = trimmedName;
    if (data.slug) sub.slug = data.slug.trim();

    // Rename subcategory across all products referencing oldName
    if (oldName !== trimmedName) {
      const prods = loadProductsFromFile();
      let prodsChanged = false;
      prods.forEach((p) => {
        if (p.subCategoryId === sub.id) {
          p.subCategoryName = trimmedName;
          prodsChanged = true;
        }
        if (Array.isArray(p.categories) && p.categories.includes(oldName)) {
          p.categories = p.categories.map((c) => (c === oldName ? trimmedName : c));
          prodsChanged = true;
        }
      });
      if (prodsChanged) {
        saveProductsToFile(prods);
        productCache.clear();
        singleProductCache.clear();
      }
    }

    try {
      if (process.env.DATABASE_URL && prisma.subCategory) {
        await prisma.subCategory.update({
          where: { id: sub.id },
          data: { name: sub.name, slug: sub.slug },
        }).catch(() => {});
      }
    } catch (e) {
      console.error('Error updating subcategory in DB:', e);
    }

    saveCategoriesToFile(fileCats);
    categoryCache = null;
    return sub;
  },

  async deleteSubCategory(categoryId: string, subCategoryId: string): Promise<boolean> {
    const fileCats = loadCategoriesFromFile();
    const cat = fileCats.find((c) => c.id === categoryId || c.slug === categoryId);
    if (!cat) return false;

    const sub = cat.subCategories?.find((s) => s.id === subCategoryId || s.slug === subCategoryId);
    const subName = sub ? sub.name : null;

    // Move products referencing this subcategory to the parent category (NEVER DELETE PRODUCTS!)
    const prods = loadProductsFromFile();
    let prodsChanged = false;
    prods.forEach((p) => {
      if (p.subCategoryId === subCategoryId) {
        p.subCategoryId = undefined;
        prodsChanged = true;
      }
      if (subName && Array.isArray(p.categories) && p.categories.includes(subName)) {
        p.categories = p.categories.map((c) => (c === subName ? cat.name : c));
        p.categories = Array.from(new Set(p.categories.filter(Boolean)));
        if (p.categories.length === 0) {
          p.categories = [cat.name];
        }
        prodsChanged = true;
      }
    });
    if (prodsChanged) {
      saveProductsToFile(prods);
      productCache.clear();
      singleProductCache.clear();
    }

    try {
      if (process.env.DATABASE_URL && prisma.subCategory) {
        await prisma.product.updateMany({
          where: { subCategoryId },
          data: { subCategoryId: null },
        }).catch(() => {});
        await prisma.subCategory.delete({ where: { id: subCategoryId } }).catch(() => {});
      }
    } catch (e) {
      console.error('Error safely deleting subcategory:', e);
    }

    if (cat.subCategories) {
      cat.subCategories = cat.subCategories.filter((s) => s.id !== subCategoryId && s.slug !== subCategoryId);
    }
    saveCategoriesToFile(fileCats);
    categoryCache = null;
    productCache.clear();
    singleProductCache.clear();
    return true;
  },

  // ORDERS
  async createOrder(orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderRecord> {
    const orders = loadOrdersFromFile();
    let orderSeq = 1001 + orders.length;
    try {
      if (process.env.DATABASE_URL && prisma.order) {
        const orderCount = await prisma.order.count().catch(() => 0);
        if (orderCount > 0) orderSeq = 1001 + orderCount;
      }
    } catch {}
    const orderNumber = `JM-${orderSeq}`;
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (process.env.DATABASE_URL && prisma.order) {
        await prisma.order.create({
          data: {
            orderNumber: newOrder.orderNumber,
            customerName: newOrder.customerName,
            customerPhone: newOrder.customerPhone,
            customerEmail: newOrder.customerEmail,
            division: newOrder.division,
            district: newOrder.district,
            area: newOrder.area,
            address: newOrder.address,
            deliveryNote: newOrder.deliveryNote,
            deliveryZone: newOrder.deliveryZone,
            deliveryCharge: newOrder.deliveryCharge,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            couponCode: newOrder.couponCode,
            total: newOrder.total,
            paymentMethod: newOrder.paymentMethod,
            paymentStatus: newOrder.paymentStatus,
            orderStatus: newOrder.orderStatus,
            items: {
              create: newOrder.items.map((i) => ({
                productName: i.productName,
                productImage: i.productImage,
                price: i.price,
                quantity: i.quantity,
                variantName: i.variantName,
                total: i.total,
              })),
            },
            payments: newOrder.payments
              ? {
                  create: newOrder.payments.map((p) => ({
                    method: p.method,
                    amount: p.amount,
                    status: p.status,
                    transactionId: p.transactionId,
                    senderNumber: p.senderNumber,
                  })),
                }
              : undefined,
          },
        });

        // Automatically deduct stock for each ordered item in database
        for (const item of newOrder.items) {
          try {
            if (item.productId) {
              await prisma.product.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } },
              });
            } else if (item.productName) {
              const p = await prisma.product.findFirst({ where: { name: item.productName } });
              if (p) {
                await prisma.product.update({
                  where: { id: p.id },
                  data: { stock: Math.max(0, p.stock - item.quantity) },
                });
              }
            }
          } catch (stockErr) {
            console.error('Stock decrement error:', stockErr);
          }
        }
      }
    } catch {
      // Memory fallback
    }

    // Deduct in products file
    const prods = loadProductsFromFile();
    let prodsChanged = false;
    for (const item of newOrder.items) {
      const p = prods.find((prod) => prod.id === item.productId || prod.name === item.productName);
      if (p) {
        if (Array.isArray(p.variants) && p.variants.length > 0) {
          const itemSkuUpper = item.sku ? item.sku.trim().toUpperCase() : '';
          const itemVarNameUpper = item.variantName ? item.variantName.trim().toUpperCase() : '';

          const targetVariant = p.variants.find(
            (v) =>
              (itemSkuUpper && v.sku && v.sku.trim().toUpperCase() === itemSkuUpper) ||
              (itemVarNameUpper && v.name && v.name.trim().toUpperCase() === itemVarNameUpper) ||
              (itemVarNameUpper && itemVarNameUpper.includes(v.name.trim().toUpperCase()))
          );

          if (targetVariant) {
            targetVariant.stock = Math.max(0, (Number(targetVariant.stock) || 0) - item.quantity);
            p.stock = p.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
            prodsChanged = true;
          } else {
            p.stock = Math.max(0, p.stock - item.quantity);
            prodsChanged = true;
          }
        } else {
          p.stock = Math.max(0, p.stock - item.quantity);
          prodsChanged = true;
        }
      }
    }
    if (prodsChanged) {
      saveProductsToFile(prods);
      productCache.clear();
      singleProductCache.clear();
    }

    orders.unshift(newOrder);
    saveOrdersToFile(orders);
    return newOrder;
  },

  async getOrders(params?: { status?: string; paymentStatus?: string }): Promise<OrderRecord[]> {
    let list = loadOrdersFromFile();
    if (params?.status) {
      list = list.filter((o) => o.orderStatus === params.status);
    }
    if (params?.paymentStatus) {
      list = list.filter((o) => o.paymentStatus === params.paymentStatus);
    }
    return list;
  },

  async getOrderByNumber(orderNumber: string): Promise<OrderRecord | null> {
    const cleanNum = orderNumber.trim().toUpperCase();
    try {
      if (process.env.DATABASE_URL && prisma.order) {
        const ord = await prisma.order.findFirst({
          where: { orderNumber: { equals: cleanNum, mode: 'insensitive' } },
          include: { items: true, payments: true },
        });
        if (ord) {
          return {
            ...ord,
            createdAt: ord.createdAt.toISOString(),
            updatedAt: ord.updatedAt.toISOString(),
            items: ord.items.map((it: any) => ({
              ...it,
              createdAt: it.createdAt ? it.createdAt.toISOString() : new Date().toISOString(),
            })),
            payments: (ord.payments || []).map((p: any) => ({
              ...p,
              createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
            })),
          } as any;
        }
      }
    } catch {}

    const orders = loadOrdersFromFile();
    return (
      orders.find(
        (o) => o.orderNumber.toUpperCase() === cleanNum
      ) || null
    );
  },

  async getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<OrderRecord | null> {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanedPhone = phone.replace(/[\s\-\+]/g, '');

    try {
      if (process.env.DATABASE_URL && prisma.order) {
        const ord = await prisma.order.findFirst({
          where: { orderNumber: { equals: cleanNum, mode: 'insensitive' } },
          include: { items: true, payments: true },
        });
        if (ord) {
          const ordPhone = (ord.customerPhone || '').replace(/[\s\-\+]/g, '');
          if (!cleanedPhone || ordPhone.includes(cleanedPhone.slice(-10)) || cleanedPhone.includes(ordPhone.slice(-10))) {
            return {
              ...ord,
              createdAt: ord.createdAt.toISOString(),
              updatedAt: ord.updatedAt.toISOString(),
              items: ord.items.map((it: any) => ({
                ...it,
                createdAt: it.createdAt ? it.createdAt.toISOString() : new Date().toISOString(),
              })),
              payments: (ord.payments || []).map((p: any) => ({
                ...p,
                createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
              })),
            } as any;
          }
        }
      }
    } catch {}

    const orders = loadOrdersFromFile();
    return (
      orders.find(
        (o) =>
          o.orderNumber.toUpperCase() === cleanNum &&
          (!cleanedPhone || o.customerPhone.replace(/[\s\-\+]/g, '').includes(cleanedPhone.slice(-10)))
      ) || null
    );
  },

  async updateOrderStatus(id: string, orderStatus: string): Promise<OrderRecord | null> {
    const orders = loadOrdersFromFile();
    const order = orders.find((o) => o.id === id || o.orderNumber === id);
    const prevStatus = order?.orderStatus;
    if (order) {
      order.orderStatus = orderStatus as any;
      order.updatedAt = new Date().toISOString();

      // If order was cancelled, restore stock
      if (orderStatus === 'CANCELLED' && prevStatus !== 'CANCELLED') {
        const prods = loadProductsFromFile();
        let prodsChanged = false;
        for (const item of order.items) {
          const p = prods.find((prod) => prod.id === item.productId || prod.name === item.productName);
          if (p) {
            if (Array.isArray(p.variants) && p.variants.length > 0) {
              const itemSkuUpper = item.sku ? item.sku.trim().toUpperCase() : '';
              const itemVarNameUpper = item.variantName ? item.variantName.trim().toUpperCase() : '';

              const targetVariant = p.variants.find(
                (v) =>
                  (itemSkuUpper && v.sku && v.sku.trim().toUpperCase() === itemSkuUpper) ||
                  (itemVarNameUpper && v.name && v.name.trim().toUpperCase() === itemVarNameUpper) ||
                  (itemVarNameUpper && itemVarNameUpper.includes(v.name.trim().toUpperCase()))
              );

              if (targetVariant) {
                targetVariant.stock = (Number(targetVariant.stock) || 0) + item.quantity;
                p.stock = p.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
                prodsChanged = true;
              } else {
                p.stock += item.quantity;
                prodsChanged = true;
              }
            } else {
              p.stock += item.quantity;
              prodsChanged = true;
            }
          }
        }
        if (prodsChanged) {
          saveProductsToFile(prods);
          productCache.clear();
          singleProductCache.clear();
        }
      }

      // If COD order is DELIVERED, automatically mark paymentStatus as PAID
      if (orderStatus === 'DELIVERED' && order.paymentMethod === 'COD' && order.paymentStatus === 'PENDING_VERIFICATION') {
        order.paymentStatus = 'PAID';
      }
      saveOrdersToFile(orders);
    }

    try {
      if (process.env.DATABASE_URL && prisma.order) {
        await prisma.order.updateMany({
          where: { OR: [{ id }, { orderNumber: id }] },
          data: { orderStatus: orderStatus as any, updatedAt: new Date() },
        });
      }
    } catch (e) {
      console.error('Failed to update order status in DB:', e);
    }

    return order || null;
  },

  async verifyPayment(orderId: string, status: PaymentStatus, note?: string): Promise<OrderRecord | null> {
    const orders = loadOrdersFromFile();
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.paymentStatus = status;
      if (status === 'PAID' && order.orderStatus === 'PENDING') {
        order.orderStatus = 'CONFIRMED';
      }
      if (order.payments && order.payments.length > 0) {
        order.payments[0].status = status;
        order.payments[0].verificationNote = note;
        order.payments[0].verifiedAt = new Date().toISOString();
      }
      order.updatedAt = new Date().toISOString();
      saveOrdersToFile(orders);
    }

    try {
      if (process.env.DATABASE_URL && prisma.order) {
        const foundOrder = await prisma.order.findFirst({
          where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
          include: { payments: true },
        });
        if (foundOrder) {
          const updateData: any = { paymentStatus: status, updatedAt: new Date() };
          if (status === 'PAID' && foundOrder.orderStatus === 'PENDING') {
            updateData.orderStatus = 'CONFIRMED';
          }
          await prisma.order.update({
            where: { id: foundOrder.id },
            data: updateData,
          });

          if (foundOrder.payments && foundOrder.payments.length > 0) {
            await prisma.payment.update({
              where: { id: foundOrder.payments[0].id },
              data: {
                status,
                verificationNote: note,
                verifiedAt: new Date(),
              },
            });
          }
        }
      }
    } catch (e) {
      console.error('Failed to update payment status in DB:', e);
    }

    return order || null;
  },

  // SETTINGS
  async getSettings(): Promise<StoreSettings> {
    try {
      const dbSettings = await prisma.setting.findMany();
      if (dbSettings && dbSettings.length > 0) {
        const fileSettings = loadSettingsFromFile();
        const mapped: any = { ...fileSettings };
        for (const s of dbSettings) {
          try {
            mapped[s.key] = JSON.parse(s.value);
          } catch {
            mapped[s.key] = s.value;
          }
        }
        return mapped as StoreSettings;
      }
    } catch {
      // Fallback to disk file
    }
    return loadSettingsFromFile();
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = loadSettingsFromFile();
    const updated = { ...current, ...data };
    saveSettingsToFile(updated);

    try {
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          await prisma.setting.upsert({
            where: { key },
            update: { value: strValue },
            create: { key, value: strValue },
          });
        }
      }
    } catch (e) {
      console.error('Failed to persist settings to DB:', e);
    }
    return updated;
  },

  // COUPONS
  async getCoupons(): Promise<CouponItem[]> {
    return memoryCoupons;
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
    const coupon = memoryCoupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or inactive coupon code' };
    }
    if (subtotal < coupon.minOrder) {
      return { valid: false, discount: 0, message: `Minimum order of ৳${coupon.minOrder} required for this coupon` };
    }

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return { valid: true, discount: Math.round(discount), message: `Coupon applied: ৳${Math.round(discount)} saved!` };
  },

  // BANNERS
  async getBanners(): Promise<BannerItem[]> {
    return memoryBanners.filter((b) => b.isActive);
  },
};
