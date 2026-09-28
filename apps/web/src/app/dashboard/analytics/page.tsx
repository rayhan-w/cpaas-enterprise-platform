'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart3, Users, MousePointerClick, Globe, Smartphone, ShieldCheck, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const linkId = searchParams.get('linkId');

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [linkTitle, setLinkTitle] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        if (linkId) {
          const res = await fetchApi(`/links/${linkId}/analytics`);
          if (res?.analytics) {
            setData(res.analytics);
            setLinkTitle(res.link?.title || 'Specific Link');
          }
        } else {
          const res = await fetchApi('/analytics/overview');
          if (res) {
            setData(res);
            setLinkTitle('All Account Links');
          }
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [linkId]);

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
        Loading telemetry data...
      </div>
    );
  }

  const traffic = data?.trafficOverTime || [];
  const devices = data?.deviceCategories || [];
  const browsers = data?.browserFamilies || [];
  const countries = data?.topCountries || data?.geographicRegions || [];
  const recentEvents = data?.recentEvents || [];

  const totalVisits = data?.summary?.totalVisits ?? data?.totalVisits ?? 0;
  const uniqueVisitors = data?.summary?.uniqueVisitors ?? data?.uniqueVisitors ?? 0;

  return (
    <div className="space-y-6">
      {/* Title & Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Privacy-Friendly Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">
            Displaying real telemetry for: <span className="font-semibold text-indigo-600">{linkTitle}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zero Fingerprinting & IP Minimization Enforced</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Visits</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalVisits}</p>
          <p className="text-[11px] text-slate-400 mt-1">Verified redirect requests</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Unique Visitors</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{uniqueVisitors}</p>
          <p className="text-[11px] text-slate-400 mt-1">Calculated via salted SHA-256 hashes</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Geographic Regions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{countries.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Distinct countries recorded</p>
        </div>
      </div>

      {/* Traffic Over Time AreaChart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          Visits & Unique Visitors Over Time
        </h3>
        <div className="h-72 w-full">
          {traffic.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No traffic records found in this window.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorUniques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="Total Visits"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                />
                <Area
                  type="monotone"
                  dataKey="uniqueVisitors"
                  name="Unique Visitors"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUniques)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Categories */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            Device Breakdown
          </h3>
          <div className="h-60 w-full">
            {devices.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No device data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {devices.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Browser Families */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            Browser Families
          </h3>
          <div className="h-60 w-full">
            {browsers.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No browser data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={browsers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" name="Visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Top Countries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Geographic Regions (Aggregated)</h3>
          <p className="text-xs text-slate-500">Lawfully obtained approximate geographic country distribution</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
              <tr>
                <th className="px-6 py-3">Country / Region</th>
                <th className="px-6 py-3">Total Events</th>
                <th className="px-6 py-3 text-right">% of Traffic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {countries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-6 text-center text-slate-400">
                    No geographic records logged.
                  </td>
                </tr>
              ) : (
                countries.map((c: any) => {
                  const countryName = c.country || 'Global';
                  const count = c.count || 0;
                  const pct = totalVisits > 0 ? ((count / totalVisits) * 100).toFixed(1) : '0';

                  return (
                    <tr key={countryName} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-3.5 font-medium text-slate-900">{countryName}</td>
                      <td className="px-6 py-3.5 text-slate-700 font-semibold">{count}</td>
                      <td className="px-6 py-3.5 text-right text-slate-500">{pct}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Visitor GPS & Location Telemetry Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-0">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              Visitor Telemetry & GPS Logs (ভিসিটর লোকেশন ও জিপিএস লগ)
            </h3>
            <p className="text-xs text-slate-500">
              Real-time records of visitor devices, timestamps, and GPS coordinates (with user permission).
            </p>
          </div>
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-semibold rounded-full border border-indigo-100 shrink-0">
            {recentEvents.length} Recent Visits
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 uppercase">
              <tr>
                <th className="px-6 py-3">Time (সময়)</th>
                <th className="px-6 py-3">Device / Browser</th>
                <th className="px-6 py-3">IP Location (আইপি লোকেশন)</th>
                <th className="px-6 py-3">GPS Location (জিপিএস লোকেশন)</th>
                <th className="px-6 py-3 text-right">Map View (ম্যাপ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No visitor events recorded yet. Share your short link to capture visitor analytics.
                  </td>
                </tr>
              ) : (
                recentEvents.map((ev: any) => {
                  const hasGps = ev.latitude !== null && ev.latitude !== undefined && ev.longitude !== null && ev.longitude !== undefined;
                  const dateStr = ev.timestamp ? new Date(ev.timestamp).toLocaleString() : 'N/A';

                  return (
                    <tr key={ev.id} className="hover:bg-slate-50/60 transition">
                      {/* Time */}
                      <td className="px-6 py-3.5 text-slate-600 font-mono text-[11px]">
                        {dateStr}
                      </td>

                      {/* Device / Browser */}
                      <td className="px-6 py-3.5 text-slate-800 font-medium">
                        <div>
                          <span>{ev.deviceCategory || 'Desktop'}</span>
                          <span className="text-slate-400 text-[11px] ml-1.5 font-normal">
                            ({ev.browserFamily || 'Browser'} / {ev.osFamily || 'OS'})
                          </span>
                        </div>
                      </td>

                      {/* IP Location */}
                      <td className="px-6 py-3.5 text-slate-700">
                        <span className="font-semibold text-slate-900">{ev.country || 'Global'}</span>
                        {ev.city && <span className="text-slate-500 text-[11px] ml-1">({ev.city})</span>}
                      </td>

                      {/* GPS Location */}
                      <td className="px-6 py-3.5">
                        {hasGps ? (
                          <div className="space-y-0.5">
                            <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block w-fit">
                              {Number(ev.latitude).toFixed(5)}, {Number(ev.longitude).toFixed(5)}
                            </span>
                            {ev.accuracy && (
                              <span className="text-[10px] text-slate-400 block">
                                Accuracy: ±{Math.round(ev.accuracy)}m
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">
                            Permission Skipped / Pending
                          </span>
                        )}
                      </td>

                      {/* Map Action */}
                      <td className="px-6 py-3.5 text-right">
                        {hasGps ? (
                          <a
                            href={`https://www.google.com/maps?q=${ev.latitude},${ev.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-lg text-[11px] border border-rose-200 transition"
                            title="Open Google Maps Pin"
                          >
                            <MapPin className="w-3 h-3 text-rose-600" />
                            <span>Google Maps</span>
                            <ExternalLink className="w-3 h-3 text-rose-400" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Telemetry Analytics" />
      <div className="flex flex-1">
        <TrackOpsSidebar />
        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400">Loading analytics...</div>}>
            <AnalyticsContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
