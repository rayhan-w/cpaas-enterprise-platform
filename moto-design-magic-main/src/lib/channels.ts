import {
  Facebook,
  Globe,
  Instagram,
  MessageCircle,
  Send,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

export type Channel = {
  slug: string;
  name: string;
  icon: LucideIcon;
  domain?: string;
  copy: string;
  eyebrow: string;
  headline: string;
  intro: string;
  features: { title: string; copy: string }[];
  useCases: string[];
  faqs: { q: string; a: string }[];
};

export const CHANNELS: Channel[] = [
  {
    slug: "whatsapp-business-api",
    name: "WhatsApp Business API",
    icon: MessageCircle,
    domain: "whatsapp.com",
    copy: "Broadcasts, catalog, form flows and commerce — your #1 sales channel.",
    eyebrow: "WhatsApp Business API",
    headline: "Turn WhatsApp into your #1 sales channel",
    intro:
      "Connect an official WhatsApp Business API number to Solvear and run personalized broadcasts, drag-and-drop chatbots, catalog selling and a shared team inbox — with open rates above 80%.",
    features: [
      { title: "Bulk broadcasting", copy: "Send personalized campaigns to segmented contact lists with delivery, read and reply analytics." },
      { title: "Drag & drop chatbot", copy: "Build multi-step flows with conditions, user inputs and HTTP API calls — no code required." },
      { title: "Shared team inbox", copy: "Assign chats to agents, add notes and labels, and reply from web, Android, iOS or desktop." },
      { title: "AI assistant", copy: "Train OpenAI or Gemini on your FAQs, documents and website for human-like replies." },
      { title: "Template management", copy: "Create, submit and track WhatsApp message templates directly from the dashboard." },
      { title: "Commerce automation", copy: "Order confirmations, COD verification and abandoned cart recovery for Shopify and WooCommerce." },
    ],
    useCases: [
      "Promotional broadcasts and festive offers",
      "Abandoned cart recovery and COD confirmation",
      "Order, shipping and payment notifications",
      "Appointment reminders and support tickets",
    ],
    faqs: [
      { q: "Do I need my own WhatsApp Business API number?", a: "Yes — you connect an official API number, and Solvear guides you through embedded signup and template approval." },
      { q: "Can I message contacts anytime?", a: "Outside the 24-hour customer service window you must use approved template messages, which Solvear manages for you." },
    ],
  },
  {
    slug: "messenger",
    name: "Messenger",
    icon: Facebook,
    domain: "messenger.com",
    copy: "Automate Facebook page conversations alongside your other channels.",
    eyebrow: "Facebook Messenger",
    headline: "Automate every Facebook page conversation",
    intro:
      "Link your Facebook pages and let Solvear reply instantly, qualify leads and hand off to a human agent — all inside the same omni-channel inbox you use for WhatsApp.",
    features: [
      { title: "Page auto-reply", copy: "Instant answers to comments and DMs so no lead waits for a response." },
      { title: "Bot flows", copy: "Reuse the same drag-and-drop flows you built for WhatsApp on Messenger." },
      { title: "Lead capture", copy: "Collect name, phone and email through guided input steps and sync to your CRM." },
      { title: "Agent handover", copy: "Escalate to a live agent with full conversation history in one click." },
    ],
    useCases: [
      "Ad click-to-Messenger campaigns",
      "Instant FAQ and pricing answers",
      "Lead qualification before a sales call",
    ],
    faqs: [
      { q: "How do I connect my page?", a: "Log in with Facebook from the dashboard and select the pages you want Solvear to manage." },
    ],
  },
  {
    slug: "instagram-dm",
    name: "Instagram DM",
    icon: Instagram,
    domain: "instagram.com",
    copy: "Manage Instagram DMs from the same unified Shared Inbox.",
    eyebrow: "Instagram Direct",
    headline: "Never miss an Instagram DM again",
    intro:
      "Bring Instagram Direct into Solvear's Shared Inbox — automate replies to story mentions, comments and DMs, and turn followers into buyers.",
    features: [
      { title: "Story & comment triggers", copy: "Auto-DM people who reply to a story or comment a keyword on your post." },
      { title: "Unified inbox", copy: "Instagram chats sit next to WhatsApp, Messenger and Telegram for your whole team." },
      { title: "AI replies", copy: "Answer product, price and availability questions automatically, 24/7." },
      { title: "Team assignment", copy: "Route conversations to the right agent with labels and saved replies." },
    ],
    useCases: [
      "Influencer and creator storefronts",
      "Comment-to-DM keyword campaigns",
      "Product enquiries from reels and stories",
    ],
    faqs: [
      { q: "What account type is required?", a: "An Instagram Professional (Business or Creator) account connected to a Facebook page." },
    ],
  },
  {
    slug: "telegram",
    name: "Telegram",
    icon: Send,
    domain: "telegram.org",
    copy: "Bots and broadcast flows for Telegram communities.",
    eyebrow: "Telegram Bots",
    headline: "Broadcast and automate across Telegram",
    intro:
      "Connect a Telegram bot token and run the same automations, sequences and broadcasts you use elsewhere — ideal for communities, channels and support groups.",
    features: [
      { title: "Bot in minutes", copy: "Paste your BotFather token and your Telegram bot is live inside Solvear." },
      { title: "Community broadcasts", copy: "Send updates to subscribers with rich media and buttons." },
      { title: "Sequence messaging", copy: "Time-based drip campaigns for onboarding and re-engagement." },
      { title: "Shared inbox", copy: "Human agents can jump into any Telegram chat from the same dashboard." },
    ],
    useCases: [
      "Crypto, trading and education communities",
      "Product update and release announcements",
      "Automated support for large groups",
    ],
    faqs: [
      { q: "Are there message limits?", a: "Telegram's own rate limits apply; Solvear queues broadcasts so delivery stays within them." },
    ],
  },
  {
    slug: "webchat",
    name: "WebChat",
    icon: Globe,
    copy: "Embeddable live chat widget powered by the same bots and inbox.",
    eyebrow: "Website WebChat",
    headline: "A live chat widget for your website",
    intro:
      "Drop a single script tag on your site and start chatting with visitors. WebChat uses the same bots, AI assistant and Shared Inbox as your messaging channels.",
    features: [
      { title: "One-line install", copy: "Copy the embed snippet into any website, landing page or storefront." },
      { title: "Customisable widget", copy: "Match brand colours, position, greeting message and offline behaviour." },
      { title: "AI + human", copy: "Let AI handle common questions and escalate to an agent when needed." },
      { title: "Visitor capture", copy: "Collect email or phone before chat to keep the conversation going later." },
    ],
    useCases: [
      "Pre-sales questions on pricing pages",
      "Support for logged-in customers",
      "Lead capture on landing pages",
    ],
    faqs: [
      { q: "Does it work on Shopify or WordPress?", a: "Yes — paste the snippet into your theme or use the WooCommerce/Shopify integration." },
    ],
  },
  {
    slug: "whatsapp-catalog",
    name: "WhatsApp Catalog",
    icon: ShoppingCart,
    domain: "whatsapp.com",
    copy: "Let customers browse and buy directly inside WhatsApp.",
    eyebrow: "WhatsApp Commerce",
    headline: "Sell your catalog inside the chat",
    intro:
      "Showcase products, take orders and collect payments without ever sending the customer to a website — the full buying journey happens in WhatsApp.",
    features: [
      { title: "Product catalog", copy: "Sync products with images, prices and descriptions into WhatsApp." },
      { title: "In-chat cart", copy: "Customers add items and place orders straight from the conversation." },
      { title: "Payment links", copy: "Collect payments with Razorpay, Stripe, PayPal, PhonePe and more." },
      { title: "Order automation", copy: "Confirmation, COD verification and delivery updates fire automatically." },
    ],
    useCases: [
      "D2C brands selling on WhatsApp",
      "Restaurants and local retail ordering",
      "Repeat orders and reorder reminders",
    ],
    faqs: [
      { q: "Can I connect my store?", a: "Yes — Shopify and WooCommerce integrations keep products and orders in sync." },
    ],
  },
];

export const getChannel = (slug: string) => CHANNELS.find((c) => c.slug === slug);
