'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Save, 
  Phone, 
  Truck, 
  CreditCard, 
  Store, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ShieldCheck,
  BarChart3,
  Activity,
  Send,
  Globe,
  Radio,
  Landmark,
  User,
  Award,
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/context/toast-context';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    storeName: 'Jawata Mart',
    storeTagline: 'Trusted Multi-Category Shopping Platform in Bangladesh',
    hotline: '+880 1915-210799',
    supportEmail: 'support@jawatamart.com',
    address: 'House #42, Road #18, Sector #12, Uttara, Dhaka-1230',
    
    // Delivery fees
    insideDhakaDeliveryFee: 70,
    outsideDhakaDeliveryFee: 120,
    freeDeliveryThreshold: 2000,
    estimatedDhakaDeliveryDays: '1-2 Days',
    estimatedOutsideDeliveryDays: '3-5 Days',
    
    // Payment Settings
    bkashMerchantNumber: '01915210799',
    bkashAccountType: 'Personal',
    nagadMerchantNumber: '01915210799',
    nagadAccountType: 'Personal',

    // Bank Account Details (UCB Bank)
    bankAccountName: 'Jawata Mart',
    bankAccountNumber: '1462101000775432',
    bankName: 'UCB Bank (United Commercial Bank)',
    bankBranch: 'Dhaka',
    bankConfirmationEmail: 'payments@jawatamart.com',
    enableBankTransfer: true,

    // Stripe Gateway Configuration
    enableStripe: true,
    
    // Feature Toggles
    enableCOD: true,
    enableBkash: true,
    enableNagad: true,
    enableSSLCommerz: true,
    bannerAnnouncement: 'Eid Special Offer: Free delivery across Bangladesh on orders over ৳2,000!',

    // Tracking & Analytics Configuration
    metaPixelId: '',
    metaTestEventCode: '',
    enableMetaPixel: true,
    enableMetaCapi: true,
    ga4MeasurementId: '',
    enableGA4: true,
    gtmId: '',
    enableGTM: true,

    // About Us & Brand Story (About Page)
    aboutStory: 'Jawata Mart is committed to delivering 100% authentic and premium products directly to families across Bangladesh.',
    aboutMission: 'To make trusted, high-quality, and ethical online shopping accessible to every doorstep in Bangladesh.',
    aboutVision: 'To become Bangladesh’s most reliable, customer-centric family shopping platform.',
  });

  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestCapiEvent = async () => {
    setTestLoading(true);
    setTestResult(null);
    if (!formData.metaPixelId?.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter your Meta Pixel ID in the field above first.',
      });
      setTestLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/tracking/capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'TestEvent',
          eventId: `test_${Date.now()}`,
          pixelId: formData.metaPixelId.trim(),
          testEventCode: formData.metaTestEventCode?.trim() || undefined,
          value: 1250,
          currency: 'BDT',
          customerPhone: formData.hotline || '01915210799',
          customerEmail: formData.supportEmail || 'support@jawatamart.com',
          customerName: formData.storeName || 'Jawata Mart',
          items: [{ id: 'test-1', name: 'Tracking Verification Sample Item', price: 1250, quantity: 1 }],
          eventSourceUrl: window.location.href,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `Event successfully received by Meta Graph API! (Trace ID: ${data.fbtrace_id || 'OK'})`,
        });
      } else {
        setTestResult({
          success: false,
          message: data.warning || data.metaError?.error?.message || 'Meta CAPI request failed. Please verify Pixel ID and Access Token.',
        });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Network error testing CAPI' });
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Migrate stored settings in localStorage if present
        try {
          const stored = localStorage.getItem('store_settings');
          if (stored) {
            const parsed = JSON.parse(stored);
            let changed = false;
            if (parsed.insideDhakaDeliveryFee === 60 || parsed.insideDhakaFee === 60 || parsed.deliveryInside === 60) {
              parsed.insideDhakaDeliveryFee = 70;
              parsed.deliveryInside = 70;
              changed = true;
            }
            if (!parsed.outsideDhakaDeliveryFee && !parsed.outsideDhakaFee && !parsed.deliveryOutside) {
              parsed.outsideDhakaDeliveryFee = 120;
              parsed.deliveryOutside = 120;
              changed = true;
            }
            if (changed) {
              localStorage.setItem('store_settings', JSON.stringify(parsed));
            }
          }
        } catch {}

        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            const loaded: any = { ...data.settings };
            if (loaded.insideDhakaDeliveryFee === 60 || loaded.insideDhakaFee === 60 || loaded.deliveryInside === 60) {
              loaded.insideDhakaDeliveryFee = 70;
            }
            if (loaded.outsideDhakaDeliveryFee === undefined && loaded.outsideDhakaFee === undefined && loaded.deliveryOutside === undefined) {
              loaded.outsideDhakaDeliveryFee = 120;
            }
            setFormData(prev => ({ ...prev, ...loaded }));
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const payload = {
      ...formData,
      insideDhakaDeliveryFee: formData.insideDhakaDeliveryFee || 70,
      outsideDhakaDeliveryFee: formData.outsideDhakaDeliveryFee || 120,
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        try {
          localStorage.setItem('store_settings', JSON.stringify(payload));
        } catch {}
        setSavedSuccess(true);
        toast('Settings updated successfully!', 'success');
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        toast('Failed to save settings', 'error');
      }
    } catch (err) {
      toast('An error occurred while saving', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-charcoal-900">Store Settings</h1>
          <p className="text-sm text-charcoal-500">Manage payment accounts, delivery rates, and store details</p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6CAE14] hover:bg-[#5B960E] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4 text-white" />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-medium">All store configuration parameters have been successfully updated.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Gateway Configurations (bKash & Nagad) */}
        <div className="bg-white rounded-2xl border border-charcoal-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100 bg-linen-50 flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-charcoal-900">Bangladesh Payment Channels</h2>
              <p className="text-xs text-charcoal-500">Configure your manual Send Money merchant numbers and instructions</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* bKash Config */}
            <div className="p-5 rounded-xl border border-pink-100 bg-pink-50/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs">
                    bK
                  </div>
                  <span className="font-bold text-charcoal-900">bKash Manual Send Money</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="enableBkash"
                    checked={formData.enableBkash}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E2136E]"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  bKash Account Number
                </label>
                <div className="p-2.5 bg-white border border-charcoal-200 rounded-lg text-xs text-charcoal-700 flex items-center justify-between">
                  <span className="font-mono text-gray-500">•••• •••• ••••</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Protected Secret
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-1">Stored securely on server. Presented to buyers at checkout to copy.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                <select
                  name="bkashAccountType"
                  value={formData.bkashAccountType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E2136E]/20"
                >
                  <option value="Merchant">Merchant Account (Make Payment)</option>
                  <option value="Personal">Personal Account (Send Money)</option>
                  <option value="Agent">Agent Account (Cash Out)</option>
                </select>
              </div>
            </div>

            {/* Nagad Config */}
            <div className="p-5 rounded-xl border border-orange-100 bg-orange-50/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F4821F] text-white flex items-center justify-center font-bold text-xs">
                    NG
                  </div>
                  <span className="font-bold text-charcoal-900">Nagad Manual Send Money</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="enableNagad"
                    checked={formData.enableNagad}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F4821F]"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Nagad Account Number
                </label>
                <div className="p-2.5 bg-white border border-charcoal-200 rounded-lg text-xs text-charcoal-700 flex items-center justify-between">
                  <span className="font-mono text-gray-500">•••• •••• ••••</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Protected Secret
                  </span>
                </div>
                <p className="text-xs text-charcoal-500 mt-1">Stored securely on server. Presented to buyers at checkout to copy.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                <select
                  name="nagadAccountType"
                  value={formData.nagadAccountType}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4821F]/20"
                >
                  <option value="Merchant">Merchant Account</option>
                  <option value="Personal">Personal Account (Send Money)</option>
                </select>
              </div>
            </div>

            {/* UCB Bank Deposit Config */}
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between border-b border-blue-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#00529B] text-white flex items-center justify-center">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-charcoal-900 block text-sm">UCB Bank Direct Deposit</span>
                    <span className="text-xs text-charcoal-500">United Commercial Bank details shown to buyers at checkout</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="enableBankTransfer"
                    checked={formData.enableBankTransfer}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00529B]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Account Name
                  </label>
                  <input
                    type="text"
                    name="bankAccountName"
                    value={formData.bankAccountName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529B]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Bank Account Number
                  </label>
                  <div className="p-2.5 bg-white border border-charcoal-200 rounded-lg text-xs text-charcoal-700 flex items-center justify-between">
                    <span className="font-mono text-gray-500">•••• •••• ••••</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Protected Secret
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-500 mt-1">Stored securely on server. Presented to buyers at checkout to copy.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529B]/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="bankBranch"
                    value={formData.bankBranch}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529B]/20"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Receipt Confirmation Email
                  </label>
                  <input
                    type="email"
                    name="bankConfirmationEmail"
                    value={formData.bankConfirmationEmail}
                    onChange={handleChange}
                    placeholder="billing@jawatamart.com"
                    className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00529B]/20"
                  />
                </div>
              </div>
            </div>

            {/* Stripe Card Payment Gateway Config */}
            <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-4 md:col-span-2">
              <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-charcoal-900 block text-sm">Stripe International & Local Cards</span>
                    <span className="text-xs text-charcoal-500">Enable Visa, Mastercard, AMEX, Apple Pay via Stripe Checkout</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="enableStripe"
                    checked={formData.enableStripe}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#635BFF]"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Stripe Publishable Key
                  </label>
                  <div className="p-3 bg-gray-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-700 flex items-center justify-between">
                    <span>Server Environment (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Server Configured
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-1">Managed via server environment variables.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Stripe Secret Key
                  </label>
                  <div className="p-3 bg-gray-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-700 flex items-center justify-between">
                    <span>Server Secret (STRIPE_SECRET_KEY)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Protected Secret
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-1">Strictly isolated server-side. Never rendered in browser.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Configuration */}
        <div className="bg-white rounded-2xl border border-charcoal-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100 bg-linen-50 flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-charcoal-900">Delivery & Logistics Rates</h2>
              <p className="text-xs text-charcoal-500">Dhaka vs outside Dhaka standard courier fees & free delivery qualification</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Inside Dhaka Fee (৳)
              </label>
              <input
                type="number"
                name="insideDhakaDeliveryFee"
                value={formData.insideDhakaDeliveryFee}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <p className="text-xs text-charcoal-500 mt-1">Applied to Dhaka city addresses</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Outside Dhaka Fee (৳)
              </label>
              <input
                type="number"
                name="outsideDhakaDeliveryFee"
                value={formData.outsideDhakaDeliveryFee}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <p className="text-xs text-charcoal-500 mt-1">Applied to all other 7 divisions</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Free Delivery Threshold (৳)
              </label>
              <input
                type="number"
                name="freeDeliveryThreshold"
                value={formData.freeDeliveryThreshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <p className="text-xs text-charcoal-500 mt-1">Orders above this amount get free shipping</p>
            </div>

            <div className="md:col-span-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    insideDhakaDeliveryFee: 70,
                    outsideDhakaDeliveryFee: 120,
                  }));
                  toast('ডেলিভারি চার্জ ৭০/১২০ টাকায় রিসেট করা হয়েছে (Save Settings বাটনে ক্লিক করুন)', 'info');
                }}
                className="px-4 py-2 bg-charcoal-100 hover:bg-charcoal-200 text-charcoal-800 text-xs font-semibold rounded-xl border border-charcoal-300 transition-all cursor-pointer"
              >
                Reset delivery charges to 70/120
              </button>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="bg-white rounded-2xl border border-charcoal-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100 bg-linen-50 flex items-center gap-2.5">
            <Store className="w-5 h-5 text-brand-600" />
            <div>
              <h2 className="text-base font-bold text-charcoal-900">Store Profile & Support Hotline</h2>
              <p className="text-xs text-charcoal-500">Contact information shown to customers and on invoices</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Customer Support Hotline
              </label>
              <input
                type="text"
                name="hotline"
                value={formData.hotline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Physical Office Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                Top Announcement Bar Notice
              </label>
              <textarea
                name="bannerAnnouncement"
                rows={2}
                value={formData.bannerAnnouncement}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>

        {/* About Us & Brand Story (About Us Page) */}
        <div className="bg-white rounded-2xl border border-charcoal-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100 bg-[#F1F8E8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6CAE14] text-white flex items-center justify-center shadow-xs">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-charcoal-900">About Us & Brand Story (আমাদের গল্প ও পরিচিতি)</h2>
                <p className="text-xs text-charcoal-500">
                  Update Jawata Mart's story, mission, and vision displayed on the public About page
                </p>
              </div>
            </div>
            <Link
              href="/about"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#DFECCE] text-xs font-bold text-[#6CAE14] hover:bg-[#E5F3D4] transition-colors shrink-0 shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live About Page</span>
            </Link>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  Our Story / About Jawata Mart (আমাদের গল্প ও যাত্রার বিবরণ)
                </label>
                <textarea
                  name="aboutStory"
                  rows={4}
                  value={formData.aboutStory || ''}
                  onChange={handleChange}
                  placeholder="Describe how Jawata Mart started and what it stands for..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Our Mission (আমাদের মিশন)
                  </label>
                  <textarea
                    name="aboutMission"
                    rows={3}
                    value={formData.aboutMission || ''}
                    onChange={handleChange}
                    placeholder="Our core purpose and commitments to buyers..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Our Vision (আমাদের ভিশন)
                  </label>
                  <textarea
                    name="aboutVision"
                    rows={3}
                    value={formData.aboutVision || ''}
                    onChange={handleChange}
                    placeholder="Where we aim to take Jawata Mart in the coming years..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking & Analytics (Meta Pixel, CAPI, GA4, GTM) */}
        <div className="bg-white rounded-2xl border border-charcoal-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-100 bg-linen-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-[#6CAE14]" />
              <div>
                <h2 className="text-base font-bold text-charcoal-900">Tracking & Marketing Analytics (Meta Pixel, CAPI & GA4)</h2>
                <p className="text-xs text-charcoal-500">
                  Configure Meta Pixel, Server-Side Conversions API (CAPI), GA4 and GTM with automatic deduplication
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-[#EBF5DC] text-[#5B960E] px-2.5 py-1 rounded-full">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              CAPI Ready
            </span>
          </div>

          <div className="p-6 space-y-8">
            {/* Meta Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-charcoal-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                    f
                  </div>
                  <h3 className="text-sm font-bold text-charcoal-900">Meta (Facebook) Pixel & Server-Side CAPI</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal-700">
                    <input
                      type="checkbox"
                      name="enableMetaPixel"
                      checked={formData.enableMetaPixel ?? true}
                      onChange={handleChange}
                      className="rounded text-[#6CAE14] focus:ring-[#6CAE14]"
                    />
                    Enable Pixel
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal-700">
                    <input
                      type="checkbox"
                      name="enableMetaCapi"
                      checked={formData.enableMetaCapi ?? true}
                      onChange={handleChange}
                      className="rounded text-[#6CAE14] focus:ring-[#6CAE14]"
                    />
                    Enable Server CAPI
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Meta Pixel ID
                  </label>
                  <div className="p-2.5 bg-white border border-charcoal-200 rounded-xl text-xs text-charcoal-700 flex items-center justify-between">
                    <span className="font-mono text-gray-500">•••• •••• ••••</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Protected Secret
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-1">
                    Find in Meta Events Manager &gt; Data Sources &gt; Settings
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Meta Test Event Code (Optional for Testing)
                  </label>
                  <div className="p-2.5 bg-white border border-charcoal-200 rounded-xl text-xs text-charcoal-700 flex items-center justify-between">
                    <span className="font-mono text-gray-500">•••• •••• ••••</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Protected Secret
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-1">
                    Meta Events Manager &gt; Test Events tab &gt; Test Server Events code
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Meta Conversions API (CAPI) Access Token
                  </label>
                  <div className="p-3 bg-gray-50 border border-charcoal-200 rounded-xl text-xs text-charcoal-700 flex items-center justify-between">
                    <span>Server Secret (META_CAPI_ACCESS_TOKEN)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Protected Secret
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 mt-1">
                    Conversions API access token is stored safely in server environment variables and never exposed to the client browser.
                  </p>
                </div>
              </div>

              {/* CAPI Event Verification Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F8F7F5] border border-[#EDE5E1]">
                <div>
                  <div className="text-xs font-bold text-[#1A1512] flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#6CAE14]" />
                    <span>CAPI Connectivity Verification</span>
                  </div>
                  <p className="text-[11px] text-[#6B5B58] mt-0.5">
                    Send a live test event to Meta Graph API to verify server-side tracking instantly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleTestCapiEvent}
                  disabled={testLoading}
                  className="px-4 py-2 rounded-xl bg-[#1A1512] hover:bg-black disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  {testLoading ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Test Event
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>

            {/* Google Section */}
            <div className="space-y-4 pt-4 border-t border-charcoal-100">
              <div className="flex items-center justify-between border-b border-charcoal-100 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#EA4335] text-white flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <h3 className="text-sm font-bold text-charcoal-900">Google Analytics 4 & Google Tag Manager</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal-700">
                    <input
                      type="checkbox"
                      name="enableGA4"
                      checked={formData.enableGA4 ?? true}
                      onChange={handleChange}
                      className="rounded text-[#6CAE14] focus:ring-[#6CAE14]"
                    />
                    Enable GA4
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-charcoal-700">
                    <input
                      type="checkbox"
                      name="enableGTM"
                      checked={formData.enableGTM ?? true}
                      onChange={handleChange}
                      className="rounded text-[#6CAE14] focus:ring-[#6CAE14]"
                    />
                    Enable GTM
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    GA4 Measurement ID
                  </label>
                  <input
                    type="text"
                    name="ga4MeasurementId"
                    value={formData.ga4MeasurementId || ''}
                    onChange={handleChange}
                    placeholder="e.g. G-XXXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6CAE14]/20 focus:border-[#6CAE14]"
                  />
                  <p className="text-[11px] text-charcoal-500 mt-1">
                    Google Analytics &gt; Admin &gt; Data Streams &gt; Measurement ID
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1.5">
                    Google Tag Manager Container ID
                  </label>
                  <input
                    type="text"
                    name="gtmId"
                    value={formData.gtmId || ''}
                    onChange={handleChange}
                    placeholder="e.g. GTM-XXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6CAE14]/20 focus:border-[#6CAE14]"
                  />
                  <p className="text-[11px] text-charcoal-500 mt-1">
                    Google Tag Manager &gt; Workspace Container ID (top right)
                  </p>
                </div>
              </div>
            </div>

            {/* Standard Events Reference */}
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EDE5E1] space-y-2 text-xs">
              <div className="font-bold text-[#1A1512]">⚡ Pre-configured E-commerce Standard Events:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#6B5B58]">
                <div>✓ <b>PageView</b> (All routes)</div>
                <div>✓ <b>ViewContent</b> (Product page)</div>
                <div>✓ <b>AddToCart</b> (Bag drawer)</div>
                <div>✓ <b>InitiateCheckout</b> (Checkout page)</div>
                <div>✓ <b>Purchase</b> (Browser + CAPI)</div>
                <div>✓ <b>Contact</b> (WhatsApp / Hotline)</div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 border-t border-charcoal-100 flex items-center justify-between">
              <p className="text-xs text-charcoal-500">Make sure to save after updating payment or tracking credentials.</p>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#6CAE14] hover:bg-[#5B960E] text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4 text-white" />
                )}
                <span>{saving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
