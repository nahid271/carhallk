import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  MessageCircle,
  Phone,
  MapPin,
  Building2,
  Clock,
} from 'lucide-react';
import { whatsappLink, telLink, formatPhone } from '@/lib/format';
import type { Dealer, Listing } from '@/lib/types';

type Locale = 'bn' | 'en';

export function SellerCard({ dealer, listing }: { dealer: Dealer; listing: Listing }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const name = locale === 'bn' && dealer.bnName ? dealer.bnName : dealer.name;
  const address = locale === 'bn' && dealer.bnAddress ? dealer.bnAddress : dealer.address;

  const message =
    locale === 'bn'
      ? `আসসালামু আলাইকুম, আমি কারবাই-তে আপনার "${listing.bnTitle ?? listing.title}" বিজ্ঞাপনটি দেখলাম। গাড়িটি কি এখনো আছে?`
      : `Hi, I saw your listing "${listing.title}" on CarBuy. Is the car still available?`;

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <Link
            href={`/dealers/${dealer.slug}`}
            className="font-semibold text-lg hover:text-primary transition-colors"
          >
            {name}
          </Link>
          <div className="flex items-center gap-2">
            {dealer.verified && (
              <Badge variant="success">
                <ShieldCheck className="h-3 w-3" />
                {t('dealer.verifiedDealer')}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold tabular">★ {dealer.rating.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground tabular">
            {dealer.reviewCount} {t('dealer.reviewsTitle').toLowerCase()}
          </div>
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{address}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {t('dealer.responseTime')}{' '}
            <strong className="text-foreground">
              {dealer.responseTime === 'fast'
                ? t('dealer.responseFast')
                : t('dealer.responseDay')}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span className="tabular">
            {dealer.totalSold} {t('dealer.totalSold').toLowerCase()}
          </span>
        </div>
      </dl>

      <div className="space-y-2 pt-2">
        <Button asChild variant="success" size="lg" className="w-full">
          <a href={whatsappLink(dealer.phone, message)} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" />
            {t('listing.contactWhatsapp')}
          </a>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <a href={telLink(dealer.phone)}>
            <Phone className="h-4 w-4" />
            {t('listing.contactCall')} · {formatPhone(dealer.phone)}
          </a>
        </Button>
      </div>
    </Card>
  );
}
