'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function ReportsPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Filters
  const [status, setStatus] = useState<string>('ALL');
  const [source, setSource] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 20 });

  const loadReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status !== 'ALL') params.append('status', status);
      if (source !== 'ALL') params.append('source', source);
      if (search.trim()) params.append('search', search.trim());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', String(page));
      params.append('limit', '20');

      const res = await fetchApi(`/reports/messages?${params.toString()}`);
      if (res?.items) {
        setMessages(res.items);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [status, source, page]);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      if (status !== 'ALL') params.append('status', status);
      if (source !== 'ALL') params.append('source', source);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const token = typeof window !== 'undefined' ? localStorage.getItem('cpaas_auth_token') : '';
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${apiBase}/api/reports/export/csv?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `cpaas_sms_report_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Reports & Logs</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit message delivery logs, DND scrubbed records, and export data directly to CSV.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="inline-flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium px-3.5 py-2 rounded-lg transition disabled:opacity-50"
        >
          {isExporting ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="SENT">Sent / Transit</option>
              <option value="DND_FILTERED">DND Filtered</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
              Source
            </label>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Sources</option>
              <option value="UI">Portal Web UI</option>
              <option value="API">Developer REST API</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end space-x-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadReports()}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
                loadReports();
              }}
              className="bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-700 transition shrink-0"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-zinc-400">
            Showing <strong className="text-zinc-200">{messages.length}</strong> of{' '}
            <strong className="text-zinc-200">{pagination.total}</strong> logs
          </div>
          <button
            onClick={loadReports}
            className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 font-medium">Recipient</th>
                <th className="pb-2.5 font-medium">Message</th>
                <th className="pb-2.5 font-medium">Source</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5 font-medium">Cost</th>
                <th className="pb-2.5 font-medium">Details</th>
                <th className="pb-2.5 font-medium text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 font-mono">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 font-sans">
                    No message logs found.
                  </td>
                </tr>
              ) : (
                messages.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-900/60 transition">
                    <td className="py-2.5 font-medium text-zinc-200">+{log.recipient}</td>
                    <td className="py-2.5 text-zinc-300 font-sans max-w-sm truncate">{log.message}</td>
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
                    <td className="py-2.5 text-zinc-300">₹{log.cost.toFixed(2)}</td>
                    <td className="py-2.5 text-zinc-500 font-sans text-[11px] truncate max-w-xs">
                      {log.errorMessage || '—'}
                    </td>
                    <td className="py-2.5 text-zinc-500 font-sans text-[11px] text-right">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 text-xs text-zinc-300 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="text-xs text-zinc-500">
              Page <strong className="text-zinc-200">{page}</strong> of <strong className="text-zinc-200">{pagination.totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 text-xs text-zinc-300 hover:text-white disabled:opacity-50"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
