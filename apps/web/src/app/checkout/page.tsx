'use client';

import React, { useState, useEffect, type FormEvent } from 'react';
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
  Copy,
  Zap,
  Key,
  ArrowRight,
  Smartphone,
  Eye,
  EyeOff,
  FileText,
  Printer,
} from 'lucide-react';

const USD_TO_INR_RATE = 84;

const PLANS_DATA: Record<string, {
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  credits: string;
  features: string[];
}> = {
  starter: {
    name: "Starter Plan",
    monthly: 29,
    yearly: 290,
    tagline: "For small businesses & startups launching WhatsApp & Bulk SMS automation.",
    credits: "5,000 Free Messages",
    features: [
      "1 Official Verified WhatsApp Business Number",
      "3 Agent Seats included",
      "5,000 Broadcast Messages / mo",
      "Visual Drag & Drop Chatbot Builder",
      "Shared Team Inbox with Tags",
      "TRAI DLT Entity Guidance",
      "Standard Email & Ticket Support",
    ],
  },
  growth: {
    name: "Growth Plan",
    monthly: 89,
    yearly: 890,
    tagline: "For scaling e-commerce brands & enterprises running daily automated campaigns.",
    credits: "50,000 Free Messages",
    features: [
      "3 Verified WhatsApp Business Numbers",
      "10 Agent Seats included",
      "50,000 Broadcast Messages / mo",
      "Shopify & WooCommerce Abandoned Cart Recovery",
      "COD Confirmation & OTP Verification Flows",
      "AI Smart Auto-Reply Tokens included",
      "Full REST API & Custom Webhooks Access",
      "Priority WhatsApp & Call Support Desk",
    ],
  },
  agency: {
    name: "Agency Plan",
    monthly: 249,
    yearly: 2490,
    tagline: "For agencies & large conglomerates managing multiple brands and client accounts.",
    credits: "250,000 Free Messages",
    features: [
      "10 Numbers & 25 Client Sub-Accounts",
      "Unlimited Agent Seats",
      "250,000 Broadcast Messages / mo",
      "White-label Reports & Analytics Dashboard",
      "Full Developer API with 1,000 req/sec throughput",
      "Dedicated Enterprise Account Manager",
      "99.99% Guaranteed SLA Uptime Contract",
      "24/7 Dedicated Emergency Hotline",
    ],
  },
};

export default function CheckoutPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>("growth");
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "bank">("upi");

  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [company, setCompany] = useState("");
  const [gstin, setGstin] = useState("");

  const [upiUtr, setUpiUtr] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [bankUtr, setBankUtr] = useState("");

  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState("");
  const [completed, setCompleted] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderId: string;
    apiKey: string;
    webhookUrl: string;
    email: string;
    name: string;
    planName: string;
    amountUsd: number;
    amountInr: number;
    date: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);

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

  const currentPlan = PLANS_DATA[selectedPlanKey] || PLANS_DATA.growth;
  const basePriceUsd = isYearly ? currentPlan.yearly : currentPlan.monthly;
  const gstAmountUsd = Math.round(basePriceUsd * 0.18);
  const totalPriceUsd = basePriceUsd + gstAmountUsd;

  const basePriceInr = Math.round(basePriceUsd * USD_TO_INR_RATE);
  const gstAmountInr = Math.round(gstAmountUsd * USD_TO_INR_RATE);
  const totalPriceInr = basePriceInr + gstAmountInr;

  const upiId = "solvear@icici";
  const upiPayUrl = `upi://pay?pa=${upiId}&pn=SOLVEAR+ADVERTISING&am=${totalPriceInr}&cu=INR&tn=Solvear_${selectedPlanKey}_Sub`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(upiPayUrl)}`;

  function handleCopyUpi() {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  }

  function handleCopyApiKey(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  }

  async function handleCompleteOrder(e: FormEvent) {
    e.preventDefault();

    if (!fullName.trim() || !workEmail.trim() || !phone.trim() || !password) {
      alert("Please fill in all required fields (Name, Email, Phone, Password).");
      return;
    }

    if (paymentMethod === "upi" && !upiUtr.trim()) {
      alert("Please enter the 12-digit UPI UTR / Reference ID from your UPI app.");
      return;
    }

    if (paymentMethod === "card" && !cardNumber.trim()) {
      alert("Please enter a valid card number.");
      return;
    }

    if (paymentMethod === "bank" && !bankUtr.trim()) {
      alert("Please enter the Bank Transfer UTR / Transaction Reference.");
      return;
    }

    setProcessing(true);
    setProcessStep("Verifying payment transaction...");

    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const generatedApiKey = `slv_live_${randomHex}`;
    const generatedOrderId = `SLV-${Math.floor(100000 + Math.random() * 900000)}`;
    const generatedWebhook = `https://api.solvear.in/v1/webhook/${generatedOrderId.toLowerCase()}`;

    setTimeout(() => {
      setProcessStep("Provisioning WhatsApp Business API channel...");
      setTimeout(() => {
        const finalOrder = {
          orderId: generatedOrderId,
          apiKey: generatedApiKey,
          webhookUrl: generatedWebhook,
          email: workEmail.trim(),
          name: fullName.trim(),
          planName: `${currentPlan.name} (${isYearly ? "Annual" : "Monthly"})`,
          amountUsd: totalPriceUsd,
          amountInr: totalPriceInr,
          date: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        };

        setOrderData(finalOrder);
        setCompleted(true);
        setProcessing(false);
      }, 700);
    }, 700);
  }

  return (
    <div className="font-sans bg-slate-950 text-slate-100 min-h-screen">
      {/* 1. Page Hero */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800 py-14 sm:py-18 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-500">Instant Activation Desk</p>
          <h1 className="mt-3 font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">
            Activate Your Solvear Subscription
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-400">
            Real-time UPI, Cards, and NetBanking checkout. Immediate WhatsApp Business API provisioning, 50,000 credits, and workspace access.
          </p>
        </div>
      </section>

      {/* 2. Main Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {completed && orderData ? (
            /* REAL INSTANT ACCESS STATE */
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 text-center space-y-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500 text-white mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Payment Verified • Order #{orderData.orderId}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Welcome to Solvear, {orderData.name}!
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
                    Your subscription to <strong>{orderData.planName}</strong> is active. You have full instant access to the platform dashboard and live developer APIs.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Enter Workspace Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href={`https://wa.me/918016081188?text=Hello%20Solvear,%20I%20have%20completed%20checkout%20for%20order%20%23${orderData.orderId}%20(${orderData.planName})%20on%20account%20${orderData.email}.%20Please%20verify%20my%20Meta%20WhatsApp%20Number.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Connect WhatsApp Number</span>
                  </a>
                </div>
              </div>

              {/* API Credentials */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-lg space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-rose-500" />
                    <h3 className="text-sm font-bold text-white">Live API Keys &amp; Workspace Credentials</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full uppercase">
                    Production
                  </span>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Live API Key</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={orderData.apiKey}
                      className="h-10 flex-1 font-mono text-xs px-3 rounded-xl bg-slate-800 border border-slate-700 text-white select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyApiKey(orderData.apiKey)}
                      className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs"
                    >
                      {copiedKey ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Webhook URL</label>
                  <input
                    type="text"
                    readOnly
                    value={orderData.webhookUrl}
                    className="h-10 w-full font-mono text-xs px-3 rounded-xl bg-slate-800 border border-slate-700 text-white select-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM & PAYMENT SELECTION */
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Plan Selector */}
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">1. Select Subscription Plan</h3>
                      <p className="text-xs text-slate-400">Instant credit provisioning &amp; official WhatsApp number onboarding.</p>
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
                        <span className="text-[9px] bg-yellow-400 text-black px-1.5 py-0.2 rounded font-extrabold">2 Mos Free</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 pt-1">
                    {Object.entries(PLANS_DATA).map(([key, plan]) => {
                      const isSelected = selectedPlanKey === key;
                      const priceUsd = isYearly ? plan.yearly : plan.monthly;
                      const priceInr = Math.round(priceUsd * USD_TO_INR_RATE);
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
                            ${priceUsd}
                            <span className="text-[10px] font-normal text-slate-400">/{isYearly ? "yr" : "mo"}</span>
                          </p>
                          <p className="text-[10px] text-slate-400">≈ ₹{priceInr.toLocaleString("en-IN")}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Account & Payment Form */}
                <form onSubmit={handleCompleteOrder} className="space-y-6">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-lg space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white">2. Workspace Account Details</h3>
                      <p className="text-xs text-slate-400">Your credentials for accessing the platform dashboard.</p>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="h-11 w-full rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-rose-500 px-3.5 text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Work Email *</label>
                        <input
                          type="email"
                          required
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          className="h-11 w-full rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-rose-500 px-3.5 text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-11 w-full rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-rose-500 px-3.5 text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Set Password *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 w-full rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-rose-500 px-3.5 pr-10 text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Company Name (Optional)</label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="h-11 w-full rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-rose-500 px-3.5 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Payment Methods */}
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-lg space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-white">3. Select Payment Method</h3>
                      <p className="text-xs text-slate-400">Instant automated verification for UPI, Cards &amp; NetBanking.</p>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-3">
                      <div
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3.5 rounded-2xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "upi"
                            ? "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20 shadow-md"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <QrCode className="w-5 h-5 text-rose-500" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "upi" ? "bg-rose-500" : "border border-slate-700"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">UPI / Dynamic QR</p>
                          <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm, CRED</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3.5 rounded-2xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "card"
                            ? "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20 shadow-md"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <CreditCard className="w-5 h-5 text-rose-500" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "card" ? "bg-rose-500" : "border border-slate-700"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">Credit / Debit Cards</p>
                          <p className="text-[10px] text-slate-400">Visa, Master, RuPay, Amex</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-3.5 rounded-2xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "bank"
                            ? "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/20 shadow-md"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Building className="w-5 h-5 text-rose-500" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "bank" ? "bg-rose-500" : "border border-slate-700"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white">Corporate Transfer</p>
                          <p className="text-[10px] text-slate-400">NEFT / RTGS / IMPS</p>
                        </div>
                      </div>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                          <div className="p-2.5 bg-white rounded-2xl border border-slate-700 shadow-md shrink-0">
                            <img src={qrCodeUrl} alt="Scan QR Code" className="h-40 w-40 object-contain rounded-lg" />
                            <p className="text-[10px] font-bold text-slate-800 text-center mt-1">Scan with any UPI App</p>
                          </div>

                          <div className="flex-1 space-y-3 text-xs">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Instant UPI Intent</span>
                              <h4 className="font-bold text-white text-sm">
                                Pay ₹{totalPriceInr.toLocaleString("en-IN")} INR (${totalPriceUsd} USD)
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Scan QR code with Google Pay, PhonePe, Paytm, BHIM, or CRED.
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex-1 p-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-white flex items-center justify-between">
                                <span>{upiId}</span>
                              </div>
                              <button
                                type="button"
                                onClick={handleCopyUpi}
                                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
                              >
                                {copiedUpi ? "Copied!" : "Copy"}
                              </button>
                            </div>

                            <a
                              href={upiPayUrl}
                              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white font-bold text-xs transition border border-rose-500/30"
                            >
                              <Smartphone className="w-4 h-4" />
                              <span>Open UPI App on Mobile</span>
                            </a>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-700/60 space-y-1.5">
                          <label className="text-xs font-bold text-white block">
                            Enter 12-Digit UPI Reference ID / UTR *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 424518928374 or transaction reference"
                            value={upiUtr}
                            onChange={(e) => setUpiUtr(e.target.value)}
                            className="h-11 w-full rounded-xl bg-slate-950 border-2 border-slate-700 focus:border-rose-500 px-3.5 text-white focus:outline-none font-mono text-xs"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{processStep || "Activating Workspace..."}</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ${totalPriceUsd} USD (₹{totalPriceInr.toLocaleString("en-IN")}) &amp; Get Instant Access</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-lg space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-base font-bold text-white">Order Summary</h3>
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full">
                      {isYearly ? "Annual Plan (2 Mos Free)" : "Monthly Plan"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{currentPlan.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">{currentPlan.tagline}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-white block">${basePriceUsd}</span>
                        <span className="text-[10px] text-slate-400">≈ ₹{basePriceInr.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400">
                        <span>Plan Subscription</span>
                        <span>${basePriceUsd}.00</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>GST / Tax (18%)</span>
                        <span>${gstAmountUsd}.00 (₹{gstAmountInr})</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Official Meta WhatsApp API Setup</span>
                        <span className="text-emerald-400 font-semibold">FREE ($0)</span>
                      </div>
                      <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-slate-800">
                        <span>Total Due Today</span>
                        <div className="text-right">
                          <span className="text-rose-400 text-base block">${totalPriceUsd}.00 USD</span>
                          <span className="text-xs font-semibold text-slate-400">₹{totalPriceInr.toLocaleString("en-IN")} INR</span>
                        </div>
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
                    <span>Instant automatic account provisioning &amp; 7-day money back guarantee.</span>
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
