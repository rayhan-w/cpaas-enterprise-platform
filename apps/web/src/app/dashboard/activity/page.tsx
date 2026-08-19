'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  Key,
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

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'WALLET_RECHARGE':
        return <CreditCard className="w-4 h-4 text-purple-400" />;
      case 'API_KEY_CREATED':
      case 'API_KEY_REVOKED':
        return <Key className="w-4 h-4 text-blue-400" />;
      case 'CAMPAIGN_DISPATCHED':
        return <Send className="w-4 h-4 text-amber-400" />;
      case 'REPORT_EXPORT':
        return <FileSpreadsheet className="w-4 h-4 text-cyan-400" />;
      default:
        return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full mb-2">
            <History className="w-3.5 h-3.5" />
            <span>Audit & Compliance Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security & Activity Audit Logs</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Immutable log of all user authentication events, wallet recharges, API token creations, and telemetry exports.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* Activity Timeline List */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="text-base font-bold text-white">Recent Security & Operations Events</h2>

        <div className="space-y-3 pt-2">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs font-sans">
              No activity logs recorded.
            </div>
          ) : (
            logs.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 hover:border-gray-700 transition"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2 rounded-xl bg-gray-950 border border-gray-800 mt-0.5">
                    {getActionIcon(item.action)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white uppercase font-mono px-2 py-0.5 bg-gray-800 rounded">
                        {item.action}
                      </span>
                      <span className="text-xs text-gray-300 font-medium">{item.details}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] text-gray-400 mt-1">
                      <span>Source IP: <strong className="font-mono text-gray-300">{item.ipAddress || '127.0.0.1'}</strong></span>
                      <span>•</span>
                      <span>Status: <strong className="text-emerald-400">SUCCESS</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-gray-400 font-mono whitespace-nowrap">
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
