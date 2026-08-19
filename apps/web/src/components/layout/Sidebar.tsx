'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  FileCheck2,
  Users,
  KeyRound,
  CreditCard,
  BarChart3,
  History,
  ShieldCheck,
  Radio,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard Overview', href: '/', icon: LayoutDashboard },
  { name: 'Send SMS Campaign', href: '/dashboard/campaigns', icon: Send },
  { name: 'DLT Headers & Templates', href: '/dashboard/dlt', icon: FileCheck2 },
  { name: 'Contacts & Phonebook', href: '/dashboard/contacts', icon: Users },
  { name: 'Developer API Keys', href: '/dashboard/developer-api', icon: KeyRound, badge: 'REST API' },
  { name: 'Billing & Recharge', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3 },
  { name: 'Activity & Audit Logs', href: '/dashboard/activity', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-850 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800 space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center space-x-1.5">
              <span>CloudSMS</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                CPaaS
              </span>
            </div>
            <div className="text-[11px] text-gray-400 font-medium">Enterprise Telephony</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Messaging & Core
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-900/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-gray-800 text-blue-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Security Badge */}
      <div className="p-4 border-t border-gray-900">
        <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-3 flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <div className="text-gray-200 font-medium">TRAI / DLT Compliant</div>
            <div className="text-gray-400 text-[10px]">SHA-256 HMAC & Encryption</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
