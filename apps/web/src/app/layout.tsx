import './globals.css';
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/cart-context';
import { ToastProvider } from '@/context/toast-context';
import AppShell from '@/components/layout/AppShell';
import { dbService } from '@/lib/db-service';
import { isValidGtmId, isValidGa4Id } from '@/lib/tracking-validator';

export const dynamic = 'force-dynamic';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: any = null;
  try {
    settings = await dbService.getSettings();
  } catch (err) {
    console.error('Failed to load settings in RootLayout:', err);
  }

  // 1. Google Tag Manager (GTM) Wiring
  const isGtmActive = Boolean(settings?.enableGTM && isValidGtmId(settings?.gtmId));
  const cleanGtmId = isGtmActive ? String(settings.gtmId).trim().toUpperCase() : '';

  // 2. Google Analytics 4 (GA4) Wiring & Double-Counting Prevention
  const isGa4Enabled = Boolean(settings?.enableGA4 && isValidGa4Id(settings?.ga4MeasurementId));
  const cleanGa4Id = isGa4Enabled ? String(settings.ga4MeasurementId).trim().toUpperCase() : '';

  // If GTM is active and ga4ViaGtm is true (default true when GTM is active),
  // GA4 is routed via GTM container. Direct gtag.js is only loaded if ga4ViaGtm is explicitly false or GTM is inactive.
  const ga4ViaGtm = settings?.ga4ViaGtm !== false;
  const isDirectGa4Active = isGa4Enabled && (!isGtmActive || !ga4ViaGtm);

  const metaPixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || settings?.metaPixelId || '1597503191183158';

  return (
    <html lang="en">
      <head>
        {/* =================================================================== */}
        {/* GOOGLE TAG MANAGER (GTM) - Top of <head>                            */}
        {/* =================================================================== */}
        {isGtmActive && (
          <script
            id="gtm-script-head"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${cleanGtmId}');`,
            }}
          />
        )}

        {/* =================================================================== */}
        {/* GOOGLE ANALYTICS 4 (GA4) - Direct gtag.js (when not routed via GTM) */}
        {/* =================================================================== */}
        {isDirectGa4Active && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${cleanGa4Id}`}
            />
            <script
              id="ga4-script-direct"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${cleanGa4Id}', { page_path: window.location.pathname });`,
              }}
            />
          </>
        )}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Meta Pixel Base Code */}
        {settings?.enableMetaPixel !== false && metaPixelId && (
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
        {/* =================================================================== */}
        {/* GOOGLE TAG MANAGER (noscript) - Immediately after <body> open       */}
        {/* =================================================================== */}
        {isGtmActive && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${cleanGtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

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
