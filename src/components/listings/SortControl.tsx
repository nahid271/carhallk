'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SortControl() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const value = params.get('sort') ?? 'newest';

  function setSort(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v === 'newest') next.delete('sort');
    else next.set('sort', v);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <Select value={value} onValueChange={setSort}>
      <SelectTrigger className="w-[220px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">{t('filters.sortNewest')}</SelectItem>
        <SelectItem value="price_asc">{t('filters.sortPriceAsc')}</SelectItem>
        <SelectItem value="price_desc">{t('filters.sortPriceDesc')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
