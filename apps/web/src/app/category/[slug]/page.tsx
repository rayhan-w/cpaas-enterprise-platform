import React from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db-service';
import ProductGrid from '@/components/product/ProductGrid';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { Sparkles, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (slug === 'all') {
    return { title: 'All Products | Nurtura Bangladesh' };
  }
  const cat = INITIAL_CATEGORIES.find((c) => c.slug === slug);
  return {
    title: cat ? `${cat.name} | Nurtura Bangladesh` : 'Category | Nurtura Bangladesh',
    description: cat?.description || 'Browse products on Nurtura Bangladesh',
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { search, sort } = await searchParams;

  const isAll = slug === 'all';
  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug);

  const products = await dbService.getProducts({
    categorySlug: isAll ? undefined : slug,
    search: search || undefined,
  });

  // Simple sorting
  let sortedProducts = [...products];
  if (sort === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-[#9B8A86]">
        <Link href="/" className="hover:text-[#C4737E] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1A1512] font-semibold">
          {isAll ? 'All Products' : category?.name || slug}
        </span>
        {search && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#C4737E] font-medium">Search: &ldquo;{search}&rdquo;</span>
          </>
        )}
      </nav>

      {/* Category Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE5E1] shadow-elevation-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C4737E] block mb-1">
            Department Store
          </span>
          <h1 className="section-title text-3xl sm:text-4xl text-[#1A1512]">
            {isAll ? 'All Catalog Products' : category?.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B58] mt-2 leading-relaxed">
            {isAll
              ? 'Browse across 10+ multi-category lifestyle departments with authentic warranty & nationwide fast delivery.'
              : category?.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-[#FCF5F6] text-[#C4737E] px-4 py-2 rounded-2xl border border-[#C4737E]/20 shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>{sortedProducts.length} Items Found</span>
        </div>
      </div>

      {/* Subcategory Pills (if available) */}
      {category && category.subCategories && category.subCategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs font-bold text-[#1A1512] shrink-0 mr-1">Subcategories:</span>
          {category.subCategories.map((sub) => (
            <span
              key={sub.id}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-[#EDE5E1] text-[#1A1512] shrink-0 hover:border-[#C4737E] cursor-pointer transition-colors"
            >
              {sub.name}
            </span>
          ))}
        </div>
      )}

      {/* Product Grid */}
      <ProductGrid products={sortedProducts} />
    </div>
  );
}
