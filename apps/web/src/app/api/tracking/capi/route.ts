import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbService } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

function sha256(val?: string): string | undefined {
  if (!val) return undefined;
  const clean = val.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash('sha256').update(clean).digest('hex');
}

function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined;
  // Strip non-digits
  let digits = phone.replace(/\D/g, '');
  // If starts with 0 and is 11 digits (Bangladesh e.g. 01712345678), prepend country code 88
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = '88' + digits;
  }
  return digits;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await dbService.getSettings().catch(() => ({} as any));

    // Access Token read from server environment variable (or saved settings / admin test)
    const capiToken = process.env.META_CAPI_ACCESS_TOKEN || settings.metaCapiToken || body.capiToken;
    const pixelId =
      process.env.META_PIXEL_ID ||
      process.env.NEXT_PUBLIC_META_PIXEL_ID ||
      settings.metaPixelId ||
      body.pixelId;
    const testCode = process.env.META_TEST_EVENT_CODE || settings.metaTestEventCode || body.testEventCode;

    if (!pixelId || !capiToken) {
      return NextResponse.json({
        success: false,
        warning: 'Meta Pixel ID and CAPI Access Token are not configured on server.',
      });
    }

    // Client Network & User-Agent Information
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      req.headers.get('cf-connecting-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Mozilla/5.0';

    // Cookies: _fbp and _fbc from HTTP headers or client payload
    const fbp = body.fbp || req.cookies.get('_fbp')?.value;
    const fbc = body.fbc || req.cookies.get('_fbc')?.value;

    // User Data matching (Hashed with SHA-256 according to Meta specification)
    const phoneRaw = normalizePhone(body.customerPhone);
    const emailRaw = body.customerEmail;
    const nameParts = (body.customerName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const userData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;
    if (phoneRaw) userData.ph = [sha256(phoneRaw)];
    if (emailRaw) userData.em = [sha256(emailRaw)];
    if (firstName) userData.fn = [sha256(firstName)];
    if (lastName) userData.ln = [sha256(lastName)];
    userData.country = [sha256('bd')];

    // Custom Data
    const customData: Record<string, any> = {
      currency: body.currency || 'BDT',
      value: Number(body.value) || 0,
    };

    if (body.items && Array.isArray(body.items) && body.items.length > 0) {
      customData.content_type = 'product';
      customData.content_ids = body.items.map((i: any) => String(i.id || i.productId));
      customData.contents = body.items.map((i: any) => ({
        id: String(i.id || i.productId),
        quantity: Number(i.quantity) || 1,
        item_price: Number(i.price) || 0,
      }));
      customData.num_items =
        Number(body.numItems) ||
        body.items.reduce((sum: number, i: any) => sum + (Number(i.quantity) || 1), 0);
    }

    // Determine event source URL
    const host = req.headers.get('host') || 'jawatamart.com';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const defaultUrl = `${proto}://${host}`;
    const eventSourceUrl = body.eventSourceUrl || defaultUrl;

    // Build Event Payload
    const eventPayload: Record<string, any> = {
      event_name: body.eventName || 'PageView',
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event_source_url: eventSourceUrl,
      action_source: 'website',
      user_data: userData,
      custom_data: customData,
    };

    const requestBody: Record<string, any> = {
      data: [eventPayload],
    };

    // Attach test_event_code if in testing mode
    if (testCode && testCode.trim() !== '') {
      requestBody.test_event_code = testCode.trim();
    }

    // Dispatch to Meta Graph API
    const metaRes = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      console.error('Meta CAPI Error:', metaData);
      return NextResponse.json({ success: false, metaError: metaData }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      eventsReceived: metaData.events_received,
      fbtrace_id: metaData.fbtrace_id,
      eventId: eventPayload.event_id,
      eventName: eventPayload.event_name,
      testMode: Boolean(testCode),
    });
  } catch (err: any) {
    console.error('CAPI Internal Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET endpoint to inspect CAPI health status without exposing secret token
export async function GET() {
  try {
    const settings = await dbService.getSettings().catch(() => ({} as any));
    const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || settings.metaPixelId;
    const hasToken = Boolean(process.env.META_CAPI_ACCESS_TOKEN || settings.metaCapiToken);
    const testCode = process.env.META_TEST_EVENT_CODE || settings.metaTestEventCode;

    return NextResponse.json({
      status: 'active',
      pixelConfigured: Boolean(pixelId),
      pixelId: pixelId ? `${pixelId.substring(0, 4)}...${pixelId.slice(-4)}` : null,
      capiConfigured: hasToken,
      testEventCode: testCode || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
