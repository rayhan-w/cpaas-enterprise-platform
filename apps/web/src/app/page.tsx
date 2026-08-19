'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Radio,
  KeyRound,
  CreditCard,
  Users,
  ArrowUpRight,
  TrendingUp,
  Activity,
  FileSpreadsheet,
  Copy,
  Check,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    totalMessages: 6,
    delivered: 3,
    sent: 1,
    failed: 1,
    dndFiltered: 1,
    deliveryRate: 66.7,
    uiDispatched: 4,
    apiDispatched: 2,
    totalCostInr: 0.48,
  });

  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, logsData] = await Promise.all([
          fetchApi('/reports/stats').catch(() => null),
          fetchApi('/reports/messages?limit=6').catch(() => null),
        ]);

        if (statsData) setStats(statsData);
        if (logsData?.items) setRecentLogs(logsData.items);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Overview</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time messaging telemetry, DLT compliance metrics, and operator dispatch status.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/dashboard/developer-api"
            className="inline-flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium px-3 py-1.5 rounded-lg transition"
          >
            <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
            <span>API Keys</span>
          </Link>
          <Link
            href="/dashboard/campaigns"
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Campaign</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-xl p-4">
          <div className="text-[11px] font-medium text-zinc-400">Total Dispatched</div>
          <div className="text-2xl font-bold text-zinc-100 font-mono mt-1">
            {stats.totalMessages.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center space-x-1">
            <span>UI: {stats.uiDispatched}</span>
            <span>•</span>
            <span>API: {stats.apiDispatched}</span>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-xl p-4">
          <div className="text-[11px] font-medium text-zinc-400">Delivery Rate</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {stats.deliveryRate}%
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            {stats.delivered} delivered / {stats.sent} in transit
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-xl p-4">
          <div className="text-[11px] font-medium text-zinc-400">TRAI DND Filtered</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
            {stats.dndFiltered}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Credits refunded automatically
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/90 rounded-xl p-4">
          <div className="text-[11px] font-medium text-zinc-400">Total Burn (INR)</div>
          <div className="text-2xl font-bold text-zinc-100 font-mono mt-1">
            ₹{stats.totalCostInr.toFixed(2)}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Rate: ₹0.12 / SMS credit
          </div>
        </div>
      </div>

      {/* Operator Latency & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Telecom Operator Routing Health */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-200">Operator Gateway Status</h2>
              <p className="text-[11px] text-zinc-500">Live latency and throughput across Tier-1 Indian telco routes</p>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>All SMPP Links Active</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Bharti Airtel', latency: '38ms', status: 'Optimal', throughput: '1,500 TPS' },
              { name: 'Reliance Jio', latency: '42ms', status: 'Optimal', throughput: '2,200 TPS' },
              { name: 'Vodafone Idea', latency: '61ms', status: 'Good', throughput: '900 TPS' },
              { name: 'BSNL National', latency: '79ms', status: 'Active', throughput: '400 TPS' },
            ].map((op) => (
              <div key={op.name} className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <div className="text-[11px] font-medium text-zinc-400">{op.name}</div>
                <div className="text-base font-bold font-mono text-zinc-200 mt-1">{op.latency}</div>
                <div className="text-[10px] text-zinc-500 mt-1">{op.throughput}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Cards */}
        <div className="lg:col-span-1 bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-zinc-200">Quick Actions</h2>

          <div className="space-y-2">
            <Link
              href="/dashboard/campaigns"
              className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 transition group"
            >
              <div className="flex items-center space-x-2.5">
                <Send className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Send Bulk SMS</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
            </Link>

            <Link
              href="/dashboard/developer-api"
              className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 transition group"
            >
              <div className="flex items-center space-x-2.5">
                <KeyRound className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Create API Key</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
            </Link>

            <Link
              href="/dashboard/billing"
              className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 transition group"
            >
              <div className="flex items-center space-x-2.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Recharge Balance</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
            </Link>

            <Link
              href="/dashboard/contacts"
              className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 transition group"
            >
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-zinc-300 group-hover:text-zinc-100">Import Contacts</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Dispatches Stream Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Recent Message Dispatches</h2>
            <p className="text-[11px] text-zinc-500">Live stream of outbound transactional and promotional traffic</p>
          </div>
          <Link
            href="/dashboard/reports"
            className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 font-medium">Recipient</th>
                <th className="pb-2.5 font-medium">Message Content</th>
                <th className="pb-2.5 font-medium">Source</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5 font-medium">Cost</th>
                <th className="pb-2.5 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 font-mono">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-zinc-500 font-sans">
                    No recent message logs.
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/60 transition">
                    <td className="py-2.5 font-semibold text-zinc-200">+{log.recipient}</td>
                    <td className="py-2.5 text-zinc-300 font-sans truncate max-w-xs">{log.message}</td>
                    <td className="py-2.5 font-sans">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {log.source}
                      </span>
                    </td>
                    <td className="py-2.5 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        log.status === 'DELIVERED'
                          ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-400'
                          : log.status === 'SENT'
                          ? 'bg-blue-950/60 border border-blue-800/80 text-blue-400'
                          : log.status === 'DND_FILTERED'
                          ? 'bg-amber-950/60 border border-amber-800/80 text-amber-400'
                          : 'bg-rose-950/60 border border-rose-800/80 text-rose-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-zinc-400">₹{log.cost?.toFixed(2)}</td>
                    <td className="py-2.5 text-zinc-500 font-sans text-right text-[11px]">
                      {new Date(log.createdAt).toLocaleTimeString()}
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
