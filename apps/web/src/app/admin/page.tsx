'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import {
  ClipboardList,
  ShieldCheck,
  FolderLock,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Loader2,
  X,
  ExternalLink,
  Calendar,
  AlertCircle,
  UserCheck,
  RotateCcw,
  Eye,
  FileText,
  Key,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

function AdminPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { user, loading: authLoading } = useAuth();

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Scopes & Requests Data
  const [scopes, setScopes] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Filtering states
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [featureFilter, setFeatureFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Review Modal State
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT' | 'REVOKE' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Role Protection
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        router.push('/unauthorized');
      }
    }
  }, [user, authLoading, router]);

  // Load Admin Data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, reqsRes, casesRes, auditRes] = await Promise.all([
        fetchApi('/admin/dashboard'),
        fetchApi('/access-requests'),
        fetchApi('/cases'),
        fetchApi('/admin/audit-logs'),
      ]);

      setMetrics(dashRes.metrics || {});
      setScopes(dashRes.scopes || []);
      setRequests(reqsRes.requests || []);
      setCases(casesRes.cases || []);
      setAuditLogs(auditRes.logs || []);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      loadAdminData();
    }
  }, [user]);

  // Handle Approval Submission
  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (!reviewNotes.trim()) {
      setActionError('Administrative review notes are mandatory.');
      return;
    }

    try {
      setActionLoading(true);
      setActionError('');
      await fetchApi(`/access-requests/${selectedRequest.id}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          notes: reviewNotes.trim(),
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });

      setActionSuccess('Access request approved successfully.');
      setTimeout(() => {
        setSelectedRequest(null);
        setReviewAction(null);
        setReviewNotes('');
        setExpiresAt('');
        setActionSuccess('');
      }, 1200);
      await loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Rejection Submission
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (!reviewNotes.trim()) {
      setActionError('Rejection reason is mandatory.');
      return;
    }

    try {
      setActionLoading(true);
      setActionError('');
      await fetchApi(`/access-requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        body: JSON.stringify({
          rejectionReason: reviewNotes.trim(),
        }),
      });

      setActionSuccess('Access request rejected.');
      setTimeout(() => {
        setSelectedRequest(null);
        setReviewAction(null);
        setReviewNotes('');
        setActionSuccess('');
      }, 1200);
      await loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to reject request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Immediate Revocation
  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    if (!reviewNotes.trim()) {
      setActionError('Revocation justification is mandatory.');
      return;
    }

    try {
      setActionLoading(true);
      setActionError('');
      await fetchApi(`/access-requests/${selectedRequest.id}/revoke`, {
        method: 'POST',
        body: JSON.stringify({
          revocationReason: reviewNotes.trim(),
        }),
      });

      setActionSuccess('Permission revoked with immediate effect.');
      setTimeout(() => {
        setSelectedRequest(null);
        setReviewAction(null);
        setReviewNotes('');
        setActionSuccess('');
      }, 1200);
      await loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to revoke access.');
    } finally {
      setActionLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesFeature = featureFilter === 'ALL' || r.featureKey === featureFilter;
    const matchesSearch =
      !searchQuery ||
      r.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.featureKey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.purpose?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesFeature && matchesSearch;
  });

  const activePermissions = requests.filter((r) => r.status === 'APPROVED');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Administrator Portal" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Administrator Approval Portal</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Delegated Operations
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Review and govern user feature access requests within your assigned administrative boundaries.
              </p>
            </div>

            {/* Scope Summary Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500 mr-1">Your Scopes:</span>
              {user?.role === 'SUPER_ADMIN' ? (
                <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  All Platform Features (Super Admin)
                </span>
              ) : scopes.length > 0 ? (
                scopes.map((s) => (
                  <span
                    key={s.featureKey}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {s.featureKey.replace('FEATURE_', '')}
                  </span>
                ))
              ) : (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  No Scopes Assigned
                </span>
              )}
            </div>
          </div>

          {/* Scoped Authority Notice */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              <strong>Delegated Authority Boundary:</strong> You can review, approve, and revoke access only for features matching your assigned administrative scopes. Backend authorization prevents actions outside your scope or role elevation.
            </p>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Requests</p>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{metrics?.pendingRequests ?? 0}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Awaiting your scope review</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Requests</p>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{metrics?.approvedRequests ?? 0}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Active within assigned scopes</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejected Requests</p>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                      <XCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{metrics?.rejectedRequests ?? 0}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Denied with mandatory notes</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Cases</p>
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <FolderLock className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{metrics?.assignedCases ?? 0}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Active investigations</p>
                </div>
              </div>

              {/* Quick Actions & Recent Queue */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Approvals Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Urgent Request Queue</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Requests pending administrative determination</p>
                    </div>
                    <Link
                      href="/admin?tab=requests"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {requests.filter((r) => r.status === 'PENDING').slice(0, 5).length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No pending requests in your assigned scopes.
                      </div>
                    ) : (
                      requests
                        .filter((r) => r.status === 'PENDING')
                        .slice(0, 5)
                        .map((req) => (
                          <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50/60 transition">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-900">{req.user?.name}</span>
                                <span className="text-[11px] text-slate-400">({req.user?.email})</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                                  {req.featureKey}
                                </span>
                                <span className="text-slate-500 truncate max-w-xs">{req.purpose}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedRequest(req);
                                setReviewAction('APPROVE');
                              }}
                              className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
                            >
                              Review
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Assigned Investigations Summary */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Assigned Cases</h2>
                      <p className="text-xs text-slate-500">Cases assigned to your supervision</p>
                    </div>
                    <Link
                      href="/admin?tab=cases"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      All Cases
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {cases.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">No cases currently assigned to you.</p>
                    ) : (
                      cases.slice(0, 4).map((c) => (
                        <Link
                          key={c.id}
                          href={`/dashboard/cases/${c.id}`}
                          className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition block space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">{c.caseNumber}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {c.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1">{c.title}</p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REQUESTS QUEUE */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Access Request Management</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Filter, inspect justifications, and decide on user access requests within assigned scopes.
                  </p>
                </div>
              </div>

              {/* Filters Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by user or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">Pending Only</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="REVOKED">Revoked</option>
                  </select>
                </div>

                <div>
                  <select
                    value={featureFilter}
                    onChange={(e) => setFeatureFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ALL">All Feature Scopes</option>
                    <option value="FEATURE_CAMERA">FEATURE_CAMERA</option>
                    <option value="FEATURE_LOCATION">FEATURE_LOCATION</option>
                    <option value="FEATURE_EXPORT">FEATURE_EXPORT</option>
                    <option value="FEATURE_INVESTIGATION">FEATURE_INVESTIGATION</option>
                    <option value="FEATURE_ANALYTICS_PRO">FEATURE_ANALYTICS_PRO</option>
                  </select>
                </div>
              </div>

              {/* Requests Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Requested Feature</th>
                      <th className="py-3 px-4">Purpose / Justification</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No access requests match the current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-900">{req.user?.name}</p>
                            <p className="text-[11px] text-slate-400">{req.user?.email}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {req.featureKey}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                            {req.purpose}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                req.status === 'APPROVED'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : req.status === 'PENDING'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : req.status === 'REJECTED'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {req.status === 'PENDING' ? (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setReviewAction('APPROVE');
                                    setReviewNotes('');
                                    setExpiresAt('');
                                  }}
                                  className="py-1 px-2.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRequest(req);
                                    setReviewAction('REJECT');
                                    setReviewNotes('');
                                  }}
                                  className="py-1 px-2.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200"
                                >
                                  Reject
                                </button>
                              </>
                            ) : req.status === 'APPROVED' ? (
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setReviewAction('REVOKE');
                                  setReviewNotes('');
                                }}
                                className="py-1 px-2.5 rounded bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700 font-semibold border border-slate-200 transition"
                              >
                                Revoke Access
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setReviewAction(null);
                                }}
                                className="py-1 px-2.5 rounded text-slate-500 hover:bg-slate-100 font-medium"
                              >
                                Details
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
          )}

          {/* TAB 3: ASSIGNED SCOPES */}
          {activeTab === 'scopes' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Administrative Delegations</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scopes configured and assigned to your account by the Super Admin owner.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {user?.role === 'SUPER_ADMIN' ? (
                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
                    <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                      <ShieldCheck className="w-5 h-5 text-purple-700" />
                      Platform Owner Authority
                    </div>
                    <p className="text-xs text-purple-700 leading-relaxed">
                      You are a Super Admin with unrestricted global authority over all platform features, users, and administrator scope assignments.
                    </p>
                  </div>
                ) : scopes.length === 0 ? (
                  <div className="col-span-full p-8 text-center text-slate-400 text-xs">
                    You currently have no administrative scopes assigned. Please contact the Super Admin.
                  </div>
                ) : (
                  scopes.map((s) => (
                    <div
                      key={s.featureKey}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {s.featureKey}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          Active Delegation
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span>Can Review & Approve:</span>
                          <span className={s.canApprove ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                            {s.canApprove ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Can Revoke:</span>
                          <span className={s.canRevoke ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                            {s.canRevoke ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNED CASES */}
          {activeTab === 'cases' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Assigned Investigation Cases</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Security incidents, fraud reports, and telemetry anomalies assigned to you.
                  </p>
                </div>
                <Link
                  href="/dashboard/cases"
                  className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                >
                  Create Case
                </Link>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Case #</th>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cases.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No investigation cases assigned to your account.
                        </td>
                      </tr>
                    ) : (
                      cases.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                            {c.caseNumber}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {c.title}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800'
                                  : c.priority === 'HIGH'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {c.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(c.updatedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              href={`/dashboard/cases/${c.id}`}
                              className="py-1 px-2.5 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-semibold transition"
                            >
                              Manage Case
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SCOPED AUDIT TRAIL */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Scoped Audit Trail</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Append-only immutable record of administrative actions taken by you or regarding your scoped features.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No audit trail records found for this scope.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {log.actorName} <span className="text-[10px] text-slate-400">({log.actorRole})</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {log.resourceType}
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                            {log.ipAddress}
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                            {log.details || '—'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* QUICK REVIEW / DECISION MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {reviewAction === 'APPROVE'
                    ? 'Approve Access Request'
                    : reviewAction === 'REJECT'
                    ? 'Reject Access Request'
                    : reviewAction === 'REVOKE'
                    ? 'Immediate Access Revocation'
                    : 'Request Review Details'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRequest.user?.name} &bull; {selectedRequest.user?.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setReviewAction(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Request Metadata Details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Requested Feature:</span>
                  <span className="font-mono font-bold text-indigo-700">{selectedRequest.featureKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Submission Timestamp:</span>
                  <span className="text-slate-700">{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                </div>
                <div className="space-y-1 pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-semibold">User Justification:</span>
                  <p className="text-slate-800 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    {selectedRequest.purpose}
                  </p>
                </div>
                {selectedRequest.decisionReason && (
                  <div className="space-y-1 pt-1 border-t border-slate-200/60">
                    <span className="text-slate-500 font-semibold">Previous Decision Reason:</span>
                    <p className="text-slate-800 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                      {selectedRequest.decisionReason}
                    </p>
                  </div>
                )}
              </div>

              {actionError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {actionSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* ACTION FORM: APPROVE */}
              {reviewAction === 'APPROVE' && (
                <form onSubmit={handleApprove} className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mandatory Administrative Review Notes <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Specify business rationale, verification checks conducted, or usage limits..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Optional Expiration Date
                    </label>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs bg-white"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Leave empty for indefinite access until manual administrative revocation.
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRequest(null);
                        setReviewAction(null);
                      }}
                      className="py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-1.5"
                    >
                      {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Confirm Approval
                    </button>
                  </div>
                </form>
              )}

              {/* ACTION FORM: REJECT */}
              {reviewAction === 'REJECT' && (
                <form onSubmit={handleReject} className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mandatory Rejection Reason <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Explain to the user why access cannot be granted at this time..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRequest(null);
                        setReviewAction(null);
                      }}
                      className="py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="py-2 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition flex items-center gap-1.5"
                    >
                      {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Confirm Rejection
                    </button>
                  </div>
                </form>
              )}

              {/* ACTION FORM: REVOKE */}
              {reviewAction === 'REVOKE' && (
                <form onSubmit={handleRevoke} className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                    <strong>Immediate Effect:</strong> Revoking access terminates the user&apos;s authorization instantly. Any backend API calls using this feature will be blocked immediately.
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Mandatory Revocation Justification <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Specify reason for revocation (e.g., project completed, policy violation)..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500 text-xs"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRequest(null);
                        setReviewAction(null);
                      }}
                      className="py-2 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="py-2 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition flex items-center gap-1.5"
                    >
                      {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Execute Immediate Revocation
                    </button>
                  </div>
                </form>
              )}

              {/* VIEW ONLY */}
              {!reviewAction && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="py-2 px-4 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-600" />
        </div>
      }
    >
      <AdminPortalContent />
    </Suspense>
  );
}
