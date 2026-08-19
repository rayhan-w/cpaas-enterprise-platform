'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Coins, 
  Building2, 
  Bell, 
  CheckCircle2, 
  Plus, 
  RefreshCw,
  Zap,
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
      // Graceful fallback
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
    <header className="h-14 border-b border-zinc-850 bg-zinc-950/90 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Left: Telecom status & Entity ID */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-zinc-300">Airtel / Jio SMPP Direct</span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
          <Building2 className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500">PE ID:</span>
          <span className="font-mono text-zinc-200 font-medium">{balance.entityId}</span>
          <span title="TRAI Verified"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /></span>
        </div>
      </div>

      {/* Right: Balance, Quick Recharge, Profile */}
      <div className="flex items-center space-x-2.5">
        {/* Dynamic Balance Pill */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1 space-x-2.5">
          <div className="flex items-center space-x-1.5">
            <Coins className="w-3.5 h-3.5 text-zinc-400" />
            <div className="text-xs font-mono font-medium text-zinc-200">
              ₹{balance.balanceInr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              <span className="text-zinc-600 mx-1.5">|</span>
              <span className="text-emerald-400 font-semibold">{balance.smsCredit.toLocaleString('en-IN')} SMS</span>
            </div>
          </div>

          <button
            onClick={loadBalance}
            disabled={isRefreshing}
            title="Refresh balance"
            className="text-zinc-500 hover:text-zinc-300 transition"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <Link
            href="/dashboard/billing"
            className="inline-flex items-center space-x-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white text-[11px] font-medium px-2 py-0.5 rounded border border-zinc-700 transition"
          >
            <Plus className="w-3 h-3" />
            <span>Top up</span>
          </Link>
        </div>

        {/* Quick Send Button */}
        <Link
          href="/dashboard/campaigns"
          className="hidden sm:inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm transition"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>New SMS</span>
        </Link>

        {/* Notifications */}
        <button 
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition relative"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-zinc-800">
          <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 font-semibold text-xs">
            EA
          </div>
          <div className="hidden lg:block text-left leading-none">
            <div className="text-xs font-medium text-zinc-200">{balance.name}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
