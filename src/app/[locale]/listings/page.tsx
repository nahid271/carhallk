import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ListingCard } from '@/components/listings/ListingCard';
import { FilterPanel } from '@/components/listings/FilterPanel';
import { SortControl } from '@/components/listings/SortControl';
import { listings, getDealerById } from '@/lib/seed-data';
import { parseQuery, applyQuery } from '@/lib/filter';

export const metadata = {
  title: 'Browse cars',
};

export default async function ListingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const query = parseQuery(sp);
  const results = applyQuery(listings, query);
  const t = await getTranslations();

  return (
    <div className="container py-8 md:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto bg-card border rounded-lg p-5">
          <FilterPanel />
        </aside>

        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{t('nav.browse')}</h1>
              <p className="text-sm text-muted-foreground mt-1 tabular">
                {t('filters.results', { count: results.length })}
              </p>
            </div>
            <SortControl />
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card border rounded-lg">
              <p className="text-lg font-semibold mb-2">
                {t('filters.results', { count: 0 })}
              </p>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try clearing filters or searching for a different make.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {results.map((l) => (
                <ListingCard key={l.id} listing={l} dealer={getDealerById(l.dealerId)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
