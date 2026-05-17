'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function ListingGallery({ photos, alt }: { photos: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (photos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] bg-muted rounded-lg overflow-hidden">
        <Image
          src={photos[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 800px"
          className="object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {photos.map((p, i) => (
            <button
              key={p + i}
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-[4/3] rounded-md overflow-hidden border-2 transition-all focus-ring',
                i === active
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-muted-foreground/40'
              )}
              aria-label={`Photo ${i + 1}`}
            >
              <Image
                src={p}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
