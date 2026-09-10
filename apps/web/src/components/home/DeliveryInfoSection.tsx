import React from 'react';
import { Truck, ShieldCheck, CreditCard, Banknote } from 'lucide-react';

export default function DeliveryInfoSection() {
  const rates = [
    { area: 'Dhaka City (Metro)', charge: '৳60', time: 'Same Day / Next Day Delivery' },
    { area: 'Chittagong & Sylhet Sadar', charge: '৳100', time: '1–2 Business Days' },
    { area: 'All Other 61 Districts', charge: '৳120', time: '2–3 Business Days' },
    { area: 'Orders above ৳2,000', charge: 'Free 🎉', time: 'Nationwide Standard Delivery' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Delivery Rates */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE5E1] shadow-elevation-1">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#EAF3E9] text-[#7A9C78] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="section-title text-xl text-[#1A1512]">
                Delivery Across Bangladesh
              </h3>
              <p className="text-xs text-[#6B5B58]">Delivered safely with reliable logistics partners</p>
            </div>
          </div>

          <div className="space-y-3">
            {rates.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 border-b border-[#F2EDEA] last:border-0 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#1A1512]">{r.area}</p>
                  <p className="text-[#9B8A86] text-[11px]">{r.time}</p>
                </div>
                <span
                  className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                    r.charge.includes('Free')
                      ? 'bg-[#EAF3E9] text-[#7A9C78]'
                      : 'bg-[#F8F7F5] text-[#1A1512]'
                  }`}
                >
                  {r.charge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Payment Security */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE5E1] shadow-elevation-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="section-title text-xl text-[#1A1512]">
                  100% Safe Local Payment
                </h3>
                <p className="text-xs text-[#6B5B58]">Choose your preferred payment method during checkout</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-2xl border border-[#EDE5E1] bg-[#F8F7F5]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E2136E]" />
                  <h4 className="text-xs font-bold text-[#1A1512]">bKash Send Money</h4>
                </div>
                <p className="text-[11px] text-[#6B5B58] leading-tight">
                  Instant mobile payment with fast verification via TrxID.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EDE5E1] bg-[#F8F7F5]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F4821F]" />
                  <h4 className="text-xs font-bold text-[#1A1512]">Nagad Send Money</h4>
                </div>
                <p className="text-[11px] text-[#6B5B58] leading-tight">
                  Pay directly to our merchant number using your Nagad app.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EDE5E1] bg-[#F8F7F5]">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="w-4 h-4 text-[#7A9C78]" />
                  <h4 className="text-xs font-bold text-[#1A1512]">Cash on Delivery</h4>
                </div>
                <p className="text-[11px] text-[#6B5B58] leading-tight">
                  Inspect the package and pay when the delivery agent arrives.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#EDE5E1] bg-[#F8F7F5]">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-[#1565C0]" />
                  <h4 className="text-xs font-bold text-[#1A1512]">SSLCommerz Gateway</h4>
                </div>
                <p className="text-[11px] text-[#6B5B58] leading-tight">
                  Secure automated online payment with cards & internet banking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
