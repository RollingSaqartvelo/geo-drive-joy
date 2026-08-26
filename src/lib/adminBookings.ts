export type ContactType = "whatsapp" | "telegram" | "phone";
export type PickupType = "office" | "delivery" | "airport";

export type AdminBooking = {
  id: string;
  carSlug: string;
  carName: string;
  carBaseCity: string;   // original city from CARS array
  pickupCity: string;    // actual pickup city
  returnCity: string;    // return city (differs = one-way)
  pickupDate: string;    // "YYYY-MM-DD"
  returnDate: string;
  pickupTime: string;    // "HH:MM"
  returnTime: string;
  pickupType: PickupType;
  deliveryAddress: string;
  services: string[];
  clientName: string;    // Latin as in passport
  clientPassport: string;
  clientLicense: string;
  clientPhone: string;
  clientContact: ContactType;
  source?: string;        // Откуда пришёл клиент (для аналитики)
  pricePerDay: number;
  totalPrice: number;
  deposit: number;
  days: number;
  contractNumber: string;
  note: string;
  createdAt: string;
};

export const BOOKINGS_KEY = "georent_admin_bookings";

// Партнёрские брони (Тбилиси–Тбилиси, без клиента) — только для отображения
// реальной занятости у партнёра. Даты сняты с партнёрского таймлайна (август 2026),
// при необходимости правятся здесь. Не пишутся в Supabase, не редактируются в UI.
export const PARTNER_BOOKINGS: { carSlug: string; from: string; to: string }[] = [
  // Porsche Macan (партнёрские единицы AM953UN + PT953AH)
  { carSlug: "porsche-macan", from: "2026-08-08", to: "2026-08-13" },
  { carSlug: "porsche-macan", from: "2026-08-18", to: "2026-08-31" },
  // Porsche Boxster (партнёрские единицы UR987AN + AK987ER)
  { carSlug: "porsche-boxster", from: "2026-08-03", to: "2026-08-05" },
  { carSlug: "porsche-boxster", from: "2026-08-09", to: "2026-08-12" },
  { carSlug: "porsche-boxster", from: "2026-08-13", to: "2026-08-16" },
  { carSlug: "porsche-boxster", from: "2026-08-21", to: "2026-08-26" },
];

export const isPartnerBooked = (slug: string, d: string): boolean =>
  PARTNER_BOOKINGS.some(p => p.carSlug === slug && d >= p.from && d <= p.to);

export function loadBookings(): AdminBooking[] {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]"); } catch { return []; }
}

export function saveBookings(bs: AdminBooking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bs));
}

export function nextContractNumber(): string {
  const bs = loadBookings();
  const nums = bs.map(b => parseInt(b.contractNumber) || 0);
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return String(max + 1).padStart(3, "0");
}

// Количество суток аренды. Если переданы времена — считаем по фактической
// длительности: любой выход за N×24 часа (возврат позже времени получения) = +1 день.
export function calcDays(fromDate: string, toDate: string, fromTime?: string, toTime?: string): number {
  if (!fromDate || !toDate) return 0;
  if (fromTime && toTime) {
    const start = new Date(`${fromDate}T${fromTime}`).getTime();
    const end = new Date(`${toDate}T${toTime}`).getTime();
    const hours = (end - start) / 3600000;
    if (hours <= 0) return 0;
    return Math.max(1, Math.ceil(hours / 24));
  }
  return Math.max(0, Math.round((new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000));
}

// Returns the city where this car currently is, accounting for one-way rentals
export function getCarCurrentCity(slug: string, baseCity: string): string {
  try {
    const bookings = loadBookings();
    const today = new Date().toISOString().split("T")[0];
    const oneWay = bookings
      .filter(b => b.carSlug === slug && b.returnCity && b.returnCity !== b.pickupCity && b.returnDate <= today)
      .sort((a, b) => a.returnDate.localeCompare(b.returnDate));
    if (oneWay.length > 0) return oneWay[oneWay.length - 1].returnCity;
  } catch {}
  return baseCity;
}

// Returns effective city of car on a specific future date (for admin calendar)
export function getCarCityOnDate(slug: string, baseCity: string, date: string): string {
  try {
    const bookings = loadBookings();
    const oneWay = bookings
      .filter(b => b.carSlug === slug && b.returnCity && b.returnCity !== b.pickupCity && b.returnDate <= date)
      .sort((a, b) => a.returnDate.localeCompare(b.returnDate));
    if (oneWay.length > 0) return oneWay[oneWay.length - 1].returnCity;
  } catch {}
  return baseCity;
}
