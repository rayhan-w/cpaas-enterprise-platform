import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Layers } from 'lucide-react';
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
    title: `${group.name} (${group.totalStyles} Styles) | Jawata Mart`,
    description: `Shop authentic ${group.name} with multiple styles and colors at Jawata Mart.`,
    openGraph: {
      title: `${group.name} — All Styles`,
      description: `Shop authentic ${group.name} with multiple styles and colors at Jawata Mart.`,
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
    <div className="max-w-7xl mx-auto px-4 py-3 sm:py-6 space-y-4 sm:space-y-6">
      {/* Top Breadcrumbs & Back link */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#EDE5E1]/60">
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#6B5B58] overflow-x-auto">
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

        <Link
          href={group.categorySlug ? `/category/${group.categorySlug}` : '/'}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1F61] hover:text-[#FD6B03] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {group.categoryName || 'Store'}</span>
        </Link>
      </div>

      {/* Clean Compact Header - No long text description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:px-6 sm:py-4 rounded-2xl border border-[#EDE5E1] shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0D1F61]">
            {group.name}
          </h1>
          <span className="text-xs text-[#6B5B58] mt-0.5 block">
            Choose your preferred style or add directly to bag
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#0D1F61] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#FD6B03]" />
            <span>{activeProducts.length} Styles</span>
          </span>
          <span className="bg-orange-50 text-[#FD6B03] border border-orange-200 text-xs font-bold px-3 py-1.5 rounded-full">
            Price: {displayPrice}
          </span>
        </div>
      </div>

      {/* Member Products Grid - Directly shown */}
      <section>
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
