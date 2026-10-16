'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowLeft,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Package,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { OrderRecord } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';

const orderStatuses = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'RETURNED',
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      const found = (data.orders || []).find(
        (o: OrderRecord) => o.id === orderId || o.orderNumber === orderId
      );
      if (found) {
        setOrder(found);
      } else {
        toast('Order not found', 'error');
      }
    } catch {
      toast('Failed to load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, orderStatus: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(`Order status updated to ${newStatus}`, 'success');
        setOrder((prev) => (prev ? { ...prev, orderStatus: newStatus as any } : null));
      } else {
        toast(data.error || 'Failed to update order status', 'error');
      }
    } catch {
      toast('Network error updating status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentAction = async (action: 'VERIFY' | 'REJECT') => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, action }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message || 'Payment status updated', 'success');
        fetchOrder();
      } else {
        toast(data.error || 'Failed to update payment status', 'error');
      }
    } catch {
      toast('Network error verifying payment', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-[#9B8A86]">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B5B58] hover:text-[#1A1512]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders List</span>
        </Link>
        <div className="p-8 bg-white rounded-2xl border border-[#EDE5E1] text-center">
          <p className="text-sm font-semibold text-[#1A1512]">Order Not Found</p>
          <p className="text-xs text-[#9B8A86] mt-1">ID: {orderId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#EDE5E1]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-xl bg-white border border-[#EDE5E1] hover:bg-[#F8F7F5] text-[#1A1512] transition-colors"
            title="Back to Orders List"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1512]">
                Order {order.orderNumber}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-[#EAF3E9] text-[#7A9C78]'
                    : order.paymentStatus === 'PENDING_VERIFICATION'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-[#FBDADA] text-[#D94040]'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-[#9B8A86] mt-0.5">
              Placed on {formatDate(order.createdAt)} • ID: {order.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/track-order?orderId=${order.orderNumber}&phone=${order.customerPhone}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[#6CAE14]/40 hover:bg-[#F1F8E8] text-[#6CAE14] text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Tracking Page</span>
          </Link>
        </div>
      </div>

      {/* Status Management Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE5E1] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#fd6b03] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#6B5B58] uppercase tracking-wider mb-1">
              Order Delivery Status
            </label>
            <select
              value={order.orderStatus}
              disabled={updating}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-[#F8F7F5] border border-[#EDE5E1] rounded-lg px-3 py-1.5 text-xs font-bold text-[#1A1512] focus:outline-none focus:border-[#6CAE14] cursor-pointer"
            >
              {orderStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Verification Quick Action */}
        <div className="flex items-center gap-2">
          {order.paymentStatus === 'PENDING_VERIFICATION' && (
            <>
              <button
                type="button"
                disabled={updating}
                onClick={() => handlePaymentAction('VERIFY')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify & Mark Paid</span>
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handlePaymentAction('REJECT')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Payment</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Items & Charges */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#EDE5E1] p-5 shadow-xs">
            <h2 className="text-sm font-bold text-[#1A1512] flex items-center gap-2 mb-4 pb-3 border-b border-[#EDE5E1]">
              <Package className="w-4 h-4 text-[#fd6b03]" />
              <span>Purchased Items ({order.items.length})</span>
            </h2>

            <div className="divide-y divide-[#F2EDEA]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.productImage || '/jawata-mart-logo.jpg'}
                      alt={item.productName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/jawata-mart-logo.jpg';
                      }}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F8F7F5] border border-[#EDE5E1] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1A1512] truncate">
                        {item.productName || 'Product Item'}
                      </p>
                      <p className="text-[11px] text-[#9B8A86]">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1A1512] shrink-0">
                    {formatPrice(item.total)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-5 pt-4 border-t border-[#EDE5E1] space-y-2 text-xs">
              <div className="flex justify-between text-[#6B5B58]">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B5B58]">
                <span>Delivery Charge ({order.deliveryZone || 'Standard'}):</span>
                <span>{formatPrice(order.deliveryCharge)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#6CAE14] font-semibold">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1A1512] pt-2 border-t border-[#EDE5E1]">
                <span>Total Amount:</span>
                <span className="text-base text-[#6CAE14]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Delivery Info */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-2xl border border-[#EDE5E1] p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#1A1512] flex items-center gap-2 pb-2 border-b border-[#EDE5E1]">
              <User className="w-4 h-4 text-[#fd6b03]" />
              <span>Customer Information</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-[#9B8A86] font-semibold uppercase block">Customer Name</span>
                <span className="text-[#1A1512] font-bold">{order.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#9B8A86] font-semibold uppercase block">Phone Number</span>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="text-[#6CAE14] font-semibold hover:underline"
                >
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div>
                  <span className="text-[10px] text-[#9B8A86] font-semibold uppercase block">Email</span>
                  <span className="text-[#1A1512]">{order.customerEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl border border-[#EDE5E1] p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[#1A1512] flex items-center gap-2 pb-2 border-b border-[#EDE5E1]">
              <MapPin className="w-4 h-4 text-[#6CAE14]" />
              <span>Shipping Destination</span>
            </h2>

            <div className="text-xs space-y-1.5 text-[#1A1512]">
              <p className="font-semibold">{order.address}</p>
              <p className="text-[#6B5B58]">
                {order.area ? `${order.area}, ` : ''}
                {order.district}, {order.division}
              </p>
              {order.deliveryNote && (
                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Note:</strong> {order.deliveryNote}
                </div>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-2xl border border-[#EDE5E1] p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[#1A1512] flex items-center gap-2 pb-2 border-b border-[#EDE5E1]">
              <CreditCard className="w-4 h-4 text-[#fd6b03]" />
              <span>Payment Details</span>
            </h2>

            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B5B58]">Method:</span>
                <span className="font-bold text-[#1A1512]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5B58]">Payment Status:</span>
                <span className="font-bold">{order.paymentStatus}</span>
              </div>
              {order.payments && order.payments.length > 0 && (
                <div className="pt-2 border-t border-[#EDE5E1] space-y-1 text-[11px]">
                  {order.payments.map((p, idx) => (
                    <div key={idx} className="bg-[#F8F7F5] p-2.5 rounded-lg space-y-0.5">
                      <p><strong>TrxID:</strong> {p.transactionId || 'N/A'}</p>
                      <p><strong>Sender:</strong> {p.senderNumber || 'N/A'}</p>
                      <p><strong>Amount:</strong> {formatPrice(p.amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
