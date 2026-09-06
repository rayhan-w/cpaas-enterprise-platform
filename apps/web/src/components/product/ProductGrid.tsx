import React from 'react';
import { ProductItem } from '@/lib/types';
import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: ProductItem[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#EDE5E1] p-4 flex flex-col gap-3 animate-pulse"
          >
            <div className="w-full aspect-square bg-[#EDE5E1] rounded-xl" />
            <div className="h-4 bg-[#EDE5E1] rounded w-3/4" />
            <div className="h-4 bg-[#EDE5E1] rounded w-1/2" />
            <div className="h-8 bg-[#EDE5E1] rounded-xl mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDE5E1] p-12 text-center max-w-md mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-[#FCF5F6] flex items-center justify-center mx-auto mb-4 text-[#C4737E]">
          <PackageOpen className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="section-title text-xl text-[#1A1512] mb-2">No Products Found</h3>
        <p className="text-xs text-[#6B5B58] leading-relaxed">
          We couldn&apos;t find any products matching your selection. Try browsing other categories or
          searching for another term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
