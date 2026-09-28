'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import { useAuth } from '@/context/AuthContext';
import {
  Camera,
  MapPin,
  FileSpreadsheet,
  FolderLock,
  BarChart,
  CheckCircle,
  Clock,
  XCircle,
  ShieldAlert,
  ArrowRight,
  Plus,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

const SENSITIVE_FEATURES = [
  {
    key: 'FEATURE_CAMERA',
    name: 'Camera Visual Verification',
    description:
      'Consent-based, user-initiated hardware inspection with live frame preview and cryptographic integrity logging.',
    icon: Camera,
    path: '/dashboard/features/camera',
  },
  {
    key: 'FEATURE_LOCATION',
    name: 'Geolocation Checkpoint Reporting',
    description:
      'Consent-based standard browser geolocation for delivery drops and operational checkpoint verification with full deletion control.',
    icon: MapPin,
    path: '/dashboard/features/location',
  },
  {
    key: 'FEATURE_EXPORT',
    name: 'Compliance Audit Data Export',
    description:
      'Structured cryptographic extraction of user logs, event telemetry, and certified audit trails.',
    icon: FileSpreadsheet,
    path: '#',
  },
  {
    key: 'FEATURE_ANALYTICS_PRO',
    name: 'Advanced Telemetry Pro',
    description:
      'Extended 365-day historical retention, cross-link comparisons, and high-frequency traffic breakdowns.',
    icon: BarChart,
    path: '/dashboard/analytics',
  },
  {
    key: 'FEATURE_INVESTIGATION',
    name: 'Investigation Case Management',
    description:
      'Attach forensic evidence records, chain of custody logs, and collaborate on security incident response.',
    icon: FolderLock,
    path: '/dashboard/cases',
  },
];

export default function FeaturesPage() {
  const { user, permissions, refreshProfile } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Request modal
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/access-requests');
      if (res?.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRequest = (feat: any) => {
    setSelectedFeature(feat);
    setPurpose('');
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeature) return;

    setSubmitting(true);
    setSubmitError('');

    try {
      await fetchApi('/access-requests', {
        method: 'POST',
        body: JSON.stringify({
          featureKey: selectedFeature.key,
          purpose,
        }),
      });

      setSubmitSuccess('Access request submitted successfully. Administrator will review.');
      await refreshProfile();
      await loadData();
      setTimeout(() => setSelectedFeature(null), 1500);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit access request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getFeatureStatus = (key: string) => {
    // 1. Check if user is Super Admin
    if (user?.role === 'SUPER_ADMIN') {
      return { status: 'APPROVED', label: 'Owner Full Access', badgeColor: 'bg-purple-100 text-purple-800' };
    }

    // 2. Check active approved permission
    const activePerm = permissions.find(
      (p) => p.featureKey === key && p.status === 'APPROVED' && (!p.expiresAt || new Date(p.expiresAt) > new Date())
    );

    if (activePerm) {
      return {
        status: 'APPROVED',
        label: 'Approved & Active',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        expiresAt: activePerm.expiresAt,
      };
    }

    // 3. Check latest request status
    const req = requests.find((r) => r.featureKey === key);
    if (req) {
      if (req.status === 'PENDING') {
        return { status: 'PENDING', label: 'Pending Admin Review', badgeColor: 'bg-amber-100 text-amber-800' };
      }
      if (req.status === 'REJECTED') {
        return {
          status: 'REJECTED',
          label: 'Request Rejected',
          badgeColor: 'bg-rose-100 text-rose-800',
          reason: req.decisionReason,
        };
      }
      if (req.status === 'REVOKED') {
        return {
          status: 'REVOKED',
          label: 'Access Revoked',
          badgeColor: 'bg-slate-200 text-slate-700',
          reason: req.decisionReason,
        };
      }
    }

    return { status: 'LOCKED', label: 'Access Required', badgeColor: 'bg-slate-100 text-slate-600' };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Feature Access Center" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Protected Feature Catalog</h1>
              <p className="text-xs text-slate-500 mt-1">
                TrackOps operates on a default-deny security model. Submit a justified request to receive administrator approval.
              </p>
            </div>
            <Link
              href="/dashboard/requests"
              className="py-2 px-4 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
            >
              View My Request History
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SENSITIVE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              const statusInfo = getFeatureStatus(feat.key);
              const isApproved = statusInfo.status === 'APPROVED';

              return (
                <div
                  key={feat.key}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.badgeColor}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{feat.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.description}</p>
                    </div>

                    {statusInfo.expiresAt && (
                      <p className="text-[11px] text-slate-400">
                        Expires: {new Date(statusInfo.expiresAt).toLocaleDateString()}
                      </p>
                    )}

                    {statusInfo.reason && (
                      <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded border border-rose-100">
                        Reason: {statusInfo.reason}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    {isApproved ? (
                      <Link
                        href={feat.path}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        Launch Feature <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : statusInfo.status === 'PENDING' ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5" /> Under Review
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenRequest(feat)}
                        className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Request Access
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Request Access Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Request Feature Access</h3>
                <p className="text-xs text-indigo-600 font-semibold">{selectedFeature.name}</p>
              </div>
              <button onClick={() => setSelectedFeature(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{submitError}</span>
              </div>
            )}

            {submitSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business Justification / Stated Purpose
                </label>
                <textarea
                  required
                  rows={4}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Explain why your operational role requires access to this sensitive feature..."
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Your stated justification will be permanently recorded in the platform audit trail and reviewed by an authorized Administrator.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFeature(null)}
                  className="py-2 px-4 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center gap-1.5"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Access Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
