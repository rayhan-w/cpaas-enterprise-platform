/**
 * Comprehensive Tracking & Analytics Utility for Jawata Mart
 * Supports:
 * 1. Meta Pixel (Browser-side fbq with unique eventID)
 * 2. Meta Conversions API (Server-side CAPI with Event Deduplication & User Data matching)
 * 3. Google Analytics 4 (GA4 via gtag)
 * 4. Google Tag Manager (GTM dataLayer)
 */

declare global {
  interface Window {
    fbq?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface TrackingProduct {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
  category?: string | null;
  brand?: string | null;
}

export interface TrackingOrder {
  orderNumber: string;
  total: number;
  subtotal?: number;
  items: TrackingProduct[];
  customerPhone?: string;
  customerEmail?: string;
  customerName?: string;
}

/**
 * Generate unique Event ID for Meta Pixel + CAPI Deduplication
 */
export function generateEventId(prefix = 'evt'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Client cookie helper
 */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Extract _fbc from cookie or from ?fbclid=... URL query
 */
function getFbc(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const cookieFbc = getCookie('_fbc');
  if (cookieFbc) return cookieFbc;
  try {
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get('fbclid');
    if (fbclid) {
      return `fb.1.${Date.now()}.${fbclid}`;
    }
  } catch {}
  return undefined;
}

/**
 * Extract _fbp from cookie
 */
function getFbp(): string | undefined {
  return getCookie('_fbp');
}

/**
 * Log tracking activity in development/preview for testing and verification
 */
function logEvent(channel: string, eventName: string, data: any) {
  if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
    console.groupCollapsed(`%c[Tracking: ${channel}] ${eventName}`, 'color: #0d1f61; font-weight: bold;');
    console.log('Payload:', data);
    console.groupEnd();
  }
}

/**
 * Asynchronously send event to server-side Conversions API (/api/tracking/capi)
 */
async function sendCapiEvent(eventName: string, eventId: string, data: any = {}) {
  if (typeof window === 'undefined') return;

  try {
    const payload = {
      eventName,
      eventId,
      eventSourceUrl: data.eventSourceUrl || window.location.href,
      fbp: getFbp(),
      fbc: getFbc(),
      ...data,
    };

    fetch('/api/tracking/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Non-blocking fail-safe
    });
  } catch {
    // Fail-safe
  }
}

/**
 * 1. PAGE VIEW
 * Fires on initial load and every route navigation
 */
export function trackPageView(url?: string) {
  if (typeof window === 'undefined') return;

  const currentUrl = url || window.location.href;
  const eventId = generateEventId('pv');

  // Meta Pixel (Browser)
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView', {}, { eventID: eventId });
    logEvent('Meta Pixel', 'PageView', { url: currentUrl, eventId });
  }

  // Conversions API (Server)
  sendCapiEvent('PageView', eventId, { eventSourceUrl: currentUrl });

  // Google Tag Manager
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'page_view',
      page_location: currentUrl,
      page_title: document.title,
    });
    logEvent('GTM', 'page_view', { url: currentUrl });
  }

  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_location: currentUrl,
      page_title: document.title,
    });
  }
}

/**
 * 2. VIEW CONTENT
 * Fires on product details page view
 */
export function trackViewContent(product: TrackingProduct) {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('vc');
  const price = Number(product.price) || 0;
  const contentId = String(product.id);

  // Meta Pixel (Browser)
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'ViewContent',
      {
        content_name: product.name,
        content_category: product.category || 'General',
        content_ids: [contentId],
        content_type: 'product',
        value: price,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'ViewContent', { ...product, eventId });
  }

  // Conversions API (Server)
  sendCapiEvent('ViewContent', eventId, {
    value: price,
    currency: 'BDT',
    items: [
      {
        id: contentId,
        name: product.name,
        price: price,
        quantity: 1,
        category: product.category,
      },
    ],
  });

  // GTM / GA4 E-commerce view_item
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ecommerce: null }); // Clear previous
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: 'BDT',
        value: price,
        items: [
          {
            item_id: contentId,
            item_name: product.name,
            item_category: product.category || 'General',
            item_brand: product.brand || 'Jawata Mart',
            price: price,
            quantity: 1,
          },
        ],
      },
    });
    logEvent('GTM / GA4', 'view_item', product);
  }
}

/**
 * 3. ADD TO CART
 * Fires when customer adds an item to cart
 */
export function trackAddToCart(item: TrackingProduct) {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('atc');
  const qty = Number(item.quantity) || 1;
  const unitPrice = Number(item.price) || 0;
  const value = unitPrice * qty;
  const contentId = String(item.id);

  // Meta Pixel (Browser)
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'AddToCart',
      {
        content_name: item.name,
        content_category: item.category || 'General',
        content_ids: [contentId],
        content_type: 'product',
        value: value,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'AddToCart', { ...item, eventId, value });
  }

  // Conversions API (Server)
  sendCapiEvent('AddToCart', eventId, {
    value: value,
    currency: 'BDT',
    items: [
      {
        id: contentId,
        name: item.name,
        price: unitPrice,
        quantity: qty,
        category: item.category,
      },
    ],
  });

  // GTM / GA4 E-commerce add_to_cart
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'BDT',
        value: value,
        items: [
          {
            item_id: contentId,
            item_name: item.name,
            item_category: item.category || 'General',
            item_brand: item.brand || 'Jawata Mart',
            price: unitPrice,
            quantity: qty,
          },
        ],
      },
    });
    logEvent('GTM / GA4', 'add_to_cart', item);
  }
}

/**
 * 4. INITIATE CHECKOUT
 * Fires when customer begins checkout process
 */
export function trackInitiateCheckout(data: { items: TrackingProduct[]; total: number; numItems: number }) {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('ic');
  const total = Number(data.total) || 0;
  const numItems = Number(data.numItems) || data.items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
  const contentIds = data.items.map((i) => String(i.id));

  // Meta Pixel (Browser)
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'InitiateCheckout',
      {
        content_ids: contentIds,
        content_type: 'product',
        num_items: numItems,
        value: total,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'InitiateCheckout', { ...data, eventId, total });
  }

  // Conversions API (Server)
  sendCapiEvent('InitiateCheckout', eventId, {
    value: total,
    currency: 'BDT',
    numItems: numItems,
    items: data.items.map((i) => ({
      id: String(i.id),
      name: i.name,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      category: i.category,
    })),
  });

  // GTM / GA4 begin_checkout
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'BDT',
        value: total,
        items: data.items.map((i) => ({
          item_id: String(i.id),
          item_name: i.name,
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
        })),
      },
    });
    logEvent('GTM / GA4', 'begin_checkout', data);
  }
}

/**
 * 5. PURCHASE
 * Fires on Order Success page with full deduplication & customer matching
 */
export function trackPurchase(order: TrackingOrder) {
  if (typeof window === 'undefined') return;

  // Use orderNumber as the eventID for bulletproof Browser + CAPI Deduplication
  const eventId = order.orderNumber ? `order_${order.orderNumber}` : generateEventId('pur');
  const total = Number(order.total) || 0;
  const numItems = order.items.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
  const contentIds = order.items.map((i) => String(i.id));

  // Meta Pixel (Browser)
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'Purchase',
      {
        content_type: 'product',
        content_ids: contentIds,
        contents: order.items.map((i) => ({
          id: String(i.id),
          quantity: Number(i.quantity) || 1,
          item_price: Number(i.price) || 0,
        })),
        num_items: numItems,
        value: total,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'Purchase', { orderNumber: order.orderNumber, total, eventId });
  }

  // Conversions API (Server)
  sendCapiEvent('Purchase', eventId, {
    orderNumber: order.orderNumber,
    value: total,
    currency: 'BDT',
    numItems: numItems,
    customerPhone: order.customerPhone,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    items: order.items.map((i) => ({
      id: String(i.id),
      name: i.name,
      price: Number(i.price) || 0,
      quantity: Number(i.quantity) || 1,
      category: i.category,
    })),
  });

  // GTM / GA4 purchase event
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: order.orderNumber,
        value: total,
        currency: 'BDT',
        items: order.items.map((i) => ({
          item_id: String(i.id),
          item_name: i.name,
          item_category: i.category || 'General',
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
        })),
      },
    });
    logEvent('GTM / GA4', 'purchase', order);
  }
}

/**
 * 6. SEARCH
 */
export function trackSearch(searchQuery: string) {
  if (typeof window === 'undefined' || !searchQuery) return;

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Search', { search_string: searchQuery });
    logEvent('Meta Pixel', 'Search', { searchQuery });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'search',
      search_term: searchQuery,
    });
  }
}

/**
 * 7. CONTACT / WHATSAPP CLICK
 */
export function trackContact(channel: string) {
  if (typeof window === 'undefined') return;

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', { content_name: channel });
    logEvent('Meta Pixel', 'Contact', { channel });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'contact',
      contact_method: channel,
    });
  }
}
