import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2 } from 'lucide-react';

export function DealerCta() {
  const t = useTranslations();

  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-foreground text-background p-8 md:p-12">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 text-cta">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {t('nav.dealers')}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-balance">
                {t('home.ctaTitle')}
              </h2>
              <p className="text-background/70">{t('home.ctaBody')}</p>
            </div>
            <Button variant="cta" size="xl" asChild>
              <Link href="/sell" className="gap-2">
                {t('home.ctaButton')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
