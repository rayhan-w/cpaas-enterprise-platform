'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trackViewContent } from '@/lib/tracking';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ChevronRight,
} from 'lucide-react';
import { ProductItem, ProductVariant } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import ProductCard from './ProductCard';

export default function ProductView({
  product,
  relatedProducts,
}: {
  product: ProductItem;
  relatedProducts: ProductItem[];
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { success } = useToast();

  const [activeImage, setActiveImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const currentPrice = selectedVariant?.price || product.price;

  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      price: currentPrice,
      category: product.categoryName,
      brand: product.brand,
    });
  }, [product.id, currentPrice]);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
    setAddedAnim(true);
    success(`Added ${quantity}x "${product.name.slice(0, 20)}..." to your bag!`);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedVariant);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-[#9B8A86] flex-wrap">
        <Link href="/" className="hover:text-[#6CAE14] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={`/category/${product.categorySlug}`}
          className="hover:text-[#6CAE14] transition-colors"
        >
          {product.categoryName || 'Category'}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1A1512] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Images Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square bg-white rounded-3xl border border-[#EDE5E1] overflow-hidden shadow-elevation-1">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#6CAE14] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#6B5B58] hover:text-[#6CAE14] shadow-sm transition-transform active:scale-90"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWishlisted ? 'fill-[#6CAE14] text-[#6CAE14]' : 'stroke-[1.75]'
                }`}
              />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img ? 'border-[#6CAE14] shadow-sm' : 'border-[#EDE5E1] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {product.brand && (
              <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] block mb-1">
                {product.brand}
              </span>
            )}
            <h1 className="section-title text-2xl sm:text-3xl lg:text-4xl text-[#1A1512] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-[#F0B840] font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-[#9B8A86]">({product.reviewCount} customer ratings)</span>
              </div>
              <span className="text-[#EDE5E1]">•</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  product.stock > 0
                    ? 'bg-[#EAF3E9] text-[#7A9C78]'
                    : 'bg-[#FBDADA] text-[#D94040]'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-white rounded-2xl border border-[#EDE5E1] shadow-xs flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#1A1512]">
              {formatPrice(currentPrice)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-[#9B8A86] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-[#6CAE14]/15 text-[#6CAE14] font-bold text-xs px-2 py-0.5 rounded-md">
                  Save {formatPrice(product.originalPrice - currentPrice)} ({product.discount}%)
                </span>
              </>
            )}
          </div>

          {/* Variants selector (if available) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1512]">
                Available Variations:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#6CAE14] bg-[#F1F8E8] text-[#6CAE14] shadow-xs'
                        : 'border-[#EDE5E1] bg-white text-[#1A1512] hover:border-[#6CAE14]/40'
                    }`}
                  >
                    {v.name}: {v.value} {v.price ? `(${formatPrice(v.price)})` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#1A1512]">Quantity:</span>
              <div className="flex items-center border border-[#EDE5E1] rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-[#F8F7F5] text-[#6B5B58] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-bold text-[#1A1512]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-[#F8F7F5] text-[#6B5B58] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-bold border transition-all active:scale-95 shadow-sm ${
                  addedAnim
                    ? 'bg-[#78B81B] text-white border-[#78B81B]'
                    : 'bg-white hover:bg-[#F1F8E8] text-[#0E140E] border-[#DFECCE] hover:border-[#6CAE14]'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#6CAE14]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-xs font-bold bg-[#6CAE14] hover:bg-[#5B960E] text-white transition-all shadow-md active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current text-[#F59E0B]" />
                <span>Order Now</span>
              </button>
            </div>
          </div>

          {/* Delivery & Trust Highlights */}
          <div className="bg-[#F1F8E8] rounded-2xl p-4 border border-[#6CAE14]/20 space-y-2.5 text-xs text-[#1A1512]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#6CAE14] shrink-0" />
              <span>
                <strong>Inside Dhaka:</strong> ৳60 (Same/Next Day) • <strong>Outside Dhaka:</strong> ৳120
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#78B81B] shrink-0" />
              <span>Pay with Cash on Delivery, bKash or Nagad Send Money</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#F0B840] shrink-0" />
              <span>7 Days easy return policy for damaged or defective items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE5E1] shadow-elevation-1 space-y-8">
        <div>
          <h2 className="section-title text-xl text-[#1A1512] mb-3">Product Overview</h2>
          <p className="text-xs sm:text-sm text-[#6B5B58] leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div>
            <h3 className="section-title text-lg text-[#1A1512] mb-3">Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex justify-between p-3 rounded-xl bg-[#F8F7F5] border border-[#EDE5E1]"
                >
                  <span className="font-semibold text-[#1A1512]">{key}</span>
                  <span className="text-[#6B5B58]">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14]">
              You May Also Like
            </span>
            <h2 className="section-title text-2xl text-[#1A1512]">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
