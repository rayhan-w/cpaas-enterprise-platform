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
  OrderRecord,
  StoreSettings,
  CouponItem,
  BannerItem,
  PaymentStatus,
} from './types';

// In-memory runtime cache for development/fallback
let memoryProducts: ProductItem[] = [...INITIAL_PRODUCTS];
let memoryCategories: CategoryItem[] = [...INITIAL_CATEGORIES];
let memoryOrders: OrderRecord[] = [
  {
    id: 'ord-1',
    orderNumber: 'NUR-1001',
    customerName: 'Tasnim Akter',
    customerPhone: '01711-234567',
    customerEmail: 'tasnim@example.com',
    division: 'Dhaka',
    district: 'Dhaka',
    area: 'Dhanmondi',
    address: 'House 12, Road 4, Dhanmondi, Dhaka',
    deliveryZone: 'INSIDE_DHAKA',
    deliveryCharge: 60,
    subtotal: 3100,
    discount: 0,
    total: 3160,
    paymentMethod: 'BKASH',
    paymentStatus: 'PENDING_VERIFICATION',
    orderStatus: 'PENDING',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    items: [
      {
        id: 'item-1',
        orderId: 'ord-1',
        productName: 'Pampers Premium Protection Diapers Pants (L, 54 Pcs)',
        productImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
        price: 1850,
        quantity: 1,
        total: 1850,
      },
      {
        id: 'item-2',
        orderId: 'ord-1',
        productName: 'Aveeno Baby Daily Moisture Wash & Shampoo 354ml',
        productImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
        price: 1250,
        quantity: 1,
        total: 1250,
      },
    ],
    payments: [
      {
        id: 'pay-1',
        orderId: 'ord-1',
        method: 'BKASH',
        amount: 3160,
        status: 'PENDING_VERIFICATION',
        transactionId: 'BK9912X8A',
        senderNumber: '01711-234567',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'ord-2',
    orderNumber: 'NUR-1002',
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
let memorySettings: StoreSettings = { ...INITIAL_SETTINGS };
let memoryCoupons: CouponItem[] = [...INITIAL_COUPONS];
let memoryBanners: BannerItem[] = [...INITIAL_BANNERS];

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
  }): Promise<ProductItem[]> {
    try {
      if (process.env.DATABASE_URL && prisma.product) {
        const where: any = { isActive: true };
        if (params?.isFeatured !== undefined) where.isFeatured = params.isFeatured;
        if (params?.isBestSeller !== undefined) where.isBestSeller = params.isBestSeller;
        if (params?.isNew !== undefined) where.isNew = params.isNew;
        if (params?.categorySlug) {
          where.category = { slug: params.categorySlug };
        }
        if (params?.subCategorySlug) {
          where.subCategory = { slug: params.subCategorySlug };
        }
        if (params?.search) {
          where.OR = [
            { name: { contains: params.search, mode: 'insensitive' } },
            { description: { contains: params.search, mode: 'insensitive' } },
            { brand: { contains: params.search, mode: 'insensitive' } },
          ];
        }

        const items = await prisma.product.findMany({
          where,
          include: { category: true, subCategory: true, variants: true },
          take: params?.limit || 50,
          orderBy: { createdAt: 'desc' },
        });

        if (items.length > 0) {
          return items.map((p) => ({
            ...p,
            images: p.images ? JSON.parse(p.images) : [p.image],
            specifications: p.specifications ? JSON.parse(p.specifications) : {},
            categoryName: p.category.name,
            categorySlug: p.category.slug,
            subCategoryName: p.subCategory?.name,
          }));
        }
      }
    } catch {
      // Fall through to memory store
    }

    // Memory Store Filtering
    let list = memoryProducts.filter((p) => p.isActive);
    if (params?.categorySlug) {
      list = list.filter((p) => p.categorySlug === params.categorySlug);
    }
    if (params?.subCategorySlug) {
      const targetSub = params.subCategorySlug.toLowerCase();
      list = list.filter(
        (p) =>
          p.subCategorySlug?.toLowerCase() === targetSub ||
          p.subCategoryId?.toLowerCase() === targetSub ||
          (p.subCategoryName && p.subCategoryName.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(targetSub))
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
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    if (params?.limit) {
      list = list.slice(0, params.limit);
    }
    return list;
  },

  async getProductBySlug(slug: string): Promise<ProductItem | null> {
    try {
      if (process.env.DATABASE_URL && prisma.product) {
        const item = await prisma.product.findUnique({
          where: { slug },
          include: { category: true, subCategory: true, variants: true, reviews: true },
        });
        if (item) {
          return {
            ...item,
            images: item.images ? JSON.parse(item.images) : [item.image],
            specifications: item.specifications ? JSON.parse(item.specifications) : {},
            categoryName: item.category.name,
            categorySlug: item.category.slug,
            subCategoryName: item.subCategory?.name,
          };
        }
      }
    } catch {
      // Fall through
    }
    return memoryProducts.find((p) => p.slug === slug) || null;
  },

  async addProduct(data: any): Promise<ProductItem> {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProduct: ProductItem = {
      id: `prod_${Date.now()}`,
      name: data.name,
      slug,
      categoryId: data.categoryId || 'cat-baby-kids',
      categoryName: data.categoryName || 'Baby & Kids',
      categorySlug: data.categorySlug || 'baby-kids',
      brand: data.brand || 'Brand',
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      discount: data.discount ? Number(data.discount) : 0,
      stock: Number(data.stock) || 50,
      sku: data.sku || `SKU-${Date.now()}`,
      image: data.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [data.image],
      description: data.description || '',
      specifications: data.specifications || {},
      badge: data.badge || '',
      isFeatured: !!data.isFeatured,
      isBestSeller: !!data.isBestSeller,
      isNew: !!data.isNew,
      isActive: data.isActive !== false,
      rating: 5.0,
      reviewCount: 0,
    };

    try {
      if (process.env.DATABASE_URL && prisma.product) {
        await prisma.product.create({
          data: {
            name: newProduct.name,
            slug: newProduct.slug,
            categoryId: newProduct.categoryId,
            brand: newProduct.brand,
            price: newProduct.price,
            originalPrice: newProduct.originalPrice,
            discount: newProduct.discount,
            stock: newProduct.stock,
            sku: newProduct.sku,
            image: newProduct.image,
            images: JSON.stringify(newProduct.images),
            description: newProduct.description,
            specifications: JSON.stringify(newProduct.specifications),
            badge: newProduct.badge,
            isFeatured: newProduct.isFeatured,
            isBestSeller: newProduct.isBestSeller,
            isNew: newProduct.isNew,
            isActive: newProduct.isActive,
          },
        });
      }
    } catch {
      // Memory fallback
    }

    memoryProducts.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, data: Partial<ProductItem>): Promise<ProductItem | null> {
    try {
      if (process.env.DATABASE_URL && prisma.product) {
        await prisma.product.update({
          where: { id },
          data: {
            name: data.name,
            price: data.price !== undefined ? Number(data.price) : undefined,
            originalPrice: data.originalPrice !== undefined ? Number(data.originalPrice) : undefined,
            stock: data.stock !== undefined ? Number(data.stock) : undefined,
            badge: data.badge,
            image: data.image,
            images: data.images ? JSON.stringify(data.images) : undefined,
            description: data.description,
            categoryId: data.categoryId,
            subCategoryId: data.subCategoryId,
          },
        });
      }
    } catch {
      // Fall through to memory
    }

    const idx = memoryProducts.findIndex((p) => p.id === id);
    if (idx !== -1) {
      memoryProducts[idx] = { ...memoryProducts[idx], ...data };
      return memoryProducts[idx];
    }
    return null;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      if (process.env.DATABASE_URL && prisma.product) {
        await prisma.product.delete({ where: { id } });
      }
    } catch {
      // Fall through to memory
    }

    const initialLen = memoryProducts.length;
    memoryProducts = memoryProducts.filter((p) => p.id !== id);
    return memoryProducts.length < initialLen;
  },

  // CATEGORIES
  async getCategories(): Promise<CategoryItem[]> {
    try {
      if (process.env.DATABASE_URL && prisma.category) {
        const cats = await prisma.category.findMany({
          where: { isActive: true },
          include: { subCategories: true },
          orderBy: { order: 'asc' },
        });
        if (cats.length > 0) return cats;
      }
    } catch {
      // Fall through
    }
    return memoryCategories;
  },

  async addCategory(data: any): Promise<CategoryItem> {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const id = data.id || `cat-${slug || Date.now()}`;
    const newCat: CategoryItem = {
      id,
      name: data.name,
      slug,
      image: data.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop',
      description: data.description || '',
      icon: data.icon || null,
      isFeatured: !!data.isFeatured,
      order: memoryCategories.length + 1,
      isActive: true,
      subCategories: [],
    };

    try {
      if (process.env.DATABASE_URL && prisma.category) {
        await prisma.category.create({
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
        });
      }
    } catch {
      // Fallback
    }

    memoryCategories.push(newCat);
    return newCat;
  },

  async updateCategory(id: string, data: Partial<CategoryItem>): Promise<CategoryItem | null> {
    try {
      if (process.env.DATABASE_URL && prisma.category) {
        await prisma.category.update({
          where: { id },
          data: {
            name: data.name,
            slug: data.slug,
            image: data.image,
            description: data.description,
            isActive: data.isActive,
          },
        });
      }
    } catch {
      // Fallback
    }

    const idx = memoryCategories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      memoryCategories[idx] = { ...memoryCategories[idx], ...data };
      return memoryCategories[idx];
    }
    return null;
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      if (process.env.DATABASE_URL && prisma.category) {
        await prisma.category.delete({ where: { id } });
      }
    } catch {
      // Fallback
    }

    const initialLen = memoryCategories.length;
    memoryCategories = memoryCategories.filter((c) => c.id !== id);
    return memoryCategories.length < initialLen;
  },

  async addSubCategory(categoryId: string, data: { name: string; slug?: string }): Promise<SubCategoryItem | null> {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const id = `sub-${slug || Date.now()}`;
    const newSub: SubCategoryItem = {
      id,
      categoryId,
      name: data.name,
      slug,
      order: 1,
    };

    try {
      if (process.env.DATABASE_URL && prisma.subCategory) {
        await prisma.subCategory.create({
          data: {
            id: newSub.id,
            categoryId: newSub.categoryId,
            name: newSub.name,
            slug: newSub.slug,
            order: newSub.order,
          },
        });
      }
    } catch {
      // Fallback
    }

    const cat = memoryCategories.find((c) => c.id === categoryId);
    if (cat) {
      if (!cat.subCategories) cat.subCategories = [];
      cat.subCategories.push(newSub);
      return newSub;
    }
    return null;
  },

  async deleteSubCategory(categoryId: string, subCategoryId: string): Promise<boolean> {
    try {
      if (process.env.DATABASE_URL && prisma.subCategory) {
        await prisma.subCategory.delete({ where: { id: subCategoryId } });
      }
    } catch {
      // Fallback
    }

    const cat = memoryCategories.find((c) => c.id === categoryId);
    if (cat && cat.subCategories) {
      const initialLen = cat.subCategories.length;
      cat.subCategories = cat.subCategories.filter((s) => s.id !== subCategoryId);
      return cat.subCategories.length < initialLen;
    }
    return false;
  },

  // ORDERS
  async createOrder(orderData: Omit<OrderRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<OrderRecord> {
    const orderNumber = `NUR-${Math.floor(1000 + Math.random() * 9000)}`;
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
      }
    } catch {
      // Memory fallback
    }

    memoryOrders.unshift(newOrder);
    return newOrder;
  },

  async getOrders(params?: { status?: string; paymentStatus?: string }): Promise<OrderRecord[]> {
    let list = [...memoryOrders];
    if (params?.status) {
      list = list.filter((o) => o.orderStatus === params.status);
    }
    if (params?.paymentStatus) {
      list = list.filter((o) => o.paymentStatus === params.paymentStatus);
    }
    return list;
  },

  async getOrderByNumberAndPhone(orderNumber: string, phone: string): Promise<OrderRecord | null> {
    const cleanedPhone = phone.replace(/[\s\-\+]/g, '');
    return (
      memoryOrders.find(
        (o) =>
          o.orderNumber.toUpperCase() === orderNumber.toUpperCase() &&
          o.customerPhone.replace(/[\s\-\+]/g, '').includes(cleanedPhone.slice(-10))
      ) || null
    );
  },

  async updateOrderStatus(id: string, orderStatus: string): Promise<OrderRecord | null> {
    const order = memoryOrders.find((o) => o.id === id);
    if (order) {
      order.orderStatus = orderStatus as any;
      order.updatedAt = new Date().toISOString();
      return order;
    }
    return null;
  },

  async verifyPayment(orderId: string, status: PaymentStatus, note?: string): Promise<OrderRecord | null> {
    const order = memoryOrders.find((o) => o.id === orderId);
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
      return order;
    }
    return null;
  },

  // SETTINGS
  async getSettings(): Promise<StoreSettings> {
    try {
      const dbSettings = await prisma.setting.findMany();
      if (dbSettings && dbSettings.length > 0) {
        const mapped: any = { ...memorySettings };
        for (const s of dbSettings) {
          try {
            mapped[s.key] = JSON.parse(s.value);
          } catch {
            mapped[s.key] = s.value;
          }
        }
        memorySettings = mapped as StoreSettings;
        return memorySettings;
      }
    } catch {
      // Fallback to memorySettings
    }
    return memorySettings;
  },

  async updateSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    memorySettings = { ...memorySettings, ...data };
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
    return memorySettings;
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
