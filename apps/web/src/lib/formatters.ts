/**
 * Robust Price Parser
 * Strips commas, currency symbols (৳, Tk, BDT, $), spaces, converts Bengali digits (০-৯)
 * Returns valid positive number or null if invalid/empty/zero/negative
 */
export function parseRobustPrice(input: any): number | null {
  if (input === null || input === undefined) return null;
  let str = String(input).trim();
  if (!str) return null;

  // Convert Bengali numerals (০-৯) to standard Arabic numerals (0-9)
  const bnDigits: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  str = str.replace(/[০-৯]/g, (char) => bnDigits[char] || char);

  // Strip commas, currency signs, spaces
  str = str.replace(/[৳,\s]|tk|bdt|\$/gi, '');

  const num = Number(str);
  if (isNaN(num) || !isFinite(num) || num <= 0) {
    return null;
  }
  return Math.round(num * 100) / 100;
}

/**
 * Formats a number as Bangladeshi Taka (BDT) with symbol
 * Example: 1450 -> ৳1,450
 * Never silently displays ৳0 if a valid fallback price exists.
 */
export function formatPrice(amount: number | string | null | undefined, fallbackPrice: number = 0): string {
  const parsed = parseRobustPrice(amount);
  if (parsed === null) {
    if (fallbackPrice > 0) {
      return `৳${Math.round(fallbackPrice).toLocaleString('en-BD')}`;
    }
    return '৳0';
  }
  return `৳${Math.round(parsed).toLocaleString('en-BD')}`;
}

/**
 * Formats a date into a clean readable string
 * Example: "2026-03-01T12:00:00Z" -> "01 Mar 2026, 06:00 PM"
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Validates a Bangladeshi mobile number (013, 014, 015, 016, 017, 018, 019)
 */
export function isValidBDPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\+]/g, '');
  // Handles 017XXXXXXXX or 88017XXXXXXXX
  const bdPhoneRegex = /^(?:8801|01)[3-9]\d{8}$/;
  return bdPhoneRegex.test(cleaned);
}
