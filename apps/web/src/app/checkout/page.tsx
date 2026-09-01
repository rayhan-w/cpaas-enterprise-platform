'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Building,
  Loader2,
  Check,
  MessageCircle,
  LogIn,
  UserPlus,
} from 'lucide-react';

const PLANS_DATA: Record<string, {
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  features: string[];
}> = {
  starter: {
    name: "Starter Plan",
    monthly: 29,
    yearly: 290,
    tagline: "For small teams testing WhatsApp automation & bulk campaigns.",
    features: [
      "1 Verified WhatsApp Number",
      "3 Agent Seats included",
      "5,000 Broadcast Messages / mo",
      "Drag & Drop Chatbot Builder",
      "Shared Team Inbox",
      "Email & Ticket Support",
    ],
  },
  growth: {
    name: "Growth Plan",
    monthly: 89,
    yearly: 890,
    tagline: "For scaling brands running daily automated campaigns.",
    features: [
      "3 Verified WhatsApp Numbers",
      "10 Agent Seats included",
      "50,000 Broadcast Messages / mo",
      "Abandoned Cart Recovery & COD Flows",
      "AI Smart Assistant tokens included",
      "Webhook & REST API Access",
      "Priority WhatsApp & Call Support",
    ],
  },
  agency: {
    name: "Agency Plan",
    monthly: 249,
    yearly: 2490,
    tagline: "For agencies and large brands managing multiple client accounts.",
    features: [
      "10 Numbers & 25 Client Sub-Accounts",
      "Unlimited Agent Seats",
      "250,000 Broadcast Messages / mo",
      "Full Developer API & Custom Webhooks",
      "White-label Reports & Analytics",
      "Dedicated Enterprise Account Manager",
      "24/7 Priority SLA Uptime Guarantee",
    ],
  },
};

export default function CheckoutPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>("growth");
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "bank">("upi");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const planParam = params.get("plan")?.toLowerCase();
      if (planParam && PLANS_DATA[planParam]) {
        setSelectedPlanKey(planParam);
      }
      if (params.get("billing") === "yearly") {
        setIsYearly(true);
      }
    }
  }, []);

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const currentPlan = PLANS_DATA[selectedPlanKey] || PLANS_DATA.growth;
  const basePrice = isYearly ? currentPlan.yearly : currentPlan.monthly;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gstAmount;

  function handleCompletePayment(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    const generatedOrderId = "SLV-" + Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      setProcessing(false);
      setOrderId(generatedOrderId);
      setCompleted(true);
    }, 600);
  }

  return (
    <div className="font-sans bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. Page Hero */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800 py-14 sm:py-18 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-500">Secure Checkout</p>
          <h1 className="mt-3 font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">
            Activate Your Solvear Subscription
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-400">
            Instant provisioning, official Meta WhatsApp API onboarding, and 24/7 dedicated deployment support.
          </p>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {completed ? (
            /* Success State */
            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl text-center space-y-6">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-400 mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Order Confirmed • ID: #{orderId}
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  Order Registered Successfully!
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Your subscription to <strong>{currentPlan.name} ({isYearly ? "Annual" : "Monthly"})</strong> is registered. Our enterprise provisioning team is activating your WhatsApp API credentials.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Subscribed Plan</span>
                  <span className="font-bold text-white">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Billing Cycle</span>
                  <span className="font-bold text-white">{isYearly ? "Yearly (2 Months Free)" : "Monthly"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/60">
                  <span className="text-slate-400">Total Invoiced Amount</span>
                  <span className="font-bold text-rose-400">${totalPrice} USD (incl. 18% GST)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Activation Desk</span>
                  <span className="font-bold text-emerald-400">Immediate WhatsApp Onboarding</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition"
                >
                  Go To Dashboard Workspace
                </Link>
                <a
                  href={`https://wa.me/918016081188?text=Hello%20Solvear,%20I%20just%20completed%20checkout%20for%20order%20%23${orderId}%20(${currentPlan.name}).%20Please%20activate%20my%20API.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Activation</span>
                </a>
              </div>
            </div>
          ) : (
            /* Checkout Screen */
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                {/* Plan Selector */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">Select Subscription Plan</h3>
                      <p className="text-xs text-slate-400">Choose your preferred tier and billing duration.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/60 w-fit">
                      <button
                        type="button"
                        onClick={() => setIsYearly(false)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          !isYearly ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsYearly(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isYearly ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>Yearly</span>
                        <span className="text-[9px] bg-yellow-400 text-black px-1 py-0.2 rounded font-extrabold">2 Mos Free</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 pt-1">
                    {Object.entries(PLANS_DATA).map(([key, plan]) => {
                      const isSelected = selectedPlanKey === key;
                      const price = isYearly ? plan.yearly : plan.monthly;
                      return (
                        <div
                          key={key}
                          onClick={() => setSelectedPlanKey(key)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                            isSelected
                              ? "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20 shadow-md"
                              : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{plan.name.replace(" Plan", "")}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />}
                          </div>
                          <p className="mt-2 text-lg font-extrabold text-white">
                            ${price}
                            <span className="text-[10px] font-normal text-slate-400">/{isYearly ? "yr" : "mo"}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method */}
                <form onSubmit={handleCompletePayment} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8 shadow-lg space-y-5">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white">Select Payment Method</h4>

                    <div className="grid gap-2.5 sm:grid-cols-3">
                      <div
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "upi"
                            ? "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <QrCode className="w-4 h-4 text-rose-500" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "upi" ? "bg-rose-500" : "border border-slate-700"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">UPI / Dynamic QR</p>
                          <p className="text-[10px] text-slate-400">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "card"
                            ? "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <CreditCard className="w-4 h-4 text-rose-500" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "card" ? "bg-rose-500" : "border border-slate-700"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">Credit / Debit Cards</p>
                          <p className="text-[10px] text-slate-400">Visa, Master, RuPay</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "bank"
                            ? "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Building className="w-4 h-4 text-rose-500" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "bank" ? "bg-rose-500" : "border border-slate-700"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">Corporate Transfer</p>
                          <p className="text-[10px] text-slate-400">NEFT / RTGS / Wire</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Activating Subscription...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pay ${totalPrice} &amp; Complete Checkout</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-lg space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">Order Summary</h3>
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                      {isYearly ? "Annual Plan" : "Monthly Plan"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{currentPlan.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">{currentPlan.tagline}</p>
                      </div>
                      <span className="text-base font-extrabold text-white">${basePrice}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Plan Subscription</span>
                        <span>${basePrice}.00</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>GST / Tax (18%)</span>
                        <span>${gstAmount}.00</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>API Provisioning</span>
                        <span className="text-emerald-400 font-semibold">FREE ($0)</span>
                      </div>
                      <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-slate-800">
                        <span>Total Due Today</span>
                        <span className="text-rose-400 text-base">${totalPrice}.00 USD</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Included with your plan:</h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {currentPlan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Backed by 99.99% enterprise uptime SLA and 7-day money back guarantee.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
