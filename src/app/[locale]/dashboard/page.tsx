import Image from 'next/image';
import { getTranslations, setRequestLocale, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, MessageCircle, BarChart3, Package, ShieldCheck } from 'lucide-react';
import { getListingsByDealer, dealers } from '@/lib/seed-data';
import { formatLakh, formatRelative } from '@/lib/format';

type Locale = 'bn' | 'en';

export const metadata = { title: 'Dealer dashboard' };

// Demo dashboard always renders against the first dealer in seed data. Real
// auth will swap this for the logged-in session.
const DEMO_DEALER = dealers[0];

const MOCK_LEADS = [
  {
    id: '1',
    buyerName: 'Rashid Karim',
    listingTitle: 'Toyota Axio Hybrid 2018',
    via: 'whatsapp',
    receivedAt: '2026-05-15T14:23:00Z',
  },
  {
    id: '2',
    buyerName: 'Sumaiya Akter',
    listingTitle: 'Toyota Prius 2016',
    via: 'call',
    receivedAt: '2026-05-15T09:05:00Z',
  },
  {
    id: '3',
    buyerName: 'Mohammed Hossain',
    listingTitle: 'Toyota Axio Hybrid 2018',
    via: 'whatsapp',
    receivedAt: '2026-05-14T18:42:00Z',
  },
];

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  setRequestLocale(localeParam);
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();

  const myListings = getListingsByDealer(DEMO_DEALER.id);
  const dealerName =
    locale === 'bn' && DEMO_DEALER.bnName ? DEMO_DEALER.bnName : DEMO_DEALER.name;
  const totalViews = myListings.reduce((sum, l) => sum + l.views, 0);

  return (
    <div className="container py-8 md:py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t('dashboard.title')}</p>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            {dealerName}
            {DEMO_DEALER.verified && (
              <ShieldCheck className="h-6 w-6 text-success" />
            )}
          </h1>
        </div>
        <Button variant="cta" size="lg" asChild>
          <Link href="/dashboard">
            <Plus className="h-4 w-4" />
            {t('dashboard.addListing')}
          </Link>
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label={t('dashboard.totalListings')}
          value={String(myListings.length)}
        />
        <StatCard
          icon={ShieldCheck}
          label={t('dashboard.activeListings')}
          value={String(myListings.filter((l) => l.photoVerified).length)}
        />
        <StatCard
          icon={Eye}
          label={t('dashboard.viewsThisMonth')}
          value={totalViews.toLocaleString()}
        />
        <StatCard
          icon={MessageCircle}
          label={t('dashboard.leadsThisMonth')}
          value={String(MOCK_LEADS.length)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Inventory */}
        <Card>
          <header className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold">{t('dashboard.inventory')}</h2>
            <Badge variant="outline" className="tabular">
              {myListings.length}
            </Badge>
          </header>
          {myListings.length === 0 ? (
            <EmptyState
              icon={Package}
              title={t('dashboard.noListingsTitle')}
              body={t('dashboard.noListingsBody')}
            />
          ) : (
            <ul className="divide-y">
              {myListings.map((l) => (
                <li key={l.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
                  <div className="relative h-16 w-24 shrink-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={l.photos[0]}
                      alt={l.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/listings/${l.slug}`}
                      className="font-semibold text-sm hover:text-primary truncate block"
                    >
                      {l.title}
                    </Link>
                    <p className="text-xs text-muted-foreground tabular">
                      {l.year} · {l.mileageKm.toLocaleString()} km
                    </p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="font-semibold tabular">
                      ৳ {formatLakh(l.price, locale)}
                    </div>
                    <div className="text-xs text-muted-foreground tabular">
                      {l.views} {t('listing.viewsLabel')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Leads */}
        <Card>
          <header className="flex items-center justify-between p-5 border-b">
            <h2 className="font-semibold">{t('dashboard.leads')}</h2>
            <Badge variant="outline" className="tabular">{MOCK_LEADS.length}</Badge>
          </header>
          {MOCK_LEADS.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title={t('dashboard.noLeadsTitle')}
              body={t('dashboard.noLeadsBody')}
            />
          ) : (
            <ul className="divide-y">
              {MOCK_LEADS.map((lead) => (
                <li key={lead.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{lead.buyerName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.listingTitle}
                      </p>
                    </div>
                    <Badge
                      variant={lead.via === 'whatsapp' ? 'success' : 'secondary'}
                      className="shrink-0"
                    >
                      {lead.via}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatRelative(lead.receivedAt, locale)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
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
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-bold tabular truncate">{value}</div>
        </div>
        <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
}) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto mb-3 h-10 w-10 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">{body}</p>
    </div>
  );
}
