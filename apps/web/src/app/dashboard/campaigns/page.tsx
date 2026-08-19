'use client';

import React, { useState, useEffect } from 'react';
import {
  Send,
  Smartphone,
  CheckCircle2,
  Users,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CampaignsPage() {
  const [headers, setHeaders] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);

  // Form State
  const [campaignName, setCampaignName] = useState('Transactional OTP Broadcast');
  const [selectedHeaderId, setSelectedHeaderId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [audienceType, setAudienceType] = useState<'MANUAL' | 'GROUP'>('MANUAL');
  const [manualPhone, setManualPhone] = useState('919876543210');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [customVariables, setCustomVariables] = useState<string[]>(['Rahul', '849201']);
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
      temp = temp.replace(/\{#var#\}/, v || '{var}');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-zinc-850">
        <h1 className="text-xl font-bold text-zinc-100 tracking-tight">Create Campaign</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Dispatch DLT-compliant bulk SMS with dynamic variable placeholders and real-time carrier delivery.
        </p>
      </div>

      {resultSuccess && (
        <div className="p-4 bg-zinc-900 border border-emerald-800/80 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">Campaign Dispatched Successfully</h3>
                <p className="text-[11px] text-zinc-400">
                  Processed {resultSuccess.totalRecipients} recipients via Sender ID &quot;{resultSuccess.senderId}&quot;.
                </p>
              </div>
            </div>
            <button
              onClick={() => setResultSuccess(null)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-800 text-xs font-mono">
            <div className="p-2 bg-zinc-950 rounded border border-zinc-850">
              <span className="text-[10px] text-zinc-500 block font-sans">Delivered</span>
              <strong className="text-emerald-400">{resultSuccess.summary?.delivered || 0}</strong>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-850">
              <span className="text-[10px] text-zinc-500 block font-sans">In Transit</span>
              <strong className="text-blue-400">{resultSuccess.summary?.sent || 0}</strong>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-850">
              <span className="text-[10px] text-zinc-500 block font-sans">DND Scrubbed</span>
              <strong className="text-amber-400">{resultSuccess.summary?.dndFiltered || 0}</strong>
            </div>
            <div className="p-2 bg-zinc-950 rounded border border-zinc-850">
              <span className="text-[10px] text-zinc-500 block font-sans">Remaining Credits</span>
              <strong className="text-zinc-200">{resultSuccess.remainingCredits}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleDispatch} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Section 1 */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3.5">
            <h2 className="text-sm font-semibold text-zinc-200">1. Campaign Details</h2>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Campaign Name</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Sender ID (DLT Header)</label>
                <select
                  value={selectedHeaderId}
                  onChange={(e) => setSelectedHeaderId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono font-medium text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  {headers.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.headerName} ({h.headerType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">DLT Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.templateName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Template Variables */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-200">2. Template Variables</h2>
            <p className="text-[11px] text-zinc-500">Substituted into dynamic {'{#var#}'} tags:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-zinc-400">{'{#var#}'} 1:</span>
                <input
                  type="text"
                  value={customVariables[0] || ''}
                  onChange={(e) => {
                    const copy = [...customVariables];
                    copy[0] = e.target.value;
                    setCustomVariables(copy);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Rahul"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-zinc-400">{'{#var#}'} 2:</span>
                <input
                  type="text"
                  value={customVariables[1] || ''}
                  onChange={(e) => {
                    const copy = [...customVariables];
                    copy[1] = e.target.value;
                    setCustomVariables(copy);
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 849201"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Audience */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-zinc-200">3. Recipients</h2>

            <div className="flex items-center space-x-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setAudienceType('MANUAL')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
                  audienceType === 'MANUAL' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Direct Numbers
              </button>
              <button
                type="button"
                onClick={() => setAudienceType('GROUP')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
                  audienceType === 'GROUP' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Contact Group
              </button>
            </div>

            {audienceType === 'MANUAL' ? (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Phone Number(s)</label>
                <textarea
                  rows={2}
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="e.g. 919876543210, 919812345678"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Select Group</label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
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

        {/* Right Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4 sticky top-20">
            <h2 className="text-sm font-semibold text-zinc-200 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-zinc-400" />
              <span>Message Preview</span>
            </h2>

            {/* Clean Phone Simulation Frame */}
            <div className="w-full max-w-[270px] mx-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-3.5 space-y-3 shadow-inner">
              <div className="text-center pb-2 border-b border-zinc-850">
                <div className="text-xs font-mono font-bold text-zinc-200">
                  {selectedHeader?.headerName || 'TFISMS'}
                </div>
                <div className="text-[10px] text-zinc-500">TRAI DLT Verified</div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-xl rounded-tl-none p-3 text-xs leading-relaxed space-y-1">
                <p>{previewText}</p>
                <div className="text-[9px] text-zinc-500 text-right font-mono">SMS • Just now</div>
              </div>
            </div>

            {/* Telemetry info */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-zinc-800">
              <div className="flex justify-between text-zinc-400">
                <span>Characters:</span>
                <span className="font-mono text-zinc-200">{charCount}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>SMS Segments:</span>
                <span className="font-mono text-zinc-200">{segmentCount}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Cost:</span>
                <span className="font-mono text-emerald-400 font-medium">1 Credit / SMS</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
