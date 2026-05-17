import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Car, Truck, Bus } from 'lucide-react';
import type { BodyType } from '@/lib/types';

interface Item {
  key: BodyType;
  icon: React.ReactNode;
}

const ITEMS: Item[] = [
  { key: 'sedan', icon: <Car className="h-8 w-8" /> },
  { key: 'suv', icon: <Car className="h-8 w-8" strokeWidth={2.4} /> },
  { key: 'hatchback', icon: <Car className="h-8 w-8" /> },
  { key: 'microbus', icon: <Bus className="h-8 w-8" /> },
  { key: 'pickup', icon: <Truck className="h-8 w-8" /> },
  { key: 'coupe', icon: <Car className="h-8 w-8" /> },
];

export function BodyTypeStrip() {
  const t = useTranslations();

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">
          {t('home.bodyTypeTitle')}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/listings?bodyType=${item.key}`}
              className="group flex flex-col items-center justify-center gap-3 p-4 rounded-lg border bg-card hover:border-primary hover:shadow-md transition-all focus-ring"
            >
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-center">
                {t(`bodyTypes.${item.key}`)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
