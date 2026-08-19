'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  KeyRound,
  CreditCard,
  Send,
  UserCheck,
  RefreshCw,
  FileSpreadsheet,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function ActivityPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/reports/activity');
      if (res) setLogs(res);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/60 border border-blue-800/80 text-blue-400">LOGIN</span>;
      case 'WALLET_RECHARGE':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">RECHARGE</span>;
      case 'API_KEY_CREATED':
      case 'API_KEY_REVOKED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300">API KEY</span>;
      case 'CAMPAIGN_DISPATCHED':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 border border-purple-800/80 text-purple-400">DISPATCH</span>;
      case 'REPORT_EXPORT':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-800/80 text-cyan-400">EXPORT</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-400">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Audit Logs</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Immutable security audit trail of authentication events, wallet recharges, and API token modifications.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="inline-flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-lg transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-200">Security Events</h2>

        <div className="divide-y divide-zinc-800/50">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-sans">
              No activity logs recorded.
            </div>
          ) : (
            logs.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-start justify-between gap-4 hover:bg-zinc-900/40 transition px-2 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getActionBadge(item.action)}</div>
                  <div>
                    <div className="text-xs font-medium text-zinc-200">{item.details}</div>
                    <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                      IP: {item.ipAddress || '127.0.0.1'}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-zinc-500 font-sans whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
