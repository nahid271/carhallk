'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const POPULAR_QUERIES = [
  { label: 'Toyota Axio', q: 'Axio' },
  { label: 'Honda Vezel', q: 'Vezel' },
  { label: 'Toyota Prius', q: 'Prius' },
  { label: 'Toyota Noah', q: 'Noah' },
];

export function Hero() {
  const t = useTranslations();
  const router = useRouter();
  const [q, setQ] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const search = q.trim();
    router.push(search ? `/listings?q=${encodeURIComponent(search)}` : '/listings');
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container relative py-16 md:py-24 lg:py-28">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            {t('home.heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/85 max-w-2xl mx-auto">
            {t('home.heroSubtitle')}
          </p>

          <form
            onSubmit={submit}
            className="mt-8 flex flex-col sm:flex-row gap-2 bg-white rounded-xl p-2 shadow-xl max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center gap-2 px-3 text-foreground">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="border-0 shadow-none focus-visible:ring-0 text-base h-12 px-0"
              />
            </div>
            <Button type="submit" variant="cta" size="lg" className="h-12 px-8 text-base">
              {t('common.search')}
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2 text-sm pt-2">
            <span className="text-primary-foreground/70">{t('home.popularSearches')}:</span>
            {POPULAR_QUERIES.map((p) => (
              <button
                key={p.q}
                onClick={() => router.push(`/listings?q=${encodeURIComponent(p.q)}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-primary-foreground"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
