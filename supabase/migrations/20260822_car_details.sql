-- Карточка данных авто (документы, страховка, VIN и т.д.) — общая для менеджеров.
create table if not exists public.car_details (
  vehicle_slug text primary key,
  name         text,
  vin          text,
  owner        text,
  id_code      text,
  seats        integer,
  insurance    text,
  doc_photos   jsonb not null default '[]',   -- [{ "url": "...", "name": "..." }]
  updated_at   timestamptz not null default now()
);

alter table public.car_details enable row level security;
drop policy if exists car_details_all on public.car_details;
create policy car_details_all on public.car_details for all using (true) with check (true);

-- Хранилище для фото ПТС/СТС
insert into storage.buckets (id, name, public)
values ('car-docs', 'car-docs', true)
on conflict (id) do nothing;

drop policy if exists "car_docs_read" on storage.objects;
create policy "car_docs_read"  on storage.objects for select using (bucket_id = 'car-docs');
drop policy if exists "car_docs_write" on storage.objects;
create policy "car_docs_write" on storage.objects for insert with check (bucket_id = 'car-docs');
drop policy if exists "car_docs_delete" on storage.objects;
create policy "car_docs_delete" on storage.objects for delete using (bucket_id = 'car-docs');
