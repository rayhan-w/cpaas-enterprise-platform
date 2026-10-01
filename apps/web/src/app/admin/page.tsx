'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Package,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/formatters';
import { OrderRecord } from '@/lib/types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/dashboard');
        const data = await res.json();
        setMetrics(data.metrics);
        setRecentOrders(data.recentOrders || []);
      } catch {
        // Handle gracefully
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-[#9B8A86]">Loading dashboard metrics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Dashboard Overview
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Real-time analytics for sales, pending bKash/Nagad payments, and warehouse dispatch.
          </p>
        </div>

        {metrics?.pendingPayments > 0 && (
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-2 bg-[#E2136E] hover:bg-[#B50057] text-white text-xs font-bold px-4 py-2.5 rounded-full transition-colors shadow-sm animate-pulse"
          >
            <CreditCard className="w-4 h-4" />
            <span>Verify {metrics.pendingPayments} Pending Payments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sales */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-elevation-1 space-y-2">
          <div className="flex items-center justify-between text-[#9B8A86]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF3E9] text-[#7A9C78] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1512]">
            {formatPrice(metrics?.totalSales || 0)}
          </p>
          <p className="text-[11px] text-[#7A9C78] font-semibold">
            Today: {formatPrice(metrics?.todaySales || 0)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-elevation-1 space-y-2">
          <div className="flex items-center justify-between text-[#9B8A86]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#F1F8E8] text-[#6CAE14] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1512]">{metrics?.totalOrders || 0}</p>
          <p className="text-[11px] text-[#6B5B58]">
            Pending Dispatch: <strong className="text-[#1A1512]">{metrics?.pendingOrders || 0}</strong>
          </p>
        </div>

        {/* Pending bKash / Nagad Payments */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-elevation-1 space-y-2">
          <div className="flex items-center justify-between text-[#9B8A86]">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Payments</span>
            <div className="w-8 h-8 rounded-xl bg-[#FFF8F0] text-[#F4821F] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#F4821F]">{metrics?.pendingPayments || 0}</p>
          <p className="text-[11px] text-[#6B5B58]">
            bKash: {metrics?.pendingBkash || 0} • Nagad: {metrics?.pendingNagad || 0}
          </p>
        </div>

        {/* Total Products & Low Stock */}
        <div className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-elevation-1 space-y-2">
          <div className="flex items-center justify-between text-[#9B8A86]">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-[#F8F7F5] text-[#1A1512] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1512]">{metrics?.totalProducts || 0}</p>
          <p className="text-[11px] text-[#D94040]">
            Low stock alerts: {metrics?.lowStockProducts || 0}
          </p>
        </div>
      </div>

      {/* Quick Excel Reports Download Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE5E1] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5D8] text-[#4E820E] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-[#6CAE14]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#1A1512]">
                Excel Reports & Data Exports (এক্সেল রিপোর্ট ডাউনলোড)
              </h2>
              <p className="text-[11px] text-[#6B5B58]">
                Download official formatted Excel spreadsheets for daily, weekly, and monthly store analytics.
              </p>
            </div>
          </div>
          <div className="text-[11px] text-[#9B8A86] font-semibold">
            UTF-8 BOM • Styled Green Headers
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Daily Orders Excel */}
          <a
            href="/api/admin/export?type=orders&period=daily&format=excel"
            download
            className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EDE5E1] hover:border-[#6CAE14] hover:bg-[#F1F8E8] transition-all group"
          >
            <div>
              <div className="text-[11px] font-bold text-[#1A1512] flex items-center gap-1.5">
                <span>⚡</span>
                <span>Daily Orders Excel</span>
              </div>
              <div className="text-[10px] text-[#6B5B58] mt-0.5">আজকের সকল অর্ডার (.xls)</div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white group-hover:bg-[#6CAE14] text-[#6B5B58] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
              <Download className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Weekly Orders Excel */}
          <a
            href="/api/admin/export?type=orders&period=weekly&format=excel"
            download
            className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EDE5E1] hover:border-[#6CAE14] hover:bg-[#F1F8E8] transition-all group"
          >
            <div>
              <div className="text-[11px] font-bold text-[#1A1512] flex items-center gap-1.5">
                <span>📅</span>
                <span>Weekly Orders Excel</span>
              </div>
              <div className="text-[10px] text-[#6B5B58] mt-0.5">বিগত ৭ দিনের রিপোর্ট (.xls)</div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white group-hover:bg-[#6CAE14] text-[#6B5B58] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
              <Download className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Monthly Orders Excel */}
          <a
            href="/api/admin/export?type=orders&period=monthly&format=excel"
            download
            className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EDE5E1] hover:border-[#6CAE14] hover:bg-[#F1F8E8] transition-all group"
          >
            <div>
              <div className="text-[11px] font-bold text-[#1A1512] flex items-center gap-1.5">
                <span>🗓️</span>
                <span>Monthly Orders Excel</span>
              </div>
              <div className="text-[10px] text-[#6B5B58] mt-0.5">চলতি মাসের রিপোর্ট (.xls)</div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white group-hover:bg-[#6CAE14] text-[#6B5B58] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
              <Download className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* Product Catalog & Stock Excel */}
          <a
            href="/api/admin/export?type=products&format=excel"
            download
            className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EDE5E1] hover:border-[#6CAE14] hover:bg-[#F1F8E8] transition-all group"
          >
            <div>
              <div className="text-[11px] font-bold text-[#1A1512] flex items-center gap-1.5">
                <span>📦</span>
                <span>Product Stock Excel</span>
              </div>
              <div className="text-[10px] text-[#6B5B58] mt-0.5">মজুদ ও মূল্য তালিকা (.xls)</div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white group-hover:bg-[#6CAE14] text-[#6B5B58] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
              <Download className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5E1] p-6 sm:p-8 shadow-elevation-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title text-xl text-[#1A1512]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#6CAE14] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F5] text-[#9B8A86] uppercase text-[10px] tracking-wider border-y border-[#EDE5E1]">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Delivery Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDEA]">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F1F8E8]/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1A1512]">{order.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-semibold text-[#1A1512]">{order.customerName}</p>
                    <p className="text-[10px] text-[#9B8A86]">{order.customerPhone}</p>
                  </td>
                  <td className="p-3 text-[#6B5B58]">{formatDate(order.createdAt)}</td>
                  <td className="p-3 font-bold text-[#1A1512]">{formatPrice(order.total)}</td>
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
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F8F7F5] text-[#1A1512] border border-[#EDE5E1]">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/track-order?orderId=${order.orderNumber}&phone=${order.customerPhone}`}
                      target="_blank"
                      className="text-[#6CAE14] hover:underline font-semibold text-[11px]"
                    >
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
