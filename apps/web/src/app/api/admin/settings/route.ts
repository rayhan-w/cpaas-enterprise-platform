import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  const raw = await dbService.getSettings();
  const settings = { ...raw };

  // Strip all sensitive credentials before client response
  delete (settings as any).stripeSecretKey;
  delete (settings as any).metaCapiToken;
  delete (settings as any).bkashMerchantNumber;
  delete (settings as any).nagadMerchantNumber;
  delete (settings as any).bankAccountNumber;
  delete (settings as any).metaPixelId;
  delete (settings as any).metaTestEventCode;

  return NextResponse.json({
    settings,
    envStatus: {
      isStripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
      isMetaCapiConfigured: Boolean(process.env.META_CAPI_ACCESS_TOKEN || process.env.META_CAPI_TOKEN),
      isBkashConfigured: Boolean(raw.bkashMerchantNumber),
      isNagadConfigured: Boolean(raw.nagadMerchantNumber),
      isBankConfigured: Boolean(raw.bankAccountNumber),
      isMetaPixelConfigured: Boolean(process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || raw.metaPixelId),
      isMetaTestEventConfigured: Boolean(raw.metaTestEventCode),
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

    const current = await dbService.getSettings();

    // Preserve existing credentials if masked or omitted
    if (!body.bkashMerchantNumber || String(body.bkashMerchantNumber).includes('•')) {
      body.bkashMerchantNumber = current.bkashMerchantNumber;
    }
    if (!body.nagadMerchantNumber || String(body.nagadMerchantNumber).includes('•')) {
      body.nagadMerchantNumber = current.nagadMerchantNumber;
    }
    if (!body.bankAccountNumber || String(body.bankAccountNumber).includes('•')) {
      body.bankAccountNumber = current.bankAccountNumber;
    }
    if (!body.metaPixelId || String(body.metaPixelId).includes('•')) {
      body.metaPixelId = current.metaPixelId;
    }
    if (!body.metaTestEventCode || String(body.metaTestEventCode).includes('•')) {
      body.metaTestEventCode = current.metaTestEventCode;
    }

    const updated = await dbService.updateSettings(body);
    const safeUpdated = { ...updated };
    delete (safeUpdated as any).stripeSecretKey;
    delete (safeUpdated as any).metaCapiToken;
    delete (safeUpdated as any).bkashMerchantNumber;
    delete (safeUpdated as any).nagadMerchantNumber;
    delete (safeUpdated as any).bankAccountNumber;
    delete (safeUpdated as any).metaPixelId;
    delete (safeUpdated as any).metaTestEventCode;

    return NextResponse.json({ success: true, settings: safeUpdated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
