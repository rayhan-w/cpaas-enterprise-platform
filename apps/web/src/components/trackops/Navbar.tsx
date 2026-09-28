'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Bell,
  LogOut,
  Shield,
  User as UserIcon,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function TrackOpsNavbar({ title }: { title?: string }) {
  const { user, logout, unreadNotifications } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (showNotifications) {
      fetchApi('/notifications')
        .then((res) => {
          if (res?.notifications) {
            setNotifications(res.notifications);
          }
        })
        .catch(() => {});
    }
  }, [showNotifications]);

  const markAllRead = async () => {
    try {
      await fetchApi('/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-800 border border-purple-200">Super Admin (Owner)</span>;
      case 'ADMIN':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800 border border-blue-200">Admin (Approver)</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">User</span>;
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href={user?.role === 'SUPER_ADMIN' ? '/super-admin' : user?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-200">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Track<span className="text-indigo-600">Ops</span>
          </span>
        </Link>
        {title && (
          <>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-sm font-medium text-slate-700">{title}</span>
          </>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {/* Role Badge */}
        {user && getRoleBadge(user.role)}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">Notifications</span>
                <button
                  onClick={markAllRead}
                  className="text-xs text-indigo-600 hover:text-indigo-800 transition font-medium"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500">No recent notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs hover:bg-slate-50 transition ${!n.isRead ? 'bg-indigo-50/50' : ''}`}
                    >
                      <div className="font-medium text-slate-900 mb-0.5 flex items-center justify-between">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{n.message}</p>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setShowNotifications(false)}
                          className="mt-1 text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          View details <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-700">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-slate-800 leading-tight">{user?.name || 'Account'}</p>
              <p className="text-slate-500 text-[11px] leading-tight truncate max-w-[120px]">{user?.email}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>

              <Link
                href="/dashboard/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
              >
                <UserIcon className="w-4 h-4 text-slate-400" />
                Profile & Security
              </Link>

              {user?.role === 'SUPER_ADMIN' && (
                <Link
                  href="/super-admin"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 transition font-medium"
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  Super Admin Console
                </Link>
              )}

              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-blue-700 hover:bg-blue-50 transition font-medium"
                >
                  <Shield className="w-4 h-4 text-blue-600" />
                  Admin Approval Portal
                </Link>
              )}

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-medium"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
