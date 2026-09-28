'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import {
  FolderLock,
  ArrowLeft,
  Plus,
  Shield,
  FileText,
  Clock,
  CheckCircle,
  FileCheck,
  Send,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  // Evidence Modal
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [evidenceType, setEvidenceType] = useState('TELEMETRY');
  const [submittingEvidence, setSubmittingEvidence] = useState(false);

  const loadCase = async () => {
    try {
      setLoading(true);
      const res = await fetchApi(`/cases/${id}`);
      if (res?.case) {
        setCaseData(res.case);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await fetchApi(`/cases/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      await loadCase();
    } catch (err: any) {
      alert(err.message || 'Failed to update case status.');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setAddingNote(true);
    try {
      await fetchApi(`/cases/${id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ content: newNote.trim() }),
      });
      setNewNote('');
      await loadCase();
    } catch (err: any) {
      alert(err.message || 'Failed to add case note.');
    } finally {
      setAddingNote(false);
    }
  };

  const handleAttachEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingEvidence(true);

    try {
      await fetchApi(`/cases/${id}/evidence`, {
        method: 'POST',
        body: JSON.stringify({
          title: evidenceTitle,
          description: evidenceDesc,
          evidenceType,
        }),
      });

      setShowEvidenceModal(false);
      setEvidenceTitle('');
      setEvidenceDesc('');
      await loadCase();
    } catch (err: any) {
      alert(err.message || 'Failed to attach evidence.');
    } finally {
      setSubmittingEvidence(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-slate-50 p-12 text-center text-xs text-slate-500">
        Investigation case not found or unauthorized.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title={`Case ${caseData.caseNumber}`} />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/dashboard/cases"
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Cases
              </Link>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100">
                  {caseData.caseNumber}
                </span>
                <h1 className="text-xl font-bold text-slate-900">{caseData.title}</h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Created by {caseData.creator?.name || 'Administrator'} · Priority:{' '}
                <span className="font-semibold text-slate-700">{caseData.priority}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={caseData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs font-semibold py-2 px-3 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="OPEN">Status: OPEN</option>
                <option value="IN_PROGRESS">Status: IN PROGRESS</option>
                <option value="UNDER_REVIEW">Status: UNDER REVIEW</option>
                <option value="CLOSED">Status: CLOSED</option>
                <option value="ARCHIVED">Status: ARCHIVED</option>
              </select>

              <button
                onClick={() => setShowEvidenceModal(true)}
                className="py-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Attach Evidence
              </button>
            </div>
          </div>

          {/* Description & Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Incident Scope & Objective</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{caseData.description}</p>
          </div>

          {/* Main Grid: Notes & Evidence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Evidence Records & Chain of Custody */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  Attached Evidence Records ({caseData.evidence?.length || 0})
                </h3>
              </div>

              {caseData.evidence?.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No evidence attached yet.</p>
              ) : (
                <div className="space-y-3">
                  {caseData.evidence.map((ev: any) => {
                    let custody = [];
                    try {
                      custody = JSON.parse(ev.chainOfCustody || '[]');
                    } catch {}

                    return (
                      <div key={ev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{ev.title}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-700 font-bold rounded">
                            {ev.evidenceType}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{ev.description}</p>

                        <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[10px] text-slate-500 break-all">
                          SHA-256: {ev.fileHash}
                        </div>

                        {custody.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase">
                              Chain of Custody:
                            </span>
                            <div className="mt-1 space-y-1">
                              {custody.map((c: any, i: number) => (
                                <div key={i} className="text-[10px] text-slate-500 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span>
                                    {c.action} by {c.actorName || c.actor} ({c.actorRole})
                                  </span>
                                  <span className="text-slate-400">
                                    {new Date(c.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Case Notes & Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Investigation Activity & Notes
                  </h3>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {caseData.notes?.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No notes recorded yet.</p>
                  ) : (
                    caseData.notes.map((note: any) => (
                      <div key={note.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-800">{note.authorName}</span>
                          <span className="text-slate-400">
                            {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="pt-4 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  required
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record an investigation update or note..."
                  className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={addingNote}
                  className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                >
                  {addingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Add
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Attach Evidence Modal */}
      {showEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Attach Cryptographic Evidence</h3>
              <button onClick={() => setShowEvidenceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAttachEvidence} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence Title</label>
                <input
                  type="text"
                  required
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                  placeholder="e.g. Header Analysis Log from Reported Domain"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence Type</label>
                <select
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="TELEMETRY">Telemetry Log</option>
                  <option value="LOG_EXTRACT">Server Log Extract</option>
                  <option value="DOCUMENT">Compliance Document</option>
                  <option value="SCREENSHOT">Visual Screenshot</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidence Description & Details</label>
                <textarea
                  required
                  rows={4}
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  placeholder="Include context, acquisition methodology, and technical description..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEvidenceModal(false)}
                  className="py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEvidence}
                  className="py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5"
                >
                  {submittingEvidence ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Record Evidence'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
