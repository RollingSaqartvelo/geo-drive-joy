-- Источник клиента (откуда пришёл) для аналитики
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS source text;
