import { useState, useEffect, type FormEvent } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Building,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  MessageCircle,
  HelpCircle,
  Phone,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
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
  validateSearch: (search: Record<string, unknown>) => {
    const rawPlan = typeof search.plan === "string" ? search.plan.toLowerCase() : "growth";
    const plan = PLANS_DATA[rawPlan] ? rawPlan : "growth";
    const billing = search.billing === "yearly" ? "yearly" : "monthly";
    return { plan, billing };
  },
  component: CheckoutPage,
});

function CheckoutPage() {
  const search = useSearch({ from: "/checkout" });
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>(search.plan || "growth");
  const [isYearly, setIsYearly] = useState<boolean>(search.billing === "yearly");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "bank">("upi");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    gstin: "",
    address: "",
  });

  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const currentPlan = PLANS_DATA[selectedPlanKey] || PLANS_DATA.growth;
  const basePrice = isYearly ? currentPlan.yearly : currentPlan.monthly;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gstAmount;

  function handleSubmitOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your Full Name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your Work Email");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your Phone / WhatsApp Number");
      return;
    }

    setProcessing(true);
    const generatedOrderId = "SLV-" + Math.floor(100000 + Math.random() * 900000);

    setTimeout(() => {
      setProcessing(false);
      setOrderId(generatedOrderId);
      setCompleted(true);
      toast.success("Order Placed Successfully! Your account is ready for activation.");
    }, 1200);
  }

  return (
    <div className="font-sans bg-background min-h-screen">
      <PageHero
        eyebrow="Secure Checkout"
        title="Activate Your Solvear Subscription"
        description="Instant provisioning, official Meta WhatsApp API onboarding, and 24/7 dedicated deployment support."
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {completed ? (
            /* Order Success State */
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-elevated text-center space-y-6 animate-in fade-in zoom-in-95">
              <div className="grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-600 mx-auto shadow-inner">
                <CheckCircle2 className="h-12 w-12" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                  Order Confirmed • ID: #{orderId}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Thank You, {formData.name}!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Your subscription to <strong>{currentPlan.name} ({isYearly ? "Annual" : "Monthly"})</strong> is registered. We have sent the invoice and onboarding credentials to <strong>{formData.email}</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border text-left space-y-3 text-xs">
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
                  <span className="font-bold text-primary text-sm">${totalPrice} USD (incl. 18% GST)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Activation Specialist Call</span>
                  <span className="font-bold text-emerald-600">Within 15 Minutes on {formData.phone}</span>
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
            <div className="grid gap-10 lg:grid-cols-12">
              {/* Left Column (7 Cols): Customer Information & Payment Method */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Plan Selector Bar */}
                <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        Select Subscription Plan
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Change plan or billing cycle instantly.
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 bg-surface px-3 py-1.5 rounded-xl border border-border">
                      <Label htmlFor="checkout-billing" className="text-xs font-semibold cursor-pointer">
                        Monthly
                      </Label>
                      <Switch
                        id="checkout-billing"
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                      />
                      <Label htmlFor="checkout-billing" className="text-xs font-semibold text-primary cursor-pointer">
                        Yearly <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md ml-0.5">2 Mos Free</span>
                      </Label>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 pt-2">
                    {Object.entries(PLANS_DATA).map(([key, plan]) => {
                      const isSelected = selectedPlanKey === key;
                      const price = isYearly ? plan.yearly : plan.monthly;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedPlanKey(key)}
                          className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
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
                          <p className="mt-2 font-display text-xl font-extrabold text-foreground">
                            ${price}
                            <span className="text-[11px] font-normal text-muted-foreground">
                              /{isYearly ? "yr" : "mo"}
                            </span>
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Billing & Organization Information Form */}
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      Account &amp; Billing Details
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Your platform login and official GST tax invoice will be sent here.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Work Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Phone / WhatsApp *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="gstin" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        GSTIN / Tax ID (Optional for 18% ITC input claim)
                      </Label>
                      <Input
                        id="gstin"
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                        className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* 3. Payment Method Choice */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">
                        Select Payment Method
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Encrypted 256-bit secure gateway connection.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div
                        onClick={() => setPaymentMethod("upi")}
                        className={`p-4 rounded-2xl border flex flex-col gap-2 cursor-pointer transition ${
                          paymentMethod === "upi"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <QrCode className="w-5 h-5 text-primary" />
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "upi"}
                            onChange={() => setPaymentMethod("upi")}
                            className="text-primary focus:ring-primary"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground">UPI / Dynamic QR</p>
                          <p className="text-[11px] text-muted-foreground">GPay, PhonePe, Paytm</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-2xl border flex flex-col gap-2 cursor-pointer transition ${
                          paymentMethod === "card"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "card"}
                            onChange={() => setPaymentMethod("card")}
                            className="text-primary focus:ring-primary"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground">Cards / NetBanking</p>
                          <p className="text-[11px] text-muted-foreground">Visa, Master, RuPay</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod("bank")}
                        className={`p-4 rounded-2xl border flex flex-col gap-2 cursor-pointer transition ${
                          paymentMethod === "bank"
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border bg-surface hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Building className="w-5 h-5 text-primary" />
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === "bank"}
                            onChange={() => setPaymentMethod("bank")}
                            className="text-primary focus:ring-primary"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-foreground">Corporate Transfer</p>
                          <p className="text-[11px] text-muted-foreground">NEFT / RTGS / Wire</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-surface border border-border text-[11px] text-muted-foreground flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero processing fees. Instant activation on all verified payment methods.</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={processing}
                    className="w-full shadow-pink rounded-xl font-bold text-xs py-6 cursor-pointer"
                  >
                    {processing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Instant Activation...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Pay ${totalPrice} &amp; Activate Account</span>
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              {/* Right Column (5 Cols): Order Summary & Guarantee */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-6 sticky top-28">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <h3 className="font-display text-base font-bold text-foreground">
                      Order Summary
                    </h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {isYearly ? "Annual Plan" : "Monthly Plan"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-display text-base font-bold text-foreground">
                          {currentPlan.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {currentPlan.tagline}
                        </p>
                      </div>
                      <span className="font-display text-lg font-extrabold text-foreground">
                        ${basePrice}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-border/60 space-y-2 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Plan Subscription</span>
                        <span>${basePrice}.00</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>GST / Govt Tax (18%)</span>
                        <span>${gstAmount}.00</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Platform Setup &amp; API Key</span>
                        <span className="text-emerald-600 font-semibold">FREE ($0)</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Meta WhatsApp DLT Onboarding</span>
                        <span className="text-emerald-600 font-semibold">FREE ($0)</span>
                      </div>
                      <div className="flex justify-between text-foreground font-extrabold text-sm pt-3 border-t border-border">
                        <span>Total Due Today</span>
                        <span className="text-primary text-base">${totalPrice}.00 USD</span>
                      </div>
                    </div>
                  </div>

                  {/* Included Plan Highlights */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      What is included:
                    </h4>
                    <ul className="space-y-2 text-xs text-foreground/85">
                      {currentPlan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Trust & Support Badges */}
                  <div className="p-4 rounded-2xl bg-surface border border-border space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>100% Risk-Free Guarantee</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      All plans are backed by our 7-day refund guarantee and 99.99% enterprise gateway uptime SLA.
                    </p>
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
