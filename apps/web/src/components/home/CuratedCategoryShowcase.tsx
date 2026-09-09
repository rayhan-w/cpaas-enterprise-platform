import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import ProductCard from '../product/ProductCard';

interface CuratedCategoryShowcaseProps {
  title: string;
  subtitle: string;
  categorySlug: string;
  products: ProductItem[];
  badgeColor?: string;
  accentBg?: string;
}

export default function CuratedCategoryShowcase({
  title,
  subtitle,
  categorySlug,
  products,
}: CuratedCategoryShowcaseProps) {
  const categoryProducts = products.filter((p) => p.categorySlug === categorySlug).slice(0, 4);

  if (categoryProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D5435] block">
            Featured Department
          </span>
          <h2 className="section-title text-2xl sm:text-3xl text-[#1B241B]">{title}</h2>
          <p className="text-xs text-[#526052] mt-1">{subtitle}</p>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="text-xs font-semibold text-[#1B241B] hover:text-[#0D5435] flex items-center gap-1 transition-colors"
        >
          <span>View All in {title}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
