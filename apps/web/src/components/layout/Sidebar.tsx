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
  Radio,
  ChevronDown,
} from 'lucide-react';

const mainNavigation = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'Campaigns', href: '/dashboard/campaigns', icon: Send },
  { name: 'DLT Templates', href: '/dashboard/dlt', icon: FileCheck2 },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Reports & Logs', href: '/dashboard/reports', icon: BarChart3 },
];

const developerNavigation = [
  { name: 'API Keys', href: '/dashboard/developer-api', icon: KeyRound, badge: 'v1' },
  { name: 'Billing & Wallet', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Audit Logs', href: '/dashboard/activity', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-zinc-950 border-r border-zinc-850 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Workspace Brand Switcher */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-zinc-100 flex items-center space-x-1">
                <span>CloudSMS</span>
                <span className="text-[10px] text-zinc-500 font-mono">CPaaS</span>
              </div>
              <div className="text-[10px] text-zinc-500">Enterprise Workspace</div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
        </div>

        {/* Navigation Sections */}
        <div className="p-3 space-y-5">
          {/* Main Messaging */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2.5 mb-1.5">
              Messaging
            </div>
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Developer & Admin */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2.5 mb-1.5">
              Developer & Admin
            </div>
            {developerNavigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-zinc-850 text-zinc-400 border border-zinc-800">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Network Badge */}
      <div className="p-3 border-t border-zinc-850">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between">
          <div className="text-[11px]">
            <div className="text-zinc-300 font-medium">Telecom SMPP</div>
            <div className="text-zinc-500 text-[10px]">Latency: 42ms</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>
    </aside>
  );
}
