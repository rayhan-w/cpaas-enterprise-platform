import React from 'react';
import Link from 'next/link';
import { dbService } from '@/lib/db-service';
import ProductGrid from '@/components/product/ProductGrid';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import SubCategoryFilter from '@/components/category/SubCategoryFilter';
import BackButton from '@/components/common/BackButton';
import { Sparkles, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ search?: string; sort?: string; sub?: string; offer?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  if (slug === 'all') {
    return { title: 'All Products | Jawata Mart' };
  }
  const cat = INITIAL_CATEGORIES.find((c) => c.slug === slug);
  return {
    title: cat ? `${cat.name} | Jawata Mart` : 'Category | Jawata Mart',
    description: cat?.description || 'Browse products on Jawata Mart',
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { search, sort, sub, offer } = await searchParams;

  const isAll = slug === 'all';
  const isOffer = offer === '1' || offer === 'true';
  const category = INITIAL_CATEGORIES.find((c) => c.slug === slug);
  const activeSub = category?.subCategories?.find((s) => s.slug === sub || s.id === sub);

  let products = await dbService.getProducts({
    categorySlug: isAll ? undefined : slug,
    subCategorySlug: sub || undefined,
    search: search || undefined,
  });

  if (isOffer) {
    products = products.filter((p) => p.discount > 0 || p.badge?.toLowerCase().includes('offer') || p.badge?.toLowerCase().includes('deal'));
  }

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
      {/* Back Button & Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-3">
        <BackButton label="Back" fallback="/" />
        <span className="text-[#EDE5E1] hidden sm:inline">|</span>
        <nav className="flex items-center gap-1.5 text-xs text-[#9B8A86] flex-wrap">
          <Link href="/" className="hover:text-[#6CAE14] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
        {isAll ? (
          <span className="text-[#0E140E] font-semibold">
            {isOffer ? 'Special Offer Zone' : 'All Products'}
          </span>
        ) : (
          <>
            <Link
              href={`/category/${category?.slug || slug}`}
              className={`hover:text-[#6CAE14] transition-colors ${activeSub ? '' : 'text-[#0E140E] font-semibold'}`}
            >
              {category?.name || slug}
            </Link>
            {activeSub && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#6CAE14] font-semibold">{activeSub.name}</span>
              </>
            )}
          </>
        )}
        {search && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#6CAE14] font-medium">Search: &ldquo;{search}&rdquo;</span>
          </>
        )}
      </nav>
    </div>

      {/* Category Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE5E1] shadow-elevation-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] block mb-1">
            {isOffer ? 'Exclusive Deals' : 'Department Store'}
          </span>
          <h1 className="section-title text-3xl sm:text-4xl text-[#0E140E]">
            {isOffer
              ? 'Offer Zone - Special Discounted Items'
              : activeSub
              ? activeSub.name
              : isAll
              ? 'All Catalog Products'
              : category?.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B58] mt-2 leading-relaxed">
            {isOffer
              ? 'Discover limited time flash discounts and exclusive bundle offers with fast nationwide delivery.'
              : activeSub
              ? `Browse authentic ${activeSub.name} products with guaranteed quality from Jawata Mart.`
              : isAll
              ? 'Browse across all 13 multi-category departments with authentic warranty & fast nationwide delivery.'
              : category?.description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold bg-[#F1F8E8] text-[#6CAE14] px-4 py-2 rounded-2xl border border-[#6CAE14]/20 shrink-0">
          <Sparkles className="w-4 h-4" />
          <span>{sortedProducts.length} Items Found</span>
        </div>
      </div>

      {/* Subcategory Navigation: Pills + Dropdown Selector */}
      {category && category.subCategories && category.subCategories.length > 0 && (
        <SubCategoryFilter
          categorySlug={category.slug}
          categoryName={category.name}
          subCategories={category.subCategories}
          currentSub={sub}
        />
      )}

      {/* Product Grid */}
      <ProductGrid products={sortedProducts} />
    </div>
  );
}
