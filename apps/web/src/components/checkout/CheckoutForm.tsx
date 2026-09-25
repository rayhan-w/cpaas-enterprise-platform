'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trackInitiateCheckout } from '@/lib/tracking';
import {
  Copy,
  Check,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  AlertCircle,
  CheckCircle2,
  Lock,
  Minus,
  Plus,
  Trash2,
  Landmark,
  Mail,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice, isValidBDPhone } from '@/lib/formatters';
import { BD_DIVISIONS, DHAKA_AREAS } from '@/lib/bd-locations';
import { PaymentMethod, DeliveryZone } from '@/lib/types';
import { useToast } from '@/context/toast-context';
import { BkashLogo, NagadLogo, CardLogosGroup } from '@/components/common/PaymentLogos';

export default function CheckoutForm() {
  const router = useRouter();
  const {
    items,
    clearCart,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    deliveryCharge,
    discount,
    total,
    appliedCoupon,
  } = useCart();
  const { error, success } = useToast();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('Dhanmondi');
  const [address, setAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [transactionId, setTransactionId] = useState('');
  const [senderNumber, setSenderNumber] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [bankSenderInfo, setBankSenderInfo] = useState('');
  const [paymentConfirmedCheckbox, setPaymentConfirmedCheckbox] = useState(false);

  // Copy helper
  const [copiedBkash, setCopiedBkash] = useState(false);
  const [copiedNagad, setCopiedNagad] = useState(false);
  const [copiedBankAcc, setCopiedBankAcc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bkashMerchantNumber = '01915210799';
  const nagadMerchantNumber = '01915210799';
  const bankAccountInfo = {
    accountName: 'Jawata Mart',
    accountNumber: '1462101000775432',
    bankName: 'UCB Bank (United Commercial Bank)',
    branch: 'Uttara Sector-12 more',
    email: 'jawatamart3@gmail.com',
  };

  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout({
        items: items.map((i) => ({
          id: i.productId,
          name: i.product.name,
          price: i.unitPrice,
          quantity: i.quantity,
          category: i.product.categoryName,
        })),
        total,
        numItems: items.reduce((sum, i) => sum + i.quantity, 0),
      });
    }
  }, []);

  const handleCopy = (text: string, type: 'bkash' | 'nagad' | 'bank') => {
    navigator.clipboard.writeText(text.replace(/[\s\-]/g, ''));
    if (type === 'bkash') {
      setCopiedBkash(true);
      setTimeout(() => setCopiedBkash(false), 2000);
    } else if (type === 'nagad') {
      setCopiedNagad(true);
      setTimeout(() => setCopiedNagad(false), 2000);
    } else {
      setCopiedBankAcc(true);
      setTimeout(() => setCopiedBankAcc(false), 2000);
    }
  };

  const handleDivisionChange = (divName: string) => {
    setDivision(divName);
    const found = BD_DIVISIONS.find((d) => d.name === divName);
    if (found && found.districts.length > 0) {
      setDistrict(found.districts[0]);
    }
    if (divName === 'Dhaka') {
      setDeliveryZone('INSIDE_DHAKA');
    } else {
      setDeliveryZone('OUTSIDE_DHAKA');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      error('Your shopping bag is empty');
      return;
    }

    if (!customerName.trim()) {
      error('Please enter your full name');
      return;
    }

    if (!customerPhone.trim() || !isValidBDPhone(customerPhone)) {
      error('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01711234567)');
      return;
    }

    if (!address.trim()) {
      error('Please enter your complete delivery address');
      return;
    }

    // Validation for manual bKash/Nagad
    if (paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') {
      if (!senderNumber.trim() || !isValidBDPhone(senderNumber)) {
        error(`Please enter the ${paymentMethod === 'BKASH' ? 'bKash' : 'Nagad'} number you sent money from`);
        return;
      }
      if (!transactionId.trim() || transactionId.trim().length < 6) {
        error('Please enter your valid Transaction ID (TrxID)');
        return;
      }
      if (!paymentConfirmedCheckbox) {
        error('Please check the confirmation box indicating you have sent the money');
        return;
      }
    }

    // Validation for Bank Transfer
    if (paymentMethod === 'BANK_TRANSFER') {
      if (!bankReference.trim()) {
        error('Please enter your Bank Deposit Slip or Transfer Reference number');
        return;
      }
      if (!paymentConfirmedCheckbox) {
        error('Please check the confirmation box indicating you have transferred or deposited the amount');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        division,
        district,
        area,
        address: address.trim(),
        deliveryNote: deliveryNote.trim() || undefined,
        deliveryZone,
        deliveryCharge,
        subtotal,
        discount,
        couponCode: appliedCoupon?.code,
        total,
        paymentMethod,
        transactionId: (paymentMethod === 'BANK_TRANSFER' ? bankReference : transactionId).trim() || undefined,
        senderNumber: (paymentMethod === 'BANK_TRANSFER' ? bankSenderInfo : senderNumber).trim() || undefined,
        bankReference: bankReference.trim() || undefined,
        bankSenderInfo: bankSenderInfo.trim() || undefined,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          productImage: i.product.image,
          price: i.unitPrice,
          quantity: i.quantity,
          variantName: i.selectedVariant ? `${i.selectedVariant.name}: ${i.selectedVariant.value}` : undefined,
          total: i.totalPrice,
        })),
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

      // If SSLCommerz or Stripe was selected, redirect to gateway url
      if ((paymentMethod === 'SSLCOMMERZ' || paymentMethod === 'STRIPE') && data.gatewayUrl) {
        clearCart();
        window.location.href = data.gatewayUrl;
        return;
      }

      // Order created successfully!
      clearCart();
      success('Order placed successfully!');
      router.push(`/order-success?orderNumber=${data.order.orderNumber}&phone=${data.order.customerPhone}`);
    } catch (err: any) {
      error(err.message || 'Something went wrong placing your order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDiv = BD_DIVISIONS.find((d) => d.name === division) || BD_DIVISIONS[0];

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto border border-[#EDE5E1] shadow-elevation-1 space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1A1512]">Your Cart is Currently Empty</h2>
        <p className="text-xs text-[#6B5B58] max-w-sm mx-auto">
          You don&apos;t have any products in your cart yet. Browse our top collections and add items to proceed with checkout.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="bg-[#6CAE14] hover:bg-[#5B960E] text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-md"
          >
            Explore All Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Customer & Delivery Details */}
      <div className="lg:col-span-7 space-y-6">
        {/* Guest Customer Notice */}
        <div className="p-3.5 bg-[#F1F8E8] border border-[#6CAE14]/20 rounded-2xl flex items-center gap-3 text-xs text-[#1A1512]">
          <div className="w-8 h-8 rounded-full bg-[#6CAE14]/15 text-[#6CAE14] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold">Fast Guest Checkout</p>
            <p className="text-[#6B5B58]">No password required. Enter your delivery info to confirm order.</p>
          </div>
        </div>

        {/* Shipping Address Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE5E1] shadow-elevation-1 space-y-4">
          <h3 className="section-title text-xl text-[#1A1512] flex items-center gap-2">
            <span>1. Delivery Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">
                Full Name <span className="text-[#D94040]">*</span>
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">
                Mobile Number (11 Digits) <span className="text-[#D94040]">*</span>
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">
              Email Address <span className="text-[#9B8A86] font-normal">(Optional for invoice copy)</span>
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. tanvir@example.com"
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
            />
          </div>

          {/* Division, District, Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">Division</label>
              <select
                value={division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
              >
                {BD_DIVISIONS.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
              >
                {selectedDiv.districts.map((dst) => (
                  <option key={dst} value={dst}>
                    {dst}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">Area / Thana</label>
              {division === 'Dhaka' && district === 'Dhaka' ? (
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                >
                  {DHAKA_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Kotwali / Sadar"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">
              Full Street Address <span className="text-[#D94040]">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House number, road number, apartment floor, landmark..."
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl p-3.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">
              Delivery Note <span className="text-[#9B8A86] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={deliveryNote}
              onChange={(e) => setDeliveryNote(e.target.value)}
              placeholder="Special instructions e.g. 'Leave with security', 'Call before arriving'"
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
            />
          </div>

          {/* Delivery Zone Selector */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#1A1512] mb-2">Delivery Destination</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setDeliveryZone('INSIDE_DHAKA')}
                className={`cursor-pointer border rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                  deliveryZone === 'INSIDE_DHAKA'
                    ? 'border-[#6CAE14] bg-[#F1F8E8]'
                    : 'border-[#EDE5E1] bg-[#F8F7F5]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryZone"
                    checked={deliveryZone === 'INSIDE_DHAKA'}
                    onChange={() => setDeliveryZone('INSIDE_DHAKA')}
                    className="accent-[#6CAE14]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1A1512]">Inside Dhaka</p>
                    <p className="text-[10px] text-[#6B5B58]">Same-day / Next-day</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#6CAE14]">৳60</span>
              </label>

              <label
                onClick={() => setDeliveryZone('OUTSIDE_DHAKA')}
                className={`cursor-pointer border rounded-2xl p-3.5 flex items-center justify-between transition-all ${
                  deliveryZone === 'OUTSIDE_DHAKA'
                    ? 'border-[#6CAE14] bg-[#F1F8E8]'
                    : 'border-[#EDE5E1] bg-[#F8F7F5]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deliveryZone"
                    checked={deliveryZone === 'OUTSIDE_DHAKA'}
                    onChange={() => setDeliveryZone('OUTSIDE_DHAKA')}
                    className="accent-[#6CAE14]"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#1A1512]">Outside Dhaka</p>
                    <p className="text-[10px] text-[#6B5B58]">1-3 business days</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#6CAE14]">৳120</span>
              </label>
            </div>
          </div>
        </div>

        {/* 2. Payment Method Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE5E1] shadow-elevation-1 space-y-5">
          <h3 className="section-title text-xl text-[#1A1512]">
            2. Payment Method
          </h3>

          {/* Payment Method Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
            {/* 1. Cash on Delivery */}
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'COD'
                  ? 'border-[#7A9C78] bg-[#EAF3E9] text-[#1A1512] font-bold shadow-xs ring-2 ring-[#7A9C78]'
                  : 'border-[#EDE5E1] bg-[#F8F7F5] text-[#6B5B58] hover:border-[#7A9C78]/40'
              }`}
            >
              <div className="h-6 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-[#7A9C78]" />
              </div>
              <span className="text-xs font-semibold">Cash on Delivery</span>
            </button>

            {/* 2. bKash */}
            <button
              type="button"
              onClick={() => setPaymentMethod('BKASH')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'BKASH'
                  ? 'border-[#E2136E] bg-[#FFF0F6] text-[#1A1512] font-bold shadow-xs ring-2 ring-[#E2136E]'
                  : 'border-[#EDE5E1] bg-[#F8F7F5] text-[#6B5B58] hover:border-[#E2136E]/40'
              }`}
            >
              <div className="h-6 flex items-center justify-center">
                <BkashLogo className="h-5 w-auto" />
              </div>
              <span className="text-xs font-semibold">bKash</span>
            </button>

            {/* 3. Nagad */}
            <button
              type="button"
              onClick={() => setPaymentMethod('NAGAD')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'NAGAD'
                  ? 'border-[#F4821F] bg-[#FFF8F0] text-[#1A1512] font-bold shadow-xs ring-2 ring-[#F4821F]'
                  : 'border-[#EDE5E1] bg-[#F8F7F5] text-[#6B5B58] hover:border-[#F4821F]/40'
              }`}
            >
              <div className="h-6 flex items-center justify-center">
                <NagadLogo className="h-5 w-auto" />
              </div>
              <span className="text-xs font-semibold">Nagad</span>
            </button>

            {/* 4. Bank Transfer (UCB Bank) */}
            <button
              type="button"
              onClick={() => setPaymentMethod('BANK_TRANSFER')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentMethod === 'BANK_TRANSFER'
                  ? 'border-[#00529B] bg-[#EBF3FB] text-[#1A1512] font-bold shadow-xs ring-2 ring-[#00529B]'
                  : 'border-[#EDE5E1] bg-[#F8F7F5] text-[#6B5B58] hover:border-[#00529B]/40'
              }`}
            >
              <div className="h-6 flex items-center justify-center text-[#00529B]">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-[#00529B]">Bank Transfer (UCB)</span>
            </button>

            {/* 5. Stripe / Cards */}
            <button
              type="button"
              onClick={() => setPaymentMethod('STRIPE')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                paymentMethod === 'STRIPE'
                  ? 'border-[#635BFF] bg-[#F4F3FF] text-[#1A1512] font-bold shadow-xs ring-2 ring-[#635BFF]'
                  : 'border-[#EDE5E1] bg-[#F8F7F5] text-[#6B5B58] hover:border-[#635BFF]/40'
              }`}
            >
              <div className="h-6 flex items-center justify-center text-[#635BFF]">
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold">Stripe / Cards</span>
            </button>
          </div>

          {/* Cash on Delivery Details */}
          {paymentMethod === 'COD' && (
            <div className="p-4 bg-[#F8F7F5] rounded-2xl border border-[#EDE5E1] text-xs text-[#1A1512] space-y-1">
              <p className="font-bold text-[#7A9C78] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Pay with Cash on Delivery
              </p>
              <p className="text-[#6B5B58]">
                Pay the exact amount of <strong className="text-[#1A1512]">{formatPrice(total)}</strong> to the delivery agent when you receive your package.
              </p>
            </div>
          )}

          {/* bKash Manual Send Money Flow */}
          {paymentMethod === 'BKASH' && (
            <div className="p-5 bg-gradient-to-br from-[#F1F8E8] to-white rounded-2xl border-2 border-[#E2136E]/30 space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#E2136E]/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1.5 rounded-xl border border-[#E2136E]/20 shadow-xs flex items-center">
                    <BkashLogo className="h-6 w-auto" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1512]">bKash Send Money Payment</h4>
                    <p className="text-[11px] text-[#6B5B58]">Personal Retail / Merchant Send Money</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#E2136E] bg-white px-2.5 py-1 rounded-full border border-[#E2136E]/20">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Step instructions */}
              <div className="space-y-2 text-xs text-[#1A1512] bg-white p-3.5 rounded-xl border border-[#EDE5E1]">
                <div className="flex items-center justify-between bg-[#F1F8E8] p-2.5 rounded-lg border border-[#E2136E]/20">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#9B8A86]">Send Money To:</p>
                    <p className="text-sm font-mono font-bold text-[#1A1512] tracking-wider">
                      {bkashMerchantNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bkashMerchantNumber, 'bkash')}
                    className="flex items-center gap-1 text-[11px] font-bold bg-white text-[#E2136E] border border-[#E2136E]/40 px-2.5 py-1.5 rounded-lg hover:bg-[#E2136E] hover:text-white transition-colors active:scale-95"
                  >
                    {copiedBkash ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBkash ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-1 text-[#6B5B58] text-[11px] pt-1">
                  <li>Open your <strong>bKash app</strong> or dial *247#</li>
                  <li>Select <strong>Send Money</strong> option</li>
                  <li>Send the exact amount <strong>{formatPrice(total)}</strong> to our number above</li>
                  <li>Copy your <strong>Transaction ID (TrxID)</strong> and fill in the fields below</li>
                </ol>
              </div>

              {/* Transaction Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1512] mb-1">
                    Sender bKash Number <span className="text-[#D94040]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] focus:outline-none focus:border-[#E2136E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1512] mb-1">
                    Transaction ID (TrxID) <span className="text-[#D94040]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g. BK78921X"
                    className="w-full bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1A1512] uppercase focus:outline-none focus:border-[#E2136E]"
                  />
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1 text-xs text-[#1A1512]">
                <input
                  type="checkbox"
                  required
                  checked={paymentConfirmedCheckbox}
                  onChange={(e) => setPaymentConfirmedCheckbox(e.target.checked)}
                  className="mt-0.5 accent-[#E2136E]"
                />
                <span className="text-[11px] text-[#6B5B58]">
                  I have sent <strong>{formatPrice(total)}</strong> from my bKash account and the Transaction ID entered above is accurate.
                </span>
              </label>
            </div>
          )}

          {/* Nagad Manual Send Money Flow */}
          {paymentMethod === 'NAGAD' && (
            <div className="p-5 bg-gradient-to-br from-[#FFF8F0] to-white rounded-2xl border-2 border-[#F4821F]/30 space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#F4821F]/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1 rounded-lg border border-[#F4821F]/25 shadow-xs flex items-center justify-center">
                    <NagadLogo className="h-6 w-auto" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1512]">Nagad Send Money Payment</h4>
                    <p className="text-[11px] text-[#6B5B58]">Personal Retail / Merchant Send Money</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#F4821F] bg-white px-2.5 py-1 rounded-full border border-[#F4821F]/20">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Step instructions */}
              <div className="space-y-2 text-xs text-[#1A1512] bg-white p-3.5 rounded-xl border border-[#EDE5E1]">
                <div className="flex items-center justify-between bg-[#FFF8F0] p-2.5 rounded-lg border border-[#F4821F]/20">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-[#9B8A86]">Send Money To:</p>
                    <p className="text-sm font-mono font-bold text-[#1A1512] tracking-wider">
                      {nagadMerchantNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(nagadMerchantNumber, 'nagad')}
                    className="flex items-center gap-1 text-[11px] font-bold bg-white text-[#F4821F] border border-[#F4821F]/40 px-2.5 py-1.5 rounded-lg hover:bg-[#F4821F] hover:text-white transition-colors active:scale-95"
                  >
                    {copiedNagad ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNagad ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-1 text-[#6B5B58] text-[11px] pt-1">
                  <li>Open your <strong>Nagad app</strong> or dial *167#</li>
                  <li>Select <strong>Send Money</strong></li>
                  <li>Send the exact amount <strong>{formatPrice(total)}</strong> to our number above</li>
                  <li>Enter your <strong>Sender Number</strong> and <strong>Transaction ID</strong> below</li>
                </ol>
              </div>

              {/* Transaction Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1512] mb-1">
                    Sender Nagad Number <span className="text-[#D94040]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="018XXXXXXXX"
                    className="w-full bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] focus:outline-none focus:border-[#F4821F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1512] mb-1">
                    Transaction ID (TrxID) <span className="text-[#D94040]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g. 78NGD99X"
                    className="w-full bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1A1512] uppercase focus:outline-none focus:border-[#F4821F]"
                  />
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1 text-xs text-[#1A1512]">
                <input
                  type="checkbox"
                  required
                  checked={paymentConfirmedCheckbox}
                  onChange={(e) => setPaymentConfirmedCheckbox(e.target.checked)}
                  className="mt-0.5 accent-[#F4821F]"
                />
                <span className="text-[11px] text-[#6B5B58]">
                  I have sent <strong>{formatPrice(total)}</strong> from my Nagad account and the Transaction ID entered above is accurate.
                </span>
              </label>
            </div>
          )}

          {/* Bank Transfer (UCB Bank) Flow */}
          {paymentMethod === 'BANK_TRANSFER' && (
            <div className="p-5 bg-gradient-to-br from-[#EBF3FB] to-white rounded-2xl border-2 border-[#00529B]/30 space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#00529B]/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-[#00529B]/20 text-[#00529B] shadow-xs flex items-center justify-center">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1512]">UCB Bank Deposit / Transfer</h4>
                    <p className="text-[11px] text-[#6B5B58]">Direct Bank Deposit, BEFTN, NPSB or Online Transfer</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#00529B] bg-white px-2.5 py-1 rounded-full border border-[#00529B]/20">
                  {formatPrice(total)}
                </span>
              </div>

              {/* Bank Account Details Card */}
              <div className="bg-white p-4 rounded-xl border border-[#EDE5E1] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 bg-[#F8F7F5] rounded-lg border border-[#EDE5E1]">
                    <span className="text-[10px] text-[#9B8A86] uppercase font-bold block">Account Name</span>
                    <span className="font-bold text-sm text-[#1A1512]">{bankAccountInfo.accountName}</span>
                  </div>
                  <div className="p-2.5 bg-[#F8F7F5] rounded-lg border border-[#EDE5E1]">
                    <span className="text-[10px] text-[#9B8A86] uppercase font-bold block">Bank Name</span>
                    <span className="font-bold text-sm text-[#00529B]">{bankAccountInfo.bankName}</span>
                  </div>
                  <div className="p-2.5 bg-[#F8F7F5] rounded-lg border border-[#EDE5E1] sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#9B8A86] uppercase font-bold block">Bank Account Number</span>
                      <span className="font-bold font-mono text-base text-[#1A1512] tracking-wider">
                        {bankAccountInfo.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(bankAccountInfo.accountNumber, 'bank')}
                      className="flex items-center gap-1 text-[11px] font-bold bg-white text-[#00529B] border border-[#00529B]/40 px-3 py-1.5 rounded-lg hover:bg-[#00529B] hover:text-white transition-colors active:scale-95 cursor-pointer"
                    >
                      {copiedBankAcc ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedBankAcc ? 'Copied!' : 'Copy Account'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 bg-[#F8F7F5] rounded-lg border border-[#EDE5E1]">
                    <span className="text-[10px] text-[#9B8A86] uppercase font-bold block">Branch</span>
                    <span className="font-semibold text-xs text-[#1A1512]">{bankAccountInfo.branch}</span>
                  </div>
                  <div className="p-2.5 bg-[#F8F7F5] rounded-lg border border-[#EDE5E1]">
                    <span className="text-[10px] text-[#9B8A86] uppercase font-bold block">Deposit Slip / Receipt Email</span>
                    <span className="font-semibold text-xs text-[#00529B] font-mono">{bankAccountInfo.email}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-[#EBF3FB] rounded-lg border border-[#00529B]/20 text-[11px] text-[#1A1512] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00529B] shrink-0" />
                  <span>
                    টাকা পাঠানোর পর স্লিপ বা স্ক্রিনশট <strong>{bankAccountInfo.email}</strong> এ ইমেইল করুন অথবা নিচে রেফারেন্স নম্বরটি লিখুন।
                  </span>
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1512] mb-1">
                    Your Bank & Account Name / Number (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={bankSenderInfo}
                    onChange={(e) => setBankSenderInfo(e.target.value)}
                    placeholder="e.g. City Bank / Rahim / 112233..."
                    className="w-full bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] focus:outline-none focus:border-[#00529B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1512] mb-1">
                    Deposit Slip No. / Transfer Reference / TrxID <span className="text-[#D94040]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankReference}
                    onChange={(e) => setBankReference(e.target.value.toUpperCase())}
                    placeholder="e.g. UCB-775432 or Deposit Slip #12345"
                    className="w-full bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#1A1512] uppercase focus:outline-none focus:border-[#00529B]"
                  />
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer pt-1 text-xs text-[#1A1512]">
                <input
                  type="checkbox"
                  required
                  checked={paymentConfirmedCheckbox}
                  onChange={(e) => setPaymentConfirmedCheckbox(e.target.checked)}
                  className="mt-0.5 accent-[#00529B]"
                />
                <span className="text-[11px] text-[#6B5B58]">
                  I have transferred or deposited <strong>{formatPrice(total)}</strong> to Jawata Mart&apos;s UCB Bank Account and the Reference / Slip No. entered above is accurate.
                </span>
              </label>
            </div>
          )}

          {/* Stripe Card & Global Payment Flow */}
          {paymentMethod === 'STRIPE' && (
            <div className="p-5 bg-gradient-to-br from-[#F4F3FF] to-white rounded-2xl border-2 border-[#635BFF]/30 space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#635BFF]/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-[#635BFF]/20 text-[#635BFF] shadow-xs flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1A1512]">Stripe Secure Payment</h4>
                    <p className="text-[11px] text-[#6B5B58]">Visa, Mastercard, Amex, Apple Pay & Google Pay</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-[#635BFF] bg-white px-2.5 py-1 rounded-full border border-[#635BFF]/20">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#EDE5E1] space-y-3 text-xs text-[#1A1512]">
                <div className="flex items-center gap-2 text-[#635BFF] font-semibold">
                  <Lock className="w-4 h-4" />
                  <span>256-bit End-to-End SSL Encrypted via Stripe</span>
                </div>
                <p className="text-[#6B5B58] text-[11px] leading-relaxed">
                  Upon clicking <strong>&quot;Confirm Order&quot;</strong> below, you will be securely redirected to Stripe Checkout to complete payment. Supports international cards and instant verification.
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-[#F8F7F5] rounded font-bold text-[10px] text-[#6B5B58] border border-[#EDE5E1]">VISA</span>
                  <span className="px-2 py-0.5 bg-[#F8F7F5] rounded font-bold text-[#6B5B58] border border-[#EDE5E1]">Mastercard</span>
                  <span className="px-2 py-0.5 bg-[#F8F7F5] rounded font-bold text-[#6B5B58] border border-[#EDE5E1]">American Express</span>
                  <span className="px-2 py-0.5 bg-[#F8F7F5] rounded font-bold text-[#6B5B58] border border-[#EDE5E1]">Apple Pay</span>
                </div>
              </div>
            </div>
          )}

          {/* SSLCommerz Online Gateway */}
          {paymentMethod === 'SSLCOMMERZ' && (
            <div className="p-4 bg-[#E3F2FD] rounded-2xl border border-[#1565C0]/20 text-xs text-[#1A1512] space-y-2">
              <p className="font-bold text-[#1565C0] flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" />
                Automated SSLCommerz Sandbox / Live Gateway
              </p>
              <p className="text-[#6B5B58]">
                Upon placing your order, you will be securely redirected to SSLCommerz to complete payment using Visa, Mastercard, AMEX, or online banking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Order Summary & Place Order */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE5E1] shadow-elevation-2 sticky top-24 space-y-5">
          <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
            <h3 className="section-title text-xl text-[#1A1512]">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all items from your order?')) {
                    clearCart();
                  }
                }}
                className="text-[11px] text-[#9B8A86] hover:text-[#D94040] font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Item thumbnails */}
          <div className="max-h-56 overflow-y-auto space-y-3 pr-1 divide-y divide-[#F2EDEA]">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedVariant?.id || 'base'}`}
                className="flex items-center gap-3 pt-3 first:pt-0"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-xl object-cover bg-[#F8F7F5] border border-[#EDE5E1] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1512] truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] font-bold text-[#6CAE14] mt-0.5">
                    {formatPrice(item.unitPrice)}
                  </p>
                  {item.selectedVariant && (
                    <p className="text-[10px] text-[#9B8A86]">
                      {item.selectedVariant.name}: {item.selectedVariant.value}
                    </p>
                  )}
                </div>

                {/* Quantity and Remove Control */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center border border-[#EDE5E1] rounded-lg bg-[#F8F7F5]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariant?.id)}
                      className="p-1 text-[#6B5B58] hover:text-[#1A1512]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-1.5 text-xs font-bold text-[#1A1512]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariant?.id)}
                      className="p-1 text-[#6B5B58] hover:text-[#1A1512]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.selectedVariant?.id)}
                    className="p-1 text-[#9B8A86] hover:text-[#D94040] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs text-[#6B5B58] border-t border-[#EDE5E1] pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#1A1512]">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[#7A9C78]">
                <span>Coupon Discount ({appliedCoupon?.code}):</span>
                <span className="font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Charge ({deliveryZone === 'INSIDE_DHAKA' ? 'Inside Dhaka' : 'Outside Dhaka'}):</span>
              <span className="font-semibold text-[#1A1512]">
                {deliveryCharge === 0 ? (
                  <span className="text-[#7A9C78] font-bold">FREE</span>
                ) : (
                  formatPrice(deliveryCharge)
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#1A1512] pt-3 border-t border-[#EDE5E1]">
              <span>Payable Total:</span>
              <span className="text-xl text-[#6CAE14]">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="w-full bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold text-sm py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Placing Your Order...</span>
            ) : paymentMethod === 'STRIPE' ? (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay with Stripe ({formatPrice(total)})</span>
              </>
            ) : paymentMethod === 'BANK_TRANSFER' ? (
              <>
                <Landmark className="w-4 h-4" />
                <span>Confirm Bank Deposit ({formatPrice(total)})</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Confirm Order ({formatPrice(total)})</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-[#9B8A86] text-center leading-relaxed">
            🔒 By clicking Confirm Order, you agree to our standard Bangladesh delivery & inspection terms.
          </p>
        </div>
      </div>
    </form>
  );
}
