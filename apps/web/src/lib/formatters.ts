/**
 * Formats a number as Bangladeshi Taka (BDT) with symbol
 * Example: 1450 -> ৳1,450
 */
export function formatPrice(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '৳0';
  }
  return `৳${Math.round(amount).toLocaleString('en-BD')}`;
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
