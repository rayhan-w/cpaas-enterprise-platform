'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import {
  Users,
  ShieldCheck,
  Key,
  ClipboardList,
  Link2,
  BarChart3,
  FolderLock,
  Activity,
  Settings,
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Power,
  RotateCcw,
  Search,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

function SuperAdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  const { user, loading: authLoading } = useAuth();

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [linksList, setLinksList] = useState<any[]>([]);
  const [casesList, setCasesList] = useState<any[]>([]);

  // Modals & Action States
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    name: '',
    email: '',
    password: '',
    scopes: ['FEATURE_CAMERA', 'FEATURE_LOCATION', 'FEATURE_EXPORT', 'FEATURE_ANALYTICS_PRO'],
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // 1. Strict Role Authorization
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'SUPER_ADMIN') {
        router.push('/unauthorized');
      } else {
        loadData();
      }
    }
  }, [user, authLoading, activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load main metrics
      const resMetrics = await fetchApi('/super-admin/dashboard');
      if (resMetrics?.metrics) {
        setMetrics(resMetrics.metrics);
      }

      // Load tab-specific data
      if (activeTab === 'users' || activeTab === 'admins') {
        const u = await fetchApi('/super-admin/users');
        if (u?.users) setUsersList(u.users);
      } else if (activeTab === 'requests' || activeTab === 'permissions') {
        const r = await fetchApi('/access-requests');
        if (r?.requests) setRequestsList(r.requests);
      } else if (activeTab === 'audit') {
        const a = await fetchApi('/super-admin/audit-logs');
        if (a?.logs) setAuditLogs(a.logs);
      } else if (activeTab === 'settings') {
        const s = await fetchApi('/super-admin/settings');
        if (s?.settings) {
          const mapped: any = {};
          s.settings.forEach((item: any) => {
            mapped[item.key] = item.value;
          });
          setSettings(mapped);
        }
      } else if (activeTab === 'links') {
        const l = await fetchApi('/links');
        if (l?.links) setLinksList(l.links);
      } else if (activeTab === 'cases') {
        const c = await fetchApi('/cases');
        if (c?.cases) setCasesList(c.cases);
      }
    } catch (err) {
      console.error('Super Admin Data Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status toggle handler
  const handleUserStatusChange = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const reason = nextStatus === 'SUSPENDED' ? prompt('Reason for suspension:') : null;
    if (nextStatus === 'SUSPENDED' && !reason) return;

    try {
      await fetchApi(`/super-admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus, reason }),
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status.');
    }
  };

  // Role change handler
  const handleUserRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Change role to ${newRole}? User sessions will be immediately invalidated.`)) return;

    try {
      await fetchApi(`/super-admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  // Create Admin handler
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/super-admin/admins', {
        method: 'POST',
        body: JSON.stringify(newAdminData),
      });
      setShowCreateAdminModal(false);
      setNewAdminData({
        name: '',
        email: '',
        password: '',
        scopes: ['FEATURE_CAMERA', 'FEATURE_LOCATION', 'FEATURE_EXPORT', 'FEATURE_ANALYTICS_PRO'],
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create administrator.');
    }
  };

  // Approval override handler
  const handleApproveRequest = async (requestId: string) => {
    const decisionReason = prompt('Approval reason/justification:', 'Approved via Super Admin Platform Owner Override');
    if (!decisionReason) return;

    try {
      await fetchApi(`/access-requests/${requestId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ decisionReason, expiresInDays: 60 }),
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to approve request.');
    }
  };

  // Revocation handler
  const handleRevokeRequest = async (requestId: string) => {
    const revocationReason = prompt('Reason for immediate revocation:', 'Permission revoked by Super Admin.');
    if (!revocationReason) return;

    try {
      await fetchApi(`/access-requests/${requestId}/revoke`, {
        method: 'POST',
        body: JSON.stringify({ revocationReason }),
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke permission.');
    }
  };

  // Save settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess('');

    try {
      await fetchApi('/super-admin/settings', {
        method: 'PATCH',
        body: JSON.stringify({ settings }),
      });
      setSettingsSuccess('Platform settings updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-purple-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Platform Owner
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Super Admin Control Console</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global management: users, administrator scopes, permission center, audit trail, and system configuration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/super-admin?tab=requests"
            className="py-2 px-3 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition border border-purple-200"
          >
            Review Pending Requests ({metrics?.pendingRequests || 0})
          </Link>
          <button
            onClick={() => setShowCreateAdminModal(true)}
            className="py-2 px-4 text-xs font-semibold rounded-lg bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Appoint Administrator
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Users</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.totalUsers || 0}</p>
          <p className="text-[10px] text-emerald-600 font-medium">{metrics?.activeUsers || 0} active</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Suspended</span>
          <p className="text-xl font-bold text-rose-600 mt-1">{metrics?.suspendedUsers || 0}</p>
          <p className="text-[10px] text-slate-400">Locked accounts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Administrators</span>
          <p className="text-xl font-bold text-blue-600 mt-1">{metrics?.totalAdmins || 0}</p>
          <p className="text-[10px] text-slate-400">Approval managers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Pending Requests</span>
          <p className="text-xl font-bold text-amber-600 mt-1">{metrics?.pendingRequests || 0}</p>
          <p className="text-[10px] text-slate-400">Awaiting decision</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Links</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{metrics?.activeLinks || 0}</p>
          <p className="text-[10px] text-slate-400">{metrics?.totalEvents || 0} clicks logged</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Active Cases</span>
          <p className="text-xl font-bold text-purple-600 mt-1">{metrics?.activeCases || 0}</p>
          <p className="text-[10px] text-slate-400">Under investigation</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-1 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'overview', label: 'Overview & Audit', icon: Activity },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'admins', label: 'Admin Scopes', icon: ShieldCheck },
          { key: 'permissions', label: 'Permission Center', icon: Key },
          { key: 'requests', label: 'Approval Oversight', icon: ClipboardList },
          { key: 'links', label: 'Platform Links', icon: Link2 },
          { key: 'cases', label: 'Investigations', icon: FolderLock },
          { key: 'audit', label: 'Complete Audit Trail', icon: Activity },
          { key: 'settings', label: 'System Settings', icon: Settings },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <Link
              key={t.key}
              href={`/super-admin?tab=${t.key}`}
              className={`py-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-purple-600 text-purple-900 bg-purple-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </Link>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-600" />
              Recent High-Assurance Platform Security Events
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-2.5">Timestamp</th>
                    <th className="px-4 py-2.5">Actor</th>
                    <th className="px-4 py-2.5">Role</th>
                    <th className="px-4 py-2.5">Action</th>
                    <th className="px-4 py-2.5">Resource</th>
                    <th className="px-4 py-2.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(metrics?.recentAuditLogs || []).map((l: any) => (
                    <tr key={l.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleDateString()} {new Date(l.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{l.actorName}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {l.actorRole}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700">{l.action}</td>
                      <td className="px-4 py-3 text-slate-600">{l.resourceType}</td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                        {l.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">All Registered Accounts</h3>
              <p className="text-xs text-slate-500">Manage user roles, enforce account suspensions, and monitor feature authorizations.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Name & Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Approved Features</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => {
                  const isSuperAdmin = u.role === 'SUPER_ADMIN';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        {isSuperAdmin ? (
                          <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-100 text-purple-800">
                            Super Admin (Owner)
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                            className="text-xs py-1 px-2 border border-slate-200 rounded-lg bg-white"
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 font-medium">
                        {u.featurePermissions?.filter((p: any) => p.status === 'APPROVED').length || 0} features
                      </td>

                      <td className="px-4 py-3.5 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        {!isSuperAdmin && (
                          <button
                            onClick={() => handleUserStatusChange(u.id, u.status)}
                            className={`py-1 px-2.5 rounded text-xs font-semibold transition ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Admin Scopes */}
      {activeTab === 'admins' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Administrator Approval Authorities & Scopes</h3>
              <p className="text-xs text-slate-500">
                Administrators can only approve requests for features explicitly granted below.
              </p>
            </div>
            <button
              onClick={() => setShowCreateAdminModal(true)}
              className="py-2 px-3.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Appoint Administrator
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Administrator</th>
                  <th className="px-4 py-3">Assigned Approval Scopes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList
                  .filter((u) => u.role === 'ADMIN')
                  .map((adm) => (
                    <tr key={adm.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-900">{adm.name}</p>
                        <p className="text-[11px] text-slate-400">{adm.email}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {adm.adminScopes?.length === 0 ? (
                            <span className="text-slate-400 italic">No scopes assigned (cannot approve features)</span>
                          ) : (
                            adm.adminScopes?.map((sc: any) => (
                              <span
                                key={sc.featureKey}
                                className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded text-[10px] font-bold"
                              >
                                {sc.featureKey}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {adm.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={async () => {
                            const newScopes = prompt(
                              'Update scopes (comma-separated: FEATURE_CAMERA,FEATURE_LOCATION,FEATURE_EXPORT,FEATURE_ANALYTICS_PRO,FEATURE_INVESTIGATION):',
                              adm.adminScopes?.map((s: any) => s.featureKey).join(',')
                            );
                            if (newScopes !== null) {
                              const scopesArr = newScopes.split(',').map((s) => s.trim()).filter(Boolean);
                              await fetchApi(`/super-admin/admins/${adm.id}/permissions`, {
                                method: 'PATCH',
                                body: JSON.stringify({ scopes: scopesArr }),
                              });
                              await loadData();
                            }
                          }}
                          className="py-1 px-3 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold text-xs transition"
                        >
                          Edit Scopes
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Permission Center */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Permission Management Center</h3>
              <p className="text-xs text-slate-500">
                Default-deny enforcement. View granted authorizations and execute immediate backend revocations.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Approver</th>
                  <th className="px-4 py-3">Expiration Date</th>
                  <th className="px-4 py-3 text-right">Owner Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requestsList.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{req.user?.name}</p>
                      <p className="text-[11px] text-slate-400">{req.user?.email}</p>
                    </td>

                    <td className="px-4 py-3.5 font-bold text-indigo-600 font-mono">
                      {req.featureKey}
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : req.status === 'REVOKED'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-slate-600">
                      {req.reviewedByName || '—'}
                    </td>

                    <td className="px-4 py-3.5 text-slate-400">
                      {req.grantedExpiry ? new Date(req.grantedExpiry).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {req.status === 'APPROVED' ? (
                        <button
                          onClick={() => handleRevokeRequest(req.id)}
                          className="py-1 px-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-semibold text-xs transition"
                        >
                          Immediate Revoke
                        </button>
                      ) : req.status === 'PENDING' ? (
                        <button
                          onClick={() => handleApproveRequest(req.id)}
                          className="py-1 px-2.5 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded font-semibold text-xs transition"
                        >
                          Owner Approve
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Approval Oversight */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Access Requests Approval Oversight</h3>
              <p className="text-xs text-slate-500">Super Admin authority over all platform access requests.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Stated Purpose</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requestsList.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-900">{req.user?.name}</p>
                      <p className="text-[11px] text-slate-400">{req.user?.email}</p>
                    </td>
                    <td className="px-4 py-3.5 font-bold font-mono text-indigo-600">{req.featureKey}</td>
                    <td className="px-4 py-3.5 text-slate-600 max-w-sm leading-relaxed">{req.purpose}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {req.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(req.id)}
                            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              const decisionReason = prompt('Rejection reason:', 'Rejected by platform owner.');
                              if (decisionReason) {
                                await fetchApi(`/access-requests/${req.id}/reject`, {
                                  method: 'POST',
                                  body: JSON.stringify({ decisionReason }),
                                });
                                await loadData();
                              }
                            }}
                            className="py-1 px-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 font-semibold transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {req.status === 'APPROVED' && (
                        <button
                          onClick={() => handleRevokeRequest(req.id)}
                          className="py-1 px-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 font-semibold transition"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Complete Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Platform-Wide Certified Audit Logs</h3>
              <p className="text-xs text-slate-500">Immutable chronological record of logins, role edits, approvals, and overrides.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString()} {new Date(l.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{l.actorName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {l.actorRole}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">{l.action}</td>
                    <td className="px-4 py-3 text-slate-600">{l.resourceType}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-sm truncate font-mono text-[11px]">
                      {l.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 9: System Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Platform-Wide Security & Global Configuration</h3>
              <p className="text-xs text-slate-500">Only the Super Admin platform owner can modify these policies.</p>
            </div>
            {settingsSuccess && (
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                ✓ {settingsSuccess}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs max-w-2xl">
            {/* General Settings */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Access & Registration</h4>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-800">Public User Self-Registration</p>
                  <p className="text-slate-500 text-[11px]">Allow new regular users to register accounts on the platform</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registration_enabled === 'true'}
                  onChange={(e) =>
                    setSettings({ ...settings, registration_enabled: e.target.checked ? 'true' : 'false' })
                  }
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-800">Maintenance Mode</p>
                  <p className="text-slate-500 text-[11px]">Temporarily lock standard access during infrastructure maintenance</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenance_mode === 'true'}
                  onChange={(e) =>
                    setSettings({ ...settings, maintenance_mode: e.target.checked ? 'true' : 'false' })
                  }
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Feature Master Switches */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Feature Master Switches</h4>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-800">Camera Visual Verification Feature</p>
                  <p className="text-slate-500 text-[11px]">Global platform switch for camera features</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.camera_feature_globally_enabled === 'true'}
                  onChange={(e) =>
                    setSettings({ ...settings, camera_feature_globally_enabled: e.target.checked ? 'true' : 'false' })
                  }
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-800">Geolocation Feature</p>
                  <p className="text-slate-500 text-[11px]">Global platform switch for geolocation coordinate reporting</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.location_feature_globally_enabled === 'true'}
                  onChange={(e) =>
                    setSettings({ ...settings, location_feature_globally_enabled: e.target.checked ? 'true' : 'false' })
                  }
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Data Retention */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Data Retention Policy</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Analytics Retention Limit (Days)</label>
                  <input
                    type="number"
                    value={settings.retention_days_analytics || '90'}
                    onChange={(e) => setSettings({ ...settings, retention_days_analytics: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Audit Trail Retention (Days)</label>
                  <input
                    type="number"
                    value={settings.retention_days_audit || '365'}
                    onChange={(e) => setSettings({ ...settings, retention_days_audit: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="py-2.5 px-6 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold transition flex items-center gap-2"
            >
              {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save System Settings'}
            </button>
          </form>
        </div>
      )}

      {/* Appoint Administrator Modal */}
      {showCreateAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Appoint Administrator</h3>
              <button onClick={() => setShowCreateAdminModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Administrator Name</label>
                <input
                  type="text"
                  required
                  value={newAdminData.name}
                  onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminData.email}
                  onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  placeholder="alex.admin@trackops.dev"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Temporary Password (8+ chars)</label>
                <input
                  type="password"
                  required
                  value={newAdminData.password}
                  onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Approval Scopes (Features Admin Can Approve)</label>
                <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {['FEATURE_CAMERA', 'FEATURE_LOCATION', 'FEATURE_EXPORT', 'FEATURE_ANALYTICS_PRO', 'FEATURE_INVESTIGATION'].map((feat) => {
                    const checked = newAdminData.scopes.includes(feat);
                    return (
                      <label key={feat} className="flex items-center gap-2 font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAdminData({ ...newAdminData, scopes: [...newAdminData.scopes, feat] });
                            } else {
                              setNewAdminData({ ...newAdminData, scopes: newAdminData.scopes.filter((s) => s !== feat) });
                            }
                          }}
                          className="w-3.5 h-3.5 text-purple-600 rounded"
                        />
                        <span>{feat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAdminModal(false)}
                  className="py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold transition"
                >
                  Appoint Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Super Admin Dashboard" />
      <div className="flex flex-1">
        <TrackOpsSidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading console...</div>}>
            <SuperAdminDashboardContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
