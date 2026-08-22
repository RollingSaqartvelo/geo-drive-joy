-- Ручной «переброс» машины между городами (общий для всех менеджеров).
create table if not exists public.car_locations (
  vehicle_slug text primary key,
  city         text not null check (city in ('batumi','tbilisi')),
  since        date,
  updated_at   timestamptz not null default now()
);

alter table public.car_locations enable row level security;

drop policy if exists car_locations_all on public.car_locations;
create policy car_locations_all on public.car_locations for all using (true) with check (true);
