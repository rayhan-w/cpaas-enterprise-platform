'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToTopOnNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Reset scroll to top immediately on page / query parameter change
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    } catch {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, searchParams]);

  return null;
}
