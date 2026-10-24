import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';
import { validateGtmInput, validateGa4Input } from '@/lib/tracking-validator';

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

    // 1. Validate GTM Container ID if provided
    if (body.gtmId !== undefined) {
      const gtmValidation = validateGtmInput(body.gtmId);
      if (!gtmValidation.valid) {
        return NextResponse.json({ error: gtmValidation.error }, { status: 400 });
      }
      body.gtmId = body.gtmId ? body.gtmId.trim().toUpperCase() : '';
    }

    // 2. Validate GA4 Measurement ID if provided
    if (body.ga4MeasurementId !== undefined) {
      const ga4Validation = validateGa4Input(body.ga4MeasurementId);
      if (!ga4Validation.valid) {
        return NextResponse.json({ error: ga4Validation.error }, { status: 400 });
      }
      body.ga4MeasurementId = body.ga4MeasurementId ? body.ga4MeasurementId.trim().toUpperCase() : '';
    }

    // 3. Re-read fresh data before saving to prevent any overwrite or data loss
    const current = await dbService.getSettings();

    // 4. Merge fresh settings with incoming changes
    const merged: any = {
      ...current,
      ...body,
      // Preserve existing credentials if masked or omitted
      bkashMerchantNumber: (!body.bkashMerchantNumber || String(body.bkashMerchantNumber).includes('•'))
        ? current.bkashMerchantNumber
        : body.bkashMerchantNumber,
      nagadMerchantNumber: (!body.nagadMerchantNumber || String(body.nagadMerchantNumber).includes('•'))
        ? current.nagadMerchantNumber
        : body.nagadMerchantNumber,
      bankAccountNumber: (!body.bankAccountNumber || String(body.bankAccountNumber).includes('•'))
        ? current.bankAccountNumber
        : body.bankAccountNumber,
      metaPixelId: (!body.metaPixelId || String(body.metaPixelId).includes('•'))
        ? current.metaPixelId
        : body.metaPixelId,
      metaTestEventCode: (!body.metaTestEventCode || String(body.metaTestEventCode).includes('•'))
        ? current.metaTestEventCode
        : body.metaTestEventCode,
      // Ensure critical store delivery numbers remain rock solid
      insideDhakaFee: body.insideDhakaFee ?? body.insideDhakaDeliveryFee ?? current.insideDhakaFee ?? 70,
      suburbsDhakaFee: body.suburbsDhakaFee ?? body.suburbsDhakaDeliveryFee ?? current.suburbsDhakaFee ?? 100,
      outsideDhakaFee: body.outsideDhakaFee ?? body.outsideDhakaDeliveryFee ?? current.outsideDhakaFee ?? 130,
      freeDeliveryThreshold: body.freeDeliveryThreshold ?? current.freeDeliveryThreshold ?? 2000,
      districtZoneMapping: body.districtZoneMapping !== undefined ? body.districtZoneMapping : current.districtZoneMapping,
    };

    const updated = await dbService.updateSettings(merged);
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
