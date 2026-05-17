import type { Listing } from './types';

export interface ListingQuery {
  q?: string;
  make?: string;
  bodyType?: string;
  yearFrom?: number;
  yearTo?: number;
  priceMin?: number;
  priceMax?: number;
  transmission?: string;
  fuel?: string;
  city?: string;
  verifiedOnly?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc';
}

export function parseQuery(searchParams: Record<string, string | string[] | undefined>): ListingQuery {
  const get = (k: string) => {
    const v = searchParams[k];
    return typeof v === 'string' && v.length > 0 ? v : undefined;
  };
  const num = (k: string) => {
    const v = get(k);
    return v ? Number(v) : undefined;
  };
  return {
    q: get('q'),
    make: get('make'),
    bodyType: get('bodyType'),
    yearFrom: num('yearFrom'),
    yearTo: num('yearTo'),
    priceMin: num('priceMin'),
    priceMax: num('priceMax'),
    transmission: get('transmission'),
    fuel: get('fuel'),
    city: get('city'),
    verifiedOnly: get('verifiedOnly') === '1',
    sort: (get('sort') as ListingQuery['sort']) ?? 'newest',
  };
}

export function applyQuery(listings: Listing[], query: ListingQuery): Listing[] {
  let out = listings.slice();

  if (query.q) {
    const needle = query.q.toLowerCase();
    out = out.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.make.toLowerCase().includes(needle) ||
        l.model.toLowerCase().includes(needle) ||
        l.description.toLowerCase().includes(needle)
    );
  }
  if (query.make) out = out.filter((l) => l.make.toLowerCase() === query.make!.toLowerCase());
  if (query.bodyType) out = out.filter((l) => l.bodyType === query.bodyType);
  if (query.yearFrom) out = out.filter((l) => l.year >= query.yearFrom!);
  if (query.yearTo) out = out.filter((l) => l.year <= query.yearTo!);
  if (query.priceMin) out = out.filter((l) => l.price >= query.priceMin!);
  if (query.priceMax) out = out.filter((l) => l.price <= query.priceMax!);
  if (query.transmission) out = out.filter((l) => l.transmission === query.transmission);
  if (query.fuel) out = out.filter((l) => l.fuel === query.fuel);
  if (query.city) out = out.filter((l) => l.registrationCity === query.city);

  switch (query.sort) {
    case 'price_asc':
      out.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      out.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
    default:
      out.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }

  return out;
}
