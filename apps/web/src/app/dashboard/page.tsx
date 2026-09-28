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
  Share2,
  Download,
  Globe,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, permissions } = useAuth();
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [preferredDomain, setPreferredDomain] = useState<'jawatamart' | 'current' | 'relative'>('jawatamart');

  // Create link modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);

  // Link Created Success Modal
  const [createdSuccessLink, setCreatedSuccessLink] = useState<any | null>(null);

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

  // Robust Clipboard Copy Function with Fallback
  const copyToClipboard = async (text: string, id: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
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
      const res = await fetchApi('/links', {
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

      // Show Success Modal with Full Tracking URL & QR Code
      if (res?.link) {
        const detailRes = await fetchApi(`/links/${res.link.id}`);
        setCreatedSuccessLink(detailRes?.link || res.link);
      }
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
  const currentOrigin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://mysterious-einstein-bljg3zfku-rayhan4.vercel.app';

  const getTrackingUrl = (slug: string, domainMode = preferredDomain) => {
    if (domainMode === 'jawatamart') return `https://www.jawatamart.com/r/${slug}`;
    if (domainMode === 'current') return `${currentOrigin}/r/${slug}`;
    return `/r/${slug}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="User Dashboard" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Top Welcome Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Welcome, {user.name}</h1>
              <p className="text-xs text-slate-500 mt-1">
                Generate tracking links, copy verified redirect URLs, and inspect privacy-friendly telemetry.
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
                className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create Tracking Link
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Active Links</span>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Link2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{activeLinks}</p>
              <p className="text-[11px] text-slate-400 mt-1">{links.length} total generated</p>
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
            <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your TrackOps Links</h2>
                <p className="text-xs text-slate-500">Click telemetry, custom domain copy links, and destination tracking</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadLinks}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition"
                >
                  Refresh Links
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Link
                </button>
              </div>
            </div>

            {/* Tracking Domain Selector Toolbar */}
            <div className="px-6 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>Preferred Tracking Domain:</span>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                <button
                  onClick={() => setPreferredDomain('jawatamart')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                    preferredDomain === 'jawatamart'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Use custom domain www.jawatamart.com"
                >
                  <span>🌐 www.jawatamart.com</span>
                </button>
                <button
                  onClick={() => setPreferredDomain('current')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                    preferredDomain === 'current'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Use current domain (Vercel)"
                >
                  <span>☁️ Vercel App Domain</span>
                </button>
                <button
                  onClick={() => setPreferredDomain('relative')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 ${
                    preferredDomain === 'relative'
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Use /r/slug path"
                >
                  <span>🔗 /r/ Short Path</span>
                </button>
              </div>
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
                  Create Tracking Link
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Tracking Link (ট্র্যাকিং লিংক & Copy)</th>
                      <th className="px-6 py-3">Destination / Target URL (আসল গন্তব্য)</th>
                      <th className="px-6 py-3">Clicks</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {links.map((link) => {
                      const activeTrackingUrl = getTrackingUrl(link.slug);
                      const jawataUrl = `https://www.jawatamart.com/r/${link.slug}`;
                      const relativePath = `/r/${link.slug}`;

                      return (
                        <tr key={link.id} className="hover:bg-slate-50/60 transition">
                          {/* Column 1: Link Title & Prominent Copy Bar */}
                          <td className="px-6 py-4 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{link.title}</span>
                              <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono text-slate-500">
                                /{link.slug}
                              </span>
                            </div>
                            
                            {/* Copyable Tracking URL Bar */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/90 space-y-1.5 max-w-md">
                              <div className="flex items-center justify-between text-[11px] font-mono text-indigo-700 font-semibold truncate bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                                <span className="truncate">{activeTrackingUrl}</span>
                              </div>

                              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                {/* Primary Big Copy Button */}
                                <button
                                  onClick={() => copyToClipboard(activeTrackingUrl, `main-${link.id}`)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition shadow-2xs ${
                                    copiedId === `main-${link.id}`
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                  }`}
                                  title="Copy this tracking link to share"
                                >
                                  {copiedId === `main-${link.id}` ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-white" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy Tracking Link</span>
                                    </>
                                  )}
                                </button>

                                {/* Quick Domain Switcher Copy Buttons */}
                                <button
                                  onClick={() => copyToClipboard(jawataUrl, `jawata-${link.id}`)}
                                  className={`px-2 py-1 rounded text-[11px] font-medium border transition ${
                                    copiedId === `jawata-${link.id}`
                                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                                  }`}
                                  title="Copy specifically with www.jawatamart.com domain"
                                >
                                  {copiedId === `jawata-${link.id}` ? '✓ Copied Domain' : '📋 jawatamart.com'}
                                </button>

                                <button
                                  onClick={() => copyToClipboard(relativePath, `path-${link.id}`)}
                                  className={`px-2 py-1 rounded text-[11px] font-mono border transition ${
                                    copiedId === `path-${link.id}`
                                      ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                                      : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600'
                                  }`}
                                  title="Copy /r/slug path only"
                                >
                                  {copiedId === `path-${link.id}` ? '✓ Copied' : '/r/slug'}
                                </button>

                                <a
                                  href={activeTrackingUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition border border-transparent hover:border-slate-200"
                                  title="Test Redirect in New Tab"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Destination URL */}
                          <td className="px-6 py-4 max-w-xs space-y-1.5">
                            <a
                              href={link.destinationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-700 hover:text-indigo-600 font-semibold truncate block text-xs underline decoration-slate-300 hover:decoration-indigo-500"
                              title={link.destinationUrl}
                            >
                              {link.destinationUrl}
                            </a>
                            <button
                              onClick={() => copyToClipboard(link.destinationUrl, `dest-${link.id}`)}
                              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition"
                              title="Copy original destination URL"
                            >
                              {copiedId === `dest-${link.id}` ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Copied Target URL
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <Copy className="w-3 h-3" /> Copy Target URL
                                </span>
                              )}
                            </button>
                          </td>

                          {/* Column 3: Clicks */}
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {link.visitCount || 0}
                          </td>

                          {/* Column 4: Status Toggle */}
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

                          {/* Column 5: Actions */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openQrCodeModal(link)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="View QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                              <Link
                                href={`/dashboard/analytics?linkId=${link.id}`}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="View Click Analytics"
                              >
                                <BarChart2 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
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

      {/* Modal 1: Create Short Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Tracking Short Link</h3>
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
                    onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                    placeholder="my-custom-slug"
                    className="w-full px-3 py-2 border border-slate-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  />
                </div>
                <div className="space-y-0.5 mt-1.5">
                  <p className="text-[11px] text-emerald-700 font-mono font-semibold">
                    Custom Domain: https://www.jawatamart.com/r/{customSlug || 'auto-slug'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Vercel Fallback: {currentOrigin}/r/{customSlug || 'auto-slug'}
                  </p>
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
                  className="py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Tracking Link Created Success Modal with Big Copy Buttons */}
      {createdSuccessLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">Tracking Link Ready!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your link was generated. Choose whether to copy with your custom domain or app domain.
              </p>
            </div>

            {/* Target / Destination URL Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Original Target URL (গন্তব্য লিংক)
                </span>
                <button
                  onClick={() => copyToClipboard(createdSuccessLink.destinationUrl, 'modal-dest')}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  {copiedId === 'modal-dest' ? '✓ Copied' : '📋 Copy Target'}
                </button>
              </div>
              <p className="text-xs text-slate-800 font-mono truncate">{createdSuccessLink.destinationUrl}</p>
            </div>

            {/* Custom Domain Tracking URL Box */}
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Primary Tracking URL (Custom Domain)
                </span>
              </div>
              <input
                type="text"
                readOnly
                value={`https://www.jawatamart.com/r/${createdSuccessLink.slug}`}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-emerald-800 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {/* Big Primary Copy Button */}
              <button
                onClick={() => copyToClipboard(`https://www.jawatamart.com/r/${createdSuccessLink.slug}`, 'modal-jawata')}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm ${
                  copiedId === 'modal-jawata'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {copiedId === 'modal-jawata' ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied jawatamart.com Tracking Link!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>📋 Copy Custom Domain Link (www.jawatamart.com)</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => copyToClipboard(`${currentOrigin}/r/${createdSuccessLink.slug}`, 'modal-vercel')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    copiedId === 'modal-vercel'
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === 'modal-vercel' ? '✓ Copied' : 'Copy Vercel Link'}</span>
                </button>

                <a
                  href={`https://www.jawatamart.com/r/${createdSuccessLink.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link</span>
                </a>
              </div>
            </div>

            {/* QR Code Preview */}
            {createdSuccessLink.qrCodeDataUrl && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-medium text-slate-500 block">Scan QR Code</span>
                <img
                  src={createdSuccessLink.qrCodeDataUrl}
                  alt="QR Code"
                  className="w-32 h-32 mx-auto border border-slate-200 rounded-lg p-1.5 bg-white shadow-xs"
                />
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setCreatedSuccessLink(null)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: QR Code Standalone Modal */}
      {qrModalLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">QR Code</h3>
              <button onClick={() => setQrModalLink(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-800">{qrModalLink.title}</p>
            <p className="text-[11px] font-mono text-emerald-700 font-semibold truncate">
              {`https://www.jawatamart.com/r/${qrModalLink.slug}`}
            </p>

            {qrModalLink.qrCodeDataUrl && (
              <img
                src={qrModalLink.qrCodeDataUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto border border-slate-200 rounded-xl p-2 bg-white"
              />
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(`https://www.jawatamart.com/r/${qrModalLink.slug}`, qrModalLink.id)}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {copiedId === qrModalLink.id ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === qrModalLink.id ? 'Copied jawatamart!' : 'Copy Link'}
              </button>

              <a
                href={qrModalLink.qrCodeDataUrl}
                download={`${qrModalLink.slug}-qr.png`}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
