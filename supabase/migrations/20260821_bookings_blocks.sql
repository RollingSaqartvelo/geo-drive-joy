-- ─────────────────────────────────────────────────────────────
-- Phase 1: shared bookings + blocks (single source of truth for availability)
-- Car catalog stays in code for now; migrated to `vehicles` in a later phase.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  vehicle_slug     text not null,
  vehicle_name     text,
  start_date       date not null,
  end_date         date not null,
  pickup_city      text not null check (pickup_city in ('batumi','tbilisi')),
  dropoff_city     text not null check (dropoff_city in ('batumi','tbilisi')),
  status           text not null default 'confirmed'
                     check (status in ('confirmed','pending','cancelled')),
  -- client PII (protected from public in Phase 3)
  client_name      text,
  client_passport  text,
  client_license   text,
  client_phone     text,
  client_contact   text,
  pickup_time      text,
  return_time      text,
  pickup_type      text,
  delivery_address text,
  services         jsonb not null default '[]',
  price_per_day    integer not null default 0,
  total_price      integer not null default 0,
  deposit          integer not null default 150,
  contract_number  text,
  note             text,
  created_at       timestamptz not null default now()
);

create index if not exists bookings_vehicle_idx on public.bookings (vehicle_slug, start_date, end_date);

create table if not exists public.blocks (
  id           uuid primary key default gen_random_uuid(),
  vehicle_slug text not null,
  date_from    date not null,
  date_to      date not null,
  reason       text,
  created_at   timestamptz not null default now()
);

create index if not exists blocks_vehicle_idx on public.blocks (vehicle_slug);

-- RLS on. Interim policy: full access (admin-only surface uses these now).
-- Phase 3 tightens this (public reads a PII-free availability path only).
alter table public.bookings enable row level security;
alter table public.blocks   enable row level security;

drop policy if exists bookings_all on public.bookings;
create policy bookings_all on public.bookings for all using (true) with check (true);

drop policy if exists blocks_all on public.blocks;
create policy blocks_all on public.blocks for all using (true) with check (true);
