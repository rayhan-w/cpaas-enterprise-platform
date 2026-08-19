'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Building,
  Radio,
  FileCode,
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TRAI DLT Portal Regulation</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DLT Headers & Content Templates</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Register 6-character alphanumeric Sender IDs and approved message templates with variable tags.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setHeaderModal(true)}
            className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sender ID</span>
          </button>
          <button
            onClick={() => setTemplateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New DLT Template</span>
          </button>
        </div>
      </div>

      {/* DLT Sender IDs Section */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center justify-between">
          <span>Approved Sender IDs (DLT Headers)</span>
          <span className="text-xs text-gray-400 font-normal">{headers.length} Approved Headers</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {headers.map((h) => (
            <div
              key={h.id}
              className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
                  {h.headerName.substring(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-mono tracking-wider flex items-center space-x-1.5">
                    <span>{h.headerName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-gray-400">{h.headerType}</div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 border border-emerald-800 text-emerald-400">
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* DLT Templates Section */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center justify-between">
          <span>Registered DLT Content Templates</span>
          <span className="text-xs text-gray-400 font-normal">{templates.length} Active Templates</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Template Name</th>
                <th className="pb-3 font-semibold">DLT Template ID</th>
                <th className="pb-3 font-semibold">Header</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Content ({'{#var#}'})</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400 font-sans">
                    No DLT templates found.
                  </td>
                </tr>
              ) : (
                templates.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-900/40 transition">
                    <td className="py-3 font-semibold text-white font-sans">{t.templateName}</td>
                    <td className="py-3 text-blue-400">{t.templateIdCode}</td>
                    <td className="py-3 font-bold text-gray-200">{t.header?.headerName || 'TFISMS'}</td>
                    <td className="py-3 text-gray-400 font-sans">{t.templateType}</td>
                    <td className="py-3 text-gray-300 font-sans max-w-md truncate">{t.content}</td>
                    <td className="py-3 font-sans">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 border border-emerald-800 text-emerald-400">
                        APPROVED
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-gray-750 p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Register DLT Sender ID (Header)</h3>

            <form onSubmit={handleCreateHeader} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Sender ID (6 Chars)</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. TFISMS"
                  value={newHeaderName}
                  onChange={(e) => setNewHeaderName(e.target.value.toUpperCase())}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Header Category</label>
                <select
                  value={newHeaderType}
                  onChange={(e) => setNewHeaderType(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="TRANSACTIONAL">Transactional (OTP, Banking, Security)</option>
                  <option value="SERVICE_IMPLICIT">Service Implicit (Account updates, Invoices)</option>
                  <option value="SERVICE_EXPLICIT">Service Explicit (Consented alerts)</option>
                  <option value="PROMOTIONAL">Promotional (Discounts, Marketing)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setHeaderModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
                >
                  Register Header
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Template */}
      {templateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-gray-750 p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Register DLT Content Template</h3>

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Target Sender ID</label>
                <select
                  value={newTemplateHeaderId}
                  onChange={(e) => setNewTemplateHeaderId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono"
                >
                  {headers.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.headerName} ({h.headerType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">DLT Template ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 140716158291030"
                    value={newTemplateCode}
                    onChange={(e) => setNewTemplateCode(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Template Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Login OTP Alert"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-300">Template Content</label>
                  <button
                    type="button"
                    onClick={() => setNewTemplateContent((prev) => prev + '{#var#}')}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-mono font-semibold"
                  >
                    + Insert {'{#var#}'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  required
                  placeholder="Dear {#var#}, your transaction OTP is {#var#}. Valid 10m. - TFISMS"
                  value={newTemplateContent}
                  onChange={(e) => setNewTemplateContent(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setTemplateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow"
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
