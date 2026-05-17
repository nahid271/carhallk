import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/ListingCard';
import { ArrowRight } from 'lucide-react';
import { getFeaturedListings, getDealerById } from '@/lib/seed-data';

export function FeaturedListings() {
  const t = useTranslations();
  const featured = getFeaturedListings();

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold">{t('home.featuredTitle')}</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/listings" className="gap-1">
              {t('common.viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} dealer={getDealerById(l.dealerId)} />
          ))}
        </div>
      </div>
    </section>
  );
}
