'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/tracking';

interface TrackingConfig {
  metaPixelId?: string;
  enableMetaPixel?: boolean;
  ga4MeasurementId?: string;
  enableGA4?: boolean;
  gtmId?: string;
  enableGTM?: boolean;
}

export default function TrackingScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [config, setConfig] = useState<TrackingConfig>({
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
    enableMetaPixel: true,
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
    enableGA4: true,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
    enableGTM: true,
  });

  // Fetch live tracking settings from DB / API
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setConfig((prev) => ({
              ...prev,
              metaPixelId: data.settings.metaPixelId || prev.metaPixelId,
              enableMetaPixel: data.settings.enableMetaPixel ?? prev.enableMetaPixel,
              ga4MeasurementId: data.settings.ga4MeasurementId || prev.ga4MeasurementId,
              enableGA4: data.settings.enableGA4 ?? prev.enableGA4,
              gtmId: data.settings.gtmId || prev.gtmId,
              enableGTM: data.settings.enableGTM ?? prev.enableGTM,
            }));
          }
        }
      } catch {
        // Fallback to env variables
      }
    }
    loadConfig();
  }, []);

  // Track PageView on SPA Route Changes
  useEffect(() => {
    if (pathname) {
      const fullUrl = window.location.href;
      trackPageView(fullUrl);
    }
  }, [pathname, searchParams]);

  const activeMetaPixelId = config.enableMetaPixel ? config.metaPixelId : null;
  const activeGtmId = config.enableGTM ? config.gtmId : null;
  const activeGa4Id = config.enableGA4 ? config.ga4MeasurementId : null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. META (FACEBOOK) PIXEL                                                  */}
      {/* ========================================================================= */}
      {activeMetaPixelId && (
        <>
          <Script
            id="meta-pixel-script"
            strategy="afterInteractive"
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
                fbq('init', '${activeMetaPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${activeMetaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. GOOGLE TAG MANAGER (GTM)                                               */}
      {/* ========================================================================= */}
      {activeGtmId && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${activeGtmId}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${activeGtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. GOOGLE ANALYTICS 4 (GA4)                                               */}
      {/* ========================================================================= */}
      {activeGa4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${activeGa4Id}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${activeGa4Id}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}
