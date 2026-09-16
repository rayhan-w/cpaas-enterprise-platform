'use client';

import { useEffect, useRef } from 'react';
import { trackPurchase } from '@/lib/tracking';
import { OrderRecord } from '@/lib/types';

interface OrderSuccessTrackerProps {
  order: OrderRecord | null;
  fallbackOrderNumber?: string;
  fallbackPhone?: string;
}

export default function OrderSuccessTracker({
  order,
  fallbackOrderNumber,
  fallbackPhone,
}: OrderSuccessTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;

    const orderNumber = order?.orderNumber || fallbackOrderNumber;
    if (!orderNumber) return;

    // Check if already tracked in this browser session
    const storageKey = `tracked_order_${orderNumber}`;
    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    const total = order?.total || 0;
    const items = (order?.items || []).map((i) => ({
      id: i.productId || i.id,
      name: i.productName,
      price: i.price,
      quantity: i.quantity,
    }));

    trackPurchase({
      orderNumber,
      total,
      subtotal: order?.subtotal,
      customerName: order?.customerName,
      customerPhone: order?.customerPhone || fallbackPhone,
      customerEmail: order?.customerEmail,
      items,
    });

    sessionStorage.setItem(storageKey, 'true');
    trackedRef.current = true;
  }, [order, fallbackOrderNumber, fallbackPhone]);

  return null;
}
