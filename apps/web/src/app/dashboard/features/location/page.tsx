'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Lock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Trash2,
  ArrowRight,
  Radio,
  Signal,
  Wifi,
  ExternalLink,
  Save,
  Search,
  Crosshair,
  Compass,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function LocationFeaturePage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [permissionInfo, setPermissionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Device GPS state
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);
  const [logging, setLogging] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  // 2. Client Network info
  const [networkInfo, setNetworkInfo] = useState<{ type?: string; effectiveType?: string; rtt?: number; downlink?: number } | null>(null);

  // 3. Cellular Tower & LAC / Cell ID Lookup State
  const [mcc, setMcc] = useState('470'); // Bangladesh
  const [mnc, setMnc] = useState('01'); // Grameenphone
  const [lac, setLac] = useState('24510');
  const [cellId, setCellId] = useState('1428590');
  const [radio, setRadio] = useState<'LTE' | 'GSM' | 'UMTS' | 'NR'>('LTE');
  const [resolvingTower, setResolvingTower] = useState(false);
  const [towerResult, setTowerResult] = useState<any | null>(null);
  const [towerError, setTowerError] = useState<string | null>(null);
  const [savingTower, setSavingTower] = useState(false);
  const [towerSavedSuccess, setTowerSavedSuccess] = useState<string | null>(null);

  // 4. Saved Tower Records
  const [towerRecords, setTowerRecords] = useState<any[]>([]);

  // 1. Verify authorization & load tower history
  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        setLoading(true);
        const res = await fetchApi('/features/location/status');
        setAuthorized(Boolean(res?.authorized));
        setPermissionInfo(res?.permission);
        if (!res?.authorized) {
          setAuthError(res?.error || 'Access required. Geolocation features require verified administrator approval.');
        } else {
          // Detect client network info if supported
          if (typeof window !== 'undefined' && 'connection' in navigator) {
            const conn: any = (navigator as any).connection;
            if (conn) {
              setNetworkInfo({
                type: conn.type,
                effectiveType: conn.effectiveType,
                rtt: conn.rtt,
                downlink: conn.downlink,
              });
            }
          }

          // Load recent tower records
          const recRes = await fetchApi('/features/cellular/records');
          if (recRes?.records) {
            setTowerRecords(recRes.records);
          }
        }
      } catch (err: any) {
        setAuthorized(false);
        setAuthError(err.message || 'Authorization check failed.');
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndLoad();
  }, []);

  // 2. Request GPS Location with explicit user click
  const requestLocation = () => {
    setLocationError(null);
    setLogSuccess(null);
    setLocating(true);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your current browser.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Browser location permission denied. TrackOps will not track without your permission.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location information is currently unavailable from your device.');
            break;
          case err.TIMEOUT:
            setLocationError('Geolocation request timed out.');
            break;
          default:
            setLocationError(err.message || 'Unknown error acquiring coordinates.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 3. Log GPS location to backend
  const handleLogLocation = async () => {
    if (!coords) return;
    setLogging(true);
    setLogSuccess(null);

    try {
      const res = await fetchApi('/features/location/log', {
        method: 'POST',
        body: JSON.stringify({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          purpose: 'Operational location checkpoint verification',
        }),
      });

      setLogSuccess(res.message || 'Location logged successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to log location.');
    } finally {
      setLogging(false);
    }
  };

  // 4. Resolve Cellular Tower (LAC + Cell ID)
  const handleResolveTower = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lac.trim() || !cellId.trim()) {
      setTowerError('Both LAC (Location Area Code) and Cell ID (CID) are required.');
      return;
    }

    setResolvingTower(true);
    setTowerError(null);
    setTowerSavedSuccess(null);

    try {
      const res = await fetchApi('/features/cellular/lookup', {
        method: 'POST',
        body: JSON.stringify({
          mcc,
          mnc,
          lac,
          cellId,
          radio,
          saveRecord: false,
        }),
      });

      if (res?.tower) {
        setTowerResult(res.tower);
      } else {
        setTowerError('Failed to resolve tower coordinates.');
      }
    } catch (err: any) {
      setTowerError(err.message || 'Failed to resolve cellular tower.');
    } finally {
      setResolvingTower(false);
    }
  };

  // 5. Save Tower Record
  const handleSaveTowerRecord = async () => {
    if (!towerResult) return;
    setSavingTower(true);
    setTowerSavedSuccess(null);

    try {
      await fetchApi('/features/cellular/lookup', {
        method: 'POST',
        body: JSON.stringify({
          mcc: towerResult.mcc,
          mnc: towerResult.mnc,
          lac: towerResult.lac,
          cellId: towerResult.cellId,
          radio: towerResult.radio,
          saveRecord: true,
          notes: `Verified BTS Tower (${towerResult.carrier})`,
        }),
      });

      setTowerSavedSuccess('Cellular tower telemetry permanently recorded in database.');
      // Refresh history
      const recRes = await fetchApi('/features/cellular/records');
      if (recRes?.records) {
        setTowerRecords(recRes.records);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save tower record.');
    } finally {
      setSavingTower(false);
    }
  };

  // 6. Delete location data (User right to deletion)
  const handleDeleteLocationData = async () => {
    if (!confirm('Are you sure you want to delete all stored location telemetry records?')) return;
    setDeleting(true);
    try {
      const res = await fetchApi('/features/location/data', { method: 'DELETE' });
      setCoords(null);
      setDeleteMessage(res.message || 'Location records deleted.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete records.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TrackOpsNavbar title="Location & Cellular Telemetry" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
          {/* Authorization Check */}
          {!authorized ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center max-w-lg mx-auto my-12 space-y-5">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Access Required: Geolocation & Cellular Telemetry</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {authError ||
                    'Under TrackOps default-deny policy, geolocation and cellular baseband features require an explicit approval by an administrator.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                <p className="font-semibold text-slate-700">Strict Access Requirements:</p>
                <ul className="list-disc pl-5 text-slate-500 space-y-1">
                  <li>Globally enabled by Super Admin (Platform Owner)</li>
                  <li>Approved for specific user account by an Administrator</li>
                  <li>Explicit user consent before GPS sampling</li>
                  <li>Complies with telecom data governance standards</li>
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard/features"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-2 transition"
                >
                  Request Administrator Access <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Authorized User View */
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    Geolocation & Cellular Tower Telemetry
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Clearance by: <span className="font-semibold text-slate-700">{permissionInfo?.grantedByName || 'Administrator'}</span>
                    {permissionInfo?.expiresAt && ` · Expires: ${new Date(permissionInfo.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Administrative Clearance Verified</span>
                </div>
              </div>

              {/* Client Network Telemetry Badge */}
              {networkInfo && (
                <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Signal className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800">Device Cellular Link:</span>
                      <p className="text-slate-500 text-[11px]">Real-time Network Information API</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-400 text-[10px] block">TYPE</span>
                      <span className="font-bold text-indigo-700 uppercase">{networkInfo.effectiveType || '4G/LTE'}</span>
                    </div>
                    {networkInfo.rtt && (
                      <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-slate-400 text-[10px] block">LATENCY (RTT)</span>
                        <span className="font-bold text-slate-800">{networkInfo.rtt} ms</span>
                      </div>
                    )}
                    {networkInfo.downlink && (
                      <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-slate-400 text-[10px] block">DOWNLINK</span>
                        <span className="font-bold text-slate-800">{networkInfo.downlink} Mbps</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SECTION 1: CELLULAR TOWER / LAC & CELL ID RESOLVER */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Cellular Tower Resolution (LAC & Cell ID)</h2>
                      <p className="text-xs text-slate-500">
                        Resolve telecom base station tower coordinates from Location Area Code (LAC) and Cell ID (CID)
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Telecom BTS Engine
                  </span>
                </div>

                <form onSubmit={handleResolveTower} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                    {/* Country Code (MCC) */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        MCC (Country)
                      </label>
                      <select
                        value={mcc}
                        onChange={(e) => {
                          setMcc(e.target.value);
                          if (e.target.value === '470') setMnc('01');
                          else if (e.target.value === '404') setMnc('10');
                          else if (e.target.value === '310') setMnc('260');
                        }}
                        className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      >
                        <option value="470">470 - Bangladesh</option>
                        <option value="404">404 - India</option>
                        <option value="310">310 - United States</option>
                        <option value="234">234 - United Kingdom</option>
                      </select>
                    </div>

                    {/* Network Code (MNC) */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        MNC (Carrier)
                      </label>
                      {mcc === '470' ? (
                        <select
                          value={mnc}
                          onChange={(e) => setMnc(e.target.value)}
                          className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        >
                          <option value="01">01 - Grameenphone</option>
                          <option value="02">02 - Robi Axiata</option>
                          <option value="03">03 - Banglalink</option>
                          <option value="04">04 - Teletalk</option>
                          <option value="07">07 - Airtel Bangladesh</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={mnc}
                          onChange={(e) => setMnc(e.target.value)}
                          placeholder="e.g. 01"
                          className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      )}
                    </div>

                    {/* LAC / TAC */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        LAC / TAC <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={lac}
                        onChange={(e) => setLac(e.target.value)}
                        placeholder="e.g. 24510"
                        className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    {/* Cell ID / CID */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Cell ID (CID) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cellId}
                        onChange={(e) => setCellId(e.target.value)}
                        placeholder="e.g. 1428590"
                        className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>

                    {/* Radio Type */}
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Radio Generation
                      </label>
                      <select
                        value={radio}
                        onChange={(e: any) => setRadio(e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      >
                        <option value="LTE">LTE (4G)</option>
                        <option value="UMTS">UMTS (3G)</option>
                        <option value="GSM">GSM (2G)</option>
                        <option value="NR">5G-NR</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[11px] text-slate-400">
                      Resolves cell tower antennas and sectors to physical GPS latitude & longitude.
                    </p>
                    <button
                      type="submit"
                      disabled={resolvingTower}
                      className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm"
                    >
                      {resolvingTower ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      Resolve Tower Coordinates
                    </button>
                  </div>
                </form>

                {towerError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{towerError}</span>
                  </div>
                )}

                {/* Resolved Tower Result Card */}
                {towerResult && (
                  <div className="p-5 bg-gradient-to-br from-indigo-50/60 to-slate-50 border border-indigo-100 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{towerResult.carrier}</h4>
                          <p className="text-[11px] text-indigo-700 font-medium">
                            MCC: {towerResult.mcc} &bull; MNC: {towerResult.mnc} &bull; LAC: {towerResult.lac} &bull; CID: {towerResult.cellId} ({towerResult.radio})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={towerResult.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-3 bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200 font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View on Google Maps
                        </a>

                        <button
                          onClick={handleSaveTowerRecord}
                          disabled={savingTower}
                          className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shadow-2xs"
                        >
                          {savingTower ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          Record Tower
                        </button>
                      </div>
                    </div>

                    {/* Coordinates & Tower Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 font-medium">Latitude:</span>
                        <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{towerResult.latitude}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 font-medium">Longitude:</span>
                        <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{towerResult.longitude}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 font-medium">Coverage Radius:</span>
                        <p className="text-sm font-mono font-bold text-indigo-700 mt-0.5">~{towerResult.rangeMeters} meters</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 font-medium">Country / Region:</span>
                        <p className="text-sm font-bold text-slate-900 mt-0.5 truncate">{towerResult.country}</p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                      <span className="text-slate-400 font-medium">Base Station (BTS) Address & Cluster:</span>
                      <p className="text-slate-800 font-medium mt-0.5">{towerResult.address}</p>
                    </div>

                    {towerSavedSuccess && (
                      <p className="text-xs text-emerald-700 bg-emerald-100/60 p-2.5 rounded-lg border border-emerald-200 font-medium">
                        ✓ {towerSavedSuccess}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 2: DEVICE GPS CHECKPOINT SAMPLING */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Direct Device GPS Checkpoint</h3>
                    <p className="text-xs text-slate-500">Sample device hardware GPS coordinates upon explicit authorization</p>
                  </div>
                  <button
                    onClick={requestLocation}
                    disabled={locating}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5 shadow-sm"
                  >
                    {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                    Sample Device GPS
                  </button>
                </div>

                {locationError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{locationError}</span>
                  </div>
                )}

                {deleteMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{deleteMessage}</span>
                  </div>
                )}

                {coords && (
                  <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Latitude:</span>
                        <p className="text-sm font-mono font-bold text-slate-800 mt-0.5">{coords.latitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Longitude:</span>
                        <p className="text-sm font-mono font-bold text-slate-800 mt-0.5">{coords.longitude.toFixed(6)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Accuracy Margin:</span>
                        <p className="text-sm font-mono font-bold text-slate-800 mt-0.5">±{Math.round(coords.accuracy)} meters</p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={handleLogLocation}
                        disabled={logging}
                        className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                      >
                        {logging ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                        Log Verified Coordinate
                      </button>

                      <a
                        href={`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Map View
                      </a>

                      <button
                        onClick={() => setCoords(null)}
                        className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition"
                      >
                        Clear
                      </button>
                    </div>

                    {logSuccess && (
                      <p className="text-xs text-emerald-700 bg-emerald-100/60 p-2.5 rounded-lg border border-emerald-200 font-medium">
                        ✓ {logSuccess}
                      </p>
                    )}
                  </div>
                )}

                {/* Right to Erasure */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Right to Erasure (GDPR Compliance)</h4>
                    <p className="text-[11px] text-slate-500">Purge all logged geolocation coordinates from database records.</p>
                  </div>
                  <button
                    onClick={handleDeleteLocationData}
                    disabled={deleting}
                    className="py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    Delete Telemetry
                  </button>
                </div>
              </div>

              {/* SECTION 3: RECENT CELLULAR TOWER TELEMETRY RECORDS */}
              {towerRecords.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Recorded Base Station (BTS) Towers</h3>
                      <p className="text-xs text-slate-500">Saved cellular tower triangulation points</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                        <tr>
                          <th className="py-2.5 px-3">Carrier</th>
                          <th className="py-2.5 px-3">LAC</th>
                          <th className="py-2.5 px-3">Cell ID</th>
                          <th className="py-2.5 px-3">Coordinates (Lat, Lng)</th>
                          <th className="py-2.5 px-3">Radius</th>
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3 text-right">Map</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {towerRecords.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">
                              {t.carrier || 'Cellular Carrier'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-indigo-700">
                              {t.lac}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                              {t.cellId}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                              {t.latitude?.toFixed(5)}, {t.longitude?.toFixed(5)}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">
                              ~{t.range || 850}m
                            </td>
                            <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                              {new Date(t.recordedAt).toLocaleDateString()}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <a
                                href={`https://www.google.com/maps?q=${t.latitude},${t.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:text-indigo-800 font-semibold"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
