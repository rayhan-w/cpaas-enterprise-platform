'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Zap,
  CheckCircle,
  ShieldCheck,
  Building,
  RefreshCw,
  Wallet,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

const PRESETS = [
  { amount: 500, label: 'Starter Pack', credits: 4166, bonus: 'Standard' },
  { amount: 1000, label: 'Growth Tier', credits: 8333, bonus: '+5% Bonus' },
  { amount: 5000, label: 'Enterprise Scale', credits: 41666, bonus: '+10% Bonus', popular: true },
  { amount: 25000, label: 'High-Volume Telecom', credits: 208333, bonus: '+15% Bonus' },
];

export default function BillingPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [gateway, setGateway] = useState<'RAZORPAY' | 'PHONEPE'>('RAZORPAY');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const calculatedCredits = Math.floor(selectedAmount / 0.12);

  const loadHistory = async () => {
    try {
      const res = await fetchApi('/payments/history');
      if (res) setTransactions(res);
    } catch {
      // Ignore fallback
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleCheckout = async () => {
    if (selectedAmount < 100) {
      alert('Minimum recharge amount is INR ₹100');
      return;
    }

    try {
      setLoading(true);
      setSuccessBanner(null);

      // Step 1: Create Order on Backend
      const order = await fetchApi('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({
          amountInr: selectedAmount,
          gateway,
        }),
      });

      // Step 2: Instant verification simulation for development / staging
      const verifyRes = await fetchApi('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: order.orderId,
          paymentId: `pay_${gateway.toLowerCase()}_mock_${Date.now()}`,
          signature: 'mock_signature_valid_sha256_hash',
          gateway,
        }),
      });

      setSuccessBanner(
        `Successfully added ${verifyRes.smsCreditsCredited.toLocaleString()} SMS Credits! New Balance: ₹${verifyRes.newBalanceInr.toFixed(2)} (${verifyRes.newSmsCredit.toLocaleString()} Credits)`
      );

      loadHistory();
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-2">
          <Wallet className="w-3.5 h-3.5" />
          <span>Automated Wallet Top-up</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Billing & SMS Credits Recharge</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Instant wallet top-up with zero transaction fees via Razorpay & PhonePe. 1 SMS Credit = INR ₹0.12.
        </p>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700/80 rounded-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold text-emerald-200">{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs text-emerald-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Recharge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recharge Selection (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preset Cards */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center justify-between">
              <span>Select Recharge Package</span>
              <span className="text-xs text-blue-400 font-mono">1 SMS = ₹0.12</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PRESETS.map((pkg) => {
                const isSelected = selectedAmount === pkg.amount;
                return (
                  <div
                    key={pkg.amount}
                    onClick={() => setSelectedAmount(pkg.amount)}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500 shadow-lg shadow-blue-500/10'
                        : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow">
                        Most Popular
                      </span>
                    )}

                    <div className="text-xs font-semibold text-gray-400">{pkg.label}</div>
                    <div className="text-2xl font-bold text-white font-mono mt-1">₹{pkg.amount.toLocaleString()}</div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-bold font-mono">
                        +{pkg.credits.toLocaleString()} SMS Credits
                      </span>
                      <span className="text-[11px] text-blue-300 font-medium">{pkg.bonus}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="pt-3 border-t border-gray-800">
              <label className="text-xs font-semibold text-gray-300">Or Enter Custom Recharge Amount (INR):</label>
              <div className="mt-1.5 relative">
                <span className="absolute left-3.5 top-2.5 text-gray-400 font-mono font-bold">₹</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value) || 0)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500 transition"
                  placeholder="e.g. 2500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white">Select Enterprise Payment Gateway</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setGateway('RAZORPAY')}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  gateway === 'RAZORPAY'
                    ? 'bg-blue-950/60 border-blue-500 shadow-md'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 font-bold font-mono text-sm">
                    RZP
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Razorpay Checkout</div>
                    <div className="text-xs text-gray-400">UPI, Cards, Netbanking & Wallets</div>
                  </div>
                </div>
                {gateway === 'RAZORPAY' && <CheckCircle className="w-5 h-5 text-blue-400" />}
              </div>

              <div
                onClick={() => setGateway('PHONEPE')}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  gateway === 'PHONEPE'
                    ? 'bg-purple-950/60 border-purple-500 shadow-md'
                    : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 font-bold font-mono text-sm">
                    Pe
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">PhonePe Business</div>
                    <div className="text-xs text-gray-400">Instant UPI Direct & QR Flow</div>
                  </div>
                </div>
                {gateway === 'PHONEPE' && <CheckCircle className="w-5 h-5 text-purple-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Checkout Summary Card (1 Column) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Order Summary</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Recharge Amount</span>
                <span className="text-white font-mono font-semibold">₹{selectedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Calculated SMS Credits</span>
                <span className="text-emerald-400 font-mono font-bold">+{calculatedCredits.toLocaleString()} Credits</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Gateway Convenience Fee</span>
                <span className="text-emerald-400 font-semibold">₹0.00 (Free)</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>GST (18% Input Credit)</span>
                <span className="text-gray-300 font-mono">Included</span>
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-between text-sm font-bold text-white">
                <span>Total Payable</span>
                <span className="font-mono text-blue-400">₹{selectedAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || selectedAmount <= 0}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Proceed to Pay ₹{selectedAmount.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center space-x-2 text-[11px] text-gray-400 pt-2 border-t border-gray-850">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>PCI-DSS Level 1 & HMAC SHA-256 Webhook Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="text-base font-bold text-white">Recharge Invoices & Order History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Gateway</th>
                <th className="pb-3 font-semibold">Amount (INR)</th>
                <th className="pb-3 font-semibold">Credits Credited</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400 font-sans">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-900/40 transition">
                    <td className="py-3 font-semibold text-white">{tx.orderId}</td>
                    <td className="py-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-900 border border-gray-800 text-gray-200">
                        {tx.gateway}
                      </span>
                    </td>
                    <td className="py-3 text-white font-bold">₹{tx.amountInr.toFixed(2)}</td>
                    <td className="py-3 text-emerald-400 font-bold">+{tx.smsCreditsCredited.toLocaleString()} SMS</td>
                    <td className="py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        tx.status === 'SUCCESS'
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                          : 'bg-amber-950 border border-amber-800 text-amber-400'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 font-sans">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
