import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashVisitorIp } from '@/lib/security';

function parseUserAgent(ua: string) {
  let deviceCategory = 'Desktop';
  if (/mobile/i.test(ua)) deviceCategory = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) deviceCategory = 'Tablet';

  let browserFamily = 'Other';
  if (/edg/i.test(ua)) browserFamily = 'Edge';
  else if (/chrome|crios/i.test(ua)) browserFamily = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browserFamily = 'Firefox';
  else if (/safari/i.test(ua)) browserFamily = 'Safari';

  let osFamily = 'Other';
  if (/windows/i.test(ua)) osFamily = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) osFamily = 'macOS';
  else if (/android/i.test(ua)) osFamily = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) osFamily = 'iOS';
  else if (/linux/i.test(ua)) osFamily = 'Linux';

  return { deviceCategory, browserFamily, osFamily };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.redirect(new URL('/not-found', req.url));
    }

    const link = await prisma.link.findUnique({
      where: { slug },
    });

    if (!link) {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head><title>Link Not Found - TrackOps</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
          <body style="font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; background:#f8fafc; margin:0;">
            <div style="text-align:center; padding:2rem; background:white; border-radius:12px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); max-width:400px;">
              <h2 style="color:#0f172a; margin-bottom:8px;">Link Not Found</h2>
              <p style="color:#64748b; font-size:14px; margin-bottom:20px;">The short link you requested does not exist or was removed.</p>
              <a href="/" style="display:inline-block; padding:8px 16px; background:#2563eb; color:white; border-radius:6px; text-decoration:none; font-size:14px;">Return Home</a>
            </div>
          </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Check if active and not expired
    if (!link.isActive || (link.expiresAt && new Date() > link.expiresAt)) {
      return new Response(
        `<!DOCTYPE html>
        <html>
          <head><title>Link Inactive - TrackOps</title><meta name="viewport" content="width=device-width, initial-scale=1"></head>
          <body style="font-family: sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; background:#f8fafc; margin:0;">
            <div style="text-align:center; padding:2rem; background:white; border-radius:12px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); max-width:400px;">
              <h2 style="color:#0f172a; margin-bottom:8px;">Link Inactive or Expired</h2>
              <p style="color:#64748b; font-size:14px; margin-bottom:20px;">This short link has been deactivated or its scheduled expiration date has passed.</p>
              <a href="/" style="display:inline-block; padding:8px 16px; background:#64748b; color:white; border-radius:6px; text-decoration:none; font-size:14px;">Return Home</a>
            </div>
          </body>
        </html>`,
        { status: 410, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Privacy-Friendly Telemetry: Never save raw IP!
    const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const visitorHash = hashVisitorIp(rawIp);
    const ua = req.headers.get('user-agent') || '';
    const { deviceCategory, browserFamily, osFamily } = parseUserAgent(ua);
    const referrer = req.headers.get('referer') || 'Direct';

    let eventId = '';
    try {
      await prisma.link.update({
        where: { id: link.id },
        data: { visitCount: { increment: 1 } },
      });

      const event = await prisma.linkEvent.create({
        data: {
          linkId: link.id,
          visitorHash,
          deviceCategory,
          browserFamily,
          osFamily,
          referrer,
          country: req.headers.get('x-vercel-ip-country') || 'Global',
          region: req.headers.get('x-vercel-ip-country-region') || 'Unknown',
          city: req.headers.get('x-vercel-ip-city') || null,
        },
      });
      eventId = event.id;
    } catch (dbErr) {
      console.error('Failed to log link telemetry event:', dbErr);
    }

    // Return HTML Interstitial with Browser Permission Verification & Fast Forward
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifying Connection...</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #0f172a;
      color: #f8fafc;
      padding: 1.5rem;
    }
    .card {
      text-align: center;
      padding: 2.5rem 2rem;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 1.25rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      max-width: 440px;
      width: 100%;
    }
    .spinner-box {
      position: relative;
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
    }
    .spinner {
      width: 100%;
      height: 100%;
      border: 4px solid #334155;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: #f8fafc; }
    p { font-size: 0.875rem; color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.5; }
    .status-badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 0.85rem 1.5rem;
      background: #4f46e5;
      color: white;
      text-decoration: none;
      border-radius: 0.625rem;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
    }
    .btn:hover { background: #4338ca; }
    .subtext {
      margin-top: 1rem;
      font-size: 0.75rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner-box">
      <div class="spinner"></div>
    </div>
    <h2>Connecting to Destination...</h2>
    <p>Please wait a moment while your secure connection is established.</p>
    <div class="status-badge" id="statusBadge">Verifying security & location...</div>
    <a id="forwardBtn" href="${link.destinationUrl}" class="btn">Click Here to Continue</a>
    <p class="subtext">You will be redirected automatically.</p>
  </div>

  <script>
    (function() {
      const destUrl = ${JSON.stringify(link.destinationUrl)};
      const eventId = ${JSON.stringify(eventId)};
      const linkId = ${JSON.stringify(link.id)};
      let hasForwarded = false;

      function proceed() {
        if (!hasForwarded) {
          hasForwarded = true;
          window.location.replace(destUrl);
        }
      }

      document.getElementById('forwardBtn').addEventListener('click', function(e) {
        e.preventDefault();
        proceed();
      });

      // Request Geolocation Consent
      if (navigator.geolocation && eventId) {
        navigator.geolocation.getCurrentPosition(
          function(pos) {
            document.getElementById('statusBadge').innerText = 'Location verified. Redirecting...';
            // Send coordinates to server
            fetch('/api/links/' + linkId + '/telemetry', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                eventId: eventId,
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy
              })
            }).finally(function() {
              setTimeout(proceed, 400);
            });
          },
          function(err) {
            // Permission denied or timed out
            document.getElementById('statusBadge').innerText = 'Continuing to destination...';
            setTimeout(proceed, 500);
          },
          { timeout: 4500, enableHighAccuracy: true, maximumAge: 0 }
        );

        // Safety fallback timer if prompt is dismissed or pending
        setTimeout(proceed, 4000);
      } else {
        setTimeout(proceed, 1200);
      }
    })();
  </script>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    console.error('Redirect Error:', err);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
