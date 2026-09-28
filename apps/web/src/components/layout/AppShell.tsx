'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomBar from '@/components/layout/MobileBottomBar';
import CartDrawer from '@/components/cart/CartDrawer';
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp';
import TrackingScripts from '@/components/tracking/TrackingScripts';
import ScrollToTopOnNav from '@/components/common/ScrollToTopOnNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  const isTrackOpsRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/super-admin') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/unauthorized') ||
    pathname.startsWith('/r/');

  if (isTrackOpsRoute) {
    return <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">{children}</div>;
  }

  return (
    <>
      <Suspense fallback={null}>
        <ScrollToTopOnNav />
      </Suspense>
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
      <MobileBottomBar />
      <CartDrawer />
      <FloatingWhatsApp />
      <Suspense fallback={null}>
        <TrackingScripts />
      </Suspense>
    </>
  );
}
