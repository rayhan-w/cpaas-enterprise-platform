'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import { Bell, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/notifications');
      if (res?.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetchApi('/notifications', { method: 'PATCH' });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Notifications Center" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-600" />
                In-App Notifications
              </h1>
              <p className="text-xs text-slate-500 mt-1">Status changes, access approvals, and security alerts.</p>
            </div>
            <button
              onClick={handleMarkAllRead}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Mark All as Read
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center space-y-2">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">No notifications yet</p>
                <p className="text-xs text-slate-500">You are all caught up on platform updates.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 transition text-xs flex items-start justify-between gap-4 ${
                    !n.isRead ? 'bg-indigo-50/40' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                      {!n.isRead && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{n.message}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {n.link && (
                    <Link
                      href={n.link}
                      className="py-1.5 px-3 bg-white border border-slate-200 hover:border-indigo-500 rounded text-xs font-semibold text-indigo-600 flex items-center gap-1 shrink-0 transition"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
