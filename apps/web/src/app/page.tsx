import React from 'react';
import Link from 'next/link';
import {
  Flame,
  Clock,
  TrendingUp,
  Globe2,
  Tv,
  ChevronRight,
  Share2,
  Bookmark,
  Search,
  Bell,
  LogIn,
  Sun,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function BanglaNewsHomePage() {
  const currentDate = 'শুক্রবার, ০৯ অক্টোবর ২০২৬';

  const categories = [
    'সর্বশেষ',
    'জাতীয়',
    'রাজনীতি',
    'আন্তর্জাতিক',
    'অর্থনীতি',
    'খেলাধুলা',
    'তথ্যপ্রযুক্তি',
    'বিনোদন',
    'মতামত',
    'চাকরি',
  ];

  const breakingNews = [
    'অর্থনীতিতে নতুন বিনিয়োগ আকর্ষণ করতে বাণিজ্য মন্ত্রণালয়ের একাধিক গুরুত্বপূর্ণ সিদ্ধান্ত',
    'আন্তর্জাতিক বাজারে তেলের মূল্যে বড় পতন, বিশ্বজুড়ে সরবরাহ স্বাভাবিকের পথে',
    'টি-টোয়েন্টি বিশ্বকাপের প্রস্তুতি ম্যাচে টাইগারদের দুর্দান্ত জয়, বোলারদের দাপট',
    'কৃত্রিম বুদ্ধিমত্তা ও সাইবার সুরক্ষায় নতুন দিগন্ত উন্মোচন করল বাংলাদেশের তরুণরা',
  ];

  const topNews = [
    {
      id: 1,
      category: 'জাতীয়',
      title: 'উন্নয়ন প্রকল্প সময়মতো বাস্তবায়নে কঠোর নজরদারির নির্দেশ সরকারের',
      excerpt:
        'প্রকল্পগুলোর গুণগত মান নিশ্চিত করতে নিয়মিত মাঠপর্যায়ে পরিদর্শনের নির্দেশ দিয়েছেন সংশ্লিষ্ট মন্ত্রণালয়। অপচয় রোধে কঠোর আর্থিক শৃঙ্খলা নিশ্চিত করার তাগিদ।',
      time: '১৫ মিনিট আগে',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      category: 'অর্থনীতি',
      title: 'রপ্তানি আয়ে রেকর্ড প্রবৃদ্ধি: তৈরি পোশাক ও আইটি খাতের যৌথ সাফল্য',
      excerpt:
        'গত প্রান্তিকে প্রবাসীদের পাঠানো রেমিট্যান্স এবং রপ্তানি আয়ে ইতিবাচক ধারা অব্যাহত থাকায় বৈদেশিক মুদ্রার রিজার্ভে স্বস্তিদায়ক অবস্থান তৈরি হয়েছে।',
      time: '৩২ মিনিট আগে',
      image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      category: 'আন্তর্জাতিক',
      title: 'জলবায়ু শীর্ষ সম্মেলনে নবায়নযোগ্য শক্তিতে বিনিয়োগ বৃদ্ধির যৌথ চুক্তি',
      excerpt:
        'বিশ্বনেতারা ২০৩০ সালের মধ্যে কার্বন নিঃসরণ উল্লেখযোগ্য মাত্রায় কমানোর অঙ্গীকার পুনর্ব্যক্ত করেছেন। উন্নয়নশীল দেশগুলোর জন্য ঘোষিত হলো নতুন তহবিল।',
      time: '১ ঘণ্টা আগে',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      category: 'খেলাধুলা',
      title: 'ব্যাটে-বলে অলরাউন্ড পারফরম্যান্সে সিরিজ নিশ্চিত করল বাংলাদেশ ক্রিকেট দল',
      excerpt:
        'শেষ ওভারে স্নায়ুচাপ ধরে রেখে ম্যাচ সেরা হলেন তরুণ অলরাউন্ডার। অধিনায়ক বললেন, বিশ্বকাপ মিশনের জন্য এই জয় আত্মবিশ্বাস বহুগুণ বাড়িয়ে দেবে।',
      time: '২ ঘণ্টা আগে',
      image: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const sidebarNews = [
    {
      id: 5,
      category: 'তথ্যপ্রযুক্তি',
      title: '৫জি নেটওয়ার্ক বিস্তারে দ্রুত এগোচ্ছে দেশের টেলিকম অপারেটরগুলো',
      time: '৩০ মিনিট আগে',
    },
    {
      id: 6,
      category: 'রাজনীতি',
      title: 'আসন্ন নির্বাচনের রোডম্যাপ পর্যালোচনায় কমিশন ও অংশীজনদের বৈঠক',
      time: '৪৫ মিনিট আগে',
    },
    {
      id: 7,
      category: 'বিনোদন',
      title: 'আন্তর্জাতিক চলচ্চিত্র উৎসবে প্রশংসিত হলো বাংলাদেশি তরুণ পরিচালকের পূর্ণদৈর্ঘ্য ছবি',
      time: '১ ঘণ্টা আগে',
    },
    {
      id: 8,
      category: 'বিজ্ঞান',
      title: 'মহাকাশ গবেষণায় নতুন টেলিস্কোপ পাঠাল নাসা, সন্ধান মিলল নতুন গ্রহের',
      time: '২ ঘণ্টা আগে',
    },
    {
      id: 9,
      category: 'শিক্ষা',
      title: 'বিশ্ববিদ্যালয় পর্যায়ে কর্মমুখী শিক্ষা ও উদ্ভাবনী গবেষণায় বিশেষ গুরুত্বারোপ',
      time: '৩ ঘণ্টা আগে',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              {currentDate}
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              ঢাকা, বাংলাদেশ
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Sun className="w-3.5 h-3.5" />
              ৩১° সে. রৌদ্রোজ্জ্বল
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-xs transition shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগইন / কন্ট্রোল প্যানেল</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-serif">
                  বাংলা <span className="text-rose-600">নিউজ</span>
                </span>
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">
                  Live
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 font-medium mt-1">
              সত্য, নির্ভুল ও নিরপেক্ষ তথ্যের সাথে সার্বক্ষণিক ২৪/৭ সংবাদ পোর্টাল
            </p>
          </div>

          {/* Header Ad or Announcement Banner */}
          <div className="w-full md:w-auto flex items-center justify-center">
            <div className="px-6 py-3 bg-gradient-to-r from-rose-50 via-slate-50 to-indigo-50 border border-slate-200 rounded-xl text-center shadow-2xs">
              <p className="text-xs font-bold text-slate-900">
                স্বাগতম বাংলা নিউজে — সত্য ও ন্যায়ের বিশ্বস্ত প্রতীক
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                সর্বশেষ সংবাদ সবার আগে পেতে চোখ রাখুন banglishnews.com-এ
              </p>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-2.5 text-sm font-semibold gap-6 text-slate-700">
              {categories.map((cat, idx) => (
                <Link
                  key={cat}
                  href={`#${cat}`}
                  className={`hover:text-rose-600 transition shrink-0 ${
                    idx === 0 ? 'text-rose-600 font-bold' : ''
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Breaking News Ticker */}
      <section className="bg-rose-50 border-b border-rose-200/80">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
          <span className="px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded shrink-0 flex items-center gap-1.5 shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-current" />
            ব্রেকিং নিউজ
          </span>
          <div className="overflow-hidden whitespace-nowrap text-xs text-slate-800 font-medium w-full">
            <div className="inline-block animate-pulse">
              {breakingNews.map((news, i) => (
                <span key={i} className="mr-8 inline-block hover:text-rose-600 cursor-pointer">
                  • {news}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main News Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* Lead Stories & Featured Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Top Lead Story */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={topNews[0].image}
                  alt={topNews[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-md shadow-md">
                  {topNews[0].category}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{topNews[0].time}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug hover:text-rose-600 transition cursor-pointer">
                  {topNews[0].title}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {topNews[0].excerpt}
                </p>
              </div>
            </div>

            {/* Sub-Lead Stories Grid (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topNews.slice(1).map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">{item.time}</span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-rose-600 transition cursor-pointer leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 pt-1">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Latest / Trending News (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-600" />
                  আজকের আলোচিত সংবাদ
                </h2>
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              </div>

              <div className="divide-y divide-slate-100">
                {sidebarNews.map((news, idx) => (
                  <div key={news.id} className="py-3.5 first:pt-0 last:pb-0 group cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="text-xl font-bold font-serif text-slate-300 group-hover:text-rose-600 transition">
                        ০{idx + 1}
                      </span>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                          {news.category}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 group-hover:text-rose-600 transition leading-snug">
                          {news.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">{news.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Access Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-white text-lg">
                ন
              </div>
              <h3 className="text-base font-bold text-white">
                বাংলা নিউজ ড্যাশবোর্ড ও শর্ট লিংক সার্ভিস
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                পেশাদার শর্ট ট্র্যাকিং লিংক তৈরি ও অ্যানালিটিক্স দেখতে আপনার অ্যাকাউন্টে লগইন করুন।
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md"
              >
                লগইন করুন
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Portal Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-2xl font-bold text-white font-serif">
                বাংলা <span className="text-rose-500">নিউজ</span>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                banglishnews.com বাংলাদেশের একটি দ্রুত বর্ধনশীল ডিজিটাল সংবাদ ও ট্র্যাকিং প্ল্যাটফর্ম।
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">বিভাগসমূহ</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition">জাতীয় সংবাদ</a></li>
                <li><a href="#" className="hover:text-white transition">রাজনীতি ও প্রশাসন</a></li>
                <li><a href="#" className="hover:text-white transition">অর্থনীতি ও বাণিজ্য</a></li>
                <li><a href="#" className="hover:text-white transition">আন্তর্জাতিক খবর</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">সার্ভিস</h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/login" className="hover:text-white transition">কন্ট্রোল প্যানেল</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">ইউজার ড্যাশবোর্ড</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">গোপনীয়তা নীতি</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">শর্তাবলী</Link></li>
              </ul>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">যোগাযোগ</h4>
              <p>বার্তা ও বাণিজ্যিক কার্যালয়: ঢাকা, বাংলাদেশ</p>
              <p>ইমেইল: news@banglishnews.com</p>
              <p>ওয়েবসাইট: banglishnews.com</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© ২০২৬ বাংলা নিউজ (banglishnews.com)। সর্বস্বত্ব সংরক্ষিত।</p>
            <p>সত্য ও তথ্যের সাথে সার্বক্ষণিক</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
