'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  CreditCard,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { OrderRecord } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';

export default function AdminPaymentVerificationPage() {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'BKASH' | 'NAGAD' | 'BANK_TRANSFER' | 'STRIPE'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('PENDING_VERIFICATION');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      // Handle
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleVerifyOrReject = async (orderId: string, action: 'VERIFY' | 'REJECT') => {
    setActionLoading(orderId);
    try {
      const note = notes[orderId] || '';
      const res = await fetch('/api/admin/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action, note }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update payment status');
      }

      success(data.message || 'Payment status updated');
      fetchOrders();
    } catch (err: any) {
      error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Filter verification orders (bKash, Nagad, Bank Transfer, Stripe)
  const paymentOrders = orders.filter((o) => {
    const isPayable =
      o.paymentMethod === 'BKASH' ||
      o.paymentMethod === 'NAGAD' ||
      o.paymentMethod === 'BANK_TRANSFER' ||
      o.paymentMethod === 'STRIPE';
    if (!isPayable) return false;
    if (filterMethod !== 'ALL' && o.paymentMethod !== filterMethod) return false;
    if (filterStatus && o.paymentStatus !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Payment Verification & Transactions
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Review bKash, Nagad, UCB Bank Deposits, and Stripe transactions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value as any)}
            className="bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] font-semibold"
          >
            <option value="ALL">All Methods</option>
            <option value="BKASH">bKash Only</option>
            <option value="NAGAD">Nagad Only</option>
            <option value="BANK_TRANSFER">Bank (UCB) Only</option>
            <option value="STRIPE">Stripe Only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] font-semibold"
          >
            <option value="PENDING_VERIFICATION">Pending Verification</option>
            <option value="PAID">Verified (Paid)</option>
            <option value="REJECTED">Rejected</option>
            <option value="">All Statuses</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5E1] p-6 sm:p-8 shadow-elevation-1 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#9B8A86]">Loading payment records...</div>
        ) : paymentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9B8A86] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#7A9C78] mx-auto" />
            <p className="font-semibold text-sm text-[#1A1512]">No pending payments in this queue!</p>
            <p>All bKash and Nagad transactions have been verified or rejected.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F5] text-[#9B8A86] uppercase text-[10px] tracking-wider border-y border-[#EDE5E1]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Sender Number</th>
                  <th className="p-3">Transaction ID (TrxID)</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Internal Note</th>
                  <th className="p-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDEA]">
                {paymentOrders.map((order) => {
                  const payment = order.payments && order.payments[0];
                  const currentNote = notes[order.id] ?? payment?.verificationNote ?? '';

                  return (
                    <tr key={order.id} className="hover:bg-[#F1F8E8]/40 transition-colors">
                      {/* Order ID */}
                      <td className="p-3 font-mono font-bold text-[#1A1512]">
                        {order.orderNumber}
                      </td>

                      {/* Customer */}
                      <td className="p-3">
                        <p className="font-semibold text-[#1A1512]">{order.customerName}</p>
                        <p className="text-[10px] text-[#9B8A86]">{order.customerPhone}</p>
                      </td>

                      {/* Method */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentMethod === 'BKASH'
                              ? 'bg-[#FFF0F6] text-[#E2136E] border border-[#E2136E]/20'
                              : order.paymentMethod === 'NAGAD'
                              ? 'bg-[#FFF8F0] text-[#F4821F] border border-[#F4821F]/20'
                              : order.paymentMethod === 'BANK_TRANSFER'
                              ? 'bg-[#EBF3FB] text-[#00529B] border border-[#00529B]/20'
                              : order.paymentMethod === 'STRIPE'
                              ? 'bg-[#F4F3FF] text-[#635BFF] border border-[#635BFF]/20'
                              : 'bg-[#F8F7F5] text-[#1A1512] border border-[#EDE5E1]'
                          }`}
                        >
                          {order.paymentMethod === 'BANK_TRANSFER'
                            ? 'Bank (UCB)'
                            : order.paymentMethod === 'STRIPE'
                            ? 'Stripe'
                            : order.paymentMethod}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-3 font-bold text-[#1A1512]">
                        {formatPrice(order.total)}
                      </td>

                      {/* Sender Number */}
                      <td className="p-3 font-mono font-semibold text-[#1A1512]">
                        {payment?.senderNumber || order.customerPhone}
                      </td>

                      {/* Transaction ID */}
                      <td className="p-3 font-mono font-bold text-[#6CAE14]">
                        {payment?.transactionId || 'N/A'}
                      </td>

                      {/* Time */}
                      <td className="p-3 text-[#6B5B58]">
                        {formatDate(payment?.createdAt || order.createdAt)}
                      </td>

                      {/* Payment Status */}
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'PAID'
                              ? 'bg-[#EAF3E9] text-[#7A9C78]'
                              : order.paymentStatus === 'REJECTED'
                              ? 'bg-[#FBDADA] text-[#D94040]'
                              : 'bg-[#FFF8F0] text-[#F4821F] animate-pulse'
                          }`}
                        >
                          {order.paymentStatus === 'PENDING_VERIFICATION'
                            ? 'Pending Verification'
                            : order.paymentStatus}
                        </span>
                      </td>

                      {/* Internal Note */}
                      <td className="p-3">
                        <input
                          type="text"
                          value={currentNote}
                          onChange={(e) =>
                            setNotes({ ...notes, [order.id]: e.target.value })
                          }
                          placeholder="e.g. Verified in bKash app"
                          className="bg-[#F8F7F5] border border-[#EDE5E1] rounded-lg px-2 py-1 text-[11px] text-[#1A1512] focus:outline-none focus:border-[#6CAE14] w-36"
                        />
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        {order.paymentStatus === 'PENDING_VERIFICATION' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleVerifyOrReject(order.id, 'VERIFY')}
                              disabled={actionLoading === order.id}
                              className="bg-[#7A9C78] hover:bg-[#60805e] disabled:opacity-50 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors shadow-xs active:scale-95"
                            >
                              Verify (Paid)
                            </button>
                            <button
                              onClick={() => handleVerifyOrReject(order.id, 'REJECT')}
                              disabled={actionLoading === order.id}
                              className="bg-[#D94040] hover:bg-[#b03030] disabled:opacity-50 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-colors shadow-xs active:scale-95"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#9B8A86] italic">Processed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
