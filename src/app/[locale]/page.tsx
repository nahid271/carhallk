import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { BodyTypeStrip } from '@/components/home/BodyTypeStrip';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { TrustStrip } from '@/components/home/TrustStrip';
import { CityQuickLinks } from '@/components/home/CityQuickLinks';
import { DealerCta } from '@/components/home/DealerCta';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <BodyTypeStrip />
      <FeaturedListings />
      <TrustStrip />
      <CityQuickLinks />
      <DealerCta />
    </>
  );
}
