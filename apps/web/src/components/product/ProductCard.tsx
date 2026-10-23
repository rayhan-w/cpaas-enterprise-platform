'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Zap, Heart, Check, Layers } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { getProductPriceRange, getProductTotalStock } from '@/lib/variant-helpers';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';
import QuickOrderModal from '@/components/checkout/QuickOrderModal';

export default function ProductCard({ product }: { product: ProductItem }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { success } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  const priceRange = getProductPriceRange(product);
  const totalStock = getProductTotalStock(product);
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const isOutOfStock = totalStock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (hasVariants) {
      // For products with variants, open quick order modal with variant selection
      setShowQuickOrder(true);
      return;
    }
    addItem(product, 1);
    setAddedAnim(true);
    success(`"${product.name.slice(0, 24)}..." added to bag!`);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setShowQuickOrder(true);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const calculatedDiscount = Boolean(
    priceRange.maxRegularPrice && priceRange.maxRegularPrice > priceRange.minPrice
  )
    ? Math.round(
        ((priceRange.maxRegularPrice! - priceRange.minPrice) / priceRange.maxRegularPrice!) * 100
      )
    : product.discount && product.discount > 0
    ? product.discount
    : 0;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-[#DFECCE] hover:border-[#6CAE14] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative h-full">
        {/* Top Badges & Wishlist */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {isOutOfStock ? (
              <span className="bg-[#D94040] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm pointer-events-auto">
                Stock Out
              </span>
            ) : calculatedDiscount > 0 ? (
              <span className="bg-[#6CAE14] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm pointer-events-auto">
                -{calculatedDiscount}% OFF
              </span>
            ) : product.badge ? (
              <span className="bg-[#0E140E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm pointer-events-auto">
                {product.badge}
              </span>
            ) : null}
          </div>

          <button
            onClick={toggleWishlist}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#526052] hover:text-[#fd6b03] shadow-sm pointer-events-auto transition-transform active:scale-90"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#fd6b03] text-[#fd6b03]' : 'stroke-[1.75]'
              }`}
            />
          </button>
        </div>

        {/* Product Image with link */}
        <Link
          href={`/products/${product.slug}`}
          className="block relative aspect-square bg-[#FAFCF7] overflow-hidden p-2"
        >
          <img
            src={product.image || '/jawata-mart-logo.jpg'}
            alt={product.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/jawata-mart-logo.jpg';
            }}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            decoding="async"
          />
          {hasVariants && (
            <span className="absolute top-2.5 right-12 bg-white/95 text-[#0d1f61] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#EDE5E1] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#fd6b03]" />
              <span>+{product.variants!.length} options</span>
            </span>
          )}
          {!isOutOfStock && totalStock <= 10 && totalStock > 0 && (
            <span className="absolute bottom-3 left-3 bg-[#fd6b03] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Only {totalStock} left!
            </span>
          )}
        </Link>

        {/* Product Information */}
        <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category Badges & Rating */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 text-xs mb-1 sm:mb-1.5">
              <div className="flex flex-wrap gap-1 items-center min-w-0">
                {Array.isArray(product.categories) && product.categories.length > 0 ? (
                  product.categories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="bg-orange-50 text-[#fd6b03] border border-orange-200 text-[9px] font-semibold px-1.5 py-0.2 rounded"
                    >
                      {cat}
                    </span>
                  ))
                ) : (
                  <span className="text-[#526052] text-[10px] sm:text-[11px] font-semibold truncate tracking-wide">
                    {product.brand || product.categoryName || 'Jawata Mart'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 text-[#F59E0B] font-bold text-[10px] sm:text-[11px] shrink-0">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                <span className="text-[#879787] text-[9px] sm:text-[10px]">({product.reviewCount || 0})</span>
              </div>
            </div>

            {/* Title */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E140E] group-hover:text-[#fd6b03] transition-colors line-clamp-2 leading-tight sm:leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Variant Indicator Dots / Badges */}
            {hasVariants && (
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                <span className="text-[10px] text-[#6B5B58] font-medium">Available in:</span>
                <div className="flex items-center gap-1">
                  {product.variants!.slice(0, 3).map((v) => (
                    <span
                      key={v.id}
                      className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#F8F7F5] border border-[#EDE5E1] rounded text-[#1A1512]"
                      title={v.name}
                    >
                      {v.name}
                    </span>
                  ))}
                  {product.variants!.length > 3 && (
                    <span className="text-[9px] text-[#9B8A86] font-bold">
                      +{product.variants!.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pricing and Action Buttons */}
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#DFECCE]/60">
            <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 flex-wrap">
              <span className="text-sm xs:text-base sm:text-lg font-bold text-[#0E140E]">
                {priceRange.displayPrice}
              </span>
              {Boolean(priceRange.maxRegularPrice && priceRange.maxRegularPrice > priceRange.minPrice) && (
                <span className="text-[10px] sm:text-xs text-[#879787] line-through font-medium">
                  {priceRange.minRegularPrice === priceRange.maxRegularPrice
                    ? formatPrice(priceRange.maxRegularPrice!)
                    : `${formatPrice(priceRange.minRegularPrice!)} – ${formatPrice(priceRange.maxRegularPrice!)}`}
                </span>
              )}
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center justify-center gap-1 py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  addedAnim
                    ? 'bg-[#0d1f61] text-white border-[#0d1f61]'
                    : 'bg-white hover:bg-orange-50/50 text-[#0d1f61] border-[#EDE5E1] hover:border-[#0d1f61]'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#fd6b03]" />
                    <span>Added!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Sold Out</span>
                ) : hasVariants ? (
                  <>
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#fd6b03]" />
                    <span>Select</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#fd6b03]" />
                    <span>Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-1 py-1.5 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold bg-[#0d1f61] hover:bg-[#162d85] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
              >
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current text-[#fd6b03]" />
                <span className="hidden xs:inline">{isOutOfStock ? 'Out of Stock' : 'Order Now'}</span>
                <span className="inline xs:hidden">{isOutOfStock ? 'Sold' : 'Order'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Quick Order Modal */}
      {showQuickOrder && (
        <QuickOrderModal
          product={product}
          isOpen={showQuickOrder}
          onClose={() => setShowQuickOrder(false)}
        />
      )}
    </>
  );
}
