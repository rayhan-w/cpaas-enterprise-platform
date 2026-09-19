import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { dbService } from '@/lib/db-service';
import BackButton from '@/components/common/BackButton';
import { 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  HeartHandshake, 
  Sparkles, 
  Target, 
  Eye, 
  ShoppingBag,
  ArrowRight,
  Clock,
  ThumbsUp,
  MessageCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Jawata Mart - Founder & Leadership',
  description: 'Learn about Jawata Mart, founded by Abdur Rahim. Delivering 100% genuine lifestyle, fashion, baby care, and organic products across all 64 districts of Bangladesh.',
};

export default async function AboutPage() {
  const settings = await dbService.getSettings();

  const ownerName = settings.ownerName || 'Abdur Rahim';
  const ownerTitle = settings.ownerTitle || 'Founder & Managing Director';
  const ownerBio = settings.ownerBio || 'Passionate entrepreneur dedicated to bringing 100% authentic lifestyle, baby care, fashion, and organic food products directly to households across all 64 districts of Bangladesh.';
  const ownerPhoto = settings.ownerPhoto || '/images/abdur-rahim-owner.jpg';
  const ownerPhone = settings.ownerPhone || '01915210799';
  const ownerEmail = settings.ownerEmail || 'jawatamart3@gmail.com';
  const officeAddress = settings.address || 'Uttara Sector-12, Dhaka, Bangladesh';

  const aboutStory = settings.aboutStory || 'Jawata Mart was founded by Abdur Rahim with a clear purpose: to bridge the gap between quality and affordability in online shopping across Bangladesh. Operating from Uttara Sector-12, Dhaka, we hand-inspect every product before dispatch, ensuring only genuine, premium-grade items reach you and your family.';
  const aboutMission = settings.aboutMission || 'To provide a trustworthy, reliable shopping experience where every Bangladeshi customer receives genuine products, transparent pricing, dedicated support, and swift doorstep delivery.';
  const aboutVision = settings.aboutVision || 'To be Bangladesh\'s most respected, customer-centric lifestyle & household shopping brand, celebrated for honesty, authenticity, and unmatched customer delight.';

  const stats = [
    { label: 'Districts Covered', value: '64', suffix: 'Districts' },
    { label: 'Happy Customers', value: '15,000+', suffix: 'Nationwide' },
    { label: 'Product Authenticity', value: '100%', suffix: 'Guaranteed' },
    { label: 'Customer Satisfaction', value: '4.9★', suffix: 'Rating' },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Genuine Products',
      desc: 'No replica or counterfeit items. Every single SKU in our inventory is thoroughly inspected for purity, durability, and authenticity.',
      badge: 'Zero Counterfeits',
    },
    {
      icon: Truck,
      title: 'Nationwide Swift Delivery',
      desc: 'Rapid delivery across all 64 districts. Inside Dhaka within 24-48 hours (৳60) and all outer divisions within 3-5 days (৳120).',
      badge: 'All 64 Districts',
    },
    {
      icon: HeartHandshake,
      title: 'Customer-First Guarantee',
      desc: 'Convenient Cash on Delivery (COD), verified bKash, Nagad, and UCB Bank payment options with easy return support if unsatisfied.',
      badge: 'Cash on Delivery',
    },
    {
      icon: Clock,
      title: 'Direct Founder Support',
      desc: 'We are a company with real human accountability. Reach out anytime via our hotline or WhatsApp for personal order assistance.',
      badge: 'Personalized Care',
    },
  ];

  return (
    <div className="bg-[#FAFCF7] min-h-screen">
      {/* Breadcrumb & Top Bar */}
      <div className="border-b border-[#DFECCE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" label="Back to Store" />
            <div className="h-4 w-px bg-[#DFECCE] hidden sm:block" />
            <nav className="hidden sm:flex items-center gap-2 text-xs text-[#526052]">
              <Link href="/" className="hover:text-[#6CAE14] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#0E140E] font-semibold">About Us</span>
            </nav>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#526052]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F8E8] text-[#6CAE14] font-bold text-[11px]">
              <Sparkles className="w-3 h-3" />
              Verified Brand
            </span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-14 sm:py-20 bg-gradient-to-b from-white via-[#F6FAF0] to-[#FAFCF7] border-b border-[#DFECCE]">
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#6CAE14_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5DC] border border-[#CDE5A8] text-xs font-bold text-[#4B7A0C] shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#6CAE14]" />
            <span>Official Profile of Jawata Mart</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0E140E] tracking-tight leading-tight">
            Delivering Purity, Trust &amp; Joy to Every Household in Bangladesh
          </h1>

          <p className="text-sm sm:text-lg text-[#526052] max-w-3xl mx-auto leading-relaxed">
            Founded by <strong>{ownerName}</strong>, Jawata Mart was built on the core belief that online shopping should be transparent, honest, and filled with authentic products that enrich your family&apos;s daily life.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#6CAE14] hover:bg-[#5E9911] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All Products</span>
            </Link>
            <a
              href={`https://wa.me/88${ownerPhone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-[#F1F8E8] text-[#0E140E] border border-[#DFECCE] text-xs sm:text-sm font-bold rounded-xl transition-all shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl border border-[#DFECCE] shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-4xl font-bold font-serif text-[#0E140E]">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#6CAE14]">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#879787]">
                {stat.suffix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Spotlight Card Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="bg-white rounded-3xl border border-[#DFECCE] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Founder Photo & Quick Badges */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#F6FAF0] via-[#EDF6E2] to-[#E2F0D0] p-8 sm:p-12 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-[#DFECCE]">
              <div className="relative group">
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden ring-4 ring-[#6CAE14]/50 shadow-2xl bg-white">
                  <img
                    src={ownerPhoto}
                    alt={ownerName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-[#9ED114]" />
                      Verified Leadership
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#6CAE14] text-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="mt-8 space-y-1">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0E140E]">
                  {ownerName}
                </h2>
                <p className="text-sm font-semibold text-[#6CAE14]">
                  {ownerTitle}
                </p>
                <p className="text-xs text-[#526052] font-medium pt-1">
                  Jawata Mart Bangladesh
                </p>
              </div>

              {/* Direct Founder Contact Pills */}
              <div className="mt-6 w-full max-w-xs space-y-2.5 text-xs text-left">
                <a
                  href={`tel:${ownerPhone}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#DFECCE] text-[#0E140E] transition-colors shadow-2xs group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center shrink-0 group-hover:bg-[#6CAE14] group-hover:text-white transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#879787] block uppercase font-bold">Direct Phone</span>
                    <span className="font-bold text-xs truncate block">{ownerPhone}</span>
                  </div>
                </a>

                <a
                  href={`mailto:${ownerEmail}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#DFECCE] text-[#0E140E] transition-colors shadow-2xs group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center shrink-0 group-hover:bg-[#6CAE14] group-hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#879787] block uppercase font-bold">Founder Email</span>
                    <span className="font-bold text-xs truncate block">{ownerEmail}</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/90 border border-[#DFECCE] text-[#0E140E] shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#879787] block uppercase font-bold">HQ Location</span>
                    <span className="font-bold text-xs truncate block">{officeAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Founder Message, Story & Philosophy */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F1F8E8] text-xs font-bold text-[#6CAE14]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>A Personal Message From the Founder</span>
                </div>

                <div className="relative">
                  <span className="text-6xl font-serif text-[#DFECCE] absolute -top-5 -left-4 select-none pointer-events-none">
                    &ldquo;
                  </span>
                  <blockquote className="relative z-10 text-base sm:text-lg text-[#0E140E] font-medium leading-relaxed italic pl-4 border-l-2 border-[#6CAE14]">
                    {ownerBio}
                  </blockquote>
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-lg font-bold text-[#0E140E] flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-[#6CAE14]" />
                    <span>The Story of Jawata Mart</span>
                  </h3>
                  <p className="text-sm text-[#526052] leading-relaxed whitespace-pre-line">
                    {aboutStory}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-[#F8FBF5] border border-[#DFECCE]">
                    <div className="flex items-center gap-2 text-[#6CAE14] font-bold text-xs mb-1.5">
                      <Target className="w-4 h-4" />
                      <span>Our Mission</span>
                    </div>
                    <p className="text-xs text-[#526052] leading-relaxed">
                      {aboutMission}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FBF5] border border-[#DFECCE]">
                    <div className="flex items-center gap-2 text-[#6CAE14] font-bold text-xs mb-1.5">
                      <Eye className="w-4 h-4" />
                      <span>Our Vision</span>
                    </div>
                    <p className="text-xs text-[#526052] leading-relaxed">
                      {aboutVision}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Assurance Note */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0E140E] to-[#1F2B1F] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#9ED114] uppercase tracking-wider">
                    Direct Promise to Every Customer
                  </div>
                  <div className="text-xs text-white/80">
                    If you ever experience any issue with your order, I personally ensure it will be resolved promptly.
                  </div>
                </div>
                <div className="shrink-0 text-right sm:text-right">
                  <span className="font-serif italic font-bold text-sm text-[#9ED114] block">
                    — {ownerName}
                  </span>
                  <span className="text-[10px] text-white/60">
                    Owner, Jawata Mart
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Pillars Section */}
      <section className="bg-white border-y border-[#DFECCE] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] bg-[#F1F8E8] px-3 py-1 rounded-full">
              Why Choose Jawata Mart
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0E140E]">
              Built On Integrity, Transparency &amp; Speed
            </h2>
            <p className="text-xs sm:text-sm text-[#526052]">
              Every parcel shipped from our Uttara facility is handled with utmost care to ensure complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-[#DFECCE] bg-[#FAFCF7] hover:bg-white hover:shadow-lg transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#EBF5DC] text-[#6CAE14] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#DFECCE] text-[#526052]">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#0E140E]">
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#526052] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0E140E] via-[#1A261A] to-[#0E140E] text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#9ED114] text-xs font-bold backdrop-blur-md">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ready to Experience Authentic Shopping?</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
              Join Thousands of Satisfied Families Across Bangladesh
            </h2>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Explore 10+ categories ranging from Organic Foods and Fashion to Baby Care, Bed Sheets, Kitchenware, and Islamic essentials.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/category/all"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#6CAE14] hover:bg-[#5E9911] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95"
              >
                <span>Start Shopping Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl transition-all border border-white/20"
              >
                <Truck className="w-4 h-4 text-[#9ED114]" />
                <span>Track an Existing Order</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
