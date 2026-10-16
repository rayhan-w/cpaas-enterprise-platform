import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const raw = await dbService.getSettings();
  const settings = { ...raw };

  // Strip all sensitive credentials before client response
  delete (settings as any).stripeSecretKey;
  delete (settings as any).metaCapiToken;

  return NextResponse.json({
    settings,
    envStatus: {
      isStripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      isMetaCapiConfigured: Boolean(process.env.META_CAPI_ACCESS_TOKEN || process.env.META_CAPI_TOKEN),
      isMetaPixelConfigured: Boolean(process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || settings.metaPixelId),
      isGA4Configured: Boolean(process.env.GA4_MEASUREMENT_ID || settings.ga4MeasurementId),
      isGTMConfigured: Boolean(process.env.GTM_ID || settings.gtmId),
    },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Prevent writing secret credentials to client-accessible settings file
    delete body.stripeSecretKey;
    delete body.metaCapiToken;

    const updated = await dbService.updateSettings(body);
    const safeUpdated = { ...updated };
    delete (safeUpdated as any).stripeSecretKey;
    delete (safeUpdated as any).metaCapiToken;

    return NextResponse.json({ success: true, settings: safeUpdated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
