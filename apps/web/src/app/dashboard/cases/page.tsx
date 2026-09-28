'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { FolderLock, Plus, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CasesPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Case Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const loadCases = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/cases');
      if (res?.cases) {
        setCases(res.cases);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    try {
      await fetchApi('/cases', {
        method: 'POST',
        body: JSON.stringify({ title, description, priority }),
      });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      await loadCases();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create case. Permission required.');
    } finally {
      setCreating(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">Critical</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">High</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">Low</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Investigation Cases" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-indigo-600" />
                Investigation Case Management
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Collaborative incident tracking, evidence collection, and cryptographic chain-of-custody logging.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="py-2 px-4 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Open New Case
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading cases...</div>
            ) : cases.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <FolderLock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">No active cases assigned</p>
                <p className="text-xs text-slate-500">You currently have no open or assigned investigation cases.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Case ID & Title</th>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Evidence</th>
                      <th className="px-6 py-3">Creator / Lead</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-6 py-4">
                          <span className="font-mono text-[11px] text-indigo-600 font-bold block">
                            {c.caseNumber}
                          </span>
                          <p className="font-semibold text-slate-900 mt-0.5">{c.title}</p>
                        </td>
                        <td className="px-6 py-4">{getPriorityBadge(c.priority)}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {c._count?.evidence || 0} records
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {c.creator?.name || 'Platform Admin'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/dashboard/cases/${c.id}`}
                            className="py-1.5 px-3 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded text-xs font-semibold inline-flex items-center gap-1 transition"
                          >
                            Open Details <ArrowRight className="w-3 h-3" />
                          </Link>
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

      {/* Create Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Create Investigation Case
            </h3>

            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Investigation of reported phishing redirect on short link"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed incident summary and scope of investigation..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
