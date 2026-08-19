'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Smartphone,
  CheckCircle,
  FileCheck2,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  Zap,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CampaignsPage() {
  const [headers, setHeaders] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  // Form State
  const [campaignName, setCampaignName] = useState('Promotional Flash Broadcast');
  const [selectedHeaderId, setSelectedHeaderId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [audienceType, setAudienceType] = useState<'MANUAL' | 'GROUP' | 'CSV'>('MANUAL');
  const [manualPhone, setManualPhone] = useState('919876543210');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [customVariables, setCustomVariables] = useState<string[]>(['Customer', '982310']);
  const [isSending, setIsSending] = useState(false);
  const [resultSuccess, setResultSuccess] = useState<any | null>(null);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [h, t, g] = await Promise.all([
          fetchApi('/dlt/headers').catch(() => []),
          fetchApi('/dlt/templates').catch(() => []),
          fetchApi('/contacts/groups').catch(() => []),
        ]);
        if (h && h.length > 0) {
          setHeaders(h);
          setSelectedHeaderId(h[0].id);
        }
        if (t && t.length > 0) {
          setTemplates(t);
          setSelectedTemplateId(t[0].id);
        }
        if (g && g.length > 0) {
          setGroups(g);
          setSelectedGroupId(g[0].id);
        }
      } catch (err) {
        console.error('Failed to load campaign metadata:', err);
      }
    }
    loadMetadata();
  }, []);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const selectedHeader = headers.find((h) => h.id === selectedHeaderId);

  // Compute preview message
  let previewText = selectedTemplate?.content || 'Select a DLT Template to preview message text...';
  if (selectedTemplate?.content) {
    let temp = selectedTemplate.content;
    customVariables.forEach((v) => {
      temp = temp.replace(/\{#var#\}/, v || '{variable}');
    });
    previewText = temp;
  }

  const charCount = previewText.length;
  const segmentCount = Math.ceil(charCount / 160) || 1;

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHeaderId) {
      alert('Please select a DLT Sender ID');
      return;
    }

    try {
      setIsSending(true);
      setResultSuccess(null);

      let payload: any = {
        name: campaignName,
        senderId: selectedHeaderId,
        templateId: selectedTemplateId || undefined,
        messageType: audienceType === 'GROUP' ? 'GROUP_BROADCAST' : 'SEND_NOW',
      };

      if (audienceType === 'GROUP') {
        payload.groupId = selectedGroupId;
      } else {
        const phoneList = manualPhone.split(',').map((p) => p.trim()).filter(Boolean);
        payload.recipients = phoneList.map((p) => ({
          phoneNumber: p,
          variables: customVariables,
        }));
      }

      const res = await fetchApi('/sms/campaigns', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setResultSuccess(res);
    } catch (err: any) {
      alert(err.message || 'Campaign dispatch failed');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>High-Speed Telecom Dispatcher</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Create & Dispatch SMS Campaign</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          DLT approved template variable substitution, TRAI scrubbing, and instant multi-operator routing.
        </p>
      </div>

      {resultSuccess && (
        <div className="p-6 bg-emerald-950/80 border border-emerald-700/80 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Campaign Dispatched Successfully!</h3>
                <p className="text-xs text-emerald-200">
                  Targeted {resultSuccess.totalRecipients} recipients via Sender ID &quot;{resultSuccess.senderId}&quot;.
                </p>
              </div>
            </div>
            <button
              onClick={() => setResultSuccess(null)}
              className="text-xs text-emerald-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-emerald-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-900/50">
              <span className="text-emerald-300 block">Delivered</span>
              <strong className="text-white font-mono text-sm">{resultSuccess.summary?.delivered || 0}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-900/50">
              <span className="text-blue-300 block">Transit (Sent)</span>
              <strong className="text-white font-mono text-sm">{resultSuccess.summary?.sent || 0}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-900/50">
              <span className="text-amber-300 block">DND Filtered</span>
              <strong className="text-white font-mono text-sm">{resultSuccess.summary?.dndFiltered || 0}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-900/50">
              <span className="text-gray-300 block">Remaining Credits</span>
              <strong className="text-emerald-400 font-mono text-sm">{resultSuccess.remainingCredits}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Campaign Builder Grid */}
      <form onSubmit={handleDispatch} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Parameters (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Campaign Basics */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              <span>Campaign Information</span>
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Campaign Title</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">DLT Sender ID (Header)</label>
                <select
                  value={selectedHeaderId}
                  onChange={(e) => setSelectedHeaderId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono font-semibold"
                >
                  {headers.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.headerName} ({h.headerType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">DLT Content Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.templateName} ({t.templateIdCode})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Variable Values */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
              <span>Template Variables ({'{#var#}'})</span>
            </h2>

            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                Populate values for dynamic tags defined in the selected DLT template:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">{'{#var#}'} 1:</span>
                  <input
                    type="text"
                    value={customVariables[0] || ''}
                    onChange={(e) => {
                      const copy = [...customVariables];
                      copy[0] = e.target.value;
                      setCustomVariables(copy);
                    }}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Customer Name"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">{'{#var#}'} 2:</span>
                  <input
                    type="text"
                    value={customVariables[1] || ''}
                    onChange={(e) => {
                      const copy = [...customVariables];
                      copy[1] = e.target.value;
                      setCustomVariables(copy);
                    }}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. OTP or Discount Code"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Audience & Recipients */}
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
              <span>Target Audience</span>
            </h2>

            <div className="flex items-center space-x-2 p-1 bg-gray-900 border border-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => setAudienceType('MANUAL')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  audienceType === 'MANUAL' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Direct Numbers
              </button>
              <button
                type="button"
                onClick={() => setAudienceType('GROUP')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                  audienceType === 'GROUP' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Contact Group
              </button>
            </div>

            {audienceType === 'MANUAL' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Recipient Phone Number(s)</label>
                <textarea
                  rows={2}
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="Enter 10 or 12 digit numbers separated by commas (e.g. 919876543210, 919812345678)"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-gray-400 block">TRAI standard: Automatically formats to 91XXXXXXXXXX</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Select Contact Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g._count?.contacts || 0} Contacts)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Simulator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-5 sticky top-24">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Live Smartphone Preview</span>
            </h2>

            {/* Simulated Phone Chassis */}
            <div className="w-full max-w-[280px] mx-auto rounded-[32px] border-4 border-gray-800 bg-gray-950 p-4 shadow-2xl space-y-3">
              {/* Phone Speaker & Notch */}
              <div className="w-20 h-3 bg-gray-800 rounded-full mx-auto"></div>

              {/* Message Header */}
              <div className="text-center pb-2 border-b border-gray-900">
                <div className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">
                  {selectedHeader?.headerName || 'TFISMS'}
                </div>
                <div className="text-[9px] text-gray-400">TRAI Verified Sender ID</div>
              </div>

              {/* Message Bubble */}
              <div className="bg-blue-600/90 text-white rounded-2xl rounded-tl-none p-3.5 text-xs shadow-md space-y-1.5 leading-relaxed">
                <div>{previewText}</div>
                <div className="text-[9px] text-blue-200 text-right">Just now • SMS</div>
              </div>

              {/* Footer Phone Home Bar */}
              <div className="w-24 h-1 bg-gray-800 rounded-full mx-auto pt-1"></div>
            </div>

            {/* Campaign Metric Breakdown */}
            <div className="space-y-2 text-xs pt-3 border-t border-gray-800">
              <div className="flex justify-between text-gray-400">
                <span>Character Length:</span>
                <span className="text-white font-mono font-semibold">{charCount} Chars</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>SMS Segments:</span>
                <span className="text-white font-mono font-semibold">{segmentCount} Segment(s)</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated Credit Cost:</span>
                <span className="text-emerald-400 font-mono font-bold">1 SMS Credit / Recipient</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Campaign Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
