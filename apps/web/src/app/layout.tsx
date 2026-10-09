import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/cart-context';
import { ToastProvider } from '@/context/toast-context';
import AppShell from '@/components/layout/AppShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#dc2626',
};

export const metadata: Metadata = {
  title: 'বাংলা নিউজ | সত্য ও তথ্যের সাথে ২৪/৭ ব্রেকিং নিউজ',
  description:
    'Bangla News - জাতীয়, আন্তর্জাতিক, রাজনীতি, অর্থনীতি, খেলাধুলা, বিজ্ঞান ও তথ্যপ্রযুক্তির নির্ভরযোগ্য সংবাদ মাধ্যম। সত্য ও সঠিক খবর সবার আগে।',
  keywords: [
    'Bangla News',
    'বাংলা নিউজ',
    'banglishnews.com',
    'ব্রেকিং নিউজ',
    'বাংলাদেশ সংবাদ',
    'লাইভ আপডেট',
    'খবর',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
  },
  openGraph: {
    title: 'বাংলা নিউজ | সত্য ও তথ্যের সাথে ২৪/৭',
    description: 'সর্বশেষ সংবাদ ও ব্রেকিং নিউজ আপডেট সবার আগে পড়তে ভিজিট করুন বাংলা নিউজ।',
    type: 'website',
    locale: 'bn_BD',
    siteName: 'Bangla News',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-slate-900 min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AppShell>{children}</AppShell>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
