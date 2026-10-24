'use client';



import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { X, Plus, Minus, ShieldCheck, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';

import { ProductItem, ProductVariant, VariantColor, DeliveryZone } from '@/lib/types';

import { calculateDeliveryCharge, getDivisionForDistrict } from '@/lib/bd-locations';

import SearchableDistrictSelect from '@/components/common/SearchableDistrictSelect';

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

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);

  const [selectedColor, setSelectedColor] = useState<VariantColor | undefined>(undefined);

  const [customerName, setCustomerName] = useState('');

  const [customerPhone, setCustomerPhone] = useState('');

  const [district, setDistrict] = useState('Dhaka');

  const [address, setAddress] = useState('');

  const [settings, setSettings] = useState<any>(null);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BKASH' | 'NAGAD'>('COD');

  const [transactionId, setTransactionId] = useState('');

  const [senderNumber, setSenderNumber] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);



  useEffect(() => {

    fetch('/api/settings')

      .then((r) => r.json())

      .then((d) => setSettings(d))

      .catch(() => {});

  }, []);



  useEffect(() => {

    if (product) {

      if (product.variants && product.variants.length > 0) {

        const v = product.variants.find((item) => item.isActive !== false) || product.variants[0];

        setSelectedVariant(v);

        if (v && v.colors && v.colors.length > 0) {

          setSelectedColor(v.colors[0]);

        } else {

          setSelectedColor(undefined);

        }

      } else {

        setSelectedVariant(undefined);

        setSelectedColor(undefined);

      }

    }

  }, [product]);



  const handleSelectVariant = (v: ProductVariant) => {

    setSelectedVariant(v);

    if (v.colors && v.colors.length > 0) {

      setSelectedColor(v.colors[0]);

    } else {

      setSelectedColor(undefined);

    }

  };



  if (!isOpen || !product) return null;



  const itemPrice = selectedVariant?.price || product.price;

  const currentStock =

    selectedColor && typeof selectedColor.stock === 'number'

      ? selectedColor.stock

      : selectedVariant

      ? selectedVariant.stock

      : product.stock;

  const isOutOfStock = currentStock <= 0;

  const subtotal = itemPrice * quantity;



  const deliveryInfo = calculateDeliveryCharge({

    subtotal,

    district,

    settings,

  });

  const deliveryZone = deliveryInfo.zone;

  const deliveryCharge = deliveryInfo.fee;

  const total = subtotal + deliveryCharge;



  const handleSubmitOrder = async (e: React.FormEvent) => {

    e.preventDefault();



    if (isOutOfStock) {

      toast('এই আইটেম/ভ্যারিয়েন্টটি বর্তমানে আউট অব স্টক।', 'error');

      return;

    }



    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {

      toast('অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং পূর্ণ ঠিকানা দিন', 'error');

      return;

    }



    if (!district || !district.trim()) {

      toast('অনুগ্রহ করে আপনার জেলা (District) নির্বাচন করুন', 'error');

      return;

    }



    if (!/^01[3-9]\d{8}$/.test(customerPhone.trim().replace('+88', ''))) {

      toast('অনুগ্রহ করে আপনার সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01711234567)', 'error');

      return;

    }



    setIsSubmitting(true);



    try {

      const orderPayload = {

        customerName: customerName.trim(),

        customerPhone: customerPhone.trim(),

        district: district.trim(),

        division: getDivisionForDistrict(district),

        address: address.trim(),

        deliveryZone,

        deliveryCharge,

        subtotal,

        total,

        paymentMethod,

        transactionId: transactionId.trim() || undefined,

        senderNumber: senderNumber.trim() || undefined,

        items: [

          {

            productId: product.id,

            productName: product.name,

            name: product.name,

            variantName: selectedVariant?.name,

            colorName: selectedColor?.name,

            sku: selectedColor?.sku || selectedVariant?.sku || product.sku,

            price: itemPrice,

            quantity: quantity,

            image: selectedColor?.image || selectedVariant?.image || product.image,

          },

        ],

        deliveryNote: `1-Click Fast Order (${paymentMethod})`,

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

                  router.push(`/order-success?orderNumber=${orderSuccess.orderNumber}&phone=${encodeURIComponent(orderSuccess.customerPhone || '')}`);

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

                src={selectedColor?.image || selectedVariant?.image || product.image}

                alt={product.name}

                className="w-16 h-16 object-cover rounded-xl border border-[#DFECCE] shrink-0 bg-white"

              />

              <div className="flex-1 min-w-0">

                <h4 className="text-xs sm:text-sm font-bold text-[#0E140E] line-clamp-1">{product.name}</h4>

                <div className="flex items-center gap-2 mt-0.5">

                  <p className="text-xs font-bold text-[#6CAE14]">{formatPrice(itemPrice)}</p>

                  {selectedVariant && (

                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-[#fd6b03] font-semibold">

                      {selectedVariant.name}

                    </span>

                  )}

                  {selectedColor && (

                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-[#2E7D32] font-semibold border border-emerald-200">

                      {selectedColor.name}

                    </span>

                  )}

                </div>

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



            {/* Variant Selector (if product has variants) */}

            {product.variants && product.variants.length > 0 && (

              <div className="bg-[#FAFCF7] p-3 rounded-2xl border border-[#DFECCE] space-y-2">

                <span className="text-xs font-bold text-[#0E140E] block">

                  Select Variant (ভ্যারিয়েন্ট বেছে নিন):

                </span>

                <div className="flex flex-wrap gap-2">

                  {product.variants.map((v) => {

                    const isSelected = selectedVariant?.id === v.id;

                    const isVOutOfStock = v.stock <= 0;

                    return (

                      <button

                        key={v.id}

                        type="button"

                        onClick={() => handleSelectVariant(v)}

                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${

                          isSelected

                            ? 'border-[#fd6b03] bg-orange-50 text-[#fd6b03] ring-1 ring-[#fd6b03]'

                            : 'border-[#DFECCE] bg-white text-[#0E140E] hover:border-[#fd6b03]/40'

                        } ${isVOutOfStock ? 'opacity-60' : ''}`}

                      >

                        {v.image && (

                          <img

                            src={v.image}

                            alt=""

                            className="w-5 h-5 rounded-md object-cover"

                          />

                        )}

                        <span>{v.name}</span>

                        <span className="text-[11px] font-bold text-[#6CAE14]">

                          {formatPrice(v.price)}

                        </span>

                        {isVOutOfStock && (

                          <span className="text-[10px] text-red-500 font-bold ml-1">

                            (Stock Out)

                          </span>

                        )}

                      </button>

                    );

                  })}

                </div>



                {/* Colour selection if variant has colors */}

                {selectedVariant?.colors && selectedVariant.colors.length > 0 && (

                  <div className="pt-2 border-t border-[#DFECCE] space-y-1.5">

                    <span className="text-[11px] font-bold text-[#0E140E] block">

                      Select Colour (রং নির্বাচন করুন):

                    </span>

                    <div className="flex flex-wrap gap-2">

                      {selectedVariant.colors.map((c) => {

                        const isColSel = selectedColor?.id === c.id;

                        const isColOOS = typeof c.stock === 'number' && c.stock <= 0;

                        const isHex = Boolean(c.swatch && (c.swatch.startsWith('#') || c.swatch.startsWith('rgb')));

                        return (

                          <button

                            key={c.id}

                            type="button"

                            onClick={() => setSelectedColor(c)}

                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${

                              isColSel

                                ? 'border-[#6CAE14] bg-emerald-50 text-[#2E7D32] ring-1 ring-[#6CAE14]'

                                : 'border-[#DFECCE] bg-white text-[#0E140E] hover:border-[#6CAE14]/40'

                            } ${isColOOS ? 'opacity-60' : ''}`}

                          >

                            {isHex ? (

                              <span

                                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"

                                style={{ backgroundColor: c.swatch }}

                              />

                            ) : c.image || c.swatch ? (

                              <img

                                src={c.swatch || c.image}

                                alt=""

                                className="w-4 h-4 rounded-full object-cover shrink-0"

                              />

                            ) : null}

                            <span>{c.name}</span>

                            {typeof c.stock === 'number' && (

                              <span className={`text-[10px] ${c.stock <= 0 ? 'text-red-500 font-bold' : 'text-[#6CAE14]'}`}>

                                {c.stock <= 0 ? '(Out)' : `(${c.stock})`}

                              </span>

                            )}

                          </button>

                        );

                      })}

                    </div>

                  </div>

                )}

              </div>

            )}



            {/* Customer Information */}

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#DFECCE]">

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6CAE14]">Shipping Details</h4>

              <div>

                <label className="block text-[11px] font-semibold text-[#0E140E] mb-1">

                  Full Name <span className="text-red-500">*</span>

                </label>

                <input

                  type="text"

                  required

                  placeholder="আপনার পুরো নাম লিখুন"

                  value={customerName}

                  onChange={(e) => setCustomerName(e.target.value)}

                  className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl px-3.5 py-2 text-xs text-[#0E140E] focus:outline-none focus:border-[#6CAE14]"

                />

              </div>



              <div>

                <label className="block text-[11px] font-semibold text-[#0E140E] mb-1">

                  Mobile Number <span className="text-red-500">*</span>

                </label>

                <input

                  type="tel"

                  required

                  placeholder="আপনার ১১ ডিজিটের মোবাইল নম্বর দিন"

                  value={customerPhone}

                  onChange={(e) => setCustomerPhone(e.target.value)}

                  className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl px-3.5 py-2 text-xs text-[#0E140E] focus:outline-none focus:border-[#6CAE14]"

                />

              </div>



              <div>

                <label className="block text-[11px] font-semibold text-[#0E140E] mb-1">

                  District / জেলা <span className="text-red-500">*</span>

                </label>

                <SearchableDistrictSelect

                  value={district}

                  onChange={setDistrict}

                  required

                />

              </div>



              <div>

                <label className="block text-[11px] font-semibold text-[#0E140E] mb-1">

                  Full Delivery Address <span className="text-red-500">*</span>

                </label>

                <textarea

                  required

                  rows={2}

                  placeholder="বাসা নং, রোড নং, এলাকা ও পূর্ণ ঠিকানা লিখুন"

                  value={address}

                  onChange={(e) => setAddress(e.target.value)}

                  className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl px-3.5 py-2 text-xs text-[#0E140E] focus:outline-none focus:border-[#6CAE14] resize-none"

                />

              </div>



              {/* Auto Calculated Delivery Charge Display */}
              <div className="p-3 bg-[#F1F8E8] rounded-xl border border-[#DFECCE] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#6CAE14]" />
                  <div>
                    <span className="font-bold text-[#0E140E] block">
                      ডেলিভারি জোন: {deliveryInfo.zoneLabel}
                    </span>
                    <span className="text-[10px] text-[#526052]">
                      জেলা ({district}) অনুযায়ী ডেলিভারি চার্জ
                    </span>
                  </div>
                </div>
                <span className="font-bold text-xs text-[#6CAE14]">
                  {formatPrice(deliveryCharge)}
                </span>
              </div>

            </div>



            {/* Payment Method Selector */}

            <div className="bg-white p-4 rounded-2xl border border-[#DFECCE] space-y-2">

              <label className="block text-xs font-bold uppercase tracking-wider text-[#6CAE14]">

                Payment Option

              </label>

              <div className="grid grid-cols-3 gap-2">

                <button

                  type="button"

                  onClick={() => setPaymentMethod('COD')}

                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${

                    paymentMethod === 'COD'

                      ? 'border-[#6CAE14] bg-[#F1F8E8] text-[#0E140E] ring-1 ring-[#6CAE14]'

                      : 'border-[#DFECCE] bg-white text-[#526052] hover:bg-[#FAFCF7]'

                  }`}

                >

                  <CodBadge className="px-2 py-0.5 text-[10px]" />

                  <span className="text-[10px] font-bold text-[#0E140E]">Cash on Delivery</span>

                </button>



                <button

                  type="button"

                  onClick={() => setPaymentMethod('BKASH')}

                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${

                    paymentMethod === 'BKASH'

                      ? 'border-[#E2136E] bg-[#FFF0F5] text-[#0E140E] ring-1 ring-[#E2136E]'

                      : 'border-[#DFECCE] bg-white text-[#526052] hover:bg-[#FAFCF7]'

                  }`}

                >

                  <div className="h-5 flex items-center">

                    <BkashLogo className="h-4.5 w-auto" />

                  </div>

                  <span className="text-[10px] font-bold text-[#E2136E]">bKash Send</span>

                </button>



                <button

                  type="button"

                  onClick={() => setPaymentMethod('NAGAD')}

                  className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-center ${

                    paymentMethod === 'NAGAD'

                      ? 'border-[#F4821F] bg-[#FFF8F0] text-[#0E140E] ring-1 ring-[#F4821F]'

                      : 'border-[#DFECCE] bg-white text-[#526052] hover:bg-[#FAFCF7]'

                  }`}

                >

                  <div className="h-5 flex items-center">

                    <NagadLogo className="h-4.5 w-auto" />

                  </div>

                  <span className="text-[10px] font-bold text-[#F4821F]">Nagad Send</span>

                </button>

              </div>



              {/* bKash Instructions in Modal */}

              {paymentMethod === 'BKASH' && (

                <div className="p-3 bg-[#FFF0F5] border border-[#E2136E]/25 rounded-xl space-y-2 text-xs animate-fade-in">

                  <div className="flex items-center justify-between text-[11px] text-[#6B5B58]">

                    <span>Send Money (Personal / Merchant):</span>

                    <span className="font-mono font-bold text-[#E2136E] bg-white px-2 py-0.5 rounded border border-[#E2136E]/20">01915210799</span>

                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">

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

                <div className="p-3 bg-[#FFF8F0] border border-[#F4821F]/25 rounded-xl space-y-2 text-xs animate-fade-in">

                  <div className="flex items-center justify-between text-[11px] text-[#6B5B58]">

                    <span>Send Money (Personal / Merchant):</span>

                    <span className="font-mono font-bold text-[#F4821F] bg-white px-2 py-0.5 rounded border border-[#F4821F]/20">01915210799</span>

                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">

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



            {/* Bill Summary */}

            <div className="bg-[#FAFCF7] p-3.5 rounded-2xl border border-[#DFECCE] space-y-1.5 text-xs">

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

              <div className="border-t border-[#DFECCE] pt-2 flex justify-between font-bold text-sm text-[#0E140E]">

                <span>Total Payable:</span>

                <span className="text-[#fd6b03] text-base">{formatPrice(total)}</span>

              </div>

            </div>



            {/* Submit Button */}

            <button

              type="submit"

              disabled={isSubmitting || isOutOfStock}

              className="w-full bg-[#0d1f61] hover:bg-[#162d85] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"

            >

              {isSubmitting ? (

                <span>Placing order...</span>

              ) : isOutOfStock ? (

                <span>Currently Out of Stock (স্টক শেষ)</span>

              ) : (

                <>

                  <ShoppingBag className="w-4 h-4 text-[#fd6b03]" />

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

