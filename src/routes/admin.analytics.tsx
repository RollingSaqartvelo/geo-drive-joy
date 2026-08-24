import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, Users, DollarSign } from "lucide-react";
import { loadBookings, type AdminBooking } from "@/lib/adminBookings";
import { syncBookings } from "@/lib/store";
import { CLIENT_SOURCES } from "./admin.calendar";

export const Route = createFileRoute("/admin/analytics")({
  component: AdminAnalytics,
});

const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const fmt = (n: number) => String(parseFloat(n.toFixed(2)));

// Цвета для источников
const COLORS: Record<string, string> = {
  "Сарафанное": "#22c55e",
  "Google Maps": "#3b82f6",
  "Гугл реклама": "#ef4444",
  "Инстаграм": "#ec4899",
  "Тредс": "#111827",
  "Авито": "#a855f7",
  "Партнёрский": "#f59e0b",
  "Не указан": "#9ca3af",
};

function AdminAnalytics() {
  const now = new Date();
  const [bookings, setBookings] = useState<AdminBooking[]>(loadBookings);
  const [period, setPeriod] = useState<"month" | "all">("month");
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => { syncBookings().then(setBookings).catch(() => {}); }, []);

  const filtered = useMemo(() => {
    if (period === "all") return bookings;
    return bookings.filter(b => {
      const d = new Date(b.pickupDate);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [bookings, period, month, year]);

  const stats = useMemo(() => {
    const keys = [...CLIENT_SOURCES, "Не указан"];
    const map = new Map<string, { count: number; revenue: number }>();
    keys.forEach(k => map.set(k, { count: 0, revenue: 0 }));
    for (const b of filtered) {
      const key = (b.source && b.source.trim()) ? b.source : "Не указан";
      const cur = map.get(key) || { count: 0, revenue: 0 };
      cur.count += 1;
      cur.revenue += b.totalPrice || 0;
      map.set(key, cur);
    }
    return keys.map(k => ({ source: k, ...(map.get(k)!) })).filter(x => x.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  const totalCount = stats.reduce((s, x) => s + x.count, 0);
  const totalRevenue = stats.reduce((s, x) => s + x.revenue, 0);
  const maxCount = Math.max(1, ...stats.map(x => x.count));

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-6 w-6 text-[var(--brand-blue)]" />
          <h1 className="text-2xl font-black text-gray-800">Аналитика</h1>
        </div>
        <p className="text-gray-400 text-sm mb-5">Откуда приходят клиенты — по источнику из бронирований</p>

        {/* Period toggle */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex gap-2">
            {(["month", "all"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${period === p ? "bg-[var(--brand-blue)] text-white shadow-md" : "bg-white text-gray-500 border border-gray-200"}`}>
                {p === "month" ? "По месяцу" : "За всё время"}
              </button>
            ))}
          </div>
          {period === "month" && (
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">‹</button>
              <span className="font-bold text-gray-700 min-w-[150px] text-center">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">›</button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-[var(--brand-blue)]" /><p className="text-xs font-semibold text-[var(--brand-blue)] uppercase tracking-wide">Клиентов (броней)</p></div>
            <p className="text-3xl font-black text-[var(--brand-blue)]">{totalCount}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-2 mb-1"><DollarSign className="h-4 w-4 text-green-600" /><p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Оборот</p></div>
            <p className="text-3xl font-black text-green-700">${fmt(totalRevenue)}</p>
          </div>
        </div>

        {/* Sources breakdown */}
        {stats.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">Нет бронирований за этот период.</div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
            <p className="font-bold text-gray-700">Источники клиентов</p>
            {stats.map(x => {
              const pct = totalCount ? Math.round(x.count / totalCount * 100) : 0;
              return (
                <div key={x.source}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[x.source] || "#9ca3af" }} />
                      {x.source}
                    </span>
                    <span className="text-gray-500">{x.count} чел. · {pct}% · <span className="text-green-600 font-semibold">${fmt(x.revenue)}</span></span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(x.count / maxCount * 100)}%`, background: COLORS[x.source] || "#9ca3af" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
