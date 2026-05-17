import { getTranslations, setRequestLocale, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListingGallery } from '@/components/listings/ListingGallery';
import { ListingCard } from '@/components/listings/ListingCard';
import { SellerCard } from '@/components/listings/SellerCard';
import {
  formatLakh,
  formatBdt,
  formatKm,
  formatYear,
  formatRelative,
} from '@/lib/format';
import {
  getListingById,
  getDealerById,
  getRelatedListings,
} from '@/lib/seed-data';
import {
  ShieldCheck,
  Camera,
  Flag,
  Eye,
  Calendar,
  Gauge,
  Settings2,
  Fuel,
  Car,
  Palette,
  Hash,
  MapPin,
  ChevronRight,
} from 'lucide-react';

type Locale = 'bn' | 'en';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: 'Listing not found' };
  return {
    title: `${listing.title} · CarBuy`,
    description: listing.description.slice(0, 160),
  };
}

export default async function ListingDetail({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  setRequestLocale(localeParam);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const listing = getListingById(id);
  if (!listing) notFound();
  const dealer = getDealerById(listing.dealerId);
  if (!dealer) notFound();
  const related = getRelatedListings(listing);

  const title = locale === 'bn' && listing.bnTitle ? listing.bnTitle : listing.title;
  const description =
    locale === 'bn' && listing.bnDescription
      ? listing.bnDescription
      : listing.description;
  const color = locale === 'bn' && listing.bnColor ? listing.bnColor : listing.color;
  const cityLabel = t(`cities.${listing.registrationCity}`);

  const specs = [
    { icon: Calendar, label: t('listing.year'), value: formatYear(listing.year, locale) },
    { icon: Gauge, label: t('listing.mileage'), value: formatKm(listing.mileageKm, locale) },
    { icon: Settings2, label: t('listing.transmission'), value: t(`transmission.${listing.transmission}`) },
    { icon: Fuel, label: t('listing.fuel'), value: t(`fuel.${listing.fuel}`) },
    { icon: Car, label: t('listing.bodyType'), value: t(`bodyTypes.${listing.bodyType}`) },
    { icon: Palette, label: t('listing.color'), value: color },
    { icon: Hash, label: t('listing.engine'), value: `${listing.engineCc} cc` },
    { icon: MapPin, label: t('listing.registration'), value: cityLabel },
  ];

  return (
    <div className="bg-muted/20">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm text-muted-foreground">
        <nav className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-foreground">{t('nav.home')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/listings" className="hover:text-foreground">{t('nav.browse')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate">{title}</span>
        </nav>
      </div>

      <div className="container pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
          <div className="space-y-6">
            <ListingGallery photos={listing.photos} alt={title} />

            {/* Title + price block */}
            <Card className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold leading-tight">{title}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {listing.photoVerified && (
                      <Badge variant="success">
                        <Camera className="h-3 w-3" />
                        {t('common.verified')}
                      </Badge>
                    )}
                    {dealer.verified && (
                      <Badge variant="success">
                        <ShieldCheck className="h-3 w-3" />
                        {t('dealer.verifiedDealer')}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span className="tabular">{listing.views}</span>{' '}
                      {t('listing.viewsLabel')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {t('listing.updatedOn')} {formatRelative(listing.updatedAt, locale)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary tabular">
                    ৳ {formatLakh(listing.price, locale)}
                  </div>
                  <div className="text-xs text-muted-foreground tabular">
                    {formatBdt(listing.price, locale)}
                    {listing.negotiable && (
                      <span className="ml-1">· {t('listing.negotiable')}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Specifications */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('listing.specifications')}</h2>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((s) => (
                  <div key={s.label} className="space-y-1">
                    <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
                      <s.icon className="h-3.5 w-3.5" />
                      {s.label}
                    </dt>
                    <dd className="font-semibold text-sm">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-3">{t('listing.description')}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">{description}</p>
            </Card>

            {/* Report */}
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
              <Flag className="h-4 w-4" />
              {t('listing.reportTitle')}
            </button>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <SellerCard dealer={dealer} listing={listing} />
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="text-xl font-bold">{t('listing.relatedListings')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((l) => (
                <ListingCard key={l.id} listing={l} dealer={getDealerById(l.dealerId)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
