'use client';

import React, { useState, useEffect } from 'react';
import { Users, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { OrderRecord } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/formatters';

interface CustomerSummary {
  name: string;
  phone: string;
  email?: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data.orders || []);
      } catch {
        // Handle
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Aggregate customer records by phone number
  const customersMap: Record<string, CustomerSummary> = {};

  orders.forEach((o) => {
    const key = o.customerPhone.trim();
    if (!customersMap[key]) {
      customersMap[key] = {
        name: o.customerName,
        phone: o.customerPhone,
        email: o.customerEmail,
        address: `${o.address}, ${o.district}`,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: o.createdAt,
      };
    }

    customersMap[key].totalOrders += 1;
    if (o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED') {
      customersMap[key].totalSpent += o.total;
    }
    if (new Date(o.createdAt) > new Date(customersMap[key].lastOrderDate)) {
      customersMap[key].lastOrderDate = o.createdAt;
      customersMap[key].name = o.customerName; // most recent name
      customersMap[key].address = `${o.address}, ${o.district}`;
    }
  });

  const customers = Object.values(customersMap);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
          Customer Directory ({customers.length})
        </h1>
        <p className="text-xs text-[#6B5B58] mt-1">
          Aggregated guest profiles based on confirmed purchase and order delivery history.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#EDE5E1] p-6 sm:p-8 shadow-elevation-1">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#9B8A86]">Loading customer profiles...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9B8A86]">No customer orders recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F7F5] text-[#9B8A86] uppercase text-[10px] tracking-wider border-y border-[#EDE5E1]">
                <tr>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3">Mobile Contact</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Primary Delivery Address</th>
                  <th className="p-3">Total Orders</th>
                  <th className="p-3">Total Spent</th>
                  <th className="p-3 text-right">Last Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDEA]">
                {customers.map((c, i) => (
                  <tr key={i} className="hover:bg-[#F1F8E8]/40 transition-colors">
                    <td className="p-3 font-bold text-[#1A1512]">{c.name}</td>
                    <td className="p-3 font-mono font-semibold text-[#1A1512]">{c.phone}</td>
                    <td className="p-3 text-[#6B5B58]">{c.email || 'N/A'}</td>
                    <td className="p-3 text-[#6B5B58] max-w-xs truncate">{c.address}</td>
                    <td className="p-3 font-semibold text-[#1A1512]">
                      <span className="bg-[#F8F7F5] px-2 py-0.5 rounded-md border border-[#EDE5E1]">
                        {c.totalOrders} order(s)
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#6CAE14]">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="p-3 text-right text-[#6B5B58]">
                      {formatDate(c.lastOrderDate)}
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
