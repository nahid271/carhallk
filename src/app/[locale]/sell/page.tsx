import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, UserPlus, ImageIcon, MessageCircle, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Sell your car',
};

const STEPS = [
  { icon: UserPlus, titleKey: 'sell.step1Title', bodyKey: 'sell.step1Body' },
  { icon: ImageIcon, titleKey: 'sell.step2Title', bodyKey: 'sell.step2Body' },
  { icon: MessageCircle, titleKey: 'sell.step3Title', bodyKey: 'sell.step3Body' },
];

export default async function SellPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-foreground via-foreground to-primary text-background">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-cta">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                {t('dealer.verifiedDealer')}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
              {t('sell.title')}
            </h1>
            <p className="text-base md:text-lg text-background/75 max-w-2xl">
              {t('sell.subtitle')}
            </p>
            <div className="pt-4">
              <Button variant="cta" size="xl" asChild>
                <Link href="/signup" className="gap-2">
                  {t('sell.cta')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-14 md:py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {STEPS.map((s, i) => (
              <Card key={s.titleKey} className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground tabular">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{t(s.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(s.bodyKey)}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="cta" size="lg" asChild>
              <Link href="/signup" className="gap-2">
                {t('sell.cta')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
