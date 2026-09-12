'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, ProductItem, ProductVariant, DeliveryZone } from '@/lib/types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductItem, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  appliedCoupon: { code: string; discount: number } | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('INSIDE_DHAKA');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Check for current cart storage
      const stored = localStorage.getItem('jawata_mart_cart');
      if (stored) {
        setItems(JSON.parse(stored));
      } else {
        // Clear any old mock data from previous demo templates
        localStorage.removeItem('nurtura_cart');
        setItems([]);
      }
      const storedZone = localStorage.getItem('jawata_mart_delivery_zone');
      if (storedZone === 'OUTSIDE_DHAKA' || storedZone === 'INSIDE_DHAKA') {
        setDeliveryZone(storedZone);
      }
    } catch {
      // Ignore storage errors
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('jawata_mart_cart', JSON.stringify(items));
        localStorage.setItem('jawata_mart_delivery_zone', deliveryZone);
      } catch {
        // Ignore
      }
    }
  }, [items, deliveryZone, mounted]);

  const addItem = (product: ProductItem, quantity = 1, variant?: ProductVariant) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && i.selectedVariant?.id === variant?.id
      );

      const unitPrice = variant?.price || product.price;

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          quantity,
          selectedVariant: variant,
          unitPrice,
          totalPrice: quantity * unitPrice,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.selectedVariant?.id === variantId)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.selectedVariant?.id === variantId) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  // Free delivery above ৳2,000
  const isFreeDelivery = subtotal >= 2000 && subtotal > 0;
  const deliveryCharge =
    subtotal === 0 ? 0 : isFreeDelivery ? 0 : deliveryZone === 'INSIDE_DHAKA' ? 60 : 120;

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal + deliveryCharge - discount);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({ code: code.toUpperCase(), discount: data.discount });
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      // Local fallback
      if (code.toUpperCase() === 'WELCOME10') {
        const disc = Math.min(300, Math.round(subtotal * 0.1));
        setAppliedCoupon({ code: 'WELCOME10', discount: disc });
        return { success: true, message: `Coupon applied: ৳${disc} saved!` };
      }
      if (code.toUpperCase() === 'EID2026' && subtotal >= 2500) {
        setAppliedCoupon({ code: 'EID2026', discount: 200 });
        return { success: true, message: 'Coupon applied: ৳200 saved!' };
      }
      return { success: false, message: 'Coupon not valid for this order' };
    }
  };

  const removeCoupon = () => setAppliedCoupon(null);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        deliveryZone,
        setDeliveryZone,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        deliveryCharge,
        discount,
        total,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
