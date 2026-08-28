'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  ShoppingBag,
  CheckCheck,
  RotateCcw,
  Bot,
  ShieldCheck,
  Zap,
  ChevronRight,
  User,
  Globe,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

type Channel = 'whatsapp' | 'instagram' | 'telegram' | 'webchat';
type FlowType = 'catalog' | 'cod' | 'cart' | 'ai';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  image?: string;
  buttons?: { label: string; action: string }[];
  catalogItem?: {
    title: string;
    price: string;
    desc: string;
    image: string;
  };
  time: string;
}

const PRESET_FLOWS: Record<FlowType, ChatMessage[]> = {
  catalog: [
    {
      id: '1',
      sender: 'user',
      text: 'Hi, can I see your latest wireless earbuds collection?',
      time: '10:42 AM',
    },
    {
      id: '2',
      sender: 'bot',
      text: '👋 Welcome to SoundCraft Audio! Here is our top-rated flagship product:',
      catalogItem: {
        title: 'SoundCraft Pro Active ANC Earbuds',
        price: '₹2,499 (MSRP ₹4,999)',
        desc: '45dB Hybrid Active Noise Cancellation, 40-hour battery life, IPX5 water resistance.',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      },
      buttons: [
        { label: '🛍️ Add to WhatsApp Cart', action: 'add_cart' },
        { label: '⚡ Buy Now with WhatsApp Pay', action: 'buy_now' },
      ],
      time: '10:42 AM',
    },
  ],
  cod: [
    {
      id: '1',
      sender: 'bot',
      text: '📦 *Order Received #ORD-98214*\n\nHi Sarah, thank you for ordering from UrbanStyle! Your total is *₹1,850* (Cash on Delivery).\n\nTo prevent unauthorized dispatches, please confirm your delivery within 30 minutes:',
      buttons: [
        { label: '✅ Confirm My COD Order', action: 'confirm_cod' },
        { label: '📍 Change Delivery Address', action: 'change_address' },
        { label: '❌ Cancel Order', action: 'cancel_order' },
      ],
      time: '11:15 AM',
    },
  ],
  cart: [
    {
      id: '1',
      sender: 'bot',
      text: '👋 Hey Alex! We noticed you left *Urban Trekker Leather Backpack* in your cart.\n\nItems in your cart are selling fast! Complete your purchase today with code *EXTRA15* for an instant 15% discount.',
      catalogItem: {
        title: 'Urban Trekker Genuine Leather Backpack',
        price: '₹3,199 (After Code: ₹2,719)',
        desc: 'Waterproof full-grain leather with padded 16" laptop sleeve and TSA lock.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      },
      buttons: [
        { label: '🚀 Complete Checkout with 15% OFF', action: 'checkout_now' },
        { label: '💬 Talk to Support Agent', action: 'talk_agent' },
      ],
      time: '02:30 PM',
    },
  ],
  ai: [
    {
      id: '1',
      sender: 'user',
      text: 'Do you offer same-day delivery in Mumbai and what is the return policy?',
      time: '04:15 PM',
    },
    {
      id: '2',
      sender: 'bot',
      text: '🤖 *Solvear AI Assistant (OpenAI + Gemini)*:\n\nYes, we provide **Express Same-Day Delivery** across Mumbai for all orders placed before 3:00 PM!\n\n📋 **Our Return Policy:**\n• 7-day hassle-free doorstep return & replacement\n• 100% full instant refund to original payment source\n• Zero return pickup charges\n\nWould you like me to help you track an ongoing parcel or check zip-code eligibility?',
      buttons: [
        { label: '📍 Check Pin Code Eligibility', action: 'check_pincode' },
        { label: '🚚 Track Existing Order', action: 'track_order' },
      ],
      time: '04:15 PM',
    },
  ],
};

export function InteractiveSimulator() {
  const [channel, setChannel] = useState<Channel>('whatsapp');
  const [activeFlow, setActiveFlow] = useState<FlowType>('catalog');
  const [messages, setMessages] = useState<ChatMessage[]>(PRESET_FLOWS.catalog);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSelectFlow = (flow: FlowType) => {
    setActiveFlow(flow);
    setMessages(PRESET_FLOWS[flow]);
  };

  const handleButtonClick = (btnLabel: string, action: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: btnLabel,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let botReply: ChatMessage;

      if (action === 'add_cart') {
        botReply = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '🛒 *Item added to WhatsApp Cart!*\n\nSubtotal: ₹2,499\nDelivery: Free Express\n\nClick below to proceed to in-chat WhatsApp Pay or Razorpay UPI:',
          buttons: [
            { label: '💳 Pay ₹2,499 with UPI / Card', action: 'payment_success' },
          ],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (action === 'confirm_cod') {
        botReply = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '🎉 *COD Order Confirmed! (ID: #ORD-98214)*\n\nYour address has been verified with TRAI DLT audit ID `#DLT-8921`. Our warehouse is preparing your parcel. You will receive live WhatsApp tracking once dispatched!',
          buttons: [
            { label: '📍 Track Dispatch Telemetry', action: 'track_dispatch' },
          ],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else if (action === 'checkout_now') {
        botReply = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '🏷️ *Coupon EXTRA15 Applied!*\n\nDiscounted Total: ₹2,719. Your cart is locked for the next 15 minutes. Click to complete instant 1-click checkout:',
          buttons: [
            { label: '⚡ Instant 1-Click Pay', action: 'payment_success' },
          ],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      } else {
        botReply = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: '✅ Action verified! Your request has been processed through the Solvear high-speed queue (Amazon SQS). How else can I assist you?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `🤖 *Solvear AI Agent*: I received your query: "${query}". Based on your CRM profile, your request is being routed via our high-speed NestJS + PostgreSQL pipeline. We're here 24/7 to boost your sales conversions!`,
        buttons: [
          { label: '🛍️ Browse Products', action: 'add_cart' },
          { label: '📞 Request Callback', action: 'callback' },
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section id="simulator" className="py-20 md:py-28 relative bg-slate-50/70 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-blue-800 font-mono">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Interactive Omnichannel Playground</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Experience Live Chatbot &amp; Commerce Automation
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Interact with the live phone simulator below. Test real WhatsApp catalogs, automated COD fraud prevention, cart recovery, and GenAI auto-replies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Controls & Scenarios */}
          <div className="lg:col-span-5 space-y-6">
            {/* Channel Switcher with Real Icons */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                Select Active Channel:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon },
                  { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
                  { id: 'telegram', label: 'Telegram', icon: TelegramIcon },
                  { id: 'webchat', label: 'Webchat', icon: Globe },
                ].map((ch) => {
                  const Icon = ch.icon;
                  const isActive = channel === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setChannel(ch.id as Channel)}
                      className={`py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-extrabold transition flex flex-col items-center justify-center space-y-2 border ${
                        isActive
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-md ring-2 ring-blue-600/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Icon className="w-6 h-6 shrink-0" />
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Workflow Presets */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Select Interactive Scenario:</span>
                <span className="text-xs text-blue-700 font-mono font-extrabold bg-blue-100/80 px-3 py-1 rounded-full">
                  Live Sim
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'catalog',
                    title: 'WhatsApp Catalog & In-Chat Checkout',
                    desc: 'Showcase rich product cards, collect instant orders, and trigger WhatsApp Pay / UPI.',
                    icon: ShoppingBag,
                  },
                  {
                    id: 'cod',
                    title: 'Shopify / WooCommerce COD Verification',
                    desc: 'Slash Return-to-Origin (RTO) by up to 65% with 1-click customer confirmation.',
                    icon: ShieldCheck,
                  },
                  {
                    id: 'cart',
                    title: 'Automated Abandoned Cart Recovery',
                    desc: 'Recover up to 28% lost revenues with dynamic discount incentives.',
                    icon: Zap,
                  },
                  {
                    id: 'ai',
                    title: 'Dual AI Agent (OpenAI & Gemini RAG)',
                    desc: 'Answer complex product FAQs, policy queries, and delivery tracking 24/7.',
                    icon: Bot,
                  },
                ].map((flow) => {
                  const Icon = flow.icon;
                  const isActive = activeFlow === flow.id;
                  return (
                    <button
                      key={flow.id}
                      onClick={() => handleSelectFlow(flow.id as FlowType)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition flex items-start space-x-4 ${
                        isActive
                          ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/80'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                          isActive ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className={`text-base font-extrabold ${isActive ? 'text-blue-950' : 'text-slate-900'}`}>
                          {flow.title}
                        </div>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed font-normal">{flow.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Smartphone Mockup */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md bg-slate-900 border-[8px] border-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-500/30 overflow-hidden flex flex-col h-[650px] relative">
              {/* Phone Speaker Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-30 flex items-center justify-center">
                <div className="w-10 h-1 bg-slate-700 rounded-full" />
              </div>

              {/* Chat Header */}
              <div
                className={`pt-7 pb-3.5 px-4 flex items-center justify-between z-20 text-white shadow-md ${
                  channel === 'whatsapp'
                    ? 'bg-emerald-700'
                    : channel === 'instagram'
                    ? 'bg-gradient-to-r from-purple-700 via-pink-600 to-amber-600'
                    : channel === 'telegram'
                    ? 'bg-sky-700'
                    : 'bg-blue-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1.5 shadow-sm">
                    {channel === 'whatsapp' && <WhatsAppIcon className="w-full h-full" />}
                    {channel === 'instagram' && <InstagramIcon className="w-full h-full" />}
                    {channel === 'telegram' && <TelegramIcon className="w-full h-full" />}
                    {channel === 'webchat' && <Globe className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div>
                    <div className="text-base font-extrabold flex items-center space-x-1">
                      <span>Solvear Verified Bot</span>
                      <CheckCheck className="w-4 h-4 text-cyan-200" />
                    </div>
                    <div className="text-xs text-white/90 flex items-center space-x-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                      <span>Online • Instant Auto-Reply</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectFlow(activeFlow)}
                  title="Reset conversation"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 bg-[#efeae2] p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
                <div className="text-center py-1">
                  <span className="text-xs font-extrabold text-slate-700 bg-white/90 border border-slate-300 px-3 py-1 rounded-full shadow-xs">
                    {channel.toUpperCase()} Business Official Gateway • 256-Bit SSL Encrypted
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
                        msg.sender === 'user'
                          ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none border border-emerald-300'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                      }`}
                    >
                      {/* Catalog Item Attachment */}
                      {msg.catalogItem && (
                        <div className="mb-3 rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
                          <img
                            src={msg.catalogItem.image}
                            alt={msg.catalogItem.title}
                            className="w-full h-36 object-cover"
                          />
                          <div className="p-3 space-y-1">
                            <div className="font-extrabold text-slate-900 text-base">{msg.catalogItem.title}</div>
                            <div className="text-emerald-700 font-mono font-extrabold text-sm">{msg.catalogItem.price}</div>
                            <p className="text-xs text-slate-600 font-normal">{msg.catalogItem.desc}</p>
                          </div>
                        </div>
                      )}

                      {/* Text Body */}
                      {msg.text && (
                        <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm text-slate-900 font-medium">
                          {msg.text}
                        </div>
                      )}

                      {/* Interactive Buttons */}
                      {msg.buttons && msg.buttons.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-200 space-y-2">
                          {msg.buttons.map((btn, i) => (
                            <button
                              key={i}
                              onClick={() => handleButtonClick(btn.label, btn.action)}
                              className="w-full py-2.5 px-3.5 bg-slate-50 hover:bg-blue-50 text-blue-700 hover:text-blue-900 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 hover:border-blue-300 flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-xs"
                            >
                              <span>{btn.label}</span>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Message Footer / Timestamp */}
                      <div className="mt-1.5 flex items-center justify-end space-x-1 text-[11px] text-slate-500 font-semibold">
                        <span>{msg.time}</span>
                        {msg.sender === 'user' && (
                          <CheckCheck className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center space-x-1.5 bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-none w-20 text-slate-400 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-slate-100 border-t border-slate-200 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl transition shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
