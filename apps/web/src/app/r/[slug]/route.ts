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

    // Record visit asynchronously to avoid blocking redirect
    prisma.$transaction([
      prisma.link.update({
        where: { id: link.id },
        data: { visitCount: { increment: 1 } },
      }),
      prisma.linkEvent.create({
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
      }),
    ]).catch((err) => console.error('Failed to log link telemetry event:', err));

    // Return 302 safe redirect
    return NextResponse.redirect(link.destinationUrl, 302);
  } catch (err: any) {
    console.error('Redirect Error:', err);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
