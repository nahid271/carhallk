import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MapPin } from 'lucide-react';
import { listings } from '@/lib/seed-data';
import type { City } from '@/lib/types';

const CITIES: City[] = ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal'];

export function CityQuickLinks() {
  const t = useTranslations();

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
          {t('home.citiesTitle')}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CITIES.map((city) => {
            const count = listings.filter((l) => l.registrationCity === city).length;
            return (
              <Link
                key={city}
                href={`/listings?city=${city}`}
                className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all focus-ring"
              >
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-semibold text-sm">{t(`cities.${city}`)}</div>
                  <div className="text-xs text-muted-foreground tabular">
                    {count} {count === 1 ? 'car' : 'cars'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
