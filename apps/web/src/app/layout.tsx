import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from '@/context/cart-context';
import { ToastProvider } from '@/context/toast-context';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomBar from '@/components/layout/MobileBottomBar';
import CartDrawer from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'Nurtura Bangladesh | Premium Multi-Category Shopping Platform',
  description:
    'Discover 10,000+ authentic lifestyle products in Bangladesh: Baby & Mother Care, Men & Women Fashion, Electronics, Health & Beauty, Home Living & Groceries with fast nationwide delivery and Cash on Delivery.',
  keywords: [
    'Bangladesh online shopping',
    'ecommerce bangladesh',
    'baby care bd',
    'mother maternity bd',
    'mens fashion dhaka',
    'womens fashion',
    'electronics bangladesh',
    'bKash payment ecommerce',
    'nagad payment',
    'cash on delivery dhaka',
  ],
  openGraph: {
    title: 'Nurtura Bangladesh | Lifestyle & Family Shopping',
    description: 'Fast nationwide delivery with bKash, Nagad, and Cash on Delivery.',
    type: 'website',
    locale: 'en_BD',
    siteName: 'Nurtura Bangladesh',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8F7F5] text-[#1A1512] min-h-screen font-sans antialiased flex flex-col justify-between">
        <ToastProvider>
          <CartProvider>
            <AnnouncementBar />
            <Header />
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
            <MobileBottomBar />
            <CartDrawer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
