import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Car } from 'lucide-react';

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Car className="h-5 w-5" />
              </span>
              {t('brand.name')}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              {t('footer.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t('footer.shop')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/listings" className="hover:text-foreground">{t('footer.shopBrowse')}</Link></li>
              <li><Link href="/listings" className="hover:text-foreground">{t('footer.shopMakes')}</Link></li>
              <li><Link href="/listings" className="hover:text-foreground">{t('footer.shopCities')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t('footer.sell')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/sell" className="hover:text-foreground">{t('footer.sellList')}</Link></li>
              <li><Link href="/sell" className="hover:text-foreground">{t('footer.sellDealer')}</Link></li>
              <li><Link href="/login" className="hover:text-foreground">{t('nav.login')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t('footer.company')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">{t('footer.about')}</Link></li>
              <li><Link href="/" className="hover:text-foreground">{t('footer.contact')}</Link></li>
              <li><Link href="/" className="hover:text-foreground">{t('footer.trust')}</Link></li>
              <li><Link href="/" className="hover:text-foreground">{t('footer.terms')}</Link></li>
              <li><Link href="/" className="hover:text-foreground">{t('footer.privacy')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} {t('brand.name')}. {t('footer.rights')}</span>
          <span>{t('footer.madeIn')}</span>
        </div>
      </div>
    </footer>
  );
}
