import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { CARS } from "./cars";
import { addDays, format, startOfDay } from "date-fns";
import { X, FileText, ArrowRight, Trash2 } from "lucide-react";
import {
  type AdminBooking, type ContactType, type PickupType,
  loadBookings, saveBookings, nextContractNumber, calcDays, getCarCurrentCity
} from "@/lib/adminBookings";
import { openContract } from "@/lib/contractGenerator";
import { AvailabilitySearch, type AvailCar } from "@/components/AvailabilitySearch";
import type { Loc } from "@/lib/availability";
import { syncBookings, syncBlocks, pushBooking, pushDeleteBooking, pushAddBlock, pushRemoveBlock, syncCarLocations, setCarLocation, type CarLocations } from "@/lib/store";

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

  // База клиентов из прошлых броней (для автозаполнения по телефону)
  const clients = useMemo(() => {
    const map = new Map<string, { name: string; passport: string; license: string; phone: string; contact: ContactType }>();
    for (const b of loadBookings()) {
      const key = (b.clientPhone || b.clientPassport || "").trim().toLowerCase();
      if (!key || !(b.clientName || "").trim()) continue;
      map.set(key, {
        name: b.clientName || "", passport: b.clientPassport || "", license: b.clientLicense || "",
        phone: b.clientPhone || "", contact: (b.clientContact || "whatsapp") as ContactType,
      });
    }
    return [...map.values()];
  }, []);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const phoneQuery = f.clientPhone.trim().toLowerCase();
  const clientMatches = phoneQuery.length >= 2
    ? clients.filter(c => c.phone && c.phone.toLowerCase().includes(phoneQuery) && c.phone.toLowerCase() !== phoneQuery).slice(0, 6)
    : [];
  const pickClient = (c: { name: string; passport: string; license: string; phone: string; contact: ContactType }) => {
    setF(prev => ({ ...prev, clientName: c.name, clientPassport: c.passport, clientLicense: c.license, clientPhone: c.phone, clientContact: c.contact }));
    setPhoneFocus(false);
  };

  const up = (k: keyof typeof EMPTY, v: unknown) => setF(prev => {
    const next = { ...prev, [k]: v };
    // Recalc days and total (учитываем время получения/возврата)
    const days = calcDays(next.pickupDate, next.returnDate, next.pickupTime, next.returnTime);
    const ppd = next.pricePerDay || 0;
    return { ...next, days, totalPrice: days * ppd };
  });

  const upDate = (k: "pickupDate" | "returnDate", v: string) => {
    setF(prev => {
      const next = { ...prev, [k]: v };
      // suggest price from car tiers
      const car = CARS.find(c => c.slug === next.carSlug);
      const days = calcDays(next.pickupDate, next.returnDate, next.pickupTime, next.returnTime);
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
            <div className="relative">
              <label className={labelCls}>Телефон / контакт</label>
              <input value={f.clientPhone}
                onChange={e => { up("clientPhone", e.target.value); setPhoneFocus(true); }}
                onFocus={() => setPhoneFocus(true)}
                onBlur={() => setTimeout(() => setPhoneFocus(false), 150)}
                autoComplete="off"
                className={fieldCls} placeholder="+7 / +972 / @telegram" />
              {phoneFocus && clientMatches.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-400 bg-gray-50">Найденные клиенты</p>
                  {clientMatches.map((c, i) => (
                    <button key={i} type="button" onMouseDown={e => { e.preventDefault(); pickClient(c); }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 flex flex-col gap-0.5 border-t border-gray-50">
                      <span className="text-sm font-semibold text-gray-800">{c.name}</span>
                      <span className="text-xs text-gray-500">{c.phone}{c.passport ? ` · ${c.passport}` : ""}</span>
                    </button>
                  ))}
                </div>
              )}
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
  // Перенос брони на другую машину мышкой (только админ)
  const moveRef = useRef<AdminBooking | null>(null);
  const [moveOver, setMoveOver] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i));
  const requests = loadRequests();

  // Filter cars by their current city (accounting for one-way rentals)
  // Машины, закреплённые за менеджером (если есть) → режим «Мои машины»
  const myCars: string[] = (() => {
    if (typeof sessionStorage === "undefined") return [];
    try { return JSON.parse(sessionStorage.getItem("georent_mycars") || "[]"); } catch { return []; }
  })();
  const hasMyCars = myCars.length > 0;
  const [scope, setScope] = useState<"mine" | "all">(hasMyCars ? "mine" : "all");
  const inScope = (slug: string) => scope === "all" || !hasMyCars || myCars.includes(slug);

  // Ручной город («переброс») имеет приоритет над авторасчётом по one-way броням
  const [carLocations, setCarLocations] = useState<CarLocations>({});
  const effectiveCity = (slug: string, baseCity: string): City =>
    (carLocations[slug] as City) || (getCarCurrentCity(slug, baseCity) as City);

  // Авто с one-way бронью (Батуми↔Тбилиси) показываем сразу в ОБОИХ городах —
  // чтобы заранее планировать перемещение.
  const _todayStr = format(today, "yyyy-MM-dd");
  const oneWayInvolves = (slug: string, cityX: City) =>
    bookings.some(b => b.carSlug === slug && b.pickupCity !== b.returnCity && b.returnDate >= _todayStr
      && (b.pickupCity === cityX || b.returnCity === cityX));

  const cars = CARS.filter(c => inScope(c.slug) && (effectiveCity(c.slug, c.city) === city || oneWayInvolves(c.slug, city)));

  const cityLabel = (c: string) => c === "batumi" ? "🌊 Батуми" : c === "tbilisi" ? "🏙️ Тбилиси" : c;
  // Фактический город машины на конкретную дату (учёт one-way сдач)
  const cityOnDate = (slug: string, ds: string): City => {
    const ow = bookings.filter(b => b.carSlug === slug && b.pickupCity !== b.returnCity && b.returnDate <= ds)
      .sort((a, b) => a.returnDate.localeCompare(b.returnDate));
    if (ow.length) return ow[ow.length - 1].returnCity as City;
    return effectiveCity(slug, CARS.find(c => c.slug === slug)?.city || "batumi");
  };

  // Тултип с ценами (при наведении на название авто)
  const priceTip = (car: typeof CARS[0]) =>
    car.tiers && car.tiers.length ? car.tiers.map(t => `${t.label}: $${t.price}`).join("  ·  ") : `$${car.price}/day`;

  const todayStr = format(today, "yyyy-MM-dd");
  const fmtD = (s: string) => (s ? format(new Date(s + "T00:00:00"), "d MMM") : "—");

  // Место получения авто
  const pickupPlace = (b: AdminBooking) =>
    b.pickupType === "delivery" ? `Доставка: ${b.deliveryAddress || "адрес не указан"}`
      : b.pickupType === "airport" ? "Аэропорт"
        : `Офис · ${cityLabel(b.pickupCity)}`;

  // Подсказка при наведении на бронь. Телефон клиента виден только админу
  // и менеджеру, за которым закреплена эта машина.
  const bookingTip = (b: AdminBooking, slug: string) => {
    const role = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("georent_role") : null;
    const canSeePhone = role === "admin" || myCars.includes(slug);
    const lines = [
      b.clientName || "Клиент",
      `📅 ${fmtD(b.pickupDate)} ${b.pickupTime || ""} → ${fmtD(b.returnDate)} ${b.returnTime || ""}`,
      `📍 Получение: ${pickupPlace(b)}`,
    ];
    if (b.returnCity && b.returnCity !== b.pickupCity) lines.push(`🔁 Возврат: ${cityLabel(b.returnCity)}`);
    lines.push(canSeePhone && b.clientPhone ? `📞 ${b.clientPhone}` : "📞 телефон скрыт");
    return lines.join("\n");
  };

  // Mobile "block dates" inline form state
  const [blockCar, setBlockCar] = useState<string | null>(null);
  const [blkFrom, setBlkFrom] = useState("");
  const [blkTo, setBlkTo] = useState("");
  // Меню по клику на пустую ячейку: новая бронь / в ремонте
  const [cellAction, setCellAction] = useState<{ slug: string; date: string } | null>(null);
  const [repFrom, setRepFrom] = useState("");
  const [repTo, setRepTo] = useState("");
  // Предупреждение: машина в этот день фактически в другом городе
  const [cityWarn, setCityWarn] = useState<{ slug: string; date: string; actualCity: City } | null>(null);

  const openNewBooking = (slug: string, from = "", to = "", pCity?: string, rCity?: string) => {
    const car = CARS.find(c => c.slug === slug);
    const curCity = getCarCurrentCity(slug, car?.city || "batumi");
    const days = from && to ? calcDays(from, to) : 0;
    const ppd = car ? suggestPrice(car, days || 1) : 0;
    setModal({
      isNew: true, carSlug: slug, carName: car?.name || "",
      carBaseCity: car?.city || curCity, pickupCity: pCity || curCity, returnCity: rCity || pCity || curCity,
      pickupDate: from, returnDate: to, pickupTime: "11:00", returnTime: "11:00",
      pickupType: "office", deliveryAddress: "", services: [],
      clientName: "", clientPassport: "", clientLicense: "", clientPhone: "",
      clientContact: "whatsapp", pricePerDay: ppd,
      totalPrice: days * ppd, deposit: 150, days, note: "",
    });
  };

  // Синхронизация с Supabase при входе (мгновенно из кэша, затем обновление из базы)
  useEffect(() => {
    syncBookings().then(setBookings).catch(() => {});
    syncBlocks().then(setBlocks).catch(() => {});
    syncCarLocations().then(setCarLocations).catch(() => {});
  }, []);

  // Переброс машины в другой город (в один клик)
  const relocateCar = (slug: string, baseCity: string) => {
    // Менеджер с закреплёнными машинами перебрасывает только свои
    if (!relFullAccess && !myCars.includes(slug)) return;
    const cur = effectiveCity(slug, baseCity);
    const next: City = cur === "batumi" ? "tbilisi" : "batumi";
    setCarLocations(prev => ({ ...prev, [slug]: next }));
    setCarLocation(slug, next);
  };

  // Полный доступ к перебросу (любая машина): админ, Каха, Lasha
  const relRole = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("georent_role") : null;
  const relUser = typeof sessionStorage !== "undefined" ? (sessionStorage.getItem("georent_user") || "") : "";
  const relFullAccess = relRole === "admin" || relUser === "Менеджер Каха" || relUser === "Менеджер Lasha";
  // Артур тоже может перебрасывать — но только свои машины
  const canRelocate = relFullAccess || relUser === "Менеджер Arthur";
  const [relocateOpen, setRelocateOpen] = useState(false);
  const [relocateSel, setRelocateSel] = useState<string | null>(null);

  const removeBlock = (slug: string, bl: Block) => {
    const nb = { ...blocks };
    nb[slug] = (nb[slug] || []).filter(x => !(x.from === bl.from && x.to === bl.to));
    setBlocks(nb); saveBlocks(nb);
    pushRemoveBlock(slug, bl.from, bl.to);
  };

  const confirmBlock = (slug: string) => {
    if (!blkFrom || !blkTo) return;
    const [from, to] = blkFrom <= blkTo ? [blkFrom, blkTo] : [blkTo, blkFrom];
    const nb = { ...blocks };
    nb[slug] = [...(nb[slug] || []), { from, to }];
    setBlocks(nb); saveBlocks(nb);
    pushAddBlock(slug, from, to);
    setBlockCar(null); setBlkFrom(""); setBlkTo("");
  };

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
    // Админ: зажатие на брони начинает её перенос на другую машину
    const isAdmin = typeof sessionStorage !== "undefined" && sessionStorage.getItem("georent_role") === "admin";
    const bk = getBooking(slug, d);
    if (isAdmin && bk) {
      moveRef.current = bk;
      dragStart.current = { carSlug: slug, date: d };
      dragMoved.current = false;
      return;
    }
    dragStart.current = { carSlug: slug, date: d };
    dragMoved.current = false;
  }, [bookings]);

  const handleMouseEnter = useCallback((slug: string, d: string) => {
    // Перенос брони: подсвечиваем машину под курсором
    if (moveRef.current) {
      if (slug !== moveRef.current.carSlug || d !== dragStart.current?.date) dragMoved.current = true;
      setMoveOver(slug);
      return;
    }
    if (dragStart.current && dragStart.current.carSlug === slug) {
      if (d !== dragStart.current.date) dragMoved.current = true;
      setHoverDate(d);
    }
  }, []);

  const handleMouseUp = useCallback((slug: string, d: string) => {
    // Перенос брони на другую машину (админ)
    if (moveRef.current) {
      const bk = moveRef.current;
      if (dragMoved.current && slug !== bk.carSlug) {
        const targetCar = CARS.find(c => c.slug === slug);
        const conflict = bookings.some(x => x.id !== bk.id && x.carSlug === slug
          && !(bk.returnDate < x.pickupDate || bk.pickupDate > x.returnDate));
        if (!conflict || window.confirm("На этой машине уже есть бронь на пересекающиеся даты. Всё равно перенести?")) {
          const moved: AdminBooking = { ...bk, carSlug: slug, carName: targetCar?.name || bk.carName, carBaseCity: targetCar?.city || bk.carBaseCity };
          const updated = bookings.map(x => x.id === bk.id ? moved : x);
          setBookings(updated); saveBookings(updated); pushBooking(moved);
        }
      } else if (!dragMoved.current) {
        setModal(bk); // просто клик по брони — открыть карточку
      }
      moveRef.current = null; dragMoved.current = false; dragStart.current = null;
      setMoveOver(null); setHoverDate(null);
      return;
    }

    if (!dragStart.current) return;
    const ds = dragStart.current;

    if (!dragMoved.current) {
      // Single click
      const booking = getBooking(slug, d);
      if (booking) {
        setModal(booking);
      } else if (isBlocked(slug, d)) {
        const removed = (blocks[slug] || []).filter(b => d >= b.from && d <= b.to);
        const nb = { ...blocks };
        nb[slug] = (nb[slug] || []).filter(b => !(d >= b.from && d <= b.to));
        setBlocks(nb);
        saveBlocks(nb);
        removed.forEach(b => pushRemoveBlock(slug, b.from, b.to));
      } else {
        setCellAction({ slug, date: d });
        setRepFrom(d);
        setRepTo(d);
      }
    } else {
      // Drag → block
      const [from, to] = ds.date <= d ? [ds.date, d] : [d, ds.date];
      const nb = { ...blocks };
      nb[ds.carSlug] = [...(nb[ds.carSlug] || []), { from, to }];
      setBlocks(nb);
      saveBlocks(nb);
      pushAddBlock(ds.carSlug, from, to);
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
    pushBooking(b);
    setModal(null);
  };

  const handleDelete = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    saveBookings(updated);
    pushDeleteBooking(id);
    setModal(null);
  };

  const totalW = CAR_COL + DAY_W * DAYS;

  const availCars: AvailCar[] = CARS.filter(c => inScope(c.slug)).map(c => ({
    slug: c.slug, baseCity: c.city as Loc, name: c.name,
    manualCity: carLocations[c.slug] as Loc | undefined,
    manualCitySince: carLocations[c.slug] ? format(today, "yyyy-MM-dd") : undefined,
    priceFrom: c.tiers && c.tiers.length ? c.tiers[c.tiers.length - 1].price : c.price,
    image: c.images?.[0]?.url,
  }));

  return (
    <div className="p-4 sm:p-6 select-none" onMouseUp={() => {
      if (dragStart.current || moveRef.current) { dragStart.current = null; moveRef.current = null; dragMoved.current = false; setHoverDate(null); setMoveOver(null); }
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Календарь</h1>
          <p className="text-gray-400 text-sm mt-0.5 hidden md:block">Клик — новое бронирование · Тяните — блокировка дат</p>
          <p className="text-gray-400 text-sm mt-0.5 md:hidden">Выберите авто и добавьте бронь</p>
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

      {/* Переброс автомобиля (только админ / Каха / Lasha) */}
      {canRelocate && (
        <button onClick={() => { setRelocateOpen(true); setRelocateSel(null); }}
          className="mb-4 inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-red-500 text-white font-bold text-sm shadow-md hover:bg-red-600 active:opacity-80 transition-colors">
          🔄 Переместить автомобиль
        </button>
      )}

      {/* Scope toggle — «Мои машины» / «Весь автопарк» (для менеджеров с закреплёнными авто) */}
      {hasMyCars && (
        <div className="flex gap-2 mb-4">
          {([["mine", "🚗 Мои машины"], ["all", "🅿️ Весь автопарк"]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setScope(v)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${scope === v ? "bg-[var(--brand-blue)] text-white shadow-md" : "bg-white text-gray-500 border border-gray-200 hover:border-[var(--brand-blue)]"}`}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Availability questionnaire — same engine used for public site */}
      <div className="mb-5">
        <AvailabilitySearch
          cars={availCars}
          bookings={bookings}
          blocks={blocks}
          ctaLabel="Оформить бронь"
          onPick={(slug, q) => openNewBooking(slug, q.pickupDate, q.returnDate, q.pickupCity, q.returnCity)}
        />
      </div>

      {/* Mobile view — car cards */}
      <div className="md:hidden space-y-3">
        {cars.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">Нет автомобилей в этом городе</p>
        )}
        {cars.map(car => {
          const carBookings = bookings
            .filter(b => b.carSlug === car.slug && b.returnDate >= todayStr)
            .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));
          const carBlocks = (blocks[car.slug] || []).filter(b => b.to >= todayStr);
          const carReqs = requests.filter(r => r.carSlug === car.slug && r.from && r.to && r.to >= todayStr);
          return (
            <div key={car.slug} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <a href={`/car/${car.slug}`} target="_blank" rel="noopener noreferrer"
                    className="block font-bold text-gray-800 leading-tight truncate hover:text-[var(--brand-blue)] hover:underline">
                    {car.name}
                  </a>
                  <p className="mt-0.5 text-[11px] text-[var(--brand-olive)] font-semibold leading-tight">{priceTip(car)}</p>
                </div>
                <button onClick={() => openNewBooking(car.slug)}
                  className="shrink-0 h-9 px-4 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold active:opacity-80">
                  + Бронь
                </button>
              </div>

              {carBookings.length > 0 ? (
                <div className="space-y-1.5">
                  {carBookings.map(b => (
                    <button key={b.id} onClick={() => setModal(b)}
                      className="w-full flex items-center justify-between gap-2 text-left rounded-xl bg-blue-50 border border-blue-100 px-3 py-2 active:bg-blue-100">
                      <span className="text-sm font-semibold text-blue-800 truncate">{b.clientName || "Бронирование"}</span>
                      <span className="text-xs text-blue-600 shrink-0">{fmtD(b.pickupDate)} – {fmtD(b.returnDate)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Нет активных броней</p>
              )}

              {carReqs.map((r, i) => (
                <button key={"req" + i} onClick={() => openNewBooking(car.slug, r.from)}
                  className="mt-1.5 w-full flex items-center justify-between gap-2 text-left rounded-xl bg-yellow-50 border border-yellow-200 px-3 py-2 active:bg-yellow-100">
                  <span className="text-sm font-medium text-yellow-700">📩 Запрос с сайта</span>
                  <span className="text-xs text-yellow-600 shrink-0">{fmtD(r.from)} – {fmtD(r.to)}</span>
                </button>
              ))}

              {carBlocks.map((bl, i) => (
                <button key={"blk" + i} onClick={() => removeBlock(car.slug, bl)}
                  className="mt-1.5 w-full flex items-center justify-between gap-2 text-left rounded-xl bg-red-50 border border-red-200 px-3 py-2 active:bg-red-100">
                  <span className="text-sm font-medium text-red-700">🔧 В ремонте</span>
                  <span className="text-xs text-red-600 shrink-0">{fmtD(bl.from)} – {fmtD(bl.to)} · убрать ✕</span>
                </button>
              ))}

              {blockCar === car.slug ? (
                <div className="mt-3 rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Заблокировать даты</p>
                  <div className="flex gap-2">
                    <input type="date" value={blkFrom} onChange={e => setBlkFrom(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
                    <input type="date" value={blkTo} onChange={e => setBlkTo(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setBlockCar(null); setBlkFrom(""); setBlkTo(""); }}
                      className="flex-1 h-9 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium">Отмена</button>
                    <button onClick={() => confirmBlock(car.slug)}
                      className="flex-1 h-9 rounded-lg bg-amber-500 text-white text-sm font-bold">Заблокировать</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setBlockCar(car.slug); setBlkFrom(""); setBlkTo(""); }}
                  className="mt-3 text-xs font-semibold text-gray-400 active:text-[var(--brand-blue)]">
                  🔒 Заблокировать даты
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Calendar — desktop grid */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
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
            <div key={car.slug} className={`flex ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/80"} ${moveOver === car.slug && moveRef.current && moveRef.current.carSlug !== car.slug ? "ring-2 ring-inset ring-green-500 bg-green-50" : ""}`}>
              <div style={{ width: CAR_COL, minWidth: CAR_COL }}
                className="border-r border-b border-gray-100 px-4 py-0 flex items-center shrink-0 h-11">
                <a href={`/car/${car.slug}`} target="_blank" rel="noopener noreferrer" title={priceTip(car)}
                  className="text-gray-700 text-xs font-semibold truncate hover:text-[var(--brand-blue)] hover:underline cursor-pointer">
                  {car.name}
                </a>
              </div>
              {days.map(d => {
                const ds = format(d, "yyyy-MM-dd");
                const blocked = isBlocked(car.slug, ds);
                const booking = getBooking(car.slug, ds);
                const req = hasRequest(car.slug, ds);
                const inDrag = isInDrag(car.slug, ds);
                const isToday = ds === format(today, "yyyy-MM-dd");
                const isPickup = booking?.pickupDate === ds;
                const isReturn = booking?.returnDate === ds;
                // Частичная заливка по времени: день выдачи — правая часть (с момента выдачи),
                // день возврата — левая часть (до момента сдачи), середина брони — полностью.
                let barL = 0, barR = 0;
                if (booking) {
                  // Заливка считается от рабочего графика 09:00–22:00 (13 ч), не от суток.
                  const frac = (t?: string) => {
                    const [h, m] = (t || "11:00").split(":").map(Number);
                    const hh = (h || 0) + (m || 0) / 60;
                    return Math.min(1, Math.max(0, (hh - 9) / (22 - 9)));
                  };
                  if (isPickup && isReturn) { barL = frac(booking.pickupTime) * 100; barR = (1 - frac(booking.returnTime)) * 100; }
                  else if (isPickup) { barL = frac(booking.pickupTime) * 100; }
                  else if (isReturn) { barR = (1 - frac(booking.returnTime)) * 100; }
                }

                // Машина в этот день фактически в другом городе → не даём ставить бронь здесь
                const actualCity = cityOnDate(car.slug, ds);
                const wrongCity = !booking && !blocked && !req && actualCity !== city;
                if (wrongCity) {
                  return (
                    <div key={ds} style={{ width: DAY_W, minWidth: DAY_W }}
                      title={`Машина будет в ${cityLabel(actualCity)} — бронь оформляйте из вкладки «${cityLabel(actualCity)}»`}
                      onClick={() => setCityWarn({ slug: car.slug, date: ds, actualCity })}
                      className={`h-11 border-r border-b border-gray-100 shrink-0 relative cursor-help
                        ${isToday ? "border-l-2 border-l-[var(--brand-blue)]" : ""}`}>
                      <div className="absolute inset-[3px] rounded-[4px] border-2 border-dashed border-gray-300 bg-gray-50/70 flex items-center justify-center">
                        <span className="text-[10px] opacity-40 leading-none">{actualCity === "batumi" ? "🌊" : "🏙️"}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={ds} style={{ width: DAY_W, minWidth: DAY_W }}
                    title={booking ? bookingTip(booking, car.slug) : undefined}
                    className={`h-11 border-r border-b border-gray-100 shrink-0 cursor-pointer transition-all relative overflow-hidden
                      ${isToday ? "border-l-2 border-l-[var(--brand-blue)]" : ""}
                      ${blocked ? "bg-red-500" : ""}
                      ${req && !blocked && !booking ? "bg-yellow-400" : ""}
                      ${inDrag ? "bg-blue-300" : ""}
                      ${!blocked && !booking && !req && !inDrag ? "hover:bg-blue-50" : ""}`}
                    onMouseDown={() => handleMouseDown(car.slug, ds)}
                    onMouseEnter={() => handleMouseEnter(car.slug, ds)}
                    onMouseUp={() => handleMouseUp(car.slug, ds)}
                  >
                    {blocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🔧</span>
                      </div>
                    )}
                    {booking && (
                      <div className="absolute inset-y-0 bg-blue-600 flex items-center overflow-hidden px-1"
                        style={{ left: `${barL}%`, right: `${barR}%` }}>
                        {isPickup && (
                          <span className="text-[9px] font-bold text-white truncate leading-none">
                            {booking.clientName ? booking.clientName.split(" ")[0] : "•"}
                          </span>
                        )}
                      </div>
                    )}
                    {req && !blocked && !booking && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-yellow-900 text-xs font-bold">●</span>
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
      <div className="hidden md:flex flex-wrap gap-5 mt-4 text-xs text-gray-400">
        {[
          { color: "bg-blue-600 border-blue-700", icon: "", text: "Бронирование" },
          { color: "bg-yellow-400 border-yellow-500", icon: "", text: "Предв. бронь / запрос" },
          { color: "bg-red-500 border-red-600", icon: "", text: "В ремонте" },
          { color: "bg-blue-300 border-blue-400", icon: "", text: "Выбор диапазона" },
        ].map(({ color, icon, text }) => (
          <span key={text} className="flex items-center gap-1.5">
            <span className={`w-5 h-4 rounded border ${color} flex items-center justify-center text-[9px]`}>{icon}</span>
            {text}
          </span>
        ))}
        {relRole === "admin" && (
          <span className="flex items-center gap-1.5 text-[var(--brand-blue)] font-medium">
            🖱️ Бронь можно перетащить мышкой на другую машину
          </span>
        )}
      </div>

      {/* Меню по клику на пустую ячейку */}
      {cellAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setCellAction(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 space-y-4" onClick={e => e.stopPropagation()}>
            <div>
              <p className="font-bold text-gray-800">{CARS.find(c => c.slug === cellAction.slug)?.name || ""}</p>
              <p className="text-xs text-gray-400">{fmtD(cellAction.date)}</p>
            </div>

            <button
              onClick={() => { const a = cellAction; setCellAction(null); openNewBooking(a.slug, a.date); }}
              className="w-full h-12 rounded-xl bg-[var(--brand-blue)] text-white font-bold text-sm flex items-center justify-center gap-2 active:opacity-80">
              🚗 Новое бронирование
            </button>

            <div className="rounded-xl bg-red-50 border border-red-200 p-3 space-y-2">
              <p className="text-sm font-bold text-red-700">🔧 Отметить в ремонте</p>
              <div className="flex gap-2">
                <input type="date" value={repFrom} onChange={e => setRepFrom(e.target.value)}
                  className="flex-1 border border-red-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-red-400" />
                <input type="date" value={repTo} onChange={e => setRepTo(e.target.value)}
                  className="flex-1 border border-red-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-red-400" />
              </div>
              <button
                onClick={() => {
                  if (!repFrom || !repTo) return;
                  const [from, to] = repFrom <= repTo ? [repFrom, repTo] : [repTo, repFrom];
                  const nb = { ...blocks };
                  nb[cellAction.slug] = [...(nb[cellAction.slug] || []), { from, to }];
                  setBlocks(nb); saveBlocks(nb);
                  pushAddBlock(cellAction.slug, from, to);
                  setCellAction(null);
                }}
                className="w-full h-10 rounded-lg bg-red-500 text-white font-bold text-sm active:opacity-80">
                Отметить в ремонте
              </button>
            </div>

            <button onClick={() => setCellAction(null)}
              className="w-full h-10 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Предупреждение: машина в этот день в другом городе */}
      {cityWarn && (() => {
        const car = CARS.find(c => c.slug === cityWarn.slug);
        // Сдача, которая пригнала машину в фактический город (для текста «сдаётся в … в HH:MM»)
        const handover = bookings
          .filter(b => b.carSlug === cityWarn.slug && b.returnCity === cityWarn.actualCity && b.pickupCity !== b.returnCity && b.returnDate <= cityWarn.date)
          .sort((a, b) => a.returnDate.localeCompare(b.returnDate)).pop();
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setCityWarn(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 space-y-4" onClick={e => e.stopPropagation()}>
              <div>
                <p className="font-bold text-gray-800">🚗 Машина в другом городе</p>
                <p className="text-sm text-gray-500 mt-0.5">{car?.name} · {fmtD(cityWarn.date)}</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <p className="text-sm text-amber-800 font-medium">
                  {handover
                    ? `⚠️ Машина сдаётся в ${cityLabel(cityWarn.actualCity)} ${fmtD(handover.returnDate)} в ${handover.returnTime}. На эту дату она уже в ${cityLabel(cityWarn.actualCity)}.`
                    : `⚠️ На эту дату машина находится в ${cityLabel(cityWarn.actualCity)}.`}
                </p>
                <p className="text-xs text-amber-700 mt-1.5">
                  Бронь из «{cityLabel(city)}» на этот день недоступна — оформляйте из вкладки «{cityLabel(cityWarn.actualCity)}».
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setCityWarn(null)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm">Закрыть</button>
                <button onClick={() => { setCity(cityWarn.actualCity); setCityWarn(null); }}
                  className="flex-1 h-11 rounded-xl bg-[var(--brand-blue)] text-white font-bold text-sm">
                  Перейти в {cityLabel(cityWarn.actualCity)}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Переброс: выбор авто + моргающее подтверждение */}
      {relocateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setRelocateOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="font-bold text-gray-800">🔄 Переместить автомобиль</p>
              <button onClick={() => setRelocateOpen(false)} className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>

            {relocateSel ? (
              (() => {
                const c = CARS.find(x => x.slug === relocateSel);
                const cur = effectiveCity(relocateSel, c?.city || "batumi");
                const target = cur === "batumi" ? "🏙️ Тбилиси" : "🌊 Батуми";
                return (
                  <div className="p-6 space-y-4 text-center">
                    <p className="font-bold text-gray-800 text-lg">{c?.name}</p>
                    <p className="text-sm text-gray-500">
                      {cur === "batumi" ? "🌊 Батуми" : "🏙️ Тбилиси"} <span className="mx-1">→</span> {target}
                    </p>
                    <p className="text-xl font-black text-red-600 animate-pulse">Точно перебросить?</p>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setRelocateSel(null)}
                        className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-500 font-medium">Отмена</button>
                      <button onClick={() => { relocateCar(relocateSel!, c?.city || "batumi"); setRelocateOpen(false); setRelocateSel(null); }}
                        className="flex-1 h-11 rounded-xl bg-red-500 text-white font-bold animate-pulse hover:animate-none">
                        Да, перебросить
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-2 overflow-y-auto">
                <p className="px-3 py-2 text-xs text-gray-400">Выберите автомобиль:</p>
                {CARS.filter(c => relFullAccess ? inScope(c.slug) : myCars.includes(c.slug)).map(c => {
                  const cur = effectiveCity(c.slug, c.city);
                  return (
                    <button key={c.slug} onClick={() => setRelocateSel(c.slug)}
                      className="w-full flex items-center justify-between gap-2 text-left rounded-xl px-3 py-2.5 hover:bg-gray-50 active:bg-gray-100">
                      <span className="text-sm font-semibold text-gray-800 truncate">{c.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">{cur === "batumi" ? "🌊 Батуми" : "🏙️ Тбилиси"}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

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
