'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import { ClipboardList, Clock, CheckCircle, XCircle, ShieldAlert, Plus, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/access-requests');
      if (res?.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filtered = requests.filter((r) => {
    if (filter === 'ALL') return true;
    return r.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit"><CheckCircle className="w-3.5 h-3.5" /> Approved</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1 w-fit"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'REVOKED':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-700 flex items-center gap-1 w-fit"><ShieldAlert className="w-3.5 h-3.5" /> Revoked</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="My Access Requests" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                Access Requests & Approvals
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Track status, review decisions, and verify permission validity across protected platform features.
              </p>
            </div>
            <Link
              href="/dashboard/features"
              className="py-2 px-4 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Request Feature Access
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'REVOKED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                  filter === st ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading requests...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <ClipboardList className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">No requests found</p>
                <p className="text-xs text-slate-500">You do not have any requests under the selected filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Requested Feature</th>
                      <th className="px-6 py-3">Stated Purpose</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Reviewer & Reason</th>
                      <th className="px-6 py-3">Expiration</th>
                      <th className="px-6 py-3 text-right">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {req.featureKey}
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-xs leading-relaxed">
                          {req.purpose}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(req.status)}
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          {req.reviewedByName ? (
                            <div>
                              <p className="font-semibold text-slate-800">{req.reviewedByName}</p>
                              {req.decisionReason && (
                                <p className="text-[11px] text-slate-500 mt-0.5">{req.decisionReason}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">Pending review</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {req.grantedExpiry ? new Date(req.grantedExpiry).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-400">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
