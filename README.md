# CarBuy

Bangladesh's most trusted used-car marketplace — a buyer-first marketplace
modeled on carsales.com.au, adapted for the Dhaka, Chittagong, and Sylhet
markets.

**Languages:** English (`/en`) + Bangla (`/bn`, default)
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui ·
next-intl · Supabase (Postgres + Auth + Storage)

---

## Quick start (zero config — uses seed data)

The app runs fully without Supabase using bundled mock listings.

```bash
cd carbuy
npm install
npm run dev
```

Open <http://localhost:3000>. You'll be redirected to `/bn` (Bangla, default).
Switch to English via the globe icon in the header.

### Pages

| Route | What it shows |
|---|---|
| `/bn` · `/en` | Home — hero search, body-type strip, featured listings, trust strip, city quick-links, dealer CTA |
| `/bn/listings` | Browse with filters + sort |
| `/bn/listings/[slug]` | Listing detail — gallery, specs, seller card, WhatsApp + call CTAs |
| `/bn/dealers/[slug]` | Dealer profile with inventory and stats |
| `/bn/sell` | Sell landing (dealer acquisition) |
| `/bn/login` · `/bn/signup` | Auth |
| `/bn/dashboard` | Demo dealer dashboard |

---

## Connecting Supabase (production setup)

1. Create a Supabase project at <https://supabase.com>.
2. Copy `.env.example` to `.env.local` and fill in:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   SUPABASE_SERVICE_ROLE_KEY=eyJh... # server-side only
   ```
3. In Supabase → SQL Editor → New Query, paste the contents of
   `supabase/schema.sql` and run it. This creates tables, indexes,
   RLS policies, and the `updated_at` trigger.
4. In Supabase → Storage, create a public bucket named `listing-photos`.
5. Restart `npm run dev`. The Supabase clients in `src/lib/supabase/` are wired
   for both browser and server use.

---

## Project layout

```
carbuy/
├── messages/
│   ├── bn.json              # Bangla strings (default locale)
│   └── en.json              # English strings
├── middleware.ts            # next-intl locale routing
├── public/                  # static assets (currently empty)
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── layout.tsx            # html/body + fonts + i18n provider
│   │       ├── page.tsx              # Home
│   │       ├── listings/page.tsx     # Browse + filters
│   │       ├── listings/[id]/page.tsx
│   │       ├── dealers/[slug]/page.tsx
│   │       ├── sell/page.tsx
│   │       ├── login/page.tsx
│   │       ├── signup/page.tsx
│   │       └── dashboard/page.tsx
│   ├── components/
│   │   ├── home/            # Hero, BodyTypeStrip, FeaturedListings, TrustStrip, CityQuickLinks, DealerCta
│   │   ├── layout/          # Header, Footer, LocaleSwitcher
│   │   ├── listings/        # ListingCard, FilterPanel, SortControl, ListingGallery, SellerCard
│   │   ├── shared/          # VerifiedBadge, PhotoVerifiedBadge
│   │   └── ui/              # shadcn primitives — Button, Card, Input, Label, Badge, Select, DropdownMenu
│   ├── i18n/
│   │   ├── request.ts       # next-intl getRequestConfig
│   │   └── routing.ts       # locales config + typed navigation helpers
│   └── lib/
│       ├── format.ts        # BDT/lakh, BD phone, WhatsApp/tel links, BN digits, DD/MM/YYYY dates
│       ├── filter.ts        # search/filter/sort engine
│       ├── seed-data.ts     # mock dealers + listings (used when Supabase env is empty)
│       ├── types.ts         # Listing, Dealer, BodyType, Fuel, etc.
│       ├── utils.ts         # cn (clsx + tailwind-merge)
│       └── supabase/
│           ├── client.ts    # browser client + isSupabaseConfigured()
│           └── server.ts    # SSR client (cookies-aware)
├── supabase/
│   └── schema.sql           # Postgres schema, indexes, RLS policies
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs          # withNextIntl plugin
├── postcss.config.mjs
└── package.json
```

---

## Design system

Generated via gstack `/ui-ux-pro-max` for marketplace pattern + trust focus.

| Token | Value | Use |
|---|---|---|
| `--primary` | `#2563EB` blue | Brand, links, primary actions |
| `--cta` | `#F97316` orange | Big calls-to-action (Search, Get started, List inventory) |
| `--success` | `#0F8A4B` deep green | Verified dealer / photo-verified badges |
| `--background` | `#F8FAFC` off-white | Base canvas |
| `--foreground` | `#1E293B` slate-900 | Body text |

**Typography:**
- `Lexend` (Google Fonts) — English body + headings
- `Hind Siliguri` (Google Fonts) — Bangla body + headings (purpose-built for
  Bangla web readability; widely used across BD news/web)
- Both loaded via `next/font/google` (`display: 'swap'`)

**Formatting helpers** in `src/lib/format.ts`:
- `formatBdt(8500000)` → `৳ 85,00,000` (South Asian grouping: last 3 then 2s)
- `formatLakh(8500000)` → `85 lakh` / `formatLakh(amount, 'bn')` → `৮৫ লাখ`
- `formatPhone('01711234567')` → `+880 1711-234567`
- `whatsappLink(phone, message)` → `https://wa.me/...?text=...`
- `formatDate('2026-05-14')` → `14/05/2026` (DD/MM/YYYY, BD-standard)
- `toBengaliDigits('2026')` → `২০২৬`

---

## Translation notes

Bangla strings in `messages/bn.json` were authored as MVP translations and
must be reviewed by a native Bangla speaker before launch — especially:

- Auto/motoring terminology (transmission types, body types, fuel)
- Dealer-facing copy (the `sell.*` and `dashboard.*` keys)
- Compound terms like "Verified dealer" (যাচাইকৃত ডিলার) — multiple
  acceptable phrasings exist; pick the one that matches your brand voice

To add a third locale later (e.g. Hindi for cross-border buyers):

1. Add the code to `src/i18n/routing.ts` (`locales: ['bn', 'en', 'hi']`)
2. Create `messages/hi.json` (copy `en.json` and translate)
3. Add it to the `LocaleSwitcher` dropdown

---

## Build for production

```bash
npm run build      # Next.js production build
npm run typecheck  # tsc --noEmit
npm run start      # serve the build on :3000
```

Deploy to Vercel: `vercel` (auto-detects Next.js + i18n plugin).

---

## What's NOT in v1 (intentional deferrals)

- **Payments** (bKash / SSLCommerz) — v1 is discovery + lead-gen only.
  All transactions happen offline at the dealer lot.
- **Phone OTP auth** — email-only in v1 (defer SMS provider setup).
- **Saved searches with email alerts** — v1.1.
- **Instant search (Algolia / Meilisearch)** — Postgres ILIKE is fine until
  ~10k listings.
- **Image moderation** — manual via admin queue until volume forces it.
- **Map embeds** — Google Maps deep-link only (saves API key + cost).

See `~/.gstack/projects/WESBITEDESIGN/zubinhiramanek-main-design-20260516-110647.md`
for the full design doc and the founder assignment.

---

## The most important thing in this README

Before you launch CarBuy to anyone, the design doc's assignment says:
**talk to 5 dealers at Tejgaon / Bangla Motor AND 5 recent buyers in Dhaka,
in person, in Bangla.** Show them this build on your phone. Watch them try
to use it. Write their words down verbatim. Bring the quotes to the next
session. That work is what protects the engineering from being wasted.
