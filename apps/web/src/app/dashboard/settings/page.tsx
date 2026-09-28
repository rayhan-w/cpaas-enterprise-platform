'use client';

import React, { useState } from 'react';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import { useAuth } from '@/context/AuthContext';
import {
  User as UserIcon,
  Lock,
  Shield,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function UserSettingsPage() {
  const { user, logout } = useAuth();

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  // Account deletion
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.');
      return;
    }

    setPwLoading(true);
    setPwError('');
    setPwSuccess('');

    try {
      const res = await fetchApi('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwSuccess(res.message || 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwError(err.message || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('WARNING: Are you absolutely sure you want to delete your TrackOps account? This action is permanent.')) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await fetchApi('/user/account', {
        method: 'DELETE',
        body: JSON.stringify({ confirmationPassword: deleteConfirmPassword }),
      });
      alert('Your account has been deleted.');
      logout();
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account.');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Account & Security Settings" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">Profile & Security Settings</h1>
            <p className="text-xs text-slate-500 mt-1">Manage credentials, review assigned role, and configure account security.</p>
          </div>

          {/* Profile Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-600" />
              Account Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Full Name</span>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{user?.name}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Email Address</span>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">{user?.email}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Platform Role</span>
                <p className="font-semibold text-indigo-600 text-sm mt-0.5">{user?.role}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-medium">Account Status</span>
                <p className="font-semibold text-emerald-600 text-sm mt-0.5">{user?.status}</p>
              </div>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              Update Password
            </h3>

            {pwError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{pwError}</span>
              </div>
            )}

            {pwSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{pwSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs max-w-md">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password (8+ characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save New Password'}
              </button>
            </form>
          </div>

          {/* Account Deletion */}
          {user?.role !== 'SUPER_ADMIN' && (
            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                Delete Account Workflow
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Permanently deletes your user account, short links, and associated activity records, subject to platform legal retention requirements.
              </p>

              {deleteError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{deleteError}</span>
                </div>
              )}

              <form onSubmit={handleDeleteAccount} className="space-y-3 text-xs max-w-md">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm with your password</label>
                  <input
                    type="password"
                    required
                    value={deleteConfirmPassword}
                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                    placeholder="Enter password to confirm"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={deleteLoading}
                  className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg transition flex items-center gap-1.5"
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Permanently Delete Account'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
