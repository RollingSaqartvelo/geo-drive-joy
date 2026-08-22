create table if not exists public.car_locations (
  vehicle_slug text primary key,
  city text not null check (city in ('batumi','tbilisi')),
  since date,
  updated_at timestamptz not null default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.car_locations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.car_locations TO anon;
GRANT ALL ON public.car_locations TO service_role;

alter table public.car_locations enable row level security;

create policy car_locations_all on public.car_locations for all using (true) with check (true);