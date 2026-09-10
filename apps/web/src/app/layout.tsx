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
  title: 'Jawata Mart | Trusted Multi-Category Shopping Platform in Bangladesh',
  description:
    'Discover 10,000+ authentic lifestyle products at Jawata Mart: Baby & Mother Care, Men & Women Fashion, Electronics, Health & Beauty, Home Living & Groceries with fast nationwide delivery from Uttara Sector-12, Dhaka.',
  keywords: [
    'Jawata Mart',
    'Jawata Mart Bangladesh',
    'online shopping bangladesh',
    'ecommerce bangladesh',
    'uttara online shop',
    'bKash payment ecommerce',
    'nagad payment',
    'cash on delivery dhaka',
  ],
  openGraph: {
    title: 'Jawata Mart | Lifestyle & Family Shopping',
    description: 'Fast nationwide delivery with bKash, Nagad, and Cash on Delivery.',
    type: 'website',
    locale: 'en_BD',
    siteName: 'Jawata Mart',
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
      <body className="bg-[#FAFCF7] text-[#0E140E] min-h-screen font-sans antialiased flex flex-col justify-between">
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
