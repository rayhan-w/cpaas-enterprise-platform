/**
 * Comprehensive Tracking & Analytics Utility for Jawata Mart
 * Supports:
 * 1. Meta Pixel (Browser-side fbq)
 * 2. Meta Conversions API (Server-side CAPI with Event Deduplication)
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

interface TrackingProduct {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string | null;
  brand?: string | null;
}

interface TrackingOrder {
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
 * Log tracking activity in development/preview for testing and verification
 */
function logEvent(channel: string, eventName: string, data: any) {
  if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
    console.groupCollapsed(`%c[Tracking: ${channel}] ${eventName}`, 'color: #6CAE14; font-weight: bold;');
    console.log('Payload:', data);
    console.groupEnd();
  }
}

/**
 * 1. PAGE VIEW
 */
export function trackPageView(url?: string) {
  if (typeof window === 'undefined') return;

  const currentUrl = url || window.location.href;

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
    logEvent('Meta Pixel', 'PageView', { url: currentUrl });
  }

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
 * 2. VIEW CONTENT / VIEW ITEM
 */
export function trackViewContent(product: TrackingProduct) {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('vc');

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'ViewContent',
      {
        content_name: product.name,
        content_category: product.category || 'General',
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'ViewContent', { ...product, eventId });
  }

  // GTM / GA4 E-commerce view_item
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ecommerce: null }); // Clear previous
    window.dataLayer.push({
      event: 'view_item',
      ecommerce: {
        currency: 'BDT',
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            item_category: product.category || 'General',
            item_brand: product.brand || 'Jawata Mart',
            price: product.price,
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
 */
export function trackAddToCart(item: TrackingProduct) {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('atc');
  const qty = item.quantity || 1;
  const value = item.price * qty;

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'AddToCart',
      {
        content_name: item.name,
        content_category: item.category || 'General',
        content_ids: [item.id],
        content_type: 'product',
        value: value,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'AddToCart', { ...item, eventId });
  }

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
            item_id: item.id,
            item_name: item.name,
            item_category: item.category || 'General',
            item_brand: item.brand || 'Jawata Mart',
            price: item.price,
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
 */
export function trackInitiateCheckout(data: { items: TrackingProduct[]; total: number; numItems: number }) {
  if (typeof window === 'undefined') return;

  const eventId = generateEventId('ic');

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'InitiateCheckout',
      {
        content_ids: data.items.map((i) => i.id),
        content_type: 'product',
        num_items: data.numItems,
        value: data.total,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'InitiateCheckout', { ...data, eventId });
  }

  // GTM / GA4 begin_checkout
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'BDT',
        value: data.total,
        items: data.items.map((i) => ({
          item_id: i.id,
          item_name: i.name,
          price: i.price,
          quantity: i.quantity || 1,
        })),
      },
    });
    logEvent('GTM / GA4', 'begin_checkout', data);
  }
}

/**
 * 5. PURCHASE (Browser-side + CAPI Trigger)
 */
export function trackPurchase(order: TrackingOrder) {
  if (typeof window === 'undefined') return;

  // Use orderNumber as the eventID for Meta Pixel + CAPI Deduplication!
  const eventId = `order_${order.orderNumber}`;

  // Meta Pixel Browser Event
  if (typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'Purchase',
      {
        content_type: 'product',
        content_ids: order.items.map((i) => i.id),
        contents: order.items.map((i) => ({ id: i.id, quantity: i.quantity || 1, item_price: i.price })),
        num_items: order.items.reduce((sum, i) => sum + (i.quantity || 1), 0),
        value: order.total,
        currency: 'BDT',
      },
      { eventID: eventId }
    );
    logEvent('Meta Pixel', 'Purchase', { orderNumber: order.orderNumber, total: order.total, eventId });
  }

  // GTM / GA4 purchase event
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: order.orderNumber,
        value: order.total,
        currency: 'BDT',
        items: order.items.map((i) => ({
          item_id: i.id,
          item_name: i.name,
          item_category: i.category || 'General',
          price: i.price,
          quantity: i.quantity || 1,
        })),
      },
    });
    logEvent('GTM / GA4', 'purchase', order);
  }

  // Trigger Client-to-Server CAPI Verification
  try {
    fetch('/api/tracking/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Purchase',
        eventId: eventId,
        orderNumber: order.orderNumber,
        value: order.total,
        currency: 'BDT',
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        items: order.items,
        eventSourceUrl: window.location.href,
      }),
    }).catch(() => {
      // Background non-blocking
    });
  } catch {}
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
