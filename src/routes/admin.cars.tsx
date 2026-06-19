import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CARS } from "./cars";

export const Route = createFileRoute("/admin/cars")({
  component: AdminCars,
});

type City = "batumi" | "tbilisi";
type RequestEntry = { carSlug: string; name: string; phone: string; from: string; to: string; date: string };
type RentalsMap = Record<string, number>;

const REQUESTS_KEY = "georent_requests";
const RENTALS_KEY = "georent_rentals";

function AdminCars() {
  const requests: RequestEntry[] = (() => {
    try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]"); } catch { return []; }
  })();

  const [rentals, setRentals] = useState<RentalsMap>(() => {
    try { return JSON.parse(localStorage.getItem(RENTALS_KEY) || "{}"); } catch { return {}; }
  });

  const [expanded, setExpanded] = useState<string | null>(null);

  const setRentalCount = (slug: string, val: number) => {
    const n = { ...rentals, [slug]: Math.max(0, val) };
    setRentals(n);
    localStorage.setItem(RENTALS_KEY, JSON.stringify(n));
  };

  const reqCount = (slug: string) => requests.filter(r => r.carSlug === slug).length;
  const rentCount = (slug: string) => rentals[slug] || 0;
  const conv = (slug: string) => {
    const r = reqCount(slug);
    return r > 0 ? Math.round((rentCount(slug) / r) * 100) : null;
  };

  const totalRequests = requests.length;
  const totalRentals = Object.values(rentals).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Автомобили</h1>
        <p className="text-white/30 text-sm mt-0.5">Статистика запросов · Аренду вносите вручную</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Всего запросов", value: totalRequests, color: "text-blue-400" },
          { label: "Выдано в аренду", value: totalRentals, color: "text-emerald-400" },
          { label: "Общая конверсия", value: totalRequests > 0 ? `${Math.round((totalRentals / totalRequests) * 100)}%` : "—", color: "text-[#c9a84c]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#111d30] rounded-2xl border border-white/5 p-5">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tables by city */}
      {(["batumi", "tbilisi"] as City[]).map(city => {
        const cars = CARS.filter(c => c.city === city);
        return (
          <div key={city} className="mb-8">
            <h2 className="text-[#c9a84c] font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
              <span>{city === "batumi" ? "🌊" : "🏙️"}</span>
              {city === "batumi" ? "Батуми" : "Тбилиси"}
            </h2>
            <div className="rounded-2xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#111d30] border-b border-white/5">
                    <th className="text-left px-5 py-3 text-xs text-white/30 font-semibold uppercase tracking-wider">Автомобиль</th>
                    <th className="text-center px-4 py-3 text-xs text-white/30 font-semibold uppercase tracking-wider">Запросов</th>
                    <th className="text-center px-4 py-3 text-xs text-white/30 font-semibold uppercase tracking-wider">В аренду</th>
                    <th className="text-center px-4 py-3 text-xs text-white/30 font-semibold uppercase tracking-wider">Конверсия</th>
                    <th className="text-center px-4 py-3 text-xs text-white/30 font-semibold uppercase tracking-wider">Запросы</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, idx) => {
                    const rq = reqCount(car.slug);
                    const rt = rentCount(car.slug);
                    const cv = conv(car.slug);
                    const carRequests = requests.filter(r => r.carSlug === car.slug);
                    const isExpanded = expanded === car.slug;

                    return (
                      <>
                        <tr key={car.slug}
                          className={`border-b border-white/5 ${idx % 2 === 0 ? "bg-[#0a1020]" : "bg-[#0d1628]"}`}>
                          <td className="px-5 py-3.5">
                            <p className="text-white font-semibold text-sm">{car.name}</p>
                            <p className="text-white/25 text-xs mt-0.5">{car.year} · от ${car.price}/день</p>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className="text-blue-400 font-black text-xl">{rq}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => setRentalCount(car.slug, rt - 1)}
                                className="w-7 h-7 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white font-bold text-lg transition-colors">−</button>
                              <span className="text-emerald-400 font-black text-xl w-8 text-center">{rt}</span>
                              <button onClick={() => setRentalCount(car.slug, rt + 1)}
                                className="w-7 h-7 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white font-bold text-lg transition-colors">+</button>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {cv !== null ? (
                              <span className={`font-bold text-sm px-3 py-1 rounded-full ${
                                cv >= 50 ? "bg-emerald-500/10 text-emerald-400" :
                                cv >= 25 ? "bg-amber-500/10 text-amber-400" :
                                "bg-white/5 text-white/30"}`}>
                                {cv}%
                              </span>
                            ) : <span className="text-white/20 text-sm">—</span>}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {rq > 0 && (
                              <button onClick={() => setExpanded(isExpanded ? null : car.slug)}
                                className="text-xs text-[#c9a84c]/70 hover:text-[#c9a84c] underline underline-offset-2 transition-colors">
                                {isExpanded ? "Скрыть" : "Показать"}
                              </button>
                            )}
                          </td>
                        </tr>
                        {isExpanded && carRequests.length > 0 && (
                          <tr key={`${car.slug}-requests`} className="bg-[#111d30]">
                            <td colSpan={5} className="px-5 py-4">
                              <div className="space-y-2">
                                {carRequests.map((r, i) => (
                                  <div key={i} className="flex items-center gap-4 text-xs bg-[#0a1020] rounded-xl px-4 py-2.5">
                                    <span className="text-white/50 w-4">{i + 1}</span>
                                    <span className="text-white font-medium">{r.name}</span>
                                    <span className="text-blue-400">{r.phone}</span>
                                    {r.from && <span className="text-white/40">{r.from} → {r.to}</span>}
                                    <span className="text-white/20 ml-auto">{r.date ? new Date(r.date).toLocaleDateString("ru") : ""}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
