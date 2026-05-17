import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata = { title: 'Log in' };

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="container max-w-md py-14 md:py-20">
      <Card className="p-7 md:p-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold">{t('auth.loginTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('auth.loginSubtitle')}</p>
        </header>

        <form className="space-y-4" action="/dashboard">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" type="password" autoComplete="current-password" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            {t('auth.loginButton')}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            {t('nav.signup')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
