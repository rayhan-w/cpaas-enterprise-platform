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

      {/* 5. Bag Department Showcase */}
      <CuratedCategoryShowcase
        title="Bags & Backpacks Collection"
        subtitle="Ergonomic school bags, plush kids bags, ladies handbags & travel duffels"
        categorySlug="bag"
        products={products}
      />

      {/* 6. Kids Toys Showcase */}
      <CuratedCategoryShowcase
        title="Kids Toys & Learning Games"
        subtitle="Montessori educational puzzles, high-speed stunt RC cars & creative outdoor toys"
        categorySlug="kids-toys"
        products={products}
      />

      {/* 7. Baby Dress Showcase */}
      <CuratedCategoryShowcase
        title="Baby Dress & Newborn Sets"
        subtitle="100% pure organic cotton rompers, hospital newborn gift sets & party wear"
        categorySlug="baby-dress"
        products={products}
      />

      {/* 8. Baby Shoes Showcase */}
      <CuratedCategoryShowcase
        title="Baby Shoes & Footwear"
        subtitle="Anti-slip soft sole booties, pre-walkers, sneakers & cute sandals"
        categorySlug="baby-shoes"
        products={products}
      />

      {/* 9. Bed Sheet & Home Tex Showcase */}
      <CuratedCategoryShowcase
        title="Bed Sheet & Home Tex"
        subtitle="100% pure cotton king size bedsheets, blackout eyelet curtains & luxury linens"
        categorySlug="bed-sheet"
        products={products}
      />

      {/* 10. Islamic Items Showcase */}
      <CuratedCategoryShowcase
        title="Islamic Lifestyle & Prayer Essentials"
        subtitle="Turkish memory foam Janamaz, velvet Quran gift boxes, Attar & prayer mats"
        categorySlug="islamic-items"
        products={products}
      />

      {/* 11. Kitchen Items Showcase */}
      <CuratedCategoryShowcase
        title="Kitchen & Cookware Essentials"
        subtitle="Die-cast non-stick granite cookware, dining sets, and premium organizers"
        categorySlug="kitchen-items"
        products={products}
      />

      {/* 12. Health & Skin Care Showcase */}
      <CuratedCategoryShowcase
        title="Health, Cosmetics & Skin Care"
        subtitle="Aveeno tear-free baby wash, organic Vitamin C serums & daily wellness"
        categorySlug="health-skin-care"
        products={products}
      />

      {/* 10. Bangladesh Nationwide Delivery & Payment Info */}
      <DeliveryInfoSection />

      {/* 11. Customer Reviews */}
      <ReviewsSection />
    </div>
  );
}
