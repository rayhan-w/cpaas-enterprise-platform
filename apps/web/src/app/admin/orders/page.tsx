'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
} from 'lucide-react';
import { OrderRecord, OrderStatus, PaymentStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';

export default function AdminOrdersPage() {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');
      success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err: any) {
      error(err.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const orderStatuses = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Order Management
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Dispatch, track, and update fulfillment statuses for customer orders nationwide.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name or phone..."
            className="bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14] w-52"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] font-semibold"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5E1] p-6 sm:p-8 shadow-elevation-1 space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#9B8A86]">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9B8A86]">No orders match your filter criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F5] text-[#9B8A86] uppercase text-[10px] tracking-wider border-y border-[#EDE5E1]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer & Location</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Delivery Status</th>
                  <th className="p-3">Placed Date</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDEA]">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F1F8E8]/40 transition-colors">
                    {/* Order ID */}
                    <td className="p-3 font-mono font-bold text-[#1A1512]">
                      {order.orderNumber}
                    </td>

                    {/* Customer */}
                    <td className="p-3">
                      <p className="font-semibold text-[#1A1512]">{order.customerName}</p>
                      <p className="text-[10px] text-[#9B8A86]">
                        {order.customerPhone} • {order.district} ({order.deliveryZone === 'INSIDE_DHAKA' ? 'Dhaka' : 'Outside'})
                      </p>
                    </td>

                    {/* Items */}
                    <td className="p-3 text-[#6B5B58]">
                      {order.items.length} item(s)
                    </td>

                    {/* Total */}
                    <td className="p-3 font-bold text-[#1A1512]">
                      {formatPrice(order.total)}
                    </td>

                    {/* Payment Status */}
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-[#EAF3E9] text-[#7A9C78]'
                            : order.paymentStatus === 'REJECTED'
                            ? 'bg-[#FBDADA] text-[#D94040]'
                            : 'bg-[#FFF8F0] text-[#F4821F]'
                        }`}
                      >
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>

                    {/* Delivery Status Selector */}
                    <td className="p-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-[#F8F7F5] border border-[#EDE5E1] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                      >
                        {orderStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Date */}
                    <td className="p-3 text-[#6B5B58]">{formatDate(order.createdAt)}</td>

                    {/* Track Link */}
                    <td className="p-3 text-right">
                      <Link
                        href={`/track-order?orderId=${order.orderNumber}&phone=${order.customerPhone}`}
                        target="_blank"
                        className="text-[#6CAE14] hover:underline font-semibold text-[11px]"
                      >
                        Track View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
