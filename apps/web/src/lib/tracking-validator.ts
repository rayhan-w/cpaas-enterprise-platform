/**
 * Validation utilities for Google Tag Manager (GTM) and Google Analytics 4 (GA4) identifiers.
 */

export function isValidGtmId(id?: string | null): boolean {
  if (!id) return false;
  const trimmed = id.trim();
  if (trimmed.includes('<') || trimmed.includes('>') || trimmed.toLowerCase().includes('script')) {
    return false;
  }
  return /^GTM-[A-Za-z0-9_-]+$/i.test(trimmed);
}

export function isValidGa4Id(id?: string | null): boolean {
  if (!id) return false;
  const trimmed = id.trim();
  if (trimmed.includes('<') || trimmed.includes('>') || trimmed.toLowerCase().includes('script')) {
    return false;
  }
  return /^G-[A-Za-z0-9]+$/i.test(trimmed);
}

export function validateGtmInput(id?: string | null): { valid: boolean; error?: string } {
  if (!id || !id.trim()) {
    // Empty is valid for saving (disables script), but triggers a warning in Admin UI
    return { valid: true };
  }
  const trimmed = id.trim();
  if (trimmed.includes('<') || trimmed.includes('>') || trimmed.toLowerCase().includes('script') || trimmed.toLowerCase().includes('iframe')) {
    return {
      valid: false,
      error: 'শুধু Container ID দিন (যেমন: GTM-XXXXXXX), পুরো স্ক্রিপ্ট পেস্ট করবেন না।'
    };
  }
  if (!/^GTM-[A-Za-z0-9_-]+$/i.test(trimmed)) {
    return {
      valid: false,
      error: "অবৈধ GTM Container ID! এটি 'GTM-' দিয়ে শুরু হতে হবে (যেমন: GTM-XXXXXXX)।"
    };
  }
  return { valid: true };
}

export function validateGa4Input(id?: string | null): { valid: boolean; error?: string } {
  if (!id || !id.trim()) {
    // Empty is valid for saving (disables script), but triggers a warning in Admin UI
    return { valid: true };
  }
  const trimmed = id.trim();
  if (trimmed.includes('<') || trimmed.includes('>') || trimmed.toLowerCase().includes('script')) {
    return {
      valid: false,
      error: 'শুধু Measurement ID দিন (যেমন: G-XXXXXXXXXX), পুরো স্ক্রিপ্ট পেস্ট করবেন না।'
    };
  }
  if (!/^G-[A-Za-z0-9]+$/i.test(trimmed)) {
    return {
      valid: false,
      error: "অবৈধ GA4 Measurement ID! এটি 'G-' দিয়ে শুরু হতে হবে (যেমন: G-XXXXXXXXXX)।"
    };
  }
  return { valid: true };
}
