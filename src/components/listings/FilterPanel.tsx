'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

const MAKES = ['Toyota', 'Honda', 'Nissan', 'Mitsubishi', 'Kia', 'Suzuki', 'Hyundai', 'Mercedes-Benz', 'BMW'];
const YEARS = Array.from({ length: 16 }, (_, i) => 2026 - i);
const BODY_TYPES = ['sedan', 'suv', 'hatchback', 'pickup', 'microbus', 'coupe'];
const TRANSMISSIONS = ['automatic', 'manual', 'cvt'];
const FUELS = ['petrol', 'diesel', 'octane', 'cng', 'hybrid', 'electric'];
const CITIES = ['dhaka', 'chittagong', 'sylhet', 'rajshahi', 'khulna', 'barisal'];

export function FilterPanel() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === 'any') next.delete(key);
    else next.set(key, value);
    router.push(`${pathname}?${next.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const activeCount = Array.from(params.keys()).filter((k) => params.get(k)).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t('filters.title')}</h2>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-auto py-1 px-2">
            <X className="h-3 w-3" />
            {t('filters.clearAll')}
          </Button>
        )}
      </div>

      <FilterRow label={t('filters.make')}>
        <Select value={params.get('make') ?? 'any'} onValueChange={(v) => setParam('make', v)}>
          <SelectTrigger><SelectValue placeholder={t('common.anyMake')} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t('common.anyMake')}</SelectItem>
            {MAKES.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </FilterRow>

      <FilterRow label={t('filters.bodyType')}>
        <Select value={params.get('bodyType') ?? 'any'} onValueChange={(v) => setParam('bodyType', v)}>
          <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t('common.anyMake').replace('make', 'type').replace('ব্র্যান্ড', 'ধরন')}</SelectItem>
            {BODY_TYPES.map((b) => <SelectItem key={b} value={b}>{t(`bodyTypes.${b}`)}</SelectItem>)}
          </SelectContent>
        </Select>
      </FilterRow>

      <div className="grid grid-cols-2 gap-3">
        <FilterRow label={t('filters.yearFrom')}>
          <Select value={params.get('yearFrom') ?? 'any'} onValueChange={(v) => setParam('yearFrom', v)}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t('common.anyYear')}</SelectItem>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </FilterRow>
        <FilterRow label={t('filters.yearTo')}>
          <Select value={params.get('yearTo') ?? 'any'} onValueChange={(v) => setParam('yearTo', v)}>
            <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t('common.anyYear')}</SelectItem>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </FilterRow>
      </div>

      <FilterRow label={t('filters.transmission')}>
        <Select value={params.get('transmission') ?? 'any'} onValueChange={(v) => setParam('transmission', v)}>
          <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">{t('common.anyMake').replace('make', '').replace('ব্র্যান্ড', '').trim() || '—'}</SelectItem>
            {TRANSMISSIONS.map((tr) => <SelectItem key={tr} value={tr}>{t(`transmission.${tr}`)}</SelectItem>)}
          </SelectContent>
        </Select>
      </FilterRow>

      <FilterRow label={t('filters.fuel')}>
        <Select value={params.get('fuel') ?? 'any'} onValueChange={(v) => setParam('fuel', v)}>
          <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">—</SelectItem>
            {FUELS.map((f) => <SelectItem key={f} value={f}>{t(`fuel.${f}`)}</SelectItem>)}
          </SelectContent>
        </Select>
      </FilterRow>

      <FilterRow label={t('filters.city')}>
        <Select value={params.get('city') ?? 'any'} onValueChange={(v) => setParam('city', v)}>
          <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">—</SelectItem>
            {CITIES.map((c) => <SelectItem key={c} value={c}>{t(`cities.${c}`)}</SelectItem>)}
          </SelectContent>
        </Select>
      </FilterRow>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
