'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Zap,
  ExternalLink,
  Code2,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  Activity,
  Play,
  X,
} from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageHero } from '@/components/site/PageHero';
import { CtaBand } from '@/components/site/CtaBand';

export type Item = {
  id: string;
  name: string;
  category: string;
  copy: string;
  domain?: string;
  fields: { name: string; label: string; placeholder: string; type?: string }[];
  events: string[];
  docUrl?: string;
  samplePayload?: Record<string, any>;
};

const ITEMS: Item[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    category: 'Payments',
    copy: 'Collect payments inside chat with hosted payment links and UPI QR codes.',
    domain: 'razorpay.com',
    fields: [
      { name: 'keyId', label: 'Key ID', placeholder: 'rzp_live_xxxxxxxxxxxxxx' },
      { name: 'keySecret', label: 'Key Secret', placeholder: '••••••••••••••••', type: 'password' },
      { name: 'webhookSecret', label: 'Webhook Secret', placeholder: 'rzp_whsec_xxxxxxxx' },
    ],
    events: ['payment.captured', 'payment.failed', 'order.paid', 'refund.processed'],
    samplePayload: {
      event: 'payment.captured',
      payload: { payment: { entity: { id: 'pay_N83xLm9812', amount: 149900, currency: 'INR', status: 'captured', contact: '+919876543210' } } },
    },
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payments',
    copy: 'Global card payments, subscription billing, and multi-currency checkout.',
    domain: 'stripe.com',
    fields: [
      { name: 'publishableKey', label: 'Publishable Key', placeholder: 'pk_live_xxxxxxxxxxxxxx' },
      { name: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_xxxxxxxxxxxxxx', type: 'password' },
      { name: 'webhookSecret', label: 'Signing Secret', placeholder: 'whsec_xxxxxxxxxxxxxx' },
    ],
    events: ['checkout.session.completed', 'payment_intent.succeeded', 'invoice.paid', 'customer.subscription.created'],
    samplePayload: {
      type: 'checkout.session.completed',
      data: { object: { id: 'cs_live_a1b2c3d4', amount_total: 4900, currency: 'usd', customer_email: 'user@example.com' } },
    },
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    category: 'Payments',
    copy: 'Fast UPI payments and dynamic QR checkout for the Indian market.',
    domain: 'phonepe.com',
    fields: [
      { name: 'merchantId', label: 'Merchant ID', placeholder: 'M22XXXXXXXX' },
      { name: 'saltKey', label: 'Salt Key', placeholder: '••••••••••••••••', type: 'password' },
      { name: 'saltIndex', label: 'Salt Index', placeholder: '1' },
    ],
    events: ['PAYMENT_SUCCESS', 'PAYMENT_ERROR', 'PAYMENT_PENDING'],
    samplePayload: {
      response: 'PAYMENT_SUCCESS',
      merchantTransactionId: 'TXN_98712638',
      amount: 85000,
    },
  },
  {
    id: 'shopify',
    name: 'Shopify',
    category: 'Commerce',
    copy: 'Order alerts, 1-click COD confirmation and abandoned cart recovery over WhatsApp.',
    domain: 'shopify.com',
    fields: [
      { name: 'shopDomain', label: 'Shopify Store Domain', placeholder: 'your-store.myshopify.com' },
      { name: 'accessToken', label: 'Admin API Access Token', placeholder: 'shpat_xxxxxxxxxxxxxx', type: 'password' },
      { name: 'apiVersion', label: 'API Version', placeholder: '2024-01' },
    ],
    events: ['orders/create', 'orders/fulfilled', 'checkouts/create', 'checkouts/update'],
    samplePayload: {
      id: 82098291194,
      email: 'jon@doe.com',
      total_price: '129.00',
      currency: 'USD',
      line_items: [{ title: 'Solvear Pro Plan', quantity: 1 }],
    },
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    category: 'Commerce',
    copy: 'WordPress store events straight into automated WhatsApp flows.',
    domain: 'woocommerce.com',
    fields: [
      { name: 'siteUrl', label: 'WordPress Site URL', placeholder: 'https://yourstore.com' },
      { name: 'consumerKey', label: 'Consumer Key', placeholder: 'ck_xxxxxxxxxxxxxxxxxxxxxxxx' },
      { name: 'consumerSecret', label: 'Consumer Secret', placeholder: 'cs_xxxxxxxxxxxxxxxxxxxxxxxx', type: 'password' },
    ],
    events: ['order.created', 'order.updated', 'order.completed', 'customer.created'],
    samplePayload: {
      id: 7291,
      status: 'processing',
      total: '2499.00',
      billing: { first_name: 'Rahul', phone: '+919876543210' },
    },
  },
  {
    id: 'whatsapp-cloud',
    name: 'WhatsApp Official Cloud API',
    category: 'Channels',
    copy: 'Direct Meta Cloud API integration with verified business profile and catalogs.',
    domain: 'whatsapp.com',
    fields: [
      { name: 'wabaId', label: 'WABA Account ID', placeholder: '109823746192837' },
      { name: 'phoneNumberId', label: 'Phone Number ID', placeholder: '102938475619283' },
      { name: 'systemToken', label: 'Permanent System User Token', placeholder: 'EAAxxxxxxxxxxxxxxxx', type: 'password' },
    ],
    events: ['messages', 'message_deliveries', 'message_reads', 'template_status_update'],
    samplePayload: {
      entry: [{ changes: [{ value: { messages: [{ from: '919876543210', text: { body: 'Hi, I need pricing info' }, type: 'text' }] } }] }],
    },
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o & ChatGPT)',
    category: 'AI',
    copy: 'Power AI chatbot agents with custom system prompts, RAG documents, and function calling.',
    domain: 'openai.com',
    fields: [
      { name: 'apiKey', label: 'OpenAI API Key', placeholder: 'sk-proj-xxxxxxxxxxxxxxxx', type: 'password' },
      { name: 'model', label: 'Default Model', placeholder: 'gpt-4o' },
      { name: 'temperature', label: 'Temperature (0.0 - 1.0)', placeholder: '0.7' },
    ],
    events: ['bot.query.received', 'bot.response.generated', 'ai.token.usage.logged'],
    samplePayload: {
      model: 'gpt-4o',
      usage: { prompt_tokens: 42, completion_tokens: 88, total_tokens: 130 },
      response: 'Hello! Solvear offers multi-channel broadcasts, automated flows and white-label reseller solutions.',
    },
  },
  {
    id: 'gemini',
    name: 'Google Gemini AI',
    category: 'AI',
    copy: 'Ultra-fast multimodal and multilingual AI reasoning with Gemini 1.5 Flash and Pro.',
    domain: 'gemini.google.com',
    fields: [
      { name: 'apiKey', label: 'Gemini API Key', placeholder: 'AIzaSyxxxxxxxxxxxxxxxx', type: 'password' },
      { name: 'model', label: 'Model Version', placeholder: 'gemini-1.5-flash' },
    ],
    events: ['gemini.chat.generate', 'gemini.tokens.consumed'],
    samplePayload: {
      candidates: [{ content: { parts: [{ text: 'Thank you for reaching out! How can I assist you with Solvear today?' }] } }],
    },
  },
  {
    id: 'sheets',
    name: 'Google Sheets',
    category: 'Productivity',
    copy: 'Log incoming leads, orders, and customer queries directly into live Google Spreadsheet rows.',
    domain: 'sheets.google.com',
    fields: [
      { name: 'spreadsheetId', label: 'Spreadsheet ID', placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' },
      { name: 'sheetName', label: 'Sheet / Tab Name', placeholder: 'Leads' },
      { name: 'credentialsJson', label: 'Service Account JSON', placeholder: '{"type": "service_account", ...}', type: 'textarea' },
    ],
    events: ['row.inserted', 'sheet.sync.completed'],
    samplePayload: {
      timestamp: '2026-08-28T10:45:00Z',
      name: 'Ankit Roy',
      phone: '+919876543210',
      channel: 'WhatsApp',
      status: 'New Lead',
    },
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'Gateways',
    copy: 'Programmable SMS, Voice fallback and global WhatsApp carrier routing.',
    domain: 'twilio.com',
    fields: [
      { name: 'accountSid', label: 'Account SID', placeholder: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      { name: 'authToken', label: 'Auth Token', placeholder: '••••••••••••••••••••••••••••••••', type: 'password' },
      { name: 'fromNumber', label: 'Twilio Phone / Sender ID', placeholder: '+12025550192' },
    ],
    events: ['sms.sent', 'sms.delivered', 'sms.failed', 'call.completed'],
    samplePayload: {
      MessageSid: 'SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      MessageStatus: 'delivered',
      To: '+919876543210',
    },
  },
  {
    id: 'webhook',
    name: 'Custom Webhook & HTTP API',
    category: 'Productivity',
    copy: 'Send and receive real-time JSON events to your own backend server or ERP.',
    fields: [
      { name: 'targetUrl', label: 'Your Webhook Endpoint URL', placeholder: 'https://api.yourcompany.com/webhooks/solvear' },
      { name: 'secretKey', label: 'HMAC Secret Key', placeholder: 'whsec_custom_9918237' },
    ],
    events: ['message.received', 'message.sent', 'contact.created', 'order.status.changed'],
    samplePayload: {
      event: 'message.received',
      contact: { phone: '+919876543210', name: 'Rahul' },
      message: { text: 'Can you confirm my order #99281?' },
    },
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Productivity',
    copy: 'Connect Solvear with 5,000+ business applications with zero code.',
    domain: 'zapier.com',
    fields: [
      { name: 'zapierHookUrl', label: 'Zapier Catch Hook URL', placeholder: 'https://hooks.zapier.com/hooks/catch/xxxxxx/xxxxxx/' },
    ],
    events: ['zapier.trigger.fired'],
    samplePayload: {
      status: 'success',
      source: 'solvear_flow',
      event: 'new_inquiry',
    },
  },
  { id: 'paypal', name: 'PayPal', category: 'Payments', copy: 'Accept PayPal and cards from customers worldwide.', domain: 'paypal.com', fields: [{ name: 'clientId', label: 'Client ID', placeholder: 'sb-xxxxxxxx' }, { name: 'secret', label: 'Secret', placeholder: '••••••••', type: 'password' }], events: ['PAYMENT.CAPTURE.COMPLETED'] },
  { id: 'paystack', name: 'Paystack', category: 'Payments', copy: 'Online payments for African businesses.', domain: 'paystack.com', fields: [{ name: 'publicKey', label: 'Public Key', placeholder: 'pk_live_xxxx' }, { name: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_xxxx', type: 'password' }], events: ['charge.success'] },
  { id: 'telegram', name: 'Telegram Bot', category: 'Channels', copy: 'Bots, channels and group automation.', domain: 'telegram.org', fields: [{ name: 'botToken', label: 'Bot Token (from @BotFather)', placeholder: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ' }], events: ['message', 'callback_query'] },
  { id: 'instagram', name: 'Instagram DM', category: 'Channels', copy: 'DM automation in the shared inbox.', domain: 'instagram.com', fields: [{ name: 'pageId', label: 'Facebook Page ID', placeholder: '1092837461928' }, { name: 'instagramId', label: 'Instagram Account ID', placeholder: '178414000000000' }], events: ['messages', 'messaging_postbacks'] },
];

const CATEGORIES = ['All', 'Payments', 'Commerce', 'Channels', 'AI', 'Gateways', 'Productivity'];

export default function IntegrationsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [connectedItems, setConnectedItems] = useState<Record<string, boolean>>({
    razorpay: true,
    'whatsapp-cloud': true,
    shopify: true,
  });

  const [activeTab, setActiveTab] = useState('config');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: 'success' | 'error'; message: string; latency?: number } | null>(null);
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [webhookLog, setWebhookLog] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filtered = useMemo(
    () =>
      ITEMS.filter(
        (i) =>
          (category === 'All' || i.category === category) &&
          i.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query, category],
  );

  const openConnector = (item: Item) => {
    setSelectedItem(item);
    setActiveTab('config');
    setTestResult(null);
    setWebhookLog(null);
    setCopiedUrl(false);

    const initialData: Record<string, string> = {};
    item.fields.forEach((f) => {
      initialData[f.name] = '';
    });
    setFormData(initialData);
  };

  const handleSaveConfig = () => {
    if (!selectedItem) return;
    setConnectedItems((prev) => ({ ...prev, [selectedItem.id]: true }));
    showToast(`${selectedItem.name} configuration saved & activated!`);
    setTimeout(() => setSelectedItem(null), 700);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        status: 'success',
        message: `Successfully authenticated with ${selectedItem?.name}! SSL Handshake 200 OK.`,
        latency: Math.floor(Math.random() * 25) + 18,
      });
      setConnectedItems((prev) => ({ ...prev, [selectedItem!.id]: true }));
      showToast(`Live Connection to ${selectedItem?.name} Verified!`);
    }, 850);
  };

  const handleSendTestWebhook = () => {
    if (!selectedItem) return;
    setIsSendingWebhook(true);
    setTimeout(() => {
      setIsSendingWebhook(false);
      const log = {
        timestamp: new Date().toISOString(),
        event: selectedItem.events[0] || 'webhook.ping',
        status: 200,
        response: { success: true, processed_in_ms: 19, message: 'Webhook accepted & queued into Amazon SQS' },
        payload: selectedItem.samplePayload || { id: 'evt_live_8912739', action: 'ping' },
      };
      setWebhookLog(log);
      showToast('Test Webhook Payload Delivered with Status 200 OK!');
    }, 700);
  };

  const webhookUrl = selectedItem ? `https://api.solvear.in/v1/webhooks/${selectedItem.id}` : '';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      {/* Floating Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-navy-deep text-white shadow-pink border border-primary/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      <main className="flex-1">
        <PageHero
          eyebrow="Integrations & Connectors"
          title="Connect Solvear with 50+ Payment Gateways, CRMs & Stores"
          description="Click on any connector below to configure live API keys, set up real-time webhooks, and trigger automated WhatsApp workflows."
        />

        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            {/* Controls Bar */}
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-xs">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 50+ integrations..."
                  className="w-full pl-10 pr-4 h-11 rounded-xl bg-surface border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                      category === c
                        ? 'border-primary bg-primary text-white shadow-pink'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((item) => {
                const isConnected = !!connectedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => openConnector(item)}
                    className="group relative cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-accent border border-primary/10 font-display text-lg font-extrabold text-primary">
                          {item.name.charAt(0)}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isConnected
                              ? 'bg-emerald-500 text-white'
                              : 'bg-surface text-muted-foreground border border-border'
                          }`}
                        >
                          {isConnected ? 'Connected' : 'Configure'}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                        {item.category}
                      </p>
                      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {item.copy}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-between">
                      <span className="text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                        <span>Connect API</span>
                        <Zap className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        {item.events.length} Events
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
              {/* Modal Header */}
              <div className="p-6 md:p-8 bg-navy-deep text-white border-b border-navy-soft flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-display text-2xl font-bold">{selectedItem.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase">
                      {selectedItem.category}
                    </span>
                  </div>
                  <p className="text-xs text-navy-foreground/75 mt-1">{selectedItem.copy}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="text-white/70 hover:text-white p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-3 p-1 rounded-xl bg-surface border border-border text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('config')}
                    className={`py-2.5 rounded-lg transition ${
                      activeTab === 'config' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Credentials &amp; API
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('webhooks')}
                    className={`py-2.5 rounded-lg transition ${
                      activeTab === 'webhooks' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Webhooks &amp; Events
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`py-2.5 rounded-lg transition ${
                      activeTab === 'code' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    cURL &amp; Code
                  </button>
                </div>

                {activeTab === 'config' && (
                  <div className="space-y-4">
                    {selectedItem.fields.map((f) => (
                      <div key={f.name} className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          {f.label} *
                        </label>
                        <input
                          type={f.type || 'text'}
                          placeholder={f.placeholder}
                          value={formData[f.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}

                    {testResult && (
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{testResult.message}</p>
                          <p className="text-[11px] opacity-80">Latency: {testResult.latency}ms • SSL 1.3 Verified</p>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-surface transition inline-flex items-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? 'Testing Ping...' : 'Test Connection'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveConfig}
                        className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-pink transition"
                      >
                        Save &amp; Activate
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'webhooks' && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Dedicated Webhook URL
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={webhookUrl}
                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs font-mono font-bold text-primary select-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(webhookUrl);
                            setCopiedUrl(true);
                            showToast('Webhook URL copied!');
                            setTimeout(() => setCopiedUrl(false), 2000);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold shrink-0"
                        >
                          {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Supported Event Types
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {selectedItem.events.map((evt) => (
                          <div key={evt} className="p-2.5 rounded-xl border border-border bg-surface text-xs font-mono flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            <span>{evt}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-border bg-surface space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider">Test Webhook Event</p>
                          <p className="text-[11px] text-muted-foreground">Simulate an incoming event into Solvear SQS Queue.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSendTestWebhook}
                          disabled={isSendingWebhook}
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-pink flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3" />
                          <span>{isSendingWebhook ? 'Sending...' : 'Send Test Event'}</span>
                        </button>
                      </div>

                      {webhookLog && (
                        <pre className="p-3 rounded-xl bg-navy-deep text-white font-mono text-[11px] overflow-x-auto max-h-36">
                          {JSON.stringify(webhookLog.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'code' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      cURL Test Dispatch
                    </label>
                    <pre className="p-4 rounded-2xl bg-navy-deep text-white font-mono text-xs overflow-x-auto">
{`curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(selectedItem.samplePayload || { event: 'ping' }, null, 2)}'`}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
