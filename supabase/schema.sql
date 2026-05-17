-- CarBuy v1 schema. Run in Supabase SQL Editor on a fresh project.
-- Postgres 15+. Assumes Supabase Auth is enabled (users live in auth.users).

create extension if not exists "uuid-ossp";

-- DEALERS — each dealer corresponds to one or more auth.users via owner_id.
create table if not exists public.dealers (
  id           uuid primary key default uuid_generate_v4(),
  owner_id     uuid not null references auth.users(id) on delete cascade,
  slug         text unique not null,
  name         text not null,
  bn_name      text,
  city         text not null,
  address      text not null,
  bn_address   text,
  phone        text not null,
  verified     boolean not null default false,
  joined_at    date not null default current_date,
  total_sold   integer not null default 0,
  response_time text not null default 'day' check (response_time in ('fast', 'day')),
  logo_url     text,
  cover_url    text,
  rating       numeric(2,1) default 0,
  review_count integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists dealers_city_idx on public.dealers (city);
create index if not exists dealers_verified_idx on public.dealers (verified);

-- LISTINGS
create table if not exists public.listings (
  id            uuid primary key default uuid_generate_v4(),
  dealer_id     uuid not null references public.dealers(id) on delete cascade,
  slug          text unique not null,
  title         text not null,
  bn_title      text,
  make          text not null,
  model         text not null,
  year          integer not null check (year between 1980 and extract(year from now())::int + 1),
  price         bigint not null check (price > 0),
  negotiable    boolean not null default true,
  mileage_km    integer not null check (mileage_km >= 0),
  transmission  text not null check (transmission in ('automatic','manual','cvt')),
  fuel          text not null check (fuel in ('petrol','diesel','octane','cng','hybrid','electric')),
  body_type     text not null check (body_type in ('sedan','suv','hatchback','pickup','microbus','coupe','wagon','convertible')),
  color         text not null,
  bn_color      text,
  engine_cc     integer not null check (engine_cc > 0),
  registration_city text not null,
  description   text not null,
  bn_description text,
  views         integer not null default 0,
  photo_verified boolean not null default false,
  featured      boolean not null default false,
  status        text not null default 'active' check (status in ('active','sold','paused')),
  posted_at     timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists listings_dealer_idx on public.listings (dealer_id);
create index if not exists listings_make_model_idx on public.listings (make, model);
create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_featured_idx on public.listings (featured) where featured;
create index if not exists listings_city_idx on public.listings (registration_city);
create index if not exists listings_price_idx on public.listings (price);
create index if not exists listings_year_idx on public.listings (year);

-- LISTING PHOTOS — ordered, capped at 10 per listing in app logic.
create table if not exists public.listing_photos (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  position    smallint not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists listing_photos_listing_idx on public.listing_photos (listing_id, position);

-- SAVED LISTINGS — buyer favorites.
create table if not exists public.saved_listings (
  user_id     uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  saved_at    timestamptz not null default now(),
  primary key (user_id, listing_id)
);

-- REPORT FLAGS — anyone can report a listing.
create table if not exists public.report_flags (
  id          uuid primary key default uuid_generate_v4(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  reporter_id uuid references auth.users(id) on delete set null,
  reason      text not null,
  details     text,
  status      text not null default 'open' check (status in ('open','reviewed','dismissed')),
  created_at  timestamptz not null default now()
);

-- DEALER REVIEWS — written by buyers after contact.
create table if not exists public.dealer_reviews (
  id          uuid primary key default uuid_generate_v4(),
  dealer_id   uuid not null references public.dealers(id) on delete cascade,
  author_id   uuid references auth.users(id) on delete set null,
  rating      smallint not null check (rating between 1 and 5),
  body        text,
  created_at  timestamptz not null default now()
);

create index if not exists dealer_reviews_dealer_idx on public.dealer_reviews (dealer_id, created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.listings;
create trigger set_updated_at before update on public.listings
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_dealers on public.dealers;
create trigger set_updated_at_dealers before update on public.dealers
for each row execute function public.set_updated_at();

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.dealers enable row level security;
alter table public.listings enable row level security;
alter table public.listing_photos enable row level security;
alter table public.saved_listings enable row level security;
alter table public.report_flags enable row level security;
alter table public.dealer_reviews enable row level security;

-- Public read for listings/dealers (browse pages are public).
create policy "dealers are publicly readable"
  on public.dealers for select using (true);

create policy "listings are publicly readable"
  on public.listings for select using (status = 'active' or auth.uid() in (
    select owner_id from public.dealers where id = listings.dealer_id
  ));

create policy "listing photos are publicly readable"
  on public.listing_photos for select using (true);

create policy "dealer reviews are publicly readable"
  on public.dealer_reviews for select using (true);

-- Dealer can manage their own dealer record.
create policy "dealer owners can update their own row"
  on public.dealers for update using (auth.uid() = owner_id);

create policy "dealer owners can insert their own row"
  on public.dealers for insert with check (auth.uid() = owner_id);

-- Dealer can manage their own listings.
create policy "dealers can insert listings"
  on public.listings for insert with check (auth.uid() in (
    select owner_id from public.dealers where id = listings.dealer_id
  ));

create policy "dealers can update their listings"
  on public.listings for update using (auth.uid() in (
    select owner_id from public.dealers where id = listings.dealer_id
  ));

create policy "dealers can delete their listings"
  on public.listings for delete using (auth.uid() in (
    select owner_id from public.dealers where id = listings.dealer_id
  ));

-- Dealer can manage photos on their listings.
create policy "dealers manage their listing photos"
  on public.listing_photos for all using (auth.uid() in (
    select d.owner_id from public.dealers d
    join public.listings l on l.dealer_id = d.id
    where l.id = listing_photos.listing_id
  ));

-- Buyers manage their own saved listings.
create policy "users manage their own saved listings"
  on public.saved_listings for all using (auth.uid() = user_id);

-- Anyone authed can file a report; nobody but service role can read/edit (admin).
create policy "anyone can file a report"
  on public.report_flags for insert with check (true);

-- Anyone authed can write a review.
create policy "anyone can write a review"
  on public.dealer_reviews for insert with check (auth.uid() = author_id);

-- ===========================================================================
-- Storage bucket for listing photos
-- Run AFTER table creation. Create the bucket in Supabase UI first OR via:
-- ===========================================================================
-- insert into storage.buckets (id, name, public) values ('listing-photos', 'listing-photos', true);

-- Allow dealers to upload to their own folder (listing_id/photo.jpg).
-- Note: refine path matching in production.
-- create policy "dealers upload listing photos"
--   on storage.objects for insert
--   with check (bucket_id = 'listing-photos' and auth.role() = 'authenticated');

-- create policy "public read of listing photos"
--   on storage.objects for select using (bucket_id = 'listing-photos');
