import { getTranslations, setRequestLocale, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListingCard } from '@/components/listings/ListingCard';
import {
  ShieldCheck,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  Clock,
  Calendar,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { getDealerById, getListingsByDealer } from '@/lib/seed-data';
import { whatsappLink, telLink, formatDate, formatPhone } from '@/lib/format';

type Locale = 'bn' | 'en';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dealer = getDealerById(slug);
  if (!dealer) return { title: 'Dealer not found' };
  return { title: `${dealer.name} · CarBuy` };
}

export default async function DealerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  setRequestLocale(localeParam);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const dealer = getDealerById(slug);
  if (!dealer) notFound();
  const dealerListings = getListingsByDealer(dealer.id);

  const name = locale === 'bn' && dealer.bnName ? dealer.bnName : dealer.name;
  const address = locale === 'bn' && dealer.bnAddress ? dealer.bnAddress : dealer.address;
  const cityLabel = t(`cities.${dealer.city}`);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container py-4 text-sm text-muted-foreground">
        <nav className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-foreground">{t('nav.home')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/listings" className="hover:text-foreground">{t('nav.dealers')}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground truncate">{name}</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {dealer.verified && (
                  <Badge variant="success" className="bg-success text-success-foreground border-0">
                    <ShieldCheck className="h-3 w-3" />
                    {t('dealer.verifiedDealer')}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/85">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {address}
                </span>
                <span className="inline-flex items-center gap-1.5 tabular">
                  <Star className="h-4 w-4 fill-current text-cta" />
                  {dealer.rating.toFixed(1)} ({dealer.reviewCount})
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild variant="success" size="lg">
                <a href={whatsappLink(dealer.phone)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="cta" size="lg">
                <a href={telLink(dealer.phone)}>
                  <Phone className="h-4 w-4" />
                  {formatPhone(dealer.phone)}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Calendar}
            label={t('dealer.listedSince')}
            value={formatDate(dealer.joinedAt, locale)}
          />
          <StatCard
            icon={TrendingUp}
            label={t('dealer.activeListings')}
            value={String(dealerListings.length)}
          />
          <StatCard
            icon={ShieldCheck}
            label={t('dealer.totalSold')}
            value={String(dealer.totalSold)}
          />
          <StatCard
            icon={Clock}
            label={t('dealer.responseTime')}
            value={
              dealer.responseTime === 'fast'
                ? t('dealer.responseFast')
                : t('dealer.responseDay')
            }
          />
        </div>
      </div>

      {/* Inventory */}
      <div className="container pb-14">
        <h2 className="text-xl font-bold mb-5">
          {t('dealer.currentInventory')}{' '}
          <span className="text-muted-foreground font-normal tabular">
            ({dealerListings.length})
          </span>
        </h2>
        {dealerListings.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">
            No active listings right now.
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {dealerListings.map((l) => (
              <ListingCard key={l.id} listing={l} dealer={dealer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-secondary text-primary flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground truncate">{label}</div>
          <div className="font-semibold text-sm tabular truncate">{value}</div>
        </div>
      </div>
    </Card>
  );
}
