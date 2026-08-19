'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Send,
  CheckCircle,
  AlertTriangle,
  Radio,
  Key,
  CreditCard,
  Users,
  ArrowUpRight,
  TrendingUp,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>({
    totalMessages: 12450,
    delivered: 12100,
    sent: 250,
    failed: 45,
    dndFiltered: 55,
    deliveryRate: 99.2,
    uiDispatched: 8200,
    apiDispatched: 4250,
    totalCostInr: 1494.00,
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
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 border border-blue-800/40 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>High-Speed Telecom SMPP Cluster Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Enterprise CPaaS Control Center
            </h1>
            <p className="text-gray-300 text-sm mt-1 max-w-2xl">
              Monitor multi-operator telecom routing, DLT scrubbing, developer API consumption, and automated wallet balances.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/campaigns"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch SMS</span>
            </Link>
            <Link
              href="/dashboard/developer-api"
              className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition"
            >
              <Key className="w-4 h-4 text-blue-400" />
              <span>API Tokens</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Dispatches</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">{stats.totalMessages.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-emerald-400 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Delivery Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.deliveryRate}%</div>
            <div className="text-xs text-gray-400 mt-1">
              {stats.delivered.toLocaleString()} delivered successfully
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">TRAI DND Scrubbed</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-400 font-mono">{stats.dndFiltered}</div>
            <div className="text-xs text-gray-400 mt-1">100% saved without credit waste</div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Consumed (INR)</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white font-mono">₹{stats.totalCostInr.toFixed(2)}</div>
            <div className="text-xs text-gray-400 mt-1">Tier 1 Enterprise Rate: ₹0.12/SMS</div>
          </div>
        </div>
      </div>

      {/* Quick Launch & Telco Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Hub */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>Platform Action Hub</span>
          </h2>

          <div className="space-y-2.5">
            <Link
              href="/dashboard/campaigns"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800/80 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-white">Create SMS Campaign</div>
                  <div className="text-xs text-gray-400">DLT variable mapping & CSV dispatch</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </Link>

            <Link
              href="/dashboard/developer-api"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800/80 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-white">Developer API Key</div>
                  <div className="text-xs text-gray-400">POST /api/v1/sms/send integration</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </Link>

            <Link
              href="/dashboard/billing"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800/80 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-white">Recharge Wallet</div>
                  <div className="text-xs text-gray-400">Razorpay & PhonePe instant gateway</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </Link>

            <Link
              href="/dashboard/contacts"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-800/80 transition group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-200 group-hover:text-white">Contact Phonebooks</div>
                  <div className="text-xs text-gray-400">Manage VIP lists & CSV imports</div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </Link>
          </div>
        </div>

        {/* Live Operator Gateway Latency & Throughput */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Telecom Gateway Health & Latency</h2>
              <p className="text-xs text-gray-400">Dynamic failover across primary Indian telco operators</p>
            </div>
            <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full font-mono font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Gateways Nominal</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { name: 'Bharti Airtel', status: 'Optimal', latency: '42ms', tps: '1,500 TPS', color: 'emerald' },
              { name: 'Reliance Jio', status: 'Optimal', latency: '38ms', tps: '2,200 TPS', color: 'emerald' },
              { name: 'Vodafone Idea', status: 'Good', latency: '65ms', tps: '900 TPS', color: 'blue' },
              { name: 'BSNL National', status: 'Active', latency: '82ms', tps: '400 TPS', color: 'amber' },
            ].map((op) => (
              <div key={op.name} className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800 space-y-2">
                <div className="text-xs font-bold text-gray-200">{op.name}</div>
                <div className="text-lg font-mono font-bold text-white">{op.latency}</div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-800/80 pt-1.5">
                  <span>{op.tps}</span>
                  <span className={`text-${op.color}-400 font-medium`}>{op.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
            <span>TRAI Header & DLT Template Validation: <strong className="text-gray-200">100% Enforced</strong></span>
            <Link href="/dashboard/reports" className="text-blue-400 hover:underline flex items-center space-x-1">
              <span>View Full Dispatch Telemetry</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Dispatches Stream */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Live Dispatched Messages Stream</h2>
            <p className="text-xs text-gray-400">Real-time status updates across UI campaigns and developer API calls</p>
          </div>
          <Link
            href="/dashboard/reports"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Open Detailed Reports</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Recipient</th>
                <th className="pb-3 font-semibold">Message Preview</th>
                <th className="pb-3 font-semibold">Source</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Cost</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {recentLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400 font-sans">
                    No recent message dispatches recorded yet.
                  </td>
                </tr>
              ) : (
                recentLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-900/40 transition">
                    <td className="py-3 font-semibold text-white">+{log.recipient}</td>
                    <td className="py-3 text-gray-300 font-sans truncate max-w-xs">{log.message}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.source === 'API' ? 'bg-purple-900/60 text-purple-300' : 'bg-blue-900/60 text-blue-300'
                      }`}>
                        {log.source}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.status === 'DELIVERED'
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                          : log.status === 'SENT'
                          ? 'bg-blue-950 border border-blue-800 text-blue-400'
                          : log.status === 'DND_FILTERED'
                          ? 'bg-amber-950 border border-amber-800 text-amber-400'
                          : 'bg-rose-950 border border-rose-800 text-rose-400'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">₹{log.cost?.toFixed(2)}</td>
                    <td className="py-3 text-gray-400 font-sans text-[11px]">
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
