import { ShieldCheck, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

export function VerifiedBadge() {
  const t = useTranslations();
  return (
    <Badge variant="success" className="font-medium">
      <ShieldCheck className="h-3 w-3" />
      {t('common.verified')}
    </Badge>
  );
}

export function PhotoVerifiedBadge() {
  const t = useTranslations();
  return (
    <Badge variant="success" className="font-medium">
      <Camera className="h-3 w-3" />
      {t('common.verified')}
    </Badge>
  );
}
