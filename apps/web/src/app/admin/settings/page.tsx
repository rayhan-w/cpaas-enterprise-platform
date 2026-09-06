'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { useToast } from '@/context/toast-context';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    storeName: 'Nurtura Bangladesh',
    storeTagline: 'Your Trusted Online Shopping Destination in Bangladesh',
    hotline: '+880 1700-000000',
    supportEmail: 'support@nurtura.com.bd',
    address: 'House #42, Road #11, Banani, Dhaka-1213, Bangladesh',
    
    // Delivery fees
    insideDhakaDeliveryFee: 60,
    outsideDhakaDeliveryFee: 120,
    freeDeliveryThreshold: 2000,
    estimatedDhakaDeliveryDays: '1-2 Days',
    estimatedOutsideDeliveryDays: '3-5 Days',
    
    // Payment Settings
    bkashMerchantNumber: '01700-000000',
    bkashAccountType: 'Merchant',
    nagadMerchantNumber: '01800-000000',
    nagadAccountType: 'Merchant',
    
    // Feature Toggles
    enableCOD: true,
    enableBkash: true,
    enableNagad: true,
    enableSSLCommerz: true,
    bannerAnnouncement: 'Eid Special Offer: Free delivery across Bangladesh on orders over ৳2,000!'
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setFormData(prev => ({ ...prev, ...data.settings }));
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

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
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
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-all shadow-sm disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
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
                <input
                  type="text"
                  name="bkashMerchantNumber"
                  value={formData.bkashMerchantNumber}
                  onChange={handleChange}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E2136E]/20 focus:border-[#E2136E]"
                />
                <p className="text-xs text-charcoal-500 mt-1">This number will be presented to buyers at checkout to copy</p>
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
                <input
                  type="text"
                  name="nagadMerchantNumber"
                  value={formData.nagadMerchantNumber}
                  onChange={handleChange}
                  placeholder="018XXXXXXXX"
                  className="w-full px-3.5 py-2 rounded-lg border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4821F]/20 focus:border-[#F4821F]"
                />
                <p className="text-xs text-charcoal-500 mt-1">This number will be displayed on the checkout page</p>
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
      </form>
    </div>
  );
}
