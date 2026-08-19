'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function DltPage() {
  const [headers, setHeaders] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [headerModal, setHeaderModal] = useState(false);
  const [templateModal, setTemplateModal] = useState(false);

  // Form states
  const [newHeaderName, setNewHeaderName] = useState('');
  const [newHeaderType, setNewHeaderType] = useState('TRANSACTIONAL');

  const [newTemplateHeaderId, setNewTemplateHeaderId] = useState('');
  const [newTemplateCode, setNewTemplateCode] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateType, setNewTemplateType] = useState('TRANSACTIONAL');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [h, t] = await Promise.all([
        fetchApi('/dlt/headers').catch(() => []),
        fetchApi('/dlt/templates').catch(() => []),
      ]);
      if (h) {
        setHeaders(h);
        if (h.length > 0 && !newTemplateHeaderId) {
          setNewTemplateHeaderId(h[0].id);
        }
      }
      if (t) setTemplates(t);
    } catch (err) {
      console.error('Failed to load DLT data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeaderName.trim()) return;

    try {
      await fetchApi('/dlt/headers', {
        method: 'POST',
        body: JSON.stringify({
          headerName: newHeaderName.toUpperCase().trim(),
          headerType: newHeaderType,
        }),
      });

      setNewHeaderName('');
      setHeaderModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create header');
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim() || !newTemplateCode.trim() || !newTemplateContent.trim()) return;

    try {
      await fetchApi('/dlt/templates', {
        method: 'POST',
        body: JSON.stringify({
          headerId: newTemplateHeaderId,
          templateIdCode: newTemplateCode.trim(),
          templateName: newTemplateName.trim(),
          templateType: newTemplateType,
          content: newTemplateContent.trim(),
        }),
      });

      setNewTemplateName('');
      setNewTemplateCode('');
      setNewTemplateContent('');
      setTemplateModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create template');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">DLT Headers & Templates</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage TRAI approved 6-character alphanumeric Sender IDs and registered content templates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setHeaderModal(true)}
            className="inline-flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sender ID</span>
          </button>
          <button
            onClick={() => setTemplateModal(true)}
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Headers Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-200">Registered Sender IDs (DLT Headers)</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {headers.map((h) => (
            <div
              key={h.id}
              className="p-3 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-mono font-bold text-xs">
                  {h.headerName.substring(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-200 font-mono flex items-center space-x-1">
                    <span>{h.headerName}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  </div>
                  <div className="text-[10px] text-zinc-500">{h.headerType}</div>
                </div>
              </div>

              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-zinc-200">Registered Content Templates</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-850 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 font-medium">Template Name</th>
                <th className="pb-2.5 font-medium">DLT Template ID</th>
                <th className="pb-2.5 font-medium">Header</th>
                <th className="pb-2.5 font-medium">Type</th>
                <th className="pb-2.5 font-medium">Content</th>
                <th className="pb-2.5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 font-mono">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-zinc-500 font-sans">
                    No DLT templates found.
                  </td>
                </tr>
              ) : (
                templates.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-900/60 transition">
                    <td className="py-2.5 font-medium text-zinc-200 font-sans">{t.templateName}</td>
                    <td className="py-2.5 text-zinc-400">{t.templateIdCode}</td>
                    <td className="py-2.5 font-bold text-zinc-300">{t.header?.headerName || 'TFISMS'}</td>
                    <td className="py-2.5 text-zinc-500 font-sans">{t.templateType}</td>
                    <td className="py-2.5 text-zinc-300 font-sans max-w-md truncate">{t.content}</td>
                    <td className="py-2.5 font-sans text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Sender ID */}
      {headerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-zinc-100">Register Sender ID (Header)</h3>

            <form onSubmit={handleCreateHeader} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Sender ID (6 Alphanumeric Characters)</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. TFISMS"
                  value={newHeaderName}
                  onChange={(e) => setNewHeaderName(e.target.value.toUpperCase())}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono uppercase text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Category</label>
                <select
                  value={newHeaderType}
                  onChange={(e) => setNewHeaderType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="TRANSACTIONAL">Transactional (OTP, Security, Banking)</option>
                  <option value="SERVICE_IMPLICIT">Service Implicit (Invoices, Alerts)</option>
                  <option value="SERVICE_EXPLICIT">Service Explicit (Consented alerts)</option>
                  <option value="PROMOTIONAL">Promotional (Offers, Marketing)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setHeaderModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Template */}
      {templateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-semibold text-zinc-100">Register Content Template</h3>

            <form onSubmit={handleCreateTemplate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Sender ID</label>
                <select
                  value={newTemplateHeaderId}
                  onChange={(e) => setNewTemplateHeaderId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100"
                >
                  {headers.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.headerName} ({h.headerType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">DLT Template ID</label>
                  <input
                    type="text"
                    required
                    placeholder="140716158291030"
                    value={newTemplateCode}
                    onChange={(e) => setNewTemplateCode(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Login Alert"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-300">Template Content</label>
                  <button
                    type="button"
                    onClick={() => setNewTemplateContent((prev) => prev + '{#var#}')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-mono"
                  >
                    + Add {'{#var#}'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Dear {#var#}, your OTP is {#var#}. Valid 10m. - TFISMS"
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setTemplateModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
