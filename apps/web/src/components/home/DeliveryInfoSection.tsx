import React from 'react';
import { Truck, ShieldCheck } from 'lucide-react';
import { BkashLogo, NagadLogo, CardLogosGroup, CodBadge } from '@/components/common/PaymentLogos';

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
              <div className="p-3.5 rounded-2xl border border-[#E2136E]/20 bg-[#FFF0F5]/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <BkashLogo className="h-5 w-auto" />
                    <span className="text-[10px] font-bold text-[#E2136E] bg-white px-2 py-0.5 rounded-full border border-[#E2136E]/20">Personal / Merchant</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1512]">bKash Payment</h4>
                  <p className="text-[11px] text-[#6B5B58] leading-tight mt-1">
                    Instant mobile payment with fast verification via TrxID.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#F4821F]/20 bg-[#FFF8F0]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <NagadLogo className="h-5 w-auto" />
                    <span className="text-[10px] font-bold text-[#F4821F] bg-white px-2 py-0.5 rounded-full border border-[#F4821F]/20">Personal / Merchant</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1512]">Nagad Payment</h4>
                  <p className="text-[11px] text-[#6B5B58] leading-tight mt-1">
                    Pay directly to our merchant number using your Nagad app.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#6CAE14]/20 bg-[#F1F8E8]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CodBadge />
                    <span className="text-[10px] font-bold text-[#6CAE14] bg-white px-2 py-0.5 rounded-full border border-[#6CAE14]/20">Pay on Hand</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1512]">Cash on Delivery</h4>
                  <p className="text-[11px] text-[#6B5B58] leading-tight mt-1">
                    Inspect the package and pay when the delivery agent arrives.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#00529B]/20 bg-[#EBF3FB]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-[#00529B] flex items-center gap-1">
                      🏛️ UCB Bank
                    </span>
                    <span className="text-[10px] font-bold text-[#00529B] bg-white px-2 py-0.5 rounded-full border border-[#00529B]/20">Deposit / Transfer</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1512]">Bank Transfer</h4>
                  <p className="text-[11px] text-[#6B5B58] leading-tight mt-1">
                    Direct deposit, BEFTN, NPSB or online transfer to Jawata Mart account.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-[#635BFF]/20 bg-[#F4F3FF]/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <CardLogosGroup />
                    <span className="text-[10px] font-bold text-[#635BFF] bg-white px-2 py-0.5 rounded-full border border-[#635BFF]/20">Stripe / Cards</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1A1512]">Stripe & Cards</h4>
                  <p className="text-[11px] text-[#6B5B58] leading-tight mt-1">
                    Visa, Mastercard, Amex, Apple Pay & Google Pay instant payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
