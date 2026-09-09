'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If login page, render plain container
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-[#F8F7F5]">{children}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('nurtura_admin_token');
    localStorage.removeItem('nurtura_admin_user');
    document.cookie = 'nurtura_admin_token=; Max-Age=0; path=/;';
    router.push('/admin/login');
  };

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/payments', label: 'Payment Verification', icon: CreditCard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Layers },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/coupons', label: 'Coupons', icon: Tag },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F5] flex flex-col lg:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="w-full lg:w-64 bg-white border-r border-[#EDE5E1] p-5 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#EDE5E1]">
            <div className="w-9 h-9 rounded-xl bg-[#0D5435] flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
              J
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#1A1512] block leading-tight">
                Jawata Mart Admin
              </span>
              <span className="text-[10px] text-[#7A9C78] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A9C78]"></span>
                Live Bangladesh
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? 'active text-[#0D5435]' : 'text-[#6B5B58]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0D5435]' : 'text-[#9B8A86]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.href === '/admin/payments' && (
                    <span className="w-2 h-2 rounded-full bg-[#E2136E] animate-ping" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="pt-6 border-t border-[#EDE5E1] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#6B5B58] hover:text-[#1A1512] hover:bg-[#F8F7F5] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#0D5435]" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] text-[#9B8A86]">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#D94040] hover:bg-[#FBDADA]/40 transition-colors text-left font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}
