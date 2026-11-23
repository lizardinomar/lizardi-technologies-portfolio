import { seedAuctions } from '../data/auctions';
import { site } from './site';

export type Status = 'upcoming' | 'live' | 'past';

export interface Auction {
  id: string;
  slug: string;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
  venue?: string;
  address?: string;
  city?: string;
  zip?: string;
  subtitle?: string;
  previewInfo?: string;
  lotCount?: number;
  highlights?: string[];
  descriptionEs?: string;
  descriptionEn?: string;
  highlightsEs?: string[];
  highlightsEn?: string[];
  inspectionEs?: string;
  inspectionEn?: string;
  photos?: { url: string; alt?: string }[];
  catalogUrl?: string;
  bidspotterUrl?: string;
  customTerms?: string;
}
export type AuctionX = Auction & { status: Status; dateObj: Date };

const slugify = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function statusOf(a: Pick<Auction, 'startDate' | 'endDate'>, now = new Date()): Status {
  const start = new Date(a.startDate);
  const end = a.endDate ? new Date(a.endDate) : new Date(start.getTime() + 24 * 3600 * 1000);
  if (now > end) return 'past';
  if (now >= start) return 'live';
  return 'upcoming';
}

const QUERY = `*[_type == "auction" && defined(startDate) && defined(title) && hideFromSite != true] | order(startDate desc){
  "id": _id, title, subtitle, startDate, endDate, description, venue, address, city, zip, previewInfo, lotCount, customTerms,
  bidspotterUrl,
  highlights, descriptionEs, descriptionEn, highlightsEs, highlightsEn, inspectionEs, inspectionEn,
  "photos": gallery[defined(asset)]{ "url": asset->url, alt },
  "catalogUrl": coalesce(catalogPdf.asset->url, catalogLink)
}`;

async function load(): Promise<Auction[]> {
  const pid = import.meta.env.PUBLIC_SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID;
  if (!pid || pid === 'placeholder') return seedAuctions;
  try {
    const { sanityClient } = await import('sanity:client');
    const rows = await sanityClient.fetch(QUERY);
    const seen = new Map<string, number>();
    return (rows as any[]).map((r) => {
      let slug = slugify(r.title) || r.id;
      const n = (seen.get(slug) ?? 0) + 1;
      seen.set(slug, n);
      if (n > 1) slug += `-${n}`;
      return {
        ...r,
        slug,
        highlights: r.highlights ?? [],
        highlightsEs: r.highlightsEs ?? [],
        highlightsEn: r.highlightsEn ?? [],
        photos: r.photos ?? [],
      } as Auction;
    });
  } catch (e) {
    console.warn('[auctions] Sanity fetch failed, using seed data:', e);
    return seedAuctions;
  }
}

export async function getAuctions(): Promise<AuctionX[]> {
  const now = new Date();
  return (await load()).map((a) => ({ ...a, dateObj: new Date(a.startDate), status: statusOf(a, now) }));
}

const TZ = 'America/Puerto_Rico';
export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) =>
  d.toLocaleDateString('en-US', { timeZone: TZ, ...opts });
export const fmtTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });

export const img = (url: string, w = 1400) => (url.includes('cdn.sanity.io') ? `${url}?w=${w}&auto=format&q=80` : url);
export const cover = (a: Pick<Auction, 'photos'>) => a.photos?.[0]?.url;
const place = (a: Auction) => [a.address, [a.city, a.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
export const bidUrl = (a: Pick<Auction, 'bidspotterUrl'>) => a.bidspotterUrl || site.bidspotter;
export const mapSrc = (a: Auction) =>
  a.address ? `https://www.google.com/maps?q=${encodeURIComponent(place(a))}&output=embed` : '';
export const mapLink = (a: Auction) =>
  a.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place(a))}` : '';
