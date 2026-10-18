'use client';

import React, { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView } from '@/lib/tracking';

/**
 * TrackingScripts Component
 * 
 * Note: GTM head snippet, GTM noscript iframe, and direct GA4 (gtag.js) are
 * now injected directly at the server level in `layout.tsx` to guarantee
 * proper placement at the top of <head> and top of <body> without client delays.
 * 
 * This component handles client-side SPA route transition tracking (PageView events)
 * across Next.js navigation.
 */
export default function TrackingScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track PageView on SPA Route Changes
  useEffect(() => {
    if (pathname) {
      const fullUrl = window.location.href;
      trackPageView(fullUrl);
    }
  }, [pathname, searchParams]);

  return null;
}
