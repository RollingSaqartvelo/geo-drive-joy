import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { CARS } from "./cars";
import { addDays, format, startOfDay } from "date-fns";
import { X, FileText, ArrowRight, Trash2 } from "lucide-react";
import {
  type AdminBooking, type ContactType, type PickupType,
  loadBookings, saveBookings, nextContractNumber, calcDays, getCarCurrentCity
} from "@/lib/adminBookings";
import { openContract } from "@/lib/contractGenerator";

export const Route = createFileRoute("/admin/calendar")({
  component: AdminCalendar,
});

type Block = { from: string; to: string };
type BlocksMap = Record<string, Block[]>;
type City = "batumi" | "tbilisi";

const BLOCKS_KEY = "georent_blocks";
const REQUESTS_KEY = "georent_requests";
const DAY_W = 44;
const DAYS = 75;
const CAR_COL = 200;

const TIMES = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  return `${h}:${i % 2 === 0 ? "00" : "30"}`;
});

const SERVICES = ["Детское кресло", "GPS-навигатор", "Видеорегистратор", "Полное КАСКО"];

function loadBlocks(): BlocksMap {
  try { return JSON.parse(localStorage.getItem(BLOCKS_KEY) || "{}"); } catch { return {}; }
}
function saveBlocks(b: BlocksMap) { localStorage.setItem(BLOCKS_KEY, JSON.stringify(b)); }

type ReqEntry = { carSlug: string; from: string; to: string };
function loadRequests(): ReqEntry[] {
  try { return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]"); } catch { return []; }
}

function suggestPrice(car: typeof CARS[0], days: number): number {
  const tiers = car.tiers ?? [{ label: "Per day", price: car.price }];
  for (const tier of [...tiers].reverse()) {
    const m = tier.label.match(/^(\d+)/);
    if (m && days >= parseInt(m[1])) return tier.price;
  }
  return tiers[tiers.length - 1]?.price ?? car.price;
}

const EMPTY: Omit<AdminBooking, "id" | "contractNumber" | "createdAt"> = {
  carSlug: "", carName: "", carBaseCity: "", pickupCity: "", returnCity: "",
  pickupDate: "", returnDate: "", pickupTime: "11:00", returnTime: "11:00",
  pickupType: "office", deliveryAddress: "", services: [],
  clientName: "", clientPassport: "", clientLicense: "", clientPhone: "",
  clientContact: "whatsapp", pricePerDay: 0, totalPrice: 0, deposit: 150, days: 0, note: "",
};

// Booking Modal Component
function BookingModal({ initial, onSave, onDelete, onClose }: {
  initial: Partial<AdminBooking> & { isNew?: boolean };
  onSave: (b: AdminBooking) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}) {
  const [f, setF] = useState<typeof EMPTY>(() => ({ ...EMPTY, ...initial }));
  const isNew = !initial.id;

  const up = (k: keyof typeof EMPTY, v: unknown) => setF(prev => {
    const next = { ...prev, [k]: v };
    // Recalc days and total
    const days = calcDays(next.pickupDate, next.returnDate);
    const ppd = next.pricePerDay || 0;
    return { ...next, days, totalPrice: days * ppd };
  });

  const upDate = (k: "pickupDate" | "returnDate", v: string) => {
    setF(prev => {
      const next = { ...prev, [k]: v };
      // suggest price from car tiers
      const car = CARS.find(c => c.slug === next.carSlug);
      const days = calcDays(next.pickupDate, next.returnDate);
      const ppd = car ? suggestPrice(car, days) : next.pricePerDay;
      return { ...next, days, pricePerDay: ppd, totalPrice: days * ppd };
    });
  };

  const toggleService = (s: string) => {
    setF(prev => ({
      ...prev,
      services: prev.services.includes(s) ? prev.services.filter(x => x !== s) : [...prev.services, s],
    }));
  };

  const canContract = f.clientName.trim().length > 1 && f.clientPassport.trim().length > 2;

  const handleSave = () => {
    const booking: AdminBooking = {
      ...f,
      id: initial.id || crypto.randomUUID(),
      contractNumber: initial.contractNumber || nextContractNumber(),
      createdAt: initial.createdAt || new Date().toISOString(),
    };
    onSave(booking);
  };

  const fieldCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)] bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative bg-white h-full w-full max-w-lg shadow-2xl overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--brand-blue)] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">{isNew ? "Новое бронирование" : "Редактировать"}</h2>
            <p className="text-white/70 text-xs mt-0.5">{f.carName || "—"}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Dates & Times */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">📅 Даты и время</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Дата получения</label>
                <input type="date" value={f.pickupDate} onChange={e => upDate("pickupDate", e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Дата возврата</label>
                <input type="date" value={f.returnDate} onChange={e => upDate("returnDate", e.target.value)} className={fieldCls} />
              </div>
              <div>
                <label className={labelCls}>Время получения</label>
                <select value={f.pickupTime} onChange={e => up("pickupTime", e.target.value)} className={fieldCls}>
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Время возврата</label>
                <select value={f.returnTime} onChange={e => up("returnTime", e.target.value)} className={fieldCls}>
                  {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {f.days > 0 && (
              <div className="text-center text-sm font-bold text-[var(--brand-blue)]">
                Срок: {f.days} {f.days === 1 ? "день" : f.days < 5 ? "дня" : "дней"}
              </div>
            )}
          </div>

          {/* Cities */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">🏙️ Города</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Город получения</label>
                <select value={f.pickupCity} onChange={e => up("pickupCity", e.target.value)} className={fieldCls}>
                  <option value="batumi">Батуми</option>
                  <option value="tbilisi">Тбилиси</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Город возврата</label>
                <select value={f.returnCity} onChange={e => up("returnCity", e.target.value)} className={fieldCls}>
                  <option value="batumi">Батуми</option>
                  <option value="tbilisi">Тбилиси</option>
                </select>
              </div>
            </div>
            {f.pickupCity !== f.returnCity && f.pickupCity && f.returnCity && (
              <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-700">
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                Межгородная аренда: после возврата авто остаётся в {f.returnCity === "batumi" ? "Батуми" : "Тбилиси"}
              </div>
            )}
          </div>

          {/* Pickup method */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">📍 Способ получения</p>
            <div className="flex gap-2">
              {[
                { v: "office", label: "Офис проката" },
                { v: "delivery", label: "Доставка" },
                { v: "airport", label: "Аэропорт" },
              ].map(({ v, label }) => (
                <button key={v} type="button"
                  onClick={() => up("pickupType", v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${f.pickupType === v ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]" : "bg-white text-gray-500 border-gray-200 hover:border-[var(--brand-blue)]"}`}>
                  {label}
                </button>
              ))}
            </div>
            {f.pickupType === "delivery" && (
              <input value={f.deliveryAddress} onChange={e => up("deliveryAddress", e.target.value)}
                className={fieldCls} placeholder="Адрес доставки" />
            )}
          </div>

          {/* Services */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">➕ Доп. услуги</p>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map(s => (
                <label key={s} className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg border transition-colors ${f.services.includes(s) ? "bg-[var(--brand-blue)]/10 border-[var(--brand-blue)]/30 text-[var(--brand-blue)] font-medium" : "bg-white border-gray-200 text-gray-600"}`}>
                  <input type="checkbox" checked={f.services.includes(s)} onChange={() => toggleService(s)} className="sr-only" />
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${f.services.includes(s) ? "bg-[var(--brand-blue)] border-[var(--brand-blue)]" : "border-gray-300"}`}>
                    {f.services.includes(s) && <span className="text-white text-[10px] font-bold">✓</span>}
                  </span>
                  {s}
                </label>
              ))}
            </div>
          </div>

          {/* Client */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">👤 Клиент</p>
            <div>
              <label className={labelCls}>ФИО (слово в слово как в загранпаспорте, латиница) *</label>
              <input value={f.clientName} onChange={e => up("clientName", e.target.value)}
                className={fieldCls} placeholder="IVANOV IVAN IVANOVICH" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Номер паспорта *</label>
                <input value={f.clientPassport} onChange={e => up("clientPassport", e.target.value)}
                  className={fieldCls} placeholder="AB1234567" />
              </div>
              <div>
                <label className={labelCls}>Вод. удостоверение</label>
                <input value={f.clientLicense} onChange={e => up("clientLicense", e.target.value)}
                  className={fieldCls} placeholder="Номер ВУ" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Телефон / контакт</label>
              <input value={f.clientPhone} onChange={e => up("clientPhone", e.target.value)}
                className={fieldCls} placeholder="+7 / +972 / @telegram" />
            </div>
            <div>
              <label className={labelCls}>Тип связи</label>
              <div className="flex gap-2">
                {(["whatsapp", "telegram", "phone"] as ContactType[]).map(ct => (
                  <button key={ct} type="button" onClick={() => up("clientContact", ct)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${f.clientContact === ct ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]" : "bg-white text-gray-500 border-gray-200"}`}>
                    {ct === "whatsapp" ? "WhatsApp" : ct === "telegram" ? "Telegram" : "Звонок"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">💰 Стоимость</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Цена в день ($)</label>
                <input type="number" value={f.pricePerDay || ""} onChange={e => {
                  const ppd = parseInt(e.target.value) || 0;
                  setF(prev => ({ ...prev, pricePerDay: ppd, totalPrice: prev.days * ppd }));
                }} className={fieldCls} placeholder="0" />
              </div>
              <div>
                <label className={labelCls}>Залог ($)</label>
                <input type="number" value={f.deposit} onChange={e => up("deposit", parseInt(e.target.value) || 150)}
                  className={fieldCls} />
              </div>
            </div>
            <div className="bg-[var(--brand-blue)] text-white rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium opacity-80">
                {f.days} дн × ${f.pricePerDay}/день
              </span>
              <span className="text-2xl font-black">${f.totalPrice}</span>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className={labelCls}>Примечание</label>
            <textarea value={f.note} onChange={e => up("note", e.target.value)}
              className={`${fieldCls} resize-none`} rows={2} placeholder="Доп. информация..." />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex flex-col gap-2">
          {canContract && (
            <button onClick={() => openContract({ ...f, id: initial.id || "", contractNumber: initial.contractNumber || nextContractNumber(), createdAt: initial.createdAt || "" })}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors">
              <FileText className="h-4 w-4" /> Договор PDF
            </button>
          )}
          <div className="flex gap-2">
            {!isNew && onDelete && (
              <button onClick={() => { if (confirm("Удалить бронирование?")) onDelete(initial.id!); }}
                className="h-11 w-11 shrink-0 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={onClose}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Отмена
            </button>
            <button onClick={handleSave}
              className="flex-1 h-11 rounded-xl bg-[var(--brand-blue)] text-white font-bold text-sm hover:opacity-90 transition-opacity">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCalendar() {
  const [city, setCity] = useState<City>("batumi");
  const [blocks, setBlocks] = useState<BlocksMap>(loadBlocks);
  const [bookings, setBookings] = useState<AdminBooking[]>(loadBookings);
  const [modal, setModal] = useState<Partial<AdminBooking> & { isNew?: boolean } | null>(null);

  const dragStart = useRef<{ carSlug: string; date: string } | null>(null);
  const dragMoved = useRef(false);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i));
  const requests = loadRequests();

  // Filter cars by their current city (accounting for one-way rentals)
  const cars = CARS.filter(c => getCarCurrentCity(c.slug, c.city) === city);

  const isBlocked = (slug: string, d: string) =>
    (blocks[slug] || []).some(b => d >= b.from && d <= b.to);

  const hasRequest = (slug: string, d: string) =>
    requests.some(r => r.carSlug === slug && r.from && r.to && d >= r.from && d <= r.to);

  const getBooking = (slug: string, d: string): AdminBooking | null =>
    bookings.find(b => b.carSlug === slug && d >= b.pickupDate && d <= b.returnDate) ?? null;

  const isInDrag = (slug: string, d: string) => {
    if (!dragStart.current || dragStart.current.carSlug !== slug || !hoverDate) return false;
    const [a, b] = dragStart.current.date <= hoverDate ? [dragStart.current.date, hoverDate] : [hoverDate, dragStart.current.date];
    return d >= a && d <= b;
  };

  const handleMouseDown = useCallback((slug: string, d: string) => {
    dragStart.current = { carSlug: slug, date: d };
    dragMoved.current = false;
  }, []);

  const handleMouseEnter = useCallback((slug: string, d: string) => {
    if (dragStart.current && dragStart.current.carSlug === slug) {
      if (d !== dragStart.current.date) dragMoved.current = true;
      setHoverDate(d);
    }
  }, []);

  const handleMouseUp = useCallback((slug: string, d: string) => {
    if (!dragStart.current) return;
    const ds = dragStart.current;

    if (!dragMoved.current) {
      // Single click
      const booking = getBooking(slug, d);
      if (booking) {
        setModal(booking);
      } else if (isBlocked(slug, d)) {
        const nb = { ...blocks };
        nb[slug] = (nb[slug] || []).filter(b => !(d >= b.from && d <= b.to));
        setBlocks(nb);
        saveBlocks(nb);
      } else {
        // New booking
        const car = CARS.find(c => c.slug === slug);
        const curCity = getCarCurrentCity(slug, car?.city || "batumi");
        setModal({
          isNew: true,
          carSlug: slug,
          carName: car?.name || "",
          carBaseCity: car?.city || curCity,
          pickupCity: curCity,
          returnCity: curCity,
          pickupDate: d,
          returnDate: "",
          pickupTime: "11:00",
          returnTime: "11:00",
          pickupType: "office",
          deliveryAddress: "",
          services: [],
          clientName: "",
          clientPassport: "",
          clientLicense: "",
          clientPhone: "",
          clientContact: "whatsapp",
          pricePerDay: car ? suggestPrice(car, 1) : 0,
          totalPrice: 0,
          deposit: 150,
          days: 0,
          note: "",
        });
      }
    } else {
      // Drag → block
      const [from, to] = ds.date <= d ? [ds.date, d] : [d, ds.date];
      const nb = { ...blocks };
      nb[ds.carSlug] = [...(nb[ds.carSlug] || []), { from, to }];
      setBlocks(nb);
      saveBlocks(nb);
    }

    dragStart.current = null;
    dragMoved.current = false;
    setHoverDate(null);
  }, [blocks, bookings]);

  const handleSave = (b: AdminBooking) => {
    const existing = bookings.find(x => x.id === b.id);
    const updated = existing ? bookings.map(x => x.id === b.id ? b : x) : [...bookings, b];
    setBookings(updated);
    saveBookings(updated);
    setModal(null);
  };

  const handleDelete = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    saveBookings(updated);
    setModal(null);
  };

  const totalW = CAR_COL + DAY_W * DAYS;

  return (
    <div className="p-6 select-none" onMouseUp={() => {
      if (dragStart.current) { dragStart.current = null; dragMoved.current = false; setHoverDate(null); }
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Календарь</h1>
          <p className="text-gray-400 text-sm mt-0.5">Клик — новое бронирование · Тяните — блокировка дат</p>
        </div>
        <div className="flex gap-2">
          {(["batumi", "tbilisi"] as City[]).map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${city === c ? "bg-[var(--brand-blue)] text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"}`}>
              {c === "batumi" ? "🌊 Батуми" : "🏙️ Тбилиси"}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
        <div style={{ minWidth: totalW }}>
          {/* Date header */}
          <div className="flex sticky top-0 z-10 bg-[var(--brand-blue)]">
            <div style={{ width: CAR_COL, minWidth: CAR_COL }}
              className="border-b border-r border-white/10 px-4 py-3 text-xs text-white/60 font-bold uppercase tracking-widest shrink-0">
              Автомобиль
            </div>
            {days.map(d => {
              const isToday = format(d, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
              const isWeekend = [0, 6].includes(d.getDay());
              return (
                <div key={d.toISOString()} style={{ width: DAY_W, minWidth: DAY_W }}
                  className={`border-b border-r border-white/10 py-2 text-center flex flex-col items-center shrink-0 ${isToday ? "bg-white/20" : isWeekend ? "bg-white/5" : ""}`}>
                  <span className={`text-xs font-bold ${isToday ? "text-white" : isWeekend ? "text-white/60" : "text-white/70"}`}>{format(d, "d")}</span>
                  <span className={`text-[9px] ${isToday ? "text-white/80" : "text-white/40"}`}>{format(d, "MMM")}</span>
                </div>
              );
            })}
          </div>

          {/* Car rows */}
          {cars.map((car, idx) => (
            <div key={car.slug} className={`flex ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/80"}`}>
              <div style={{ width: CAR_COL, minWidth: CAR_COL }}
                className="border-r border-b border-gray-100 px-4 py-0 flex items-center shrink-0 h-11">
                <p className="text-gray-700 text-sm font-semibold truncate">{car.name}</p>
              </div>
              {days.map(d => {
                const ds = format(d, "yyyy-MM-dd");
                const blocked = isBlocked(car.slug, ds);
                const booking = getBooking(car.slug, ds);
                const req = hasRequest(car.slug, ds);
                const inDrag = isInDrag(car.slug, ds);
                const isToday = ds === format(today, "yyyy-MM-dd");
                const isPickup = booking?.pickupDate === ds;

                return (
                  <div key={ds} style={{ width: DAY_W, minWidth: DAY_W }}
                    className={`h-11 border-r border-b border-gray-100 shrink-0 cursor-pointer transition-all relative overflow-hidden
                      ${isToday ? "border-l-2 border-l-[var(--brand-blue)]" : ""}
                      ${blocked ? "bg-amber-100" : ""}
                      ${booking ? "bg-blue-100" : ""}
                      ${req && !blocked && !booking ? "bg-yellow-50" : ""}
                      ${inDrag ? "bg-blue-200" : ""}
                      ${!blocked && !booking && !req && !inDrag ? "hover:bg-blue-50" : ""}`}
                    onMouseDown={() => handleMouseDown(car.slug, ds)}
                    onMouseEnter={() => handleMouseEnter(car.slug, ds)}
                    onMouseUp={() => handleMouseUp(car.slug, ds)}
                  >
                    {blocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-amber-500 text-xs font-bold">✕</span>
                      </div>
                    )}
                    {booking && (
                      <div className="absolute inset-0 flex items-center overflow-hidden px-1">
                        {isPickup && (
                          <span className="text-[9px] font-bold text-blue-700 truncate leading-none">
                            {booking.clientName ? booking.clientName.split(" ")[0] : "•"}
                          </span>
                        )}
                      </div>
                    )}
                    {req && !blocked && !booking && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-yellow-500 text-xs">●</span>
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
      <div className="flex flex-wrap gap-5 mt-4 text-xs text-gray-400">
        {[
          { color: "bg-amber-100 border-amber-300", icon: "✕", text: "Заблокировано" },
          { color: "bg-blue-100 border-blue-300", icon: "●", text: "Бронирование" },
          { color: "bg-yellow-50 border-yellow-300", icon: "●", text: "Запрос с сайта" },
          { color: "bg-blue-200 border-blue-400", icon: "", text: "Выбор диапазона" },
        ].map(({ color, icon, text }) => (
          <span key={text} className="flex items-center gap-1.5">
            <span className={`w-5 h-4 rounded border ${color} flex items-center justify-center text-[9px]`}>{icon}</span>
            {text}
          </span>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <BookingModal
          initial={modal}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
