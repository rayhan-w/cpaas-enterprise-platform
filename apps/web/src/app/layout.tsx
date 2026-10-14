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
  themeColor: '#6CAE14',
};

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
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/jawata-mart-logo.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
    shortcut: '/icon.svg',
    apple: '/jawata-mart-logo.jpg',
  },
  openGraph: {
    title: 'Jawata Mart | Lifestyle & Family Shopping',
    description: 'Fast nationwide delivery with bKash, Nagad, UCB Bank, and Cash on Delivery.',
    type: 'website',
    locale: 'en_BD',
    siteName: 'Jawata Mart',
    images: ['/jawata-mart-cover.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const metaPixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || '1597503191183158';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Meta Pixel Base Code */}
        {metaPixelId && (
          <>
            <script
              id="meta-pixel-base"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${metaPixelId}');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className="bg-slate-50 text-slate-900 min-h-screen font-sans antialiased flex flex-col justify-between">
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <AppShell>{children}</AppShell>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
