import { useState, useEffect } from "react";
import { addDays, format, startOfDay } from "date-fns";
import { fetchSlotsPublic, fetchBlocksPublic, type BlocksMap } from "@/lib/store";
import { transferWindows, type Loc } from "@/lib/availability";
import { AvailabilitySearch, type AvailCar } from "@/components/AvailabilitySearch";
import { CARS } from "@/routes/cars";
import type { AdminBooking } from "@/lib/adminBookings";

const DAY_W = 40;
const DAYS = 60;
const CAR_COL = 180;
const CITY = (c: string) => (c === "batumi" ? "Батуми" : c === "tbilisi" ? "Тбилиси" : c);

/**
 * Публичный read-only календарь для партнёров.
 * Без входа в админку, без данных клиентов (PII), авто-обновление из Supabase.
 */
export function ReadOnlyCalendar({ cars, title }: { cars: { slug: string; name: string }[]; title: string }) {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [blocks, setBlocks] = useState<BlocksMap>({});
  const [updated, setUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const [b, bl] = await Promise.all([fetchSlotsPublic(), fetchBlocksPublic()]);
      if (!alive) return;
      setBookings(b); setBlocks(bl); setUpdated(new Date());
    };
    load();
    const t = setInterval(load, 60_000); // авто-обновление раз в минуту
    return () => { alive = false; clearInterval(t); };
  }, []);

  const today = startOfDay(new Date());
  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i));
  const todayStr = format(today, "yyyy-MM-dd");
  const fmtD = (s: string) => format(new Date(s + "T00:00:00"), "d MMM");

  const transfersFor = (slug: string) => transferWindows(slug, bookings);
  const bookingAt = (slug: string, d: string) =>
    bookings.find(b => b.carSlug === slug && d >= b.pickupDate && d <= b.returnDate);
  const blockedAt = (slug: string, d: string) => (blocks[slug] || []).some(b => d >= b.from && d <= b.to);
  const transferAt = (slug: string, d: string) => transfersFor(slug).some(w => d >= w.from && d <= w.to);

  const totalW = CAR_COL + DAY_W * DAYS;

  const availCars: AvailCar[] = cars.map(c => {
    const full = CARS.find(x => x.slug === c.slug);
    return {
      slug: c.slug,
      baseCity: (full?.city || "batumi") as Loc,
      name: c.name,
      priceFrom: full?.tiers && full.tiers.length ? full.tiers[full.tiers.length - 1].price : (full?.price || 0),
      image: full?.images?.[0]?.url,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-gray-800">{title}</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Актуальный календарь бронирований · обновляется автоматически
            </p>
          </div>
          {updated && (
            <span className="text-xs text-gray-400">Обновлено: {format(updated, "HH:mm")}</span>
          )}
        </div>

        {/* Подбор свободного авто (только просмотр) */}
        <div className="mb-5">
          <AvailabilitySearch cars={availCars} bookings={bookings} blocks={blocks} ctaLabel="доступна ✓" onPick={() => {}} />
        </div>

        {/* Календарь-сетка (прокручивается по горизонтали, в т.ч. на телефоне) */}
        <div className="block overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
          <div style={{ minWidth: totalW }}>
            <div className="flex sticky top-0 z-10 bg-[var(--brand-blue)]">
              <div style={{ width: CAR_COL, minWidth: CAR_COL }}
                className="border-b border-r border-white/10 px-4 py-3 text-xs text-white/60 font-bold uppercase tracking-widest shrink-0">
                Автомобиль
              </div>
              {days.map(d => {
                const isToday = format(d, "yyyy-MM-dd") === todayStr;
                const isWeekend = [0, 6].includes(d.getDay());
                return (
                  <div key={d.toISOString()} style={{ width: DAY_W, minWidth: DAY_W }}
                    className={`border-b border-r border-white/10 py-2 text-center flex flex-col items-center shrink-0 ${isToday ? "bg-white/20" : isWeekend ? "bg-white/5" : ""}`}>
                    <span className="text-xs font-bold text-white/70">{format(d, "d")}</span>
                    <span className="text-[9px] text-white/40">{format(d, "MMM")}</span>
                  </div>
                );
              })}
            </div>

            {cars.map((car, idx) => (
              <div key={car.slug} className={`flex ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/80"}`}>
                <div style={{ width: CAR_COL, minWidth: CAR_COL }}
                  className="border-r border-b border-gray-100 px-4 flex items-center shrink-0 h-11">
                  <p className="text-gray-700 text-sm font-semibold truncate">{car.name}</p>
                </div>
                {days.map(d => {
                  const ds = format(d, "yyyy-MM-dd");
                  const bk = bookingAt(car.slug, ds);
                  const blk = blockedAt(car.slug, ds);
                  const tr = transferAt(car.slug, ds);
                  const isPickup = bk?.pickupDate === ds;
                  return (
                    <div key={ds} style={{ width: DAY_W, minWidth: DAY_W }}
                      title={bk ? `${fmtD(bk.pickupDate)}–${fmtD(bk.returnDate)} · ${CITY(bk.pickupCity)}→${CITY(bk.returnCity)}` : tr ? "Перегон" : blk ? "Недоступно" : "Свободно"}
                      className={`h-11 border-r border-b border-gray-100 shrink-0 relative overflow-hidden
                        ${bk ? "bg-blue-100" : ""} ${blk ? "bg-amber-100" : ""} ${tr ? "bg-gray-200" : ""}`}>
                      {isPickup && bk.pickupCity !== bk.returnCity && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-blue-700">→</span>
                      )}
                      {tr && <span className="absolute inset-0 flex items-center justify-center text-[10px]">🚚</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-3">
          {cars.map(car => {
            const bs = bookings.filter(b => b.carSlug === car.slug && b.returnDate >= todayStr)
              .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));
            const bls = (blocks[car.slug] || []).filter(b => b.to >= todayStr);
            return (
              <div key={car.slug} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="font-bold text-gray-800 mb-2">{car.name}</p>
                {bs.length === 0 && bls.length === 0 && (
                  <p className="text-xs text-green-600 font-medium">Свободна — броней нет</p>
                )}
                {bs.map(b => (
                  <div key={b.pickupDate + b.returnDate} className="flex items-center justify-between gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 mb-1.5">
                    <span className="text-sm font-semibold text-blue-800">{fmtD(b.pickupDate)} – {fmtD(b.returnDate)}</span>
                    <span className="text-xs text-blue-600">{CITY(b.pickupCity)} → {CITY(b.returnCity)}</span>
                  </div>
                ))}
                {bls.map((b, i) => (
                  <div key={"bl" + i} className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 mb-1.5 text-sm font-medium text-amber-700">
                    🔒 Недоступно: {fmtD(b.from)} – {fmtD(b.to)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="w-5 h-4 rounded bg-blue-100 border border-blue-300" /> Занято</span>
          <span className="flex items-center gap-1.5"><span className="w-5 h-4 rounded bg-gray-200 border border-gray-300" /> 🚚 Перегон</span>
          <span className="flex items-center gap-1.5"><span className="w-5 h-4 rounded bg-amber-100 border border-amber-300" /> Недоступно</span>
          <span className="flex items-center gap-1.5"><span className="w-5 h-4 rounded bg-white border border-gray-300" /> Свободно</span>
        </div>
      </div>
    </div>
  );
}
