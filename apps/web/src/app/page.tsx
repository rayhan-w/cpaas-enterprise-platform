import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Flame, Award, HeartHandshake } from 'lucide-react';
import { dbService } from '@/lib/db-service';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryPills from '@/components/home/CategoryPills';
import FlashSaleSection from '@/components/home/FlashSaleSection';
import CuratedCategoryShowcase from '@/components/home/CuratedCategoryShowcase';
import DeliveryInfoSection from '@/components/home/DeliveryInfoSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import ProductGrid from '@/components/product/ProductGrid';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const products = await dbService.getProducts({ limit: 40 });
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* 1. Hero Banner Carousel */}
      <HeroBanner />

      {/* 2. Category Department Pills */}
      <CategoryPills />

      {/* 3. Flash Sale Deals */}
      <FlashSaleSection products={products} />

      {/* 4. Best Sellers Across Bangladesh */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Customer Favorites
            </span>
            <h2 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
              Best Selling Products
            </h2>
          </div>
          <Link
            href="/category/all"
            className="text-xs font-semibold text-[#1A1512] hover:text-[#6CAE14] flex items-center gap-1 transition-colors"
          >
            <span>View All ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ProductGrid products={bestSellers} />
      </section>

      {/* 5. Baby & Mother Care Showcase (1 of many categories) */}
      <CuratedCategoryShowcase
        title="Baby & Mother Care"
        subtitle="Trusted pediatric skincare, organic diapers, maternity essentials & feeding bottles"
        categorySlug="baby-kids"
        products={products}
      />

      {/* 6. Fashion Showcase (Men & Women) */}
      <CuratedCategoryShowcase
        title="Lifestyle & Festive Fashion"
        subtitle="Fine combed cotton Panjabis, designer Jamdani sarees, and stretch denim"
        categorySlug="mens-fashion"
        products={products}
      />

      {/* 7. Electronics & Gadgets */}
      <CuratedCategoryShowcase
        title="Smart Electronics & Audio"
        subtitle="True wireless earbuds, fast charging power banks, and everyday tech accessories"
        categorySlug="electronics-gadgets"
        products={products}
      />

      {/* 8. Health, Beauty & Skincare */}
      <CuratedCategoryShowcase
        title="Health & Personal Care"
        subtitle="100% authentic dermatologically-tested serums, moisturisers, and grooming"
        categorySlug="health-beauty"
        products={products}
      />

      {/* 9. Home, Kitchen & Groceries */}
      <CuratedCategoryShowcase
        title="Home, Kitchen & Pure Foods"
        subtitle="Digital induction cooktops, aged Himalayan basmati, and raw Sundarban wild honey"
        categorySlug="food-grocery"
        products={products}
      />

      {/* 10. Bangladesh Nationwide Delivery & Payment Info */}
      <DeliveryInfoSection />

      {/* 11. Customer Reviews */}
      <ReviewsSection />
    </div>
  );
}
