export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface ReviewItem {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatar?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName?: string;
  categorySlug?: string;
  subCategoryId?: string | null;
  subCategoryName?: string | null;
  subCategorySlug?: string | null;
  brand?: string | null;
  price: number;
  originalPrice?: number | null;
  discount: number;
  stock: number;
  sku?: string | null;
  image: string;
  images: string[];
  description: string;
  specifications?: Record<string, string> | null;
  badge?: string | null;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  variants?: any[];
  reviews?: any[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  icon?: string | null;
  isFeatured: boolean;
  order: number;
  isActive: boolean;
  subCategories?: SubCategoryItem[];
  productCount?: number;
}

export interface SubCategoryItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  order: number;
}

export interface CartItem {
  productId: string;
  product: ProductItem;
  quantity: number;
  selectedVariant?: ProductVariant;
  unitPrice: number;
  totalPrice: number;
}

export type DeliveryZone = 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';

export type PaymentMethod = 'COD' | 'BKASH' | 'NAGAD' | 'SSLCOMMERZ';

export type PaymentStatus = 'PENDING_VERIFICATION' | 'PAID' | 'FAILED' | 'REJECTED' | 'REFUNDED';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variantName?: string;
  total: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  division: string;
  district: string;
  area: string;
  address: string;
  deliveryNote?: string;
  deliveryZone: DeliveryZone;
  deliveryCharge: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
  payments?: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  senderNumber?: string;
  gatewayResponse?: string;
  verificationNote?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface CouponItem {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  bkashMerchantNumber: string;
  nagadMerchantNumber: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeDeliveryThreshold: number;
  sslcommerzStoreId: string;
  sslcommerzIsLive: boolean;
}
