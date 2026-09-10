'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag, Zap, Heart, Check } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/context/toast-context';

export default function ProductCard({ product }: { product: ProductItem }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { success } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedAnim(true);
    success(`Added "${product.name.slice(0, 24)}..." to your bag!`);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    router.push('/checkout');
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group ag-card bg-white rounded-2xl border border-[#EDE5E1] overflow-hidden flex flex-col relative h-full">
      {/* Top Badges & Wishlist */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="bg-[#6CAE14] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm pointer-events-auto">
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-[#1A1512] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm pointer-events-auto">
              -{product.discount}%
            </span>
          )}
        </div>

        <button
          onClick={toggleWishlist}
          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#6B5B58] hover:text-[#6CAE14] shadow-sm pointer-events-auto transition-transform active:scale-90"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#6CAE14] text-[#6CAE14]' : 'stroke-[1.75]'
            }`}
          />
        </button>
      </div>

      {/* Image with link */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-square bg-[#F8F7F5] overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute bottom-2 left-2 bg-amber-500/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
            Only {product.stock} left!
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="text-[#9B8A86] text-[11px] font-medium truncate uppercase tracking-wider">
              {product.brand || product.categoryName || 'Jawata Mart'}
            </span>
            <div className="flex items-center gap-1 text-[#F0B840] font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#9B8A86] text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-[#0E140E] group-hover:text-[#6CAE14] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-3 pt-3 border-t border-[#F2EDEA]">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold text-[#1A1512]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#9B8A86] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Actions: Add to Bag & Buy Now (Ghorer Bazar Style) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                addedAnim
                  ? 'bg-[#78B81B] text-white border-[#78B81B]'
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
                  <span>কার্ট</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold bg-[#6CAE14] hover:bg-[#5B960E] text-white transition-all shadow-sm active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-[#F59E0B]" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
