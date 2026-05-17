import { useTranslations } from 'next-intl';
import { ShieldCheck, Camera, Flag } from 'lucide-react';

const ITEMS = [
  { icon: ShieldCheck, titleKey: 'home.trust1Title', bodyKey: 'home.trust1Body' },
  { icon: Camera, titleKey: 'home.trust2Title', bodyKey: 'home.trust2Body' },
  { icon: Flag, titleKey: 'home.trust3Title', bodyKey: 'home.trust3Body' },
];

export function TrustStrip() {
  const t = useTranslations();
  return (
    <section className="py-14 md:py-20">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 md:mb-14 text-balance max-w-2xl mx-auto">
          {t('home.trustTitle')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {ITEMS.map((item) => (
            <div
              key={item.titleKey}
              className="text-center md:text-left p-6 rounded-xl bg-card border"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-success/15 text-success mb-4">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(item.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(item.bodyKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
