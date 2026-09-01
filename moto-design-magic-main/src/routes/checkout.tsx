import { useState, useEffect, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";

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

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout & Instant Activation — Solvear Platform" },
      {
        name: "description",
        content:
          "Secure checkout for Solvear WhatsApp Business API, Bulk SMS, and Omnichannel CPaaS subscriptions. Instant activation with UPI, Cards, and Net Banking.",
      },
      { property: "og:title", content: "Checkout — Solvear Platform" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>("growth");
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "bank">("upi");

  // Read URL query parameters safely once on mount without router re-render loop
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

  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [phoneWhatsApp, setPhoneWhatsApp] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [taxGstin, setTaxGstin] = useState("");

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const currentPlan = PLANS_DATA[selectedPlanKey] || PLANS_DATA.growth;
  const basePrice = isYearly ? currentPlan.yearly : currentPlan.monthly;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gstAmount;

  function handleSubmitOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your Full Name");
      return;
    }
    if (!workEmail.trim()) {
      toast.error("Please enter your Work Email");
      return;
    }
    if (!phoneWhatsApp.trim()) {
      toast.error("Please enter your Phone or WhatsApp Number");
      return;
    }

    setProcessing(true);
    const generatedOrderId = "SLV-" + Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      setProcessing(false);
      setOrderId(generatedOrderId);
      setCompleted(true);
      toast.success("Order Placed Successfully! Account activation initiated.");
    }, 600);
  }

  return (
    <div className="font-sans bg-background min-h-screen text-foreground">
      <PageHero
        eyebrow="Secure Checkout"
        title="Activate Your Solvear Subscription"
        description="Instant provisioning, official Meta WhatsApp API onboarding, and 24/7 dedicated deployment support."
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {completed ? (
            /* Order Success State */
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-elevated text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-600 mx-auto shadow-inner">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                  Order Confirmed • ID: #{orderId}
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Thank You, {fullName}!
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Your subscription to <strong>{currentPlan.name} ({isYearly ? "Annual" : "Monthly"})</strong> is registered. We have dispatched login credentials to <strong>{workEmail}</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Subscribed Plan</span>
                  <span className="font-bold text-foreground">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Billing Cycle</span>
                  <span className="font-bold text-foreground">{isYearly ? "Yearly (2 Months Free)" : "Monthly"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Total Invoiced Amount</span>
                  <span className="font-bold text-primary">${totalPrice} USD (incl. 18% GST)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Activation Desk</span>
                  <span className="font-bold text-emerald-600">Immediate WhatsApp Onboarding</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="rounded-xl shadow-pink font-bold text-xs">
                  <Link to="/auth">Go To Dashboard Login</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs gap-1.5"
                >
                  <a
                    href={`https://wa.me/918016081188?text=Hello%20Solvear,%20I%20just%20completed%20checkout%20for%20order%20%23${orderId}%20(${currentPlan.name}).%20Please%20activate%20my%20API.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp Activation</span>
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            /* Checkout Form & Order Summary Grid */
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Column: Plan & Form */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Plan Selector */}
                <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        Select Subscription Plan
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Choose your preferred tier and billing duration.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-surface p-1.5 rounded-xl border border-border w-fit">
                      <button
                        type="button"
                        onClick={() => setIsYearly(false)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          !isYearly ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsYearly(true)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          isYearly ? "bg-primary text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
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
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs"
                              : "border-border bg-surface hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display text-xs font-bold text-foreground">
                              {plan.name.replace(" Plan", "")}
                            </span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                          </div>
                          <p className="mt-2 font-display text-lg font-extrabold text-foreground">
                            ${price}
                            <span className="text-[10px] font-normal text-muted-foreground">
                              /{isYearly ? "yr" : "mo"}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Billing Form */}
                <form onSubmit={handleSubmitOrder} className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-xs space-y-5">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      Account &amp; Billing Details
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your platform access and GST invoice will be generated with these details.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-foreground/80 block">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        autoComplete="name"
                        autoCapitalize="words"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-12 w-full rounded-xl bg-surface border border-border px-4 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="workEmail" className="text-xs font-bold uppercase tracking-wider text-foreground/80 block">
                        Work Email *
                      </label>
                      <input
                        id="workEmail"
                        name="workEmail"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        className="h-12 w-full rounded-xl bg-surface border border-border px-4 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="phoneWhatsApp" className="text-xs font-bold uppercase tracking-wider text-foreground/80 block">
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="phoneWhatsApp"
                        name="phoneWhatsApp"
                        type="tel"
                        required
                        autoComplete="tel"
                        inputMode="tel"
                        value={phoneWhatsApp}
                        onChange={(e) => setPhoneWhatsApp(e.target.value)}
                        className="h-12 w-full rounded-xl bg-surface border border-border px-4 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="companyName" className="text-xs font-bold uppercase tracking-wider text-foreground/80 block">
                        Company Name
                      </label>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        autoComplete="organization"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="h-12 w-full rounded-xl bg-surface border border-border px-4 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label htmlFor="taxGstin" className="text-xs font-bold uppercase tracking-wider text-foreground/80 block">
                        GSTIN / Tax ID (Optional for 18% ITC claim)
                      </label>
                      <input
                        id="taxGstin"
                        name="taxGstin"
                        type="text"
                        value={taxGstin}
                        onChange={(e) => setTaxGstin(e.target.value)}
                        className="h-12 w-full rounded-xl bg-surface border border-border px-4 text-base sm:text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                      />
                    </div>
                  </div>

                  {/* 3. Payment Method Choice */}
                  <div className="pt-3 border-t border-border space-y-3">
                    <h4 className="font-display text-sm font-bold text-foreground">
                      Select Payment Method
                    </h4>

                    <div className="grid gap-2.5 sm:grid-cols-3">
                      <div
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "upi"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <QrCode className="w-4 h-4 text-primary" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "upi" ? "bg-primary" : "border border-border"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground">UPI / Dynamic QR</p>
                          <p className="text-[10px] text-muted-foreground">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "card" ? "bg-primary" : "border border-border"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground">Credit / Debit Cards</p>
                          <p className="text-[10px] text-muted-foreground">Visa, Master, RuPay</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-3.5 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition ${
                          paymentMethod === "bank"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Building className="w-4 h-4 text-primary" />
                          <span className={`h-2.5 w-2.5 rounded-full ${paymentMethod === "bank" ? "bg-primary" : "border border-border"}`} />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground">Corporate Transfer</p>
                          <p className="text-[10px] text-muted-foreground">NEFT / RTGS / Wire</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={processing}
                    className="w-full shadow-pink rounded-xl font-bold text-xs py-5 cursor-pointer"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Activating Subscription...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Pay ${totalPrice} &amp; Complete Checkout</span>
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-display text-base font-bold text-foreground">
                      Order Summary
                    </h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {isYearly ? "Annual Plan" : "Monthly Plan"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display text-sm font-bold text-foreground">
                          {currentPlan.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[200px]">
                          {currentPlan.tagline}
                        </p>
                      </div>
                      <span className="font-display text-base font-extrabold text-foreground">
                        ${basePrice}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border/60 space-y-1.5 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Plan Subscription</span>
                        <span>${basePrice}.00</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>GST / Tax (18%)</span>
                        <span>${gstAmount}.00</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>API Provisioning</span>
                        <span className="text-emerald-600 font-semibold">FREE ($0)</span>
                      </div>
                      <div className="flex justify-between text-foreground font-extrabold text-sm pt-2 border-t border-border">
                        <span>Total Due Today</span>
                        <span className="text-primary text-base">${totalPrice}.00 USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="pt-3 border-t border-border space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-foreground/80">
                      Included with your plan:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-foreground/85">
                      {currentPlan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-2xl bg-surface border border-border text-[11px] text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
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
