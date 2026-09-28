'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import {
  Link2,
  Plus,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Trash2,
  BarChart2,
  ShieldCheck,
  Key,
  FolderLock,
  Loader2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, permissions } = useAuth();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create link modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  // QR Code Modal
  const [qrModalLink, setQrModalLink] = useState<any | null>(null);

  const loadLinks = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/links');
      if (res?.links) {
        setLinks(res.links);
      }
    } catch (err) {
      console.error('Failed to load links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadLinks();
      }
    }
  }, [user, authLoading]);

  const handleCopy = (slug: string, id: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/r/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = async (link: any) => {
    try {
      await fetchApi(`/links/${link.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !link.isActive }),
      });
      setLinks((prev) =>
        prev.map((l) => (l.id === link.id ? { ...l, isActive: !l.isActive } : l))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update link status.');
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this short link?')) return;
    try {
      await fetchApi(`/links/${id}`, { method: 'DELETE' });
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete link.');
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    try {
      await fetchApi('/links', {
        method: 'POST',
        body: JSON.stringify({
          title,
          destinationUrl,
          customSlug: customSlug || undefined,
        }),
      });

      setShowCreateModal(false);
      setTitle('');
      setDestinationUrl('');
      setCustomSlug('');
      await loadLinks();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create link.');
    } finally {
      setCreating(false);
    }
  };

  const openQrCodeModal = async (link: any) => {
    try {
      const res = await fetchApi(`/links/${link.id}`);
      if (res?.link) {
        setQrModalLink(res.link);
      }
    } catch {
      alert('Could not generate QR code.');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  const totalVisits = links.reduce((acc, l) => acc + (l.visitCount || 0), 0);
  const activeLinks = links.filter((l) => l.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="User Dashboard" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Welcome, {user.name}</h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage your verified links, review privacy-friendly telemetry, and request access to protected features.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/features"
                className="py-2 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                Feature Catalog
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="py-2 px-4 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Short Link
              </button>
            </div>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Total Links</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Link2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{links.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">{activeLinks} active links running</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Total Clicks Recorded</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <BarChart2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{totalVisits}</p>
              <p className="text-[11px] text-slate-400 mt-1">Privacy-friendly hashed telemetry</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Approved Features</span>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{permissions.length}</p>
              <p className="text-[11px] text-slate-400 mt-1">Authorized access rights</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Security Clearance</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2 capitalize">{user.role.toLowerCase()}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Account Active</p>
            </div>
          </div>

          {/* Links Management Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your TrackOps Links</h2>
                <p className="text-xs text-slate-500">Click telemetry, QR codes, and safe redirect destinations</p>
              </div>
              <button
                onClick={loadLinks}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading links...</div>
            ) : links.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Link2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">No links created yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create your first short link with privacy-compliant visitor analytics and safe redirect controls.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 py-2 px-4 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
                >
                  Create Short Link
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Link Title & Slug</th>
                      <th className="px-6 py-3">Destination URL</th>
                      <th className="px-6 py-3">Clicks</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {links.map((link) => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const fullUrl = `${origin}/r/${link.slug}`;

                      return (
                        <tr key={link.id} className="hover:bg-slate-50/60 transition">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{link.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[11px] text-indigo-600">/r/{link.slug}</span>
                              <button
                                onClick={() => handleCopy(link.slug, link.id)}
                                className="p-1 text-slate-400 hover:text-slate-700 transition"
                                title="Copy Short URL"
                              >
                                {copiedId === link.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="px-6 py-4 max-w-xs">
                            <a
                              href={link.destinationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-600 hover:text-indigo-600 truncate block text-xs"
                              title={link.destinationUrl}
                            >
                              {link.destinationUrl}
                            </a>
                          </td>

                          <td className="px-6 py-4 font-semibold text-slate-800">
                            {link.visitCount || 0}
                          </td>

                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleActive(link)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                                link.isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {link.isActive ? 'Active' : 'Disabled'}
                            </button>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openQrCodeModal(link)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                title="View QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              <Link
                                href={`/dashboard/analytics?linkId=${link.id}`}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                title="View Analytics"
                              >
                                <BarChart2 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Delete Link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Short Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Short Link</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateLink} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Security Briefing"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination URL (HTTP/HTTPS)</label>
                <input
                  type="url"
                  required
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://example.com/target-document"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Validated against Open Redirects, dangerous protocols, and private network SSRF.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Custom Slug (Optional)</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-500 text-xs font-mono">
                    /r/
                  </span>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="my-custom-slug"
                    className="w-full px-3 py-2 border border-slate-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  />
                </div>
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
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">QR Code</h3>
              <button onClick={() => setQrModalLink(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-medium text-slate-800">{qrModalLink.title}</p>
            <p className="text-[11px] font-mono text-indigo-600 truncate">{qrModalLink.redirectUrl}</p>

            {qrModalLink.qrCodeDataUrl && (
              <img
                src={qrModalLink.qrCodeDataUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto border border-slate-200 rounded-xl p-2 bg-white"
              />
            )}

            <div className="pt-2">
              <a
                href={qrModalLink.qrCodeDataUrl}
                download={`${qrModalLink.slug}-qr.png`}
                className="inline-block w-full py-2 px-4 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Download QR Code
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
