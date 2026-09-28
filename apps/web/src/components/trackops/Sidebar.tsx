'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  Key,
  ShieldCheck,
  Camera,
  MapPin,
  ClipboardList,
  FolderLock,
  Settings,
  Users,
  ShieldAlert,
  Activity,
  Bell,
} from 'lucide-react';

export default function TrackOpsSidebar() {
  const pathname = usePathname() || '';
  const { user, hasFeature } = useAuth();

  const isSuperAdminView = pathname.startsWith('/super-admin');
  const isAdminView = pathname.startsWith('/admin');

  // 1. Super Admin Menu
  if (user?.role === 'SUPER_ADMIN' && isSuperAdminView) {
    const superAdminItems = [
      { name: 'Dashboard Overview', href: '/super-admin', icon: LayoutDashboard },
      { name: 'User Management', href: '/super-admin?tab=users', icon: Users },
      { name: 'Admin Scopes', href: '/super-admin?tab=admins', icon: ShieldCheck },
      { name: 'Permission Center', href: '/super-admin?tab=permissions', icon: Key },
      { name: 'Approval Oversight', href: '/super-admin?tab=requests', icon: ClipboardList },
      { name: 'Platform Links', href: '/super-admin?tab=links', icon: Link2 },
      { name: 'Platform Analytics', href: '/super-admin?tab=analytics', icon: BarChart3 },
      { name: 'Investigations', href: '/super-admin?tab=cases', icon: FolderLock },
      { name: 'Platform Audit Logs', href: '/super-admin?tab=audit', icon: Activity },
      { name: 'System Settings', href: '/super-admin?tab=settings', icon: Settings },
    ];

    return (
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          <div className="px-3 py-2 rounded-lg bg-purple-50 border border-purple-100">
            <p className="text-xs font-semibold text-purple-900">Platform Owner Console</p>
            <p className="text-[11px] text-purple-600">Full administrative authority</p>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Owner Controls</p>
            {superAdminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-purple-100 text-purple-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-900 transition font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              Switch to User View
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  // 2. Admin Menu
  if ((user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && isAdminView) {
    const adminItems = [
      { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
      { name: 'Pending Requests', href: '/admin?tab=requests', icon: ClipboardList },
      { name: 'Assigned Scopes', href: '/admin?tab=scopes', icon: ShieldCheck },
      { name: 'Assigned Cases', href: '/admin?tab=cases', icon: FolderLock },
      { name: 'Scoped Audit Trail', href: '/admin?tab=audit', icon: Activity },
    ];

    return (
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-xs font-semibold text-blue-900">Admin Approval Portal</p>
            <p className="text-[11px] text-blue-600">Scoped request management</p>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Approver Tools</p>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-blue-100 text-blue-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-900 transition font-medium"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              Switch to User View
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  // 3. User Dashboard Menu
  const userItems = [
    { name: 'My Links & Overview', href: '/dashboard', icon: Link2 },
    { name: 'Link Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Available Features', href: '/dashboard/features', icon: Key },
    { name: 'My Access Requests', href: '/dashboard/requests', icon: ClipboardList },
    { name: 'Camera Verification', href: '/dashboard/features/camera', icon: Camera, restricted: true, featureKey: 'FEATURE_CAMERA' },
    { name: 'Location Reporting', href: '/dashboard/features/location', icon: MapPin, restricted: true, featureKey: 'FEATURE_LOCATION' },
    { name: 'Assigned Cases', href: '/dashboard/cases', icon: FolderLock },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Profile & Security', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform Navigation</p>
          {userItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isApproved = item.featureKey ? hasFeature(item.featureKey) : true;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.restricted && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isApproved ? 'Active' : 'Locked'}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick links for Super Admin and Admin to their consoles */}
        {user?.role === 'SUPER_ADMIN' && (
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/super-admin"
              className="flex items-center gap-2 px-3 py-2 text-xs text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition font-medium"
            >
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              Open Super Admin Console
            </Link>
          </div>
        )}

        {user?.role === 'ADMIN' && (
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-xs text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Open Admin Approval Portal
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
