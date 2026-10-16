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
  const categoryProducts = products.filter((p) => {
    const targetSlug = categorySlug.toLowerCase();
    const targetTitle = title.toLowerCase();
    if (p.categorySlug?.toLowerCase() === targetSlug || p.categoryId?.toLowerCase() === targetSlug) return true;
    if (p.categoryName && p.categoryName.toLowerCase() === targetTitle) return true;
    if (Array.isArray(p.categories)) {
      return p.categories.some(
        (c) =>
          c.toLowerCase() === targetSlug ||
          c.toLowerCase() === targetTitle ||
          c.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(targetSlug)
      );
    }
    return false;
  }).slice(0, 4);

  if (categoryProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#fd6b03] block">
            Featured Department
          </span>
          <h2 className="section-title text-2xl sm:text-3xl text-[#0E140E]">{title}</h2>
          <p className="text-xs text-[#526052] mt-1">{subtitle}</p>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="text-xs font-bold text-[#0d1f61] hover:text-[#fd6b03] flex items-center gap-1 transition-colors self-start sm:self-auto shrink-0"
        >
          <span className="hidden sm:inline">View All in {title}</span>
          <span className="sm:hidden">View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
