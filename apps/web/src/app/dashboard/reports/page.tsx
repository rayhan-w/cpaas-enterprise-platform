'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Filter,
  Download,
  Search,
  Calendar,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
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
      const url = `http://localhost:4000/api/reports/export/csv?${params.toString()}`;

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Telemetry & Logs</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Campaign & API Message Reports</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Audit message delivery logs, DND filtering records, carrier latencies, and export data directly to CSV.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={isExporting}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition disabled:opacity-50"
        >
          {isExporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>Export to CSV / Excel</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Delivery Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="SENT">Sent / Operator Transit</option>
              <option value="DND_FILTERED">DND Filtered</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Dispatch Source
            </label>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Sources</option>
              <option value="UI">Portal Web UI</option>
              <option value="API">Developer REST API</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Search Input & Button */}
          <div className="flex items-end space-x-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search phone or text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadReports()}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
                loadReports();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shrink-0"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Showing <strong className="text-white">{messages.length}</strong> of{' '}
            <strong className="text-white">{pagination.total}</strong> total logs
          </div>
          <button
            onClick={loadReports}
            className="text-xs text-blue-400 hover:underline flex items-center space-x-1"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Table</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Recipient MSISDN</th>
                <th className="pb-3 font-semibold">Dispatched Content</th>
                <th className="pb-3 font-semibold">Source</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Cost (INR)</th>
                <th className="pb-3 font-semibold">Error / DND Details</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-sans">
                    No message logs found matching the selected filters.
                  </td>
                </tr>
              ) : (
                messages.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-900/40 transition">
                    <td className="py-3.5 font-bold text-white">+{log.recipient}</td>
                    <td className="py-3.5 text-gray-300 font-sans max-w-sm truncate">{log.message}</td>
                    <td className="py-3.5 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.source === 'API' ? 'bg-purple-900/60 text-purple-300' : 'bg-blue-900/60 text-blue-300'
                      }`}>
                        {log.source}
                      </span>
                    </td>
                    <td className="py-3.5 font-sans">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
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
                    <td className="py-3.5 text-gray-200 font-semibold">₹{log.cost.toFixed(2)}</td>
                    <td className="py-3.5 text-gray-400 font-sans text-[11px] truncate max-w-xs">
                      {log.errorMessage || '—'}
                    </td>
                    <td className="py-3.5 text-gray-400 font-sans text-[11px]">
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
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-gray-300 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span className="text-xs text-gray-400">
              Page <strong className="text-white">{page}</strong> of <strong className="text-white">{pagination.totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-gray-300 hover:text-white disabled:opacity-50"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
