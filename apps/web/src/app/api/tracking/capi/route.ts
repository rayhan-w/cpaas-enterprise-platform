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
  // If starts with 0 and 11 digits (BD format e.g. 01712345678), prepend 880
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = '88' + digits;
  }
  return digits;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const settings = await dbService.getSettings();

    const pixelId = settings.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID;
    const capiToken = settings.metaCapiToken || process.env.META_CAPI_ACCESS_TOKEN;
    const testCode = settings.metaTestEventCode || process.env.META_TEST_EVENT_CODE;

    if (!pixelId || !capiToken) {
      // If CAPI not yet configured in admin, return informative response
      return NextResponse.json({
        success: false,
        warning: 'Meta Pixel ID or CAPI Access Token is not configured yet in Admin Settings.',
      });
    }

    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Mozilla/5.0';

    const phoneRaw = normalizePhone(body.customerPhone);
    const emailRaw = body.customerEmail;
    const nameParts = (body.customerName || '').trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Build Meta CAPI Payload
    const userData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };

    if (phoneRaw) userData.ph = [sha256(phoneRaw)];
    if (emailRaw) userData.em = [sha256(emailRaw)];
    if (firstName) userData.fn = [sha256(firstName)];
    if (lastName) userData.ln = [sha256(lastName)];
    userData.country = [sha256('bd')];

    const customData: Record<string, any> = {
      currency: body.currency || 'BDT',
      value: Number(body.value) || 0,
    };

    if (body.items && Array.isArray(body.items)) {
      customData.content_type = 'product';
      customData.contents = body.items.map((i: any) => ({
        id: i.id || i.productId,
        quantity: i.quantity || 1,
        item_price: Number(i.price) || 0,
      }));
    }

    const eventPayload: Record<string, any> = {
      event_name: body.eventName || 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.eventId || `evt_${Date.now()}`,
      event_source_url: body.eventSourceUrl || 'https://mysterious-einstein-iota.vercel.app',
      action_source: 'website',
      user_data: userData,
      custom_data: customData,
    };

    const requestBody: Record<string, any> = {
      data: [eventPayload],
    };

    if (testCode) {
      requestBody.test_event_code = testCode;
    }

    // Call Meta Graph API
    const metaRes = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

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
    });
  } catch (err: any) {
    console.error('CAPI Internal Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET endpoint to quickly test CAPI connectivity from Admin
export async function GET() {
  try {
    const settings = await dbService.getSettings();
    const pixelId = settings.metaPixelId || process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const hasToken = Boolean(settings.metaCapiToken || process.env.META_CAPI_ACCESS_TOKEN);

    return NextResponse.json({
      status: 'active',
      pixelConfigured: Boolean(pixelId),
      pixelId: pixelId ? `${pixelId.substring(0, 4)}...${pixelId.slice(-4)}` : null,
      capiConfigured: hasToken,
      testEventCode: settings.metaTestEventCode || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
