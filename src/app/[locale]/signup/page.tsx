import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const metadata = { title: 'Sign up' };

const CITIES = ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal'];

export default async function SignupPage({
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
          <h1 className="text-2xl font-bold">{t('auth.signupTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('auth.signupSubtitle')}</p>
        </header>

        <form className="space-y-4" action="/dashboard">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t('auth.dealerName')}</Label>
            <Input id="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">{t('auth.phone')}</Label>
            <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input id="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input id="password" type="password" autoComplete="new-password" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">{t('auth.city')}</Label>
            <Select>
              <SelectTrigger id="city"><SelectValue placeholder="—" /></SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>{t(`cities.${c}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" size="lg">
            {t('auth.signupButton')}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          {t('auth.haveAccount')}{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            {t('nav.login')}
          </Link>
        </p>
      </Card>
    </div>
  );
}
