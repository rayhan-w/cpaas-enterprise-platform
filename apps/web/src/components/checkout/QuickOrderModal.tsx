'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, ShieldCheck, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';

import { BkashLogo, NagadLogo, CodBadge } from '@/components/common/PaymentLogos';

interface QuickOrderModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickOrderModal({ product, isOpen, onClose }: QuickOrderModalProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'INSIDE_DHAKA' | 'OUTSIDE_DHAKA'>('INSIDE_DHAKA');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD'>('COD');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  if (!isOpen || !product) return null;

  const itemPrice = product.price;
  const subtotal = itemPrice * quantity;
  const deliveryCharge = subtotal >= 2000 ? 0 : deliveryZone === 'INSIDE_DHAKA' ? 60 : 120;
  const total = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      toast('Please enter your name, phone number, and delivery address', 'error');
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(customerPhone.trim().replace('+88', ''))) {
      toast('Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        address: address.trim(),
        city: deliveryZone === 'INSIDE_DHAKA' ? 'Dhaka' : 'Outside Dhaka',
        deliveryZone,
        paymentMethod,
        transactionId: transactionId.trim() || undefined,
        senderNumber: senderNumber.trim() || undefined,
        items: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
          },
        ],
        notes: `Ghorer Bazar Style 1-Click Fast Order (${paymentMethod})`,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setOrderSuccess(data.order);
      toast('Your order has been placed successfully!', 'success');
    } catch (err: any) {
      toast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DFECCE] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#F1F8E8] px-5 py-4 border-b border-[#DFECCE] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6CAE14] animate-ping" />
            <h3 className="font-bold text-base sm:text-lg text-[#0E140E]">
              Quick Order (1-Click Checkout)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EDE5E1] flex items-center justify-center text-[#526052] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          /* Success Screen */
          <div className="p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center mx-auto ring-4 ring-[#9ED114]/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-[#0E140E]">Thank You! Your Order is Confirmed</h4>
              <p className="text-xs text-[#526052] mt-1">
                Order Number: <span className="font-mono font-bold text-[#6CAE14]">{orderSuccess.orderNumber}</span>
              </p>
            </div>
            <div className="bg-[#FAFCF7] border border-[#DFECCE] p-4 rounded-2xl text-left text-xs space-y-1.5 text-[#526052]">
              <p><strong className="text-[#0E140E]">Customer Name:</strong> {orderSuccess.customerName}</p>
              <p><strong className="text-[#0E140E]">Phone:</strong> {orderSuccess.customerPhone}</p>
              <p><strong className="text-[#0E140E]">Address:</strong> {orderSuccess.address}</p>
              <p><strong className="text-[#0E140E]">Total Bill:</strong> {formatPrice(orderSuccess.total)} (Cash on Delivery)</p>
            </div>
            <p className="text-xs text-[#6CAE14] font-medium bg-[#F1F8E8] p-3 rounded-xl">
              Our customer service team will call you shortly to verify and dispatch your order.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  router.push(`/order-success?orderNumber=${orderSuccess.orderNumber}`);
                }}
                className="w-full bg-[#6CAE14] hover:bg-[#5B960E] text-white font-bold py-3 rounded-xl text-xs transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  onClose();
                }}
                className="w-full bg-white border border-[#DFECCE] hover:bg-[#F1F8E8] text-[#0E140E] font-bold py-3 rounded-xl text-xs transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <form onSubmit={handleSubmitOrder} className="p-5 overflow-y-auto space-y-4">
            {/* Product Summary Card */}
            <div className="flex items-center gap-3 p-3 bg-[#FAFCF7] rounded-2xl border border-[#DFECCE]">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-xl border border-[#DFECCE] shrink-0 bg-white"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#0E140E] line-clamp-1">{product.name}</h4>
                <p className="text-xs font-bold text-[#6CAE14] mt-0.5">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-[#526052]">Quantity:</span>
                  <div className="flex items-center border border-[#DFECCE] bg-white rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 text-[#526052] hover:text-[#6CAE14]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-[#0E140E]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1 text-[#526052] hover:text-[#6CAE14]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs: Name, Phone, Address */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0E140E] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl px-3.5 py-2.5 text-xs text-[#0E140E] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E140E] mb-1">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="11-digit phone number (e.g. 017XXXXXXXX)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl px-3.5 py-2.5 text-xs text-[#0E140E] focus:outline-none focus:border-[#6CAE14]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E140E] mb-1">
                  Complete Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House, Road, Area, Thana & District"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl px-3.5 py-2 text-xs text-[#0E140E] focus:outline-none focus:border-[#6CAE14] resize-none"
                />
              </div>
            </div>

            {/* Delivery Area Selection */}
            <div>
              <label className="block text-xs font-bold text-[#0E140E] mb-1.5">
                Select Delivery Zone:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeliveryZone('INSIDE_DHAKA')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                    deliveryZone === 'INSIDE_DHAKA'
                      ? 'border-[#6CAE14] bg-[#F1F8E8] text-[#0E140E] ring-1 ring-[#6CAE14]'
                      : 'border-[#DFECCE] bg-white text-[#526052]'
                  }`}
                >
                  <span className="font-bold">Inside Dhaka</span>
                  <span className="text-[11px] text-[#6CAE14] font-semibold">Delivery Charge ৳60</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryZone('OUTSIDE_DHAKA')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-0.5 transition-all ${
                    deliveryZone === 'OUTSIDE_DHAKA'
                      ? 'border-[#6CAE14] bg-[#F1F8E8] text-[#0E140E] ring-1 ring-[#6CAE14]'
                      : 'border-[#DFECCE] bg-white text-[#526052]'
                  }`}
                >
                  <span className="font-bold">Outside Dhaka</span>
                  <span className="text-[11px] text-[#6CAE14] font-semibold">Delivery Charge ৳120</span>
                </button>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-[#FAFCF7] p-3 rounded-xl border border-[#DFECCE] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#526052]">
                <span>Product Subtotal:</span>
                <span className="font-semibold text-[#0E140E]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#526052]">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-[#0E140E]">
                  {deliveryCharge === 0 ? 'Free (৳0)' : formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="border-t border-[#DFECCE] pt-1.5 flex justify-between font-bold text-sm text-[#0E140E]">
                <span>Total Payable:</span>
                <span className="text-[#6CAE14] text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-[#0E140E] mb-1.5">
                Select Payment Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    paymentMethod === 'COD'
                      ? 'border-[#6CAE14] bg-[#F1F8E8] text-[#0E140E] ring-1 ring-[#6CAE14]'
                      : 'border-[#DFECCE] bg-white text-[#526052] hover:bg-[#FAFCF7]'
                  }`}
                >
                  <CodBadge />
                  <span className="text-[10px] font-bold text-[#0E140E]">Cash on Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    paymentMethod === 'BKASH'
                      ? 'border-[#E2136E] bg-[#FFF0F5] text-[#0E140E] ring-1 ring-[#E2136E]'
                      : 'border-[#DFECCE] bg-white text-[#526052] hover:bg-[#FAFCF7]'
                  }`}
                >
                  <BkashLogo className="h-4.5 w-auto" />
                  <span className="text-[10px] font-bold text-[#E2136E]">bKash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('NAGAD')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    paymentMethod === 'NAGAD'
                      ? 'border-[#F4821F] bg-[#FFF8F0] text-[#0E140E] ring-1 ring-[#F4821F]'
                      : 'border-[#DFECCE] bg-white text-[#526052] hover:bg-[#FAFCF7]'
                  }`}
                >
                  <NagadLogo className="h-4.5 w-auto" />
                  <span className="text-[10px] font-bold text-[#F4821F]">Nagad</span>
                </button>
              </div>

              {/* bKash Instructions in Modal */}
              {paymentMethod === 'BKASH' && (
                <div className="mt-2.5 p-3 bg-[#FFF0F5] border border-[#E2136E]/20 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#6B5B58]">
                    <span>Send Money (Personal):</span>
                    <span className="font-mono font-bold text-[#E2136E]">01700-000000</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="bKash Number"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="bg-white border border-[#E2136E]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#0E140E] focus:outline-none focus:border-[#E2136E]"
                    />
                    <input
                      type="text"
                      placeholder="TrxID (Optional)"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="bg-white border border-[#E2136E]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#0E140E] focus:outline-none focus:border-[#E2136E]"
                    />
                  </div>
                </div>
              )}

              {/* Nagad Instructions in Modal */}
              {paymentMethod === 'NAGAD' && (
                <div className="mt-2.5 p-3 bg-[#FFF8F0] border border-[#F4821F]/20 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[#6B5B58]">
                    <span>Send Money (Personal):</span>
                    <span className="font-mono font-bold text-[#F4821F]">01800-000000</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nagad Number"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="bg-white border border-[#F4821F]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#0E140E] focus:outline-none focus:border-[#F4821F]"
                    />
                    <input
                      type="text"
                      placeholder="TrxID (Optional)"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="bg-white border border-[#F4821F]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#0E140E] focus:outline-none focus:border-[#F4821F]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Placing order...</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm Order • {formatPrice(total)}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
