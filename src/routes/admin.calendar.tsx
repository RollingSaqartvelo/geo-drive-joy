import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CARS } from "./cars";
import { addDays, format, startOfDay } from "date-fns";

export const Route = createFileRoute("/admin/calendar")({
  component: AdminCalendar,
});

type Block = { from: string; to: string };
type BlocksMap = Record<string, Block[]>;
type City = "batumi" | "tbilisi";

const BLOCKS_KEY = "georent_blocks";
const REQUESTS_KEY = "georent_requests";

function loadBlocks(): BlocksMap {
  try { return JSON.parse(localStorage.getItem(BLOCKS_KEY) || "{}"); } catch { return {}; }
}
function saveBlocks(b: BlocksMap) {
  localStorage.setItem(BLOCKS_KEY, JSON.stringify(b));
}

type RequestEntry = { carSlug: string; from: string; to: string; name: string; phone: string; date: string };
function loadRequests(): RequestEntry[] {
  try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]"); } catch { return []; }
}

const DAY_W = 46;
const DAYS = 75;
const CAR_COL = 192;

function AdminCalendar() {
  const [city, setCity] = useState<City>("batumi");
  const [blocks, setBlocks] = useState<BlocksMap>(loadBlocks);
  const [dragStart, setDragStart] = useState<{ carSlug: string; date: string } | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i));
  const cars = CARS.filter(c => c.city === city);
  const requests = loadRequests();

  const isBlocked = (slug: string, d: string) =>
    (blocks[slug] || []).some(b => d >= b.from && d <= b.to);

  const hasRequest = (slug: string, d: string) =>
    requests.some(r => r.carSlug === slug && r.from && r.to && d >= r.from && d <= r.to);

  const isInDrag = (slug: string, d: string) => {
    if (!dragStart || dragStart.carSlug !== slug || !hoverDate) return false;
    const [a, b] = dragStart.date <= hoverDate ? [dragStart.date, hoverDate] : [hoverDate, dragStart.date];
    return d >= a && d <= b;
  };

  const handleMouseDown = (slug: string, d: string) => {
    if (isBlocked(slug, d)) {
      const nb = { ...blocks };
      nb[slug] = (nb[slug] || []).filter(b => !(d >= b.from && d <= b.to));
      setBlocks(nb);
      saveBlocks(nb);
    } else {
      setDragStart({ carSlug: slug, date: d });
      setHoverDate(d);
    }
  };

  const handleMouseUp = () => {
    if (!dragStart || !hoverDate) { setDragStart(null); return; }
    const [from, to] = dragStart.date <= hoverDate
      ? [dragStart.date, hoverDate]
      : [hoverDate, dragStart.date];
    const nb = { ...blocks };
    nb[dragStart.carSlug] = [...(nb[dragStart.carSlug] || []), { from, to }];
    setBlocks(nb);
    saveBlocks(nb);
    setDragStart(null);
    setHoverDate(null);
  };

  const totalW = CAR_COL + DAY_W * DAYS;

  return (
    <div
      className="p-6 select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { setDragStart(null); setHoverDate(null); }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Календарь</h1>
          <p className="text-white/30 text-sm mt-0.5">
            Тяните по строке чтобы заблокировать · Клик по заблокированному — разблокировать
          </p>
        </div>
        <div className="flex gap-2">
          {(["batumi", "tbilisi"] as City[]).map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${city === c
                ? "bg-[#c9a84c] text-[#0a1020]"
                : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"}`}>
              {c === "batumi" ? "🌊 Батуми" : "🏙️ Тбилиси"}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-x-auto rounded-2xl border border-white/5 shadow-xl">
        <div style={{ minWidth: totalW }}>

          {/* Date header */}
          <div className="flex sticky top-0 z-10 bg-[#111d30]">
            <div style={{ width: CAR_COL, minWidth: CAR_COL }}
              className="border-b border-r border-white/5 px-4 py-3 text-xs text-white/30 font-semibold uppercase tracking-widest shrink-0">
              Автомобиль
            </div>
            {days.map(d => {
              const isToday = format(d, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              const isWeekend = [0, 6].includes(d.getDay());
              return (
                <div key={d.toISOString()}
                  style={{ width: DAY_W, minWidth: DAY_W }}
                  className={`border-b border-r border-white/5 py-2 text-center flex flex-col items-center justify-center shrink-0
                    ${isToday ? "bg-[#c9a84c]/10" : isWeekend ? "bg-white/3" : ""}`}>
                  <span className={`text-xs font-bold ${isToday ? "text-[#c9a84c]" : isWeekend ? "text-white/40" : "text-white/50"}`}>
                    {format(d, "d")}
                  </span>
                  <span className={`text-[10px] ${isToday ? "text-[#c9a84c]/70" : "text-white/20"}`}>
                    {format(d, "MMM")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Car rows */}
          {cars.map((car, idx) => (
            <div key={car.slug} className={`flex ${idx % 2 === 0 ? "bg-[#0a1020]" : "bg-[#0d1628]"}`}>
              {/* Car name */}
              <div style={{ width: CAR_COL, minWidth: CAR_COL }}
                className="border-r border-b border-white/5 px-4 py-0 flex items-center shrink-0 h-11">
                <p className="text-white text-sm font-medium truncate">{car.name}</p>
              </div>

              {/* Day cells */}
              {days.map(d => {
                const ds = format(d, "yyyy-MM-dd");
                const blocked = isBlocked(car.slug, ds);
                const req = hasRequest(car.slug, ds);
                const inDrag = isInDrag(car.slug, ds);
                const isToday = ds === format(today, "yyyy-MM-dd");

                return (
                  <div key={ds}
                    style={{ width: DAY_W, minWidth: DAY_W }}
                    className={`h-11 border-r border-b border-white/5 shrink-0 cursor-pointer transition-colors relative
                      ${isToday ? "border-l-2 border-l-[#c9a84c]/40" : ""}
                      ${blocked ? "bg-[#c9a84c]/15" : ""}
                      ${req && !blocked ? "bg-blue-500/15" : ""}
                      ${inDrag ? "bg-blue-400/30" : ""}
                      ${!blocked && !req && !inDrag ? "hover:bg-white/4" : ""}`}
                    onMouseDown={() => handleMouseDown(car.slug, ds)}
                    onMouseEnter={() => dragStart && setHoverDate(ds)}
                  >
                    {blocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#c9a84c]/50 text-xs font-bold">✕</span>
                      </div>
                    )}
                    {req && !blocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-blue-400/70 text-xs">●</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-4 text-xs text-white/40">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-[#c9a84c]/15 border border-[#c9a84c]/30 flex items-center justify-center text-[#c9a84c]/60 text-[10px]">✕</span>
          Заблокировано
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400/70 text-[10px]">●</span>
          Запрос на аренду
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-blue-400/30 border border-blue-300/30" />
          Выбор диапазона
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded border-l-2 border-l-[#c9a84c]/50 bg-[#0a1020]" />
          Сегодня
        </span>
      </div>
    </div>
  );
}
