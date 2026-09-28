'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TrackOpsNavbar from '@/components/trackops/Navbar';
import TrackOpsSidebar from '@/components/trackops/Sidebar';
import {
  Camera,
  Video,
  VideoOff,
  ShieldCheck,
  ShieldAlert,
  Lock,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function CameraFeaturePage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [permissionInfo, setPermissionInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Camera stream state
  const [streaming, setStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // 1. Verify backend authorization
  useEffect(() => {
    async function checkAuth() {
      try {
        setLoading(true);
        const res = await fetchApi('/features/camera/status');
        setAuthorized(Boolean(res?.authorized));
        setPermissionInfo(res?.permission);
        if (!res?.authorized) {
          setAuthError(res?.error || 'Access required. Camera verification requires administrator approval.');
        }
      } catch (err: any) {
        setAuthorized(false);
        setAuthError(err.message || 'Authorization check failed.');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();

    // Cleanup camera stream when navigating away
    return () => {
      stopCamera();
    };
  }, []);

  // 2. Start Camera with explicit user action
  const startCamera = async () => {
    setStreamError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera media devices.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false, // Never request audio
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStreaming(true);
    } catch (err: any) {
      console.error('Camera access denied:', err);
      setStreamError(
        err.name === 'NotAllowedError'
          ? 'Browser camera permission denied. Please allow camera permissions in your browser bar.'
          : err.message || 'Could not initialize video stream.'
      );
      setStreaming(false);
    }
  };

  // 3. Stop Camera and release hardware tracks
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  // 4. Capture Frame (Explicit User Button Click)
  const captureFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
    }
  };

  // 5. Submit frame for cryptographic verification
  const verifyFrame = async () => {
    if (!capturedImage) return;
    setVerifying(true);
    try {
      const res = await fetchApi('/features/camera/verify', {
        method: 'POST',
        body: JSON.stringify({ imageData: capturedImage }),
      });
      setVerificationResult(res);
    } catch (err: any) {
      alert(err.message || 'Verification recording failed.');
    } finally {
      setVerifying(false);
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
      <TrackOpsNavbar title="Camera Verification" />

      <div className="flex flex-1">
        <TrackOpsSidebar />

        <main className="flex-1 p-8 max-w-5xl mx-auto w-full space-y-6">
          {/* Authorization Check: Access Required Page */}
          {!authorized ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center max-w-lg mx-auto my-12 space-y-5">
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">Access Required: Camera Verification</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {authError ||
                    'Under TrackOps default-deny policy, the camera feature remains strictly locked until an administrator reviews and approves your operational purpose.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                <p className="font-semibold text-slate-700">Strict Access Requirements:</p>
                <ul className="list-disc pl-5 text-slate-500 space-y-1">
                  <li>Globally enabled by Super Admin (Platform Owner)</li>
                  <li>Explicit approval granted by an authorized Administrator</li>
                  <li>Clear explanation of purpose provided to the user</li>
                  <li>User clicks button to initiate browser permission prompt</li>
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
            /* Authorized User: Consent-Based Camera Interface */
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-indigo-600" />
                    Consent-Based Camera Verification
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Authorized by: <span className="font-semibold text-slate-700">{permissionInfo?.grantedByName || 'Administrator'}</span>
                    {permissionInfo?.expiresAt && ` · Expires: ${new Date(permissionInfo.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Administrative Clearance Verified</span>
                </div>
              </div>

              {/* Privacy Notice Banner */}
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Privacy & User Control Guarantee:
                </p>
                <p className="text-indigo-700 leading-relaxed">
                  The camera will <strong>never</strong> activate automatically or secretly. Video streams are processed strictly on your local browser. Media hardware tracks are released immediately whenever you stop the stream or exit this page.
                </p>
              </div>

              {streamError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500" />
                  <span>{streamError}</span>
                </div>
              )}

              {/* Live Preview Screen */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Live Hardware Feed</span>
                    {streaming && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span> Camera Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!streaming ? (
                      <button
                        onClick={startCamera}
                        className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4" /> Enable Camera
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={captureFrame}
                          className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition flex items-center gap-1.5"
                        >
                          <Camera className="w-4 h-4" /> Capture Frame
                        </button>
                        <button
                          onClick={stopCamera}
                          className="py-2 px-3 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold text-xs transition flex items-center gap-1.5"
                        >
                          <VideoOff className="w-4 h-4" /> Stop Camera
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative aspect-video max-h-96 w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!streaming ? 'hidden' : ''}`}
                  />
                  {!streaming && (
                    <div className="text-center p-6 space-y-2">
                      <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs font-semibold text-slate-400">Camera Inactive</p>
                      <p className="text-[11px] text-slate-500 max-w-xs">
                        Click "Enable Camera" above to grant browser permission and start live preview.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Captured Frame & Cryptographic Verification */}
              {capturedImage && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">User-Initiated Captured Frame</h3>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <img
                      src={capturedImage}
                      alt="Captured preview"
                      className="w-64 aspect-video object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                    <div className="space-y-3 text-xs flex-1">
                      <p className="text-slate-600 leading-relaxed">
                        This frame was generated upon your explicit capture click. You may verify and record its cryptographic hash into the platform audit log.
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={verifyFrame}
                          disabled={verifying}
                          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition flex items-center gap-1.5"
                        >
                          {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log Cryptographic Hash'}
                        </button>
                        <button
                          onClick={() => setCapturedImage(null)}
                          className="py-2 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg transition"
                        >
                          Discard
                        </button>
                      </div>

                      {verificationResult && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 space-y-1">
                          <p className="font-semibold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            {verificationResult.message}
                          </p>
                          <p className="text-[11px] font-mono text-emerald-700 break-all">
                            SHA-256: {verificationResult.imageHash}
                          </p>
                        </div>
                      )}
                    </div>
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
