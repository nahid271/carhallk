import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShieldCheck, MapPin, Gauge, Settings2, Fuel } from 'lucide-react';
import { formatLakh, formatKm, formatYear } from '@/lib/format';
import type { Listing, Dealer } from '@/lib/types';
import { cn } from '@/lib/utils';

type Locale = 'bn' | 'en';

interface Props {
  listing: Listing;
  dealer?: Dealer;
  variant?: 'default' | 'compact';
}

export function ListingCard({ listing, dealer, variant = 'default' }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const title = locale === 'bn' && listing.bnTitle ? listing.bnTitle : listing.title;
  const cityKey = listing.registrationCity;
  const cityLabel = t(`cities.${cityKey}`);
  const transmissionLabel = t(`transmission.${listing.transmission}`);
  const fuelLabel = t(`fuel.${listing.fuel}`);

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group block focus-ring rounded-lg"
    >
      <Card
        className={cn(
          'overflow-hidden h-full transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5',
          variant === 'compact' && 'shadow-none border-muted'
        )}
      >
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <Image
            src={listing.photos[0]}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {listing.photoVerified && (
            <div className="absolute top-3 left-3">
              <Badge variant="success" className="bg-success text-success-foreground border-0 shadow-sm">
                <ShieldCheck className="h-3 w-3" />
                {t('common.verified')}
              </Badge>
            </div>
          )}
          {listing.featured && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" className="bg-cta text-cta-foreground border-0 shadow-sm">
                ★
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 tabular">
              {formatYear(listing.year, locale)} · {formatKm(listing.mileageKm, locale)}
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary tabular">
              {locale === 'bn' ? '৳ ' : '৳ '}
              {formatLakh(listing.price, locale)}
            </span>
            {listing.negotiable && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {t('listing.negotiable')}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Settings2 className="h-3 w-3" />
              {transmissionLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <Fuel className="h-3 w-3" />
              {fuelLabel}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {cityLabel}
            </span>
            {dealer && (
              <span className="inline-flex items-center gap-1 text-foreground/80 truncate max-w-[140px]">
                {dealer.verified && <ShieldCheck className="h-3 w-3 text-success" />}
                <span className="truncate">{locale === 'bn' && dealer.bnName ? dealer.bnName : dealer.name}</span>
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
