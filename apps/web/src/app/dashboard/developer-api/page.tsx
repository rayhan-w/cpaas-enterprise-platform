'use client';

import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Code2,
  CheckCircle2,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function DeveloperApiPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [permissions, setPermissions] = useState('sms:send,sms:read,reports:read');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');

  const loadKeys = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/api-keys');
      if (res) setApiKeys(res);
    } catch (err) {
      console.error('Failed to load keys:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeys();
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    try {
      const res = await fetchApi('/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: keyName, permissions }),
      });

      setNewlyCreatedKey(res);
      setKeyName('');
      loadKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to generate API Key');
    }
  };

  const handleRevokeKey = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke "${name}"? External applications using this token will fail immediately.`)) {
      return;
    }

    try {
      await fetchApi(`/api-keys/${id}`, { method: 'DELETE' });
      loadKeys();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-850">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">API Keys</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Authenticate external backend systems and microservices to send SMS via REST endpoints.
          </p>
        </div>

        <button
          onClick={() => {
            setNewlyCreatedKey(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create API Key</span>
        </button>
      </div>

      {/* Keys Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Active Keys</h2>
            <p className="text-[11px] text-zinc-500">Bearer tokens are hashed with SHA-256 at rest</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                <th className="pb-2.5 font-medium">Name</th>
                <th className="pb-2.5 font-medium">Key Prefix</th>
                <th className="pb-2.5 font-medium">Permissions</th>
                <th className="pb-2.5 font-medium">Status</th>
                <th className="pb-2.5 font-medium">Last Used</th>
                <th className="pb-2.5 font-medium">Created</th>
                <th className="pb-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 font-mono">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-500 font-sans">
                    No API keys created yet. Click &quot;Create API Key&quot; to generate your first token.
                  </td>
                </tr>
              ) : (
                apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-zinc-900/60 transition">
                    <td className="py-3 font-medium text-zinc-200 font-sans">{key.name}</td>
                    <td className="py-3 text-zinc-400">
                      <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[11px]">
                        {key.keyPrefix}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-400 font-sans">{key.permissions}</td>
                    <td className="py-3 font-sans">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        key.isActive
                          ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-400'
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${key.isActive ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                        <span>{key.isActive ? 'Active' : 'Revoked'}</span>
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500 font-sans">
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3 text-zinc-500 font-sans">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right font-sans">
                      {key.isActive && (
                        <button
                          onClick={() => handleRevokeKey(key.id, key.name)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 transition"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippets & API Reference */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Public REST API Documentation</span>
            </h2>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Endpoint: <code className="text-zinc-300 font-mono">POST http://localhost:4000/api/v1/sms/send</code>
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
            {(['curl', 'node', 'python'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition ${
                  activeTab === tab ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab === 'node' ? 'Node.js' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Code Box */}
        <div className="rounded-lg bg-zinc-950 border border-zinc-850 p-4 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed">
          {activeTab === 'curl' && (
            <pre>{`curl -X POST http://localhost:4000/api/v1/sms/send \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: cpaas_live_YOUR_KEY_HERE" \\
  -d '{
    "recipient": "919876543210",
    "sender_id": "TFISMS",
    "template_id": "140716158291028",
    "variables": ["Rahul", "849201"]
  }'`}</pre>
          )}

          {activeTab === 'node' && (
            <pre>{`import axios from 'axios';

const { data } = await axios.post(
  'http://localhost:4000/api/v1/sms/send',
  {
    recipient: '919876543210',
    sender_id: 'TFISMS',
    template_id: '140716158291028',
    variables: ['Rahul', '849201'],
  },
  {
    headers: { 'X-API-Key': 'cpaas_live_YOUR_KEY_HERE' },
  }
);

console.log('Dispatched message ID:', data.message_id);`}</pre>
          )}

          {activeTab === 'python' && (
            <pre>{`import requests

url = "http://localhost:4000/api/v1/sms/send"
headers = { "X-API-Key": "cpaas_live_YOUR_KEY_HERE" }
payload = {
    "recipient": "919876543210",
    "sender_id": "TFISMS",
    "template_id": "140716158291028",
    "variables": ["Rahul", "849201"]
}

res = requests.post(url, json=payload, headers=headers)
print(res.json())`}</pre>
          )}
        </div>
      </div>

      {/* Modal: Create Key */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-xl p-6 space-y-4 shadow-xl">
            {!newlyCreatedKey ? (
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">Create New API Key</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Use this token to authenticate external API calls</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Key Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production Shopify Webhook"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Permissions</label>
                  <select
                    value={permissions}
                    onChange={(e) => setPermissions(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="sms:send,sms:read,reports:read">Full Access (Send SMS + Read Logs)</option>
                    <option value="sms:send">Send Only (Restricted to /api/v1/sms/send)</option>
                    <option value="reports:read">Read-Only Analytics</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm"
                  >
                    Create Secret Key
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>API Key Created</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Copy this key now. It will not be shown again.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      readOnly
                      value={newlyCreatedKey.rawApiKey}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 font-mono text-xs text-zinc-200 focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey.rawApiKey)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 rounded-lg border border-zinc-700 transition"
                      title="Copy Key"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setNewlyCreatedKey(null);
                    }}
                    className="bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-medium px-3.5 py-1.5 rounded-lg border border-zinc-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
