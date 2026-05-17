/**
 * BD-locale number, currency, phone, and date helpers.
 *
 * Lakh formatting (৳ 8,50,000 reads as "8.5 lakh") follows the South Asian
 * grouping convention — required for any consumer product targeting BD readers.
 */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
}

/** Group an integer using the Indian/Bangladeshi convention: last 3 then groups of 2. */
function groupSouthAsian(n: number): string {
  const s = Math.round(Math.abs(n)).toString();
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${grouped},${last3}`;
}

export function formatBdt(amount: number, locale: 'bn' | 'en' = 'en'): string {
  const grouped = groupSouthAsian(amount);
  const symbol = '৳';
  return locale === 'bn'
    ? `${symbol} ${toBengaliDigits(grouped)}`
    : `${symbol} ${grouped}`;
}

/** "8.5 lakh" / "৮.৫ লাখ" — short form for headlines and cards. */
export function formatLakh(amount: number, locale: 'bn' | 'en' = 'en'): string {
  const lakh = amount / 100000;
  const crore = amount / 10000000;
  if (crore >= 1) {
    const v = Number(crore.toFixed(crore >= 10 ? 0 : 2)).toString();
    return locale === 'bn'
      ? `${toBengaliDigits(v)} কোটি`
      : `${v} crore`;
  }
  const v = Number(lakh.toFixed(lakh >= 10 ? 1 : 2)).toString();
  return locale === 'bn' ? `${toBengaliDigits(v)} লাখ` : `${v} lakh`;
}

export function formatKm(km: number, locale: 'bn' | 'en' = 'en'): string {
  const grouped = groupSouthAsian(km);
  return locale === 'bn'
    ? `${toBengaliDigits(grouped)} কিমি`
    : `${grouped} km`;
}

export function formatYear(year: number, locale: 'bn' | 'en' = 'en'): string {
  return locale === 'bn' ? toBengaliDigits(year) : String(year);
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  // Normalize to +8801XXXXXXXXX
  let national = digits;
  if (national.startsWith('880')) national = national.slice(3);
  if (national.startsWith('0')) national = national.slice(1);
  return `+880 ${national.slice(0, 4)}-${national.slice(4)}`;
}

export function whatsappLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  let normalized = digits;
  if (normalized.startsWith('0')) normalized = '880' + normalized.slice(1);
  if (!normalized.startsWith('880')) normalized = '880' + normalized;
  const params = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${normalized}${params}`;
}

export function telLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  let normalized = digits;
  if (normalized.startsWith('0')) normalized = '880' + normalized.slice(1);
  if (!normalized.startsWith('880')) normalized = '880' + normalized;
  return `tel:+${normalized}`;
}

/** DD/MM/YYYY — BD-standard date format. */
export function formatDate(iso: string, locale: 'bn' | 'en' = 'en'): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  const formatted = `${dd}/${mm}/${yyyy}`;
  return locale === 'bn' ? toBengaliDigits(formatted) : formatted;
}

/** "3 days ago" / "৩ দিন আগে" for relative timestamps in listing cards. */
export function formatRelative(iso: string, locale: 'bn' | 'en' = 'en'): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (days >= 30) {
    const months = Math.floor(days / 30);
    return locale === 'bn'
      ? `${toBengaliDigits(months)} মাস আগে`
      : `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
  if (days >= 1) {
    return locale === 'bn'
      ? `${toBengaliDigits(days)} দিন আগে`
      : `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
  if (hours >= 1) {
    return locale === 'bn'
      ? `${toBengaliDigits(hours)} ঘণ্টা আগে`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }
  return locale === 'bn' ? 'এইমাত্র' : 'just now';
}
