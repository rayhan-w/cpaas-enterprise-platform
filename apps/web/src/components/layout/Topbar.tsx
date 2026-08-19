'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, 
  Building2, 
  Bell, 
  CheckCircle2, 
  Plus, 
  User as UserIcon,
  Zap,
  RefreshCw
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export function Topbar() {
  const [balance, setBalance] = useState<{ balanceInr: number; smsCredit: number; entityId: string; name: string }>({
    balanceInr: 1692.08,
    smsCredit: 14101,
    entityId: '17011582910283',
    name: 'Enterprise Admin',
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadBalance = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetchApi('/users/profile');
      if (res) {
        setBalance({
          balanceInr: res.balanceInr ?? 1692.08,
          smsCredit: res.smsCredit ?? 14101,
          entityId: res.entityId || '17011582910283',
          name: res.name || 'Enterprise Admin',
        });
      }
    } catch {
      // Fallback gracefully to default seeded values
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadBalance();
    const interval = setInterval(loadBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Left: Platform Status & Entity ID */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline">DLT Gateway Live:</span>
          <span className="font-mono font-semibold">AIRTEL / JIO / VI</span>
        </div>

        <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400 bg-gray-900/90 border border-gray-800 px-3 py-1.5 rounded-lg">
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Entity (PE_ID):</span>
          <span className="font-mono text-gray-200 font-semibold">{balance.entityId}</span>
          <span title="TRAI Verified"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /></span>
        </div>
      </div>

      {/* Right: Wallet Balance, Quick Recharge, Notifications & Profile */}
      <div className="flex items-center space-x-3">
        {/* Dynamic Balance Card */}
        <div className="flex items-center bg-gradient-to-r from-blue-950/70 to-indigo-950/70 border border-blue-800/50 rounded-xl px-3.5 py-1.5 shadow-sm space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-blue-300/80 font-medium leading-none">Available Credits</div>
              <div className="text-sm font-bold text-white leading-tight font-mono">
                ₹{balance.balanceInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                <span className="text-gray-400 font-normal mx-1">/</span>
                <span className="text-emerald-400 font-bold">{balance.smsCredit.toLocaleString('en-IN')} SMS</span>
              </div>
            </div>
          </div>

          <button
            onClick={loadBalance}
            disabled={isRefreshing}
            title="Refresh Balance"
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <Link
            href="/dashboard/billing"
            className="hidden sm:inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Recharge</span>
          </Link>
        </div>

        {/* Action Button: Quick Send */}
        <Link
          href="/dashboard/campaigns"
          className="hidden lg:flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg transition"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>New SMS</span>
        </Link>

        {/* Notification Bell */}
        <button 
          className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* User Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
            EA
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-gray-200">{balance.name}</div>
            <div className="text-[10px] text-gray-400">Enterprise Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
