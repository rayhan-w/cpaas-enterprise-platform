'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CheckCircle2,
  Coins,
  ArrowRight,
  RefreshCw,
  Receipt,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

const PRESETS = [
  { amount: 500, label: 'Starter', credits: 4166, bonus: '₹0.12/SMS' },
  { amount: 1000, label: 'Growth', credits: 8333, bonus: '₹0.12/SMS' },
  { amount: 5000, label: 'Scale', credits: 41666, bonus: '₹0.12/SMS', popular: true },
  { amount: 25000, label: 'Enterprise', credits: 208333, bonus: '₹0.12/SMS' },
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
      // Ignore
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

      // Step 1: Create Order
      const order = await fetchApi('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ amountInr: selectedAmount, gateway }),
      });

      // Step 2: Verification
      const verifyRes = await fetchApi('/payments/verify', {
        method: 'POST',
        body: JSON.stringify({
          orderId: order.orderId,
          paymentId: `pay_${gateway.toLowerCase()}_${Date.now()}`,
          signature: 'mock_signature_valid_sha256_hash',
          gateway,
        }),
      });

      setSuccessBanner(
        `Added ${verifyRes.smsCreditsCredited.toLocaleString()} SMS Credits! New Balance: ₹${verifyRes.newBalanceInr.toFixed(2)} (${verifyRes.newSmsCredit.toLocaleString()} SMS)`
      );

      loadHistory();
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-zinc-850">
        <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Billing & Credits</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Top up wallet balance, convert INR to SMS credits (1 SMS = ₹0.12), and review invoices.
        </p>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-zinc-900 border border-emerald-800/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-emerald-200">{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs text-zinc-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Package Selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-200">Select Amount</h2>
              <span className="text-xs font-mono text-zinc-500">1 SMS = ₹0.12</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESETS.map((pkg) => {
                const isSelected = selectedAmount === pkg.amount;
                return (
                  <div
                    key={pkg.amount}
                    onClick={() => setSelectedAmount(pkg.amount)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-800/90 border-blue-500 shadow-sm'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-[11px] font-medium text-zinc-400">{pkg.label}</div>
                    <div className="text-lg font-bold text-zinc-100 font-mono mt-1">₹{pkg.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-emerald-400 font-mono font-medium mt-1">
                      +{pkg.credits.toLocaleString()} SMS
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <label className="text-xs font-medium text-zinc-300">Custom Amount (INR)</label>
              <div className="mt-1 relative">
                <span className="absolute left-3 top-2 text-zinc-500 font-mono text-xs">₹</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Gateway Selector */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-200">Payment Gateway</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setGateway('RAZORPAY')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                  gateway === 'RAZORPAY'
                    ? 'bg-zinc-800/90 border-blue-500'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-200">Razorpay</div>
                  <div className="text-[11px] text-zinc-500">UPI, Cards, Netbanking</div>
                </div>
                {gateway === 'RAZORPAY' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </div>

              <div
                onClick={() => setGateway('PHONEPE')}
                className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                  gateway === 'PHONEPE'
                    ? 'bg-zinc-800/90 border-blue-500'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-200">PhonePe</div>
                  <div className="text-[11px] text-zinc-500">UPI Direct & QR</div>
                </div>
                {gateway === 'PHONEPE' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4 sticky top-20">
            <h2 className="text-sm font-semibold text-zinc-200">Order Summary</h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Recharge Amount</span>
                <span className="font-mono text-zinc-200">₹{selectedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Credited SMS</span>
                <span className="font-mono font-semibold text-emerald-400">+{calculatedCredits.toLocaleString()} SMS</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Gateway Fee</span>
                <span className="text-emerald-400">₹0.00</span>
              </div>

              <div className="pt-2.5 border-t border-zinc-800 flex justify-between text-sm font-bold text-zinc-100">
                <span>Total</span>
                <span className="font-mono text-blue-400">₹{selectedAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || selectedAmount <= 0}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Pay ₹{selectedAmount.toLocaleString()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Invoices */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-200">Invoices & Recharge History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 font-medium">Order ID</th>
                <th className="pb-2.5 font-medium">Gateway</th>
                <th className="pb-2.5 font-medium">Amount</th>
                <th className="pb-2.5 font-medium">Credits Added</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 font-mono">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-zinc-500 font-sans">
                    No transactions recorded.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-900/60 transition">
                    <td className="py-2.5 font-medium text-zinc-200">{tx.orderId}</td>
                    <td className="py-2.5 text-zinc-400 font-sans">{tx.gateway}</td>
                    <td className="py-2.5 text-zinc-200 font-semibold">₹{tx.amountInr.toFixed(2)}</td>
                    <td className="py-2.5 text-emerald-400">+{tx.smsCreditsCredited.toLocaleString()}</td>
                    <td className="py-2.5 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-500 font-sans text-right text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString()}
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
