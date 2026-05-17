import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Car } from 'lucide-react';

export async function Header() {
  const t = await getTranslations();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </span>
          <span>{t('brand.name')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/listings">{t('nav.browse')}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sell">{t('nav.sell')}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">{t('nav.login')}</Link>
            </Button>
            <Button variant="cta" size="sm" asChild>
              <Link href="/sell">{t('nav.sell')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
