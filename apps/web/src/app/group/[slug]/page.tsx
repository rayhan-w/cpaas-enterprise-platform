import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { dbService } from '@/lib/db-service';
import ProductCard from '@/components/product/ProductCard';
import { formatPrice } from '@/lib/formatters';

interface GroupPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: GroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await dbService.getGroupBySlug(slug);

  if (!group) {
    return { title: 'Collection Not Found | Jawata Mart' };
  }

  return {
    title: `${group.name} Collection (${group.totalStyles} Styles) | Jawata Mart`,
    description: group.description.slice(0, 160),
    openGraph: {
      title: `${group.name} — All Styles & Colors`,
      description: group.description.slice(0, 160),
      images: [{ url: group.image }],
    },
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { slug } = await params;
  const group = await dbService.getGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  const products = await dbService.getProductsByGroupId(group.id);
  const activeProducts = products.filter((p) => p.isActive !== false);

  const displayPrice =
    group.minPrice === group.maxPrice
      ? formatPrice(group.minPrice)
      : `${formatPrice(group.minPrice)} – ${formatPrice(group.maxPrice)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#6B5B58] overflow-x-auto pb-1">
        <Link href="/" className="hover:text-[#FD6B03] transition-colors shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#EDE5E1]" />
        {group.categorySlug && (
          <>
            <Link
              href={`/category/${group.categorySlug}`}
              className="hover:text-[#FD6B03] transition-colors shrink-0"
            >
              {group.categoryName || 'Category'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#EDE5E1]" />
          </>
        )}
        <span className="font-bold text-[#1A1512] shrink-0">{group.name}</span>
      </nav>

      {/* Back button */}
      <div>
        <Link
          href={group.categorySlug ? `/category/${group.categorySlug}` : '/'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1F61] hover:text-[#FD6B03] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {group.categoryName || 'Store'}</span>
        </Link>
      </div>

      {/* Group Header Hero Card */}
      <div className="bg-gradient-to-r from-orange-50/70 via-white to-amber-50/50 rounded-3xl p-5 sm:p-8 border border-[#FD6B03]/20 shadow-xs flex flex-col md:flex-row items-center gap-6">
        {group.image && (
          <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl overflow-hidden bg-white border border-[#EDE5E1] p-1.5 shadow-sm shrink-0">
            <img
              src={group.image}
              alt={group.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        )}

        <div className="flex-1 space-y-2.5 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="bg-[#0D1F61] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-[#FD6B03]" />
              <span>{activeProducts.length} Styles Available</span>
            </span>
            <span className="bg-white text-[#FD6B03] border border-orange-200 text-xs font-bold px-2.5 py-1 rounded-full">
              Price Range: {displayPrice}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-serif font-bold text-[#0E140E]">
            {group.name}
          </h1>

          {group.description && (
            <p className="text-xs sm:text-sm text-[#6B5B58] max-w-2xl leading-relaxed whitespace-pre-line">
              {group.description}
            </p>
          )}

          <div className="pt-1 flex items-center justify-center md:justify-start gap-2 text-xs text-[#0D1F61] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FD6B03]" />
            <span>Select any style below to view details or add directly to your bag!</span>
          </div>
        </div>
      </div>

      {/* Member Products Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-[#0E140E]">
            All Available Styles ({activeProducts.length})
          </h2>
          <span className="text-xs text-[#6B5B58]">
            Click any style for full view or click &ldquo;Add to Bag&rdquo; directly
          </span>
        </div>

        {activeProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#EDE5E1] p-12 text-center">
            <p className="text-sm text-[#6B5B58]">No styles currently active in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
