export interface VariantColor {
  id: string;
  name: string; // e.g. "Kalo", "Neel", "Sobuj", "Black", "Gold"
  swatch?: string; // HEX color code (#000000) or thumbnail image URL
  image?: string; // main image for this specific color
  images?: string[]; // optional gallery images for this color
  sku?: string; // optional SKU specific to this color
  stock?: number; // optional stock specific to this color
}

export interface ProductVariant {
  id: string;
  productId?: string;
  name: string;
  value?: string;
  sku: string;
  price: number;
  regularPrice?: number | null;
  stock: number;
  image?: string;
  images?: string[];
  isActive: boolean;
  order?: number;
  colors?: VariantColor[];
}

export interface ProductGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images?: string[];
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  categories?: string[];
  productIds: string[];
  minPrice: number;
  maxPrice: number;
  minRegularPrice?: number | null;
  maxRegularPrice?: number | null;
  totalStyles: number;
  isActive: boolean;
  isFeatured?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
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
  categories?: string[];
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
  variants?: ProductVariant[];
  mergedFromSlugs?: string[];
  groupId?: string | null;
  groupSlug?: string | null;
  oldVariantId?: string | null;
  isGroupPlaceholder?: boolean;
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
  itemCount?: number;
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
  selectedColor?: VariantColor;
  unitPrice: number;
  totalPrice: number;
}

export type DeliveryZone = 'INSIDE_DHAKA' | 'DHAKA_SUBURBS' | 'OUTSIDE_DHAKA';

export type PaymentMethod = 'COD' | 'BKASH' | 'NAGAD' | 'SSLCOMMERZ' | 'STRIPE' | 'BANK_TRANSFER';

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
  sku?: string;
  price: number;
  quantity: number;
  variantName?: string;
  colorName?: string;
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
  suburbsDhakaFee?: number;
  outsideDhakaFee: number;
  freeDeliveryThreshold: number;
  districtZoneMapping?: Record<string, DeliveryZone>;
  sslcommerzStoreId: string;
  sslcommerzIsLive: boolean;

  // Bank Deposit Configuration
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  enableBankTransfer?: boolean;

  // Tracking & Analytics Configuration
  metaPixelId?: string;
  metaCapiToken?: string;
  metaTestEventCode?: string;
  enableMetaPixel?: boolean;
  enableMetaCapi?: boolean;
  
  ga4MeasurementId?: string;
  enableGA4?: boolean;
  
  gtmId?: string;
  enableGTM?: boolean;
  ga4ViaGtm?: boolean;

  // Owner Profile & About Page Configuration
  ownerName?: string;
  ownerTitle?: string;
  ownerBio?: string;
  ownerPhoto?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  aboutStory?: string;
  aboutMission?: string;
  aboutVision?: string;
}
