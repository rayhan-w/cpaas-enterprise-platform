'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Zap, Heart, Check } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedAnim(true);
    success(`"${product.name.slice(0, 24)}..." added to bag!`);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickOrder(true);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-[#DFECCE] hover:border-[#6CAE14] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative h-full">
        {/* Top Badges & Wishlist */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {product.discount > 0 ? (
              <span className="bg-[#6CAE14] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm pointer-events-auto">
                -{product.discount}% OFF
              </span>
            ) : product.badge ? (
              <span className="bg-[#0E140E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm pointer-events-auto">
                {product.badge}
              </span>
            ) : null}
          </div>

          <button
            onClick={toggleWishlist}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#526052] hover:text-[#6CAE14] shadow-sm pointer-events-auto transition-transform active:scale-90"
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#6CAE14] text-[#6CAE14]' : 'stroke-[1.75]'
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
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          {product.stock <= 10 && product.stock > 0 && (
            <span className="absolute bottom-3 left-3 bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Only {product.stock} left!
            </span>
          )}
        </Link>

        {/* Product Information */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
              <span className="text-[#526052] text-[11px] font-semibold truncate tracking-wide">
                {product.brand || product.categoryName || 'Jawata Mart'}
              </span>
              <div className="flex items-center gap-1 text-[#F59E0B] font-bold text-[11px]">
                <Star className="w-3 h-3 fill-current" />
                <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                <span className="text-[#879787] text-[10px]">({product.reviewCount || 12})</span>
              </div>
            </div>

            {/* Title */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="text-xs sm:text-sm font-bold text-[#0E140E] group-hover:text-[#6CAE14] transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Pricing and Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-[#DFECCE]/60">
            <div className="flex items-baseline gap-2 mb-2.5">
              <span className="text-base sm:text-lg font-bold text-[#0E140E]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#879787] line-through font-medium">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Actions: Add to Cart & Buy Now (English) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  addedAnim
                    ? 'bg-[#6CAE14] text-white border-[#6CAE14]'
                    : 'bg-white hover:bg-[#F1F8E8] text-[#0E140E] border-[#DFECCE] hover:border-[#6CAE14]'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#6CAE14]" />
                    <span>Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold bg-[#6CAE14] hover:bg-[#5B960E] text-white transition-all shadow-sm hover:shadow active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-[#F59E0B]" />
                <span>Order Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Quick Order Modal */}
      <QuickOrderModal
        product={product}
        isOpen={showQuickOrder}
        onClose={() => setShowQuickOrder(false)}
      />
    </>
  );
}
