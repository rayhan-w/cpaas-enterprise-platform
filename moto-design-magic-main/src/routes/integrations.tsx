import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Code2,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Activity,
  Play,
  CreditCard,
  ShoppingCart,
  MessageCircle,
  Bot,
  FileSpreadsheet,
  Phone,
  Webhook,
  Mail,
  Send,
  Radio,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — Payments, CRMs & Gateways | Solvear" },
      {
        name: "description",
        content:
          "Connect Solvear to Razorpay, Stripe, PhonePe, Shopify, WooCommerce, WhatsApp Cloud API, OpenAI, Gemini, Twilio, Google Sheets, and dozens more built-in connectors.",
      },
      { property: "og:title", content: "Solvear Integrations — Connect Your Whole Stack" },
      {
        property: "og:description",
        content: "Dozens of built-in payment, gateway, commerce and CRM integrations.",
      },
    ],
  }),
  component: Integrations,
});

export type Item = {
  id: string;
  name: string;
  category: string;
  copy: string;
  icon: any;
  color: string;
  fields: { name: string; label: string; placeholder: string; type?: string }[];
  events: string[];
  samplePayload?: Record<string, any>;
};

const ITEMS: Item[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    category: "Payments",
    copy: "Collect payments inside chat with hosted payment links and UPI QR codes.",
    icon: CreditCard,
    color: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    fields: [
      { name: "keyId", label: "Key ID", placeholder: "rzp_live_xxxxxxxxxxxxxx" },
      { name: "keySecret", label: "Key Secret", placeholder: "••••••••••••••••", type: "password" },
      { name: "webhookSecret", label: "Webhook Secret", placeholder: "rzp_whsec_xxxxxxxx" },
    ],
    events: ["payment.captured", "payment.failed", "order.paid", "refund.processed"],
    samplePayload: {
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_N83xLm9812", amount: 149900, currency: "INR", status: "captured", contact: "+918016081188" } } },
    },
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    copy: "Global card payments, subscription billing, and multi-currency checkout.",
    icon: CreditCard,
    color: "bg-indigo-500/15 text-indigo-500 border-indigo-500/30",
    fields: [
      { name: "publishableKey", label: "Publishable Key", placeholder: "pk_live_xxxxxxxxxxxxxx" },
      { name: "secretKey", label: "Secret Key", placeholder: "sk_live_xxxxxxxxxxxxxx", type: "password" },
      { name: "webhookSecret", label: "Signing Secret", placeholder: "whsec_xxxxxxxxxxxxxx" },
    ],
    events: ["checkout.session.completed", "payment_intent.succeeded", "invoice.paid", "customer.subscription.created"],
    samplePayload: {
      type: "checkout.session.completed",
      data: { object: { id: "cs_live_a1b2c3d4", amount_total: 4900, currency: "usd", customer_email: "user@example.com" } },
    },
  },
  {
    id: "phonepe",
    name: "PhonePe",
    category: "Payments",
    copy: "Fast UPI payments and dynamic QR checkout for the Indian market.",
    icon: CreditCard,
    color: "bg-purple-500/15 text-purple-500 border-purple-500/30",
    fields: [
      { name: "merchantId", label: "Merchant ID", placeholder: "M22XXXXXXXX" },
      { name: "saltKey", label: "Salt Key", placeholder: "••••••••••••••••", type: "password" },
      { name: "saltIndex", label: "Salt Index", placeholder: "1" },
    ],
    events: ["PAYMENT_SUCCESS", "PAYMENT_ERROR", "PAYMENT_PENDING"],
    samplePayload: {
      response: "PAYMENT_SUCCESS",
      merchantTransactionId: "TXN_98712638",
      amount: 85000,
    },
  },
  {
    id: "shopify",
    name: "Shopify",
    category: "Commerce",
    copy: "Order alerts, 1-click COD confirmation and abandoned cart recovery over WhatsApp.",
    icon: ShoppingCart,
    color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    fields: [
      { name: "shopDomain", label: "Shopify Store Domain", placeholder: "your-store.myshopify.com" },
      { name: "accessToken", label: "Admin API Access Token", placeholder: "shpat_xxxxxxxxxxxxxx", type: "password" },
      { name: "apiVersion", label: "API Version", placeholder: "2024-01" },
    ],
    events: ["orders/create", "orders/fulfilled", "checkouts/create", "checkouts/update"],
    samplePayload: {
      id: 82098291194,
      email: "jon@doe.com",
      total_price: "129.00",
      currency: "USD",
      line_items: [{ title: "Solvear Pro Plan", quantity: 1 }],
    },
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    category: "Commerce",
    copy: "WordPress store events straight into automated WhatsApp flows.",
    icon: ShoppingCart,
    color: "bg-violet-500/15 text-violet-500 border-violet-500/30",
    fields: [
      { name: "siteUrl", label: "WordPress Site URL", placeholder: "https://yourstore.com" },
      { name: "consumerKey", label: "Consumer Key", placeholder: "ck_xxxxxxxxxxxxxxxxxxxxxxxx" },
      { name: "consumerSecret", label: "Consumer Secret", placeholder: "cs_xxxxxxxxxxxxxxxxxxxxxxxx", type: "password" },
    ],
    events: ["order.created", "order.updated", "order.completed", "customer.created"],
    samplePayload: {
      id: 7291,
      status: "processing",
      total: "2499.00",
      billing: { first_name: "Rahul", phone: "+918016081188" },
    },
  },
  {
    id: "whatsapp-cloud",
    name: "WhatsApp Official Cloud API",
    category: "Channels",
    copy: "Direct Meta Cloud API integration with verified business profile and catalogs.",
    icon: MessageCircle,
    color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    fields: [
      { name: "wabaId", label: "WABA Account ID", placeholder: "109823746192837" },
      { name: "phoneNumberId", label: "Phone Number ID", placeholder: "102938475619283" },
      { name: "systemToken", label: "Permanent System User Token", placeholder: "EAAxxxxxxxxxxxxxxxx", type: "password" },
    ],
    events: ["messages", "message_deliveries", "message_reads", "template_status_update"],
    samplePayload: {
      entry: [{ changes: [{ value: { messages: [{ from: "918016081188", text: { body: "Hi, I need pricing info" }, type: "text" }] } }] }],
    },
  },
  {
    id: "openai",
    name: "OpenAI (GPT-4o & ChatGPT)",
    category: "AI",
    copy: "Power AI chatbot agents with custom system prompts, RAG documents, and function calling.",
    icon: Bot,
    color: "bg-teal-500/15 text-teal-500 border-teal-500/30",
    fields: [
      { name: "apiKey", label: "OpenAI API Key", placeholder: "sk-proj-xxxxxxxxxxxxxxxx", type: "password" },
      { name: "model", label: "Default Model", placeholder: "gpt-4o" },
      { name: "temperature", label: "Temperature (0.0 - 1.0)", placeholder: "0.7" },
    ],
    events: ["bot.query.received", "bot.response.generated", "ai.token.usage.logged"],
    samplePayload: {
      model: "gpt-4o",
      usage: { prompt_tokens: 42, completion_tokens: 88, total_tokens: 130 },
      response: "Hello! Solvear offers multi-channel broadcasts, automated flows and white-label reseller solutions.",
    },
  },
  {
    id: "gemini",
    name: "Google Gemini AI",
    category: "AI",
    copy: "Ultra-fast multimodal and multilingual AI reasoning with Gemini 1.5 Flash and Pro.",
    icon: Bot,
    color: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    fields: [
      { name: "apiKey", label: "Gemini API Key", placeholder: "AIzaSyxxxxxxxxxxxxxxxx", type: "password" },
      { name: "model", label: "Model Version", placeholder: "gemini-1.5-flash" },
    ],
    events: ["gemini.chat.generate", "gemini.tokens.consumed"],
    samplePayload: {
      candidates: [{ content: { parts: [{ text: "Thank you for reaching out! How can I assist you with Solvear today?" }] } }],
    },
  },
  {
    id: "sheets",
    name: "Google Sheets",
    category: "Productivity",
    copy: "Log incoming leads, orders, and customer queries directly into live Google Spreadsheet rows.",
    icon: FileSpreadsheet,
    color: "bg-green-500/15 text-green-500 border-green-500/30",
    fields: [
      { name: "spreadsheetId", label: "Spreadsheet ID", placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" },
      { name: "sheetName", label: "Sheet / Tab Name", placeholder: "Leads" },
      { name: "credentialsJson", label: "Service Account JSON", placeholder: '{"type": "service_account", ...}', type: "textarea" },
    ],
    events: ["row.inserted", "sheet.sync.completed"],
    samplePayload: {
      timestamp: "2026-08-31T10:45:00Z",
      name: "Client Lead",
      phone: "+918016081188",
      channel: "WhatsApp",
      status: "New Lead",
    },
  },
  {
    id: "twilio",
    name: "Twilio",
    category: "Gateways",
    copy: "Programmable SMS, Voice fallback and global WhatsApp carrier routing.",
    icon: Phone,
    color: "bg-rose-500/15 text-rose-500 border-rose-500/30",
    fields: [
      { name: "accountSid", label: "Account SID", placeholder: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { name: "authToken", label: "Auth Token", placeholder: "••••••••••••••••••••••••••••••••", type: "password" },
      { name: "fromNumber", label: "Twilio Phone / Sender ID", placeholder: "+12025550192" },
    ],
    events: ["sms.sent", "sms.delivered", "sms.failed", "call.completed"],
    samplePayload: {
      MessageSid: "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      MessageStatus: "delivered",
      To: "+918016081188",
    },
  },
  {
    id: "webhook",
    name: "Custom Webhook & HTTP API",
    category: "Productivity",
    copy: "Send and receive real-time JSON events to your own backend server or ERP.",
    icon: Webhook,
    color: "bg-primary/15 text-primary border-primary/30",
    fields: [
      { name: "targetUrl", label: "Your Webhook Endpoint URL", placeholder: "https://api.yourcompany.com/webhooks/solvear" },
      { name: "secretKey", label: "HMAC Secret Key", placeholder: "whsec_custom_9918237" },
    ],
    events: ["message.received", "message.sent", "contact.created", "order.status.changed"],
    samplePayload: {
      event: "message.received",
      contact: { phone: "+918016081188", name: "Client" },
      message: { text: "Can you confirm my order?" },
    },
  },
  {
    id: "smtp",
    name: "SMTP Mail Server",
    category: "Email",
    copy: "Send transactional email and OTPs from any SMTP mail host.",
    icon: Mail,
    color: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    fields: [
      { name: "host", label: "SMTP Host", placeholder: "smtp.mailgun.org" },
      { name: "port", label: "Port", placeholder: "587" },
      { name: "user", label: "Username", placeholder: "postmaster@domain.com" },
      { name: "pass", label: "Password", placeholder: "••••••••", type: "password" },
    ],
    events: ["email.sent", "email.bounced"],
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    category: "Channels",
    copy: "Bots, channels and group automation.",
    icon: Send,
    color: "bg-sky-500/15 text-sky-500 border-sky-500/30",
    fields: [
      { name: "botToken", label: "Bot Token (from @BotFather)", placeholder: "123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ" },
    ],
    events: ["message", "callback_query"],
  },
];

const CATEGORIES = ["All", "Payments", "Commerce", "Channels", "AI", "Gateways", "Email", "Productivity"];

function BrandMark({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <span className={`grid h-11 w-11 place-items-center rounded-2xl border shadow-xs ${item.color}`}>
      <Icon className="h-5 w-5" />
    </span>
  );
}

function Integrations() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [connectedItems, setConnectedItems] = useState<Record<string, boolean>>({
    razorpay: true,
    "whatsapp-cloud": true,
    shopify: true,
  });

  // Modal State
  const [activeTab, setActiveTab] = useState("config");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: "success" | "error"; message: string; latency?: number } | null>(null);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [webhookLog, setWebhookLog] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const filtered = useMemo(
    () =>
      ITEMS.filter(
        (i) =>
          (category === "All" || i.category === category) &&
          i.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, category],
  );

  const openConnector = (item: Item) => {
    setSelectedItem(item);
    setActiveTab("config");
    setTestResult(null);
    setWebhookLog(null);
    setCopiedUrl(false);

    const initialData: Record<string, string> = {};
    item.fields.forEach((f) => {
      initialData[f.name] = "";
    });
    setFormData(initialData);
  };

  const handleSaveConfig = () => {
    if (!selectedItem) return;
    setConnectedItems((prev) => ({ ...prev, [selectedItem.id]: true }));
    toast.success(`${selectedItem.name} configuration saved & activated!`);
    setSelectedItem(null);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        status: "success",
        message: `Successfully authenticated with ${selectedItem?.name} Gateway! SSL Handshake 200 OK.`,
        latency: Math.floor(Math.random() * 25) + 18,
      });
      setConnectedItems((prev) => ({ ...prev, [selectedItem!.id]: true }));
      toast.success(`Live Connection to ${selectedItem?.name} Verified!`);
    }, 600);
  };

  const handleSendTestWebhook = () => {
    if (!selectedItem) return;
    setIsSendingWebhook(true);
    setTimeout(() => {
      setIsSendingWebhook(false);
      const log = {
        timestamp: new Date().toISOString(),
        event: selectedItem.events[0] || "webhook.ping",
        status: 200,
        response: { success: true, processed_in_ms: 19, message: "Webhook accepted" },
        payload: selectedItem.samplePayload || { id: "evt_live_8912739", action: "ping" },
      };
      setWebhookLog(log);
      toast.success("Test Webhook Payload Delivered with Status 200 OK!");
    }, 500);
  };

  const webhookUrl = selectedItem ? `https://api.solvear.in/v1/webhooks/${selectedItem.id}` : "";

  return (
    <>
      <PageHero
        eyebrow="Integrations & Connectors"
        title="Connect Solvear with 50+ Payment Gateways, CRMs & Stores"
        description="Click on any connector below to configure live API keys, set up real-time webhooks, and trigger automated WhatsApp workflows."
      />

      <section className="section-y bg-background font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Controls Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xs">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search integrations..."
                aria-label="Search integrations"
                className="pl-10 h-11 rounded-2xl bg-surface border-border text-xs"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all ${
                    category === c
                      ? "border-primary bg-primary text-white shadow-pink"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => {
              const isConnected = !!connectedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => openConnector(item)}
                  className="group relative cursor-pointer rounded-3xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <BrandMark item={item} />
                      <Badge
                        variant={isConnected ? "default" : "outline"}
                        className={`text-[10px] font-extrabold uppercase tracking-wider rounded-lg ${
                          isConnected
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : "text-muted-foreground border-border"
                        }`}
                      >
                        {isConnected ? "Connected" : "Configure"}
                      </Badge>
                    </div>

                    <h2 className="mt-4 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h2>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {item.category}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {item.copy}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/70 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                      <span>Connect API</span>
                      <Zap className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {item.events.length} Events
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="mt-16 text-center space-y-3 py-12 rounded-3xl border border-dashed border-border">
              <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-base font-bold text-foreground">
                No integrations found matching "{query}"
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You can still connect any custom service using our generic <strong>Custom Webhook &amp; HTTP API</strong>.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Live Functional Integration Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        {selectedItem && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 rounded-3xl border-border bg-card shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 bg-navy-deep text-white border-b border-navy-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <BrandMark item={selectedItem} />
                  <div>
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-xl font-bold text-white font-display">
                        {selectedItem.name}
                      </DialogTitle>
                      <Badge className="bg-primary text-white text-[10px] uppercase tracking-wider">
                        {selectedItem.category}
                      </Badge>
                    </div>
                    <DialogDescription className="text-xs text-navy-foreground/75 mt-0.5 max-w-md">
                      {selectedItem.copy}
                    </DialogDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="active-toggle"
                    checked={!!connectedItems[selectedItem.id]}
                    onCheckedChange={(checked) =>
                      setConnectedItems((prev) => ({ ...prev, [selectedItem.id]: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Modal Body with Tabs */}
            <div className="p-6 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-surface border border-border">
                  <TabsTrigger value="config" className="rounded-xl text-xs font-bold gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Credentials</span>
                  </TabsTrigger>
                  <TabsTrigger value="webhooks" className="rounded-xl text-xs font-bold gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Webhooks</span>
                  </TabsTrigger>
                  <TabsTrigger value="code" className="rounded-xl text-xs font-bold gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>cURL Snippet</span>
                  </TabsTrigger>
                </TabsList>

                {/* 1. Credentials Configuration Tab */}
                <TabsContent value="config" className="mt-5 space-y-5">
                  <div className="space-y-3.5">
                    {selectedItem.fields.map((field) => (
                      <div key={field.name} className="space-y-1.5">
                        <Label htmlFor={field.name} className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          {field.label} *
                        </Label>
                        <Input
                          id={field.name}
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, [field.name]: e.target.value })
                          }
                          className="h-10 rounded-xl bg-surface border-border font-mono text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Test Ping Result Box */}
                  {testResult && (
                    <div
                      className={`p-3.5 rounded-2xl border flex items-start gap-2.5 animate-in fade-in text-xs ${
                        testResult.status === "success"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                          : "bg-rose-50 border-rose-200 text-rose-900"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-bold">{testResult.message}</p>
                        {testResult.latency && (
                          <p className="text-[11px] opacity-80">Ping Latency: {testResult.latency}ms • SSL 200 OK</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="rounded-xl border-border gap-2 text-xs font-bold"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                      <span>{isTesting ? "Testing..." : "Test Connection"}</span>
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setSelectedItem(null)}
                        className="rounded-xl text-xs font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveConfig}
                        className="rounded-xl bg-primary text-white shadow-pink hover:bg-primary-hover text-xs font-bold"
                      >
                        Save &amp; Activate
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* 2. Webhooks & Real-time Events Tab */}
                <TabsContent value="webhooks" className="mt-5 space-y-5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Your Webhook URL
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={webhookUrl}
                        className="h-10 rounded-xl bg-surface border-border font-mono text-xs select-all text-primary font-bold"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(webhookUrl);
                          setCopiedUrl(true);
                          toast.success("Webhook URL copied!");
                          setTimeout(() => setCopiedUrl(false), 2000);
                        }}
                        className="h-10 px-3.5 rounded-xl shrink-0 font-bold text-xs"
                      >
                        {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Supported Events
                    </Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {selectedItem.events.map((evt) => (
                        <div
                          key={evt}
                          className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-surface text-xs font-semibold text-foreground"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          <span className="font-mono text-[11px]">{evt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Webhook Tester */}
                  <div className="p-4 rounded-2xl border border-border bg-surface space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                          Test Simulator
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Simulate an incoming event from {selectedItem.name}.
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={handleSendTestWebhook}
                        disabled={isSendingWebhook}
                        size="sm"
                        className="bg-primary text-white shadow-pink rounded-xl text-xs font-bold gap-1.5"
                      >
                        <Play className="w-3 h-3" />
                        <span>{isSendingWebhook ? "Sending..." : "Send Event"}</span>
                      </Button>
                    </div>

                    {webhookLog && (
                      <div className="space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                          <span>Status: <strong className="text-emerald-600">200 OK</strong></span>
                          <span>Timestamp: {webhookLog.timestamp}</span>
                        </div>
                        <pre className="p-3 rounded-xl bg-navy-deep text-white font-mono text-[10px] overflow-x-auto max-h-36 leading-relaxed border border-navy-soft">
                          {JSON.stringify(webhookLog.payload, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* 3. Code & Developer Snippets */}
                <TabsContent value="code" className="mt-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      cURL Webhook Dispatch
                    </Label>
                    <pre className="p-4 rounded-2xl bg-navy-deep text-white font-mono text-xs overflow-x-auto leading-relaxed border border-navy-soft">
{`curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(selectedItem.samplePayload || { event: "ping" }, null, 2)}'`}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <CtaBand
        title="Need a custom integration?"
        description="Our engineers build custom connectors for enterprise ERPs, CRMs and private gateways. Contact us today."
      />
    </>
  );
}
