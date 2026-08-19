'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  ShieldCheck,
  Terminal,
  Code2,
  AlertCircle,
  ExternalLink,
  Zap,
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
    if (!confirm(`Are you sure you want to revoke API key "${name}"? Any applications using this token will stop working immediately.`)) {
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
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2">
            <Key className="w-3.5 h-3.5" />
            <span>Developer REST API v1</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Developer API Token Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Create high-throughput API tokens to dispatch SMS programmatically from your SaaS, ERP, or backend systems.
          </p>
        </div>

        <button
          onClick={() => {
            setNewlyCreatedKey(null);
            setModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New API Key</span>
        </button>
      </div>

      {/* Security Info Card */}
      <div className="glass-panel p-4 rounded-xl border border-blue-800/40 bg-blue-950/20 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-gray-300">
          <strong className="text-white">Enterprise Security Standards:</strong> API Keys use SHA-256 cryptographic hashing at rest. Full raw tokens are only revealed <span className="underline text-blue-300">once</span> upon generation. Guarded with automatic rate-limiting and DLT compliance validation on every request.
        </div>
      </div>

      {/* Keys Table */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <h2 className="text-base font-bold text-white">Active Developer Keys</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Key Name</th>
                <th className="pb-3 font-semibold">Key Identifier</th>
                <th className="pb-3 font-semibold">Permissions</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Last Used</th>
                <th className="pb-3 font-semibold">Created Date</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 font-sans">
                    No developer API keys found. Click &quot;Generate New API Key&quot; to get started.
                  </td>
                </tr>
              ) : (
                apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-900/40 transition">
                    <td className="py-3.5 font-semibold text-white font-sans">{key.name}</td>
                    <td className="py-3.5 text-blue-400 bg-gray-900/80 px-2.5 py-1 rounded inline-block my-1 border border-gray-800">
                      {key.keyPrefix}
                    </td>
                    <td className="py-3.5 text-gray-400 font-sans">{key.permissions}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        key.isActive
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                          : 'bg-rose-950 border border-rose-800 text-rose-400'
                      }`}>
                        {key.isActive ? 'ACTIVE' : 'REVOKED'}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-400 font-sans">
                      {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3.5 text-gray-400 font-sans">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right font-sans">
                      {key.isActive ? (
                        <button
                          onClick={() => handleRevokeKey(key.id, key.name)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 transition"
                          title="Revoke Token"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Integration & Docs Section */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Public REST API Integration Guide</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Target endpoint: <code className="text-emerald-400 bg-gray-900 px-2 py-0.5 rounded font-mono">POST http://localhost:4000/api/v1/sms/send</code>
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-gray-900 border border-gray-800 p-1 rounded-xl">
            {(['curl', 'node', 'python'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab === 'node' ? 'Node.js / TS' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="relative rounded-xl bg-gray-950 border border-gray-800 p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          {activeTab === 'curl' && (
            <pre>{`curl -X POST http://localhost:4000/api/v1/sms/send \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: cpaas_live_YOUR_TOKEN_HERE" \\
  -d '{
    "recipient": "919876543210",
    "sender_id": "TFISMS",
    "template_id": "140716158291028",
    "variables": ["Rahul", "849201"]
  }'`}</pre>
          )}

          {activeTab === 'node' && (
            <pre>{`import axios from 'axios';

async function dispatchSms() {
  const response = await axios.post(
    'http://localhost:4000/api/v1/sms/send',
    {
      recipient: '919876543210',
      sender_id: 'TFISMS',
      template_id: '140716158291028',
      variables: ['Rahul', '849201'],
    },
    {
      headers: {
        'X-API-Key': 'cpaas_live_YOUR_TOKEN_HERE',
      },
    }
  );

  console.log('Message Dispatched:', response.data);
}

dispatchSms();`}</pre>
          )}

          {activeTab === 'python' && (
            <pre>{`import requests

url = "http://localhost:4000/api/v1/sms/send"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "cpaas_live_YOUR_TOKEN_HERE"
}
payload = {
    "recipient": "919876543210",
    "sender_id": "TFISMS",
    "template_id": "140716158291028",
    "variables": ["Rahul", "849201"]
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}</pre>
          )}
        </div>
      </div>

      {/* Modal: Generate API Key */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-gray-750 p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            {!newlyCreatedKey ? (
              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Generate Developer API Key</h3>
                    <p className="text-xs text-gray-400">Create a secure bearer token for external API calls</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Key Name / Application Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production Shopify Webhook or ERP Backend"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Scope Permissions</label>
                  <select
                    value={permissions}
                    onChange={(e) => setPermissions(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="sms:send,sms:read,reports:read">Full Access (Send SMS + Read Logs + Reports)</option>
                    <option value="sms:send">Send Only (Restricted to POST /api/v1/sms/send)</option>
                    <option value="reports:read">Read-Only Analytics</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Create Token</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-200">
                    <strong className="text-white block font-bold">API Key Generated Successfully!</strong>
                    Make sure to copy your secret key now. For your security, you will not be able to see it again.
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Your Raw API Secret Token:</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={newlyCreatedKey.rawApiKey}
                      className="w-full bg-gray-900 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 font-mono text-xs text-emerald-300 focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(newlyCreatedKey.rawApiKey)}
                      className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow transition shrink-0"
                      title="Copy Key"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copiedKey && <span className="text-[11px] text-emerald-400 font-semibold">Copied to clipboard!</span>}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setNewlyCreatedKey(null);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
                  >
                    Done & Close
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
