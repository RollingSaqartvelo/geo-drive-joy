// ─────────────────────────────────────────────────────────────────────────
// AvailabilityService — единый движок доступности автопарка между городами.
// Используется И публичным сайтом, И админкой (один источник истины).
//
// Логика НЕ сводится к простому пересечению дат. Учитывается:
//   • дата и город получения/возврата;
//   • направление брони (one-way vs round-trip);
//   • предыдущая и следующая бронь в цепочке;
//   • физическое местоположение авто;
//   • буфер на перегон между городами = 2 дня.
//
// Модуль чистый: принимает брони/блокировки как аргументы, не читает БД сам.
// Это позволяет запускать одну и ту же логику поверх localStorage ИЛИ Supabase.
// ─────────────────────────────────────────────────────────────────────────

import type { AdminBooking } from "./adminBookings";

export type Loc = "batumi" | "tbilisi";

/** Дней на перегон авто между городами. После брони со сменой города авто
 *  доступно в новом городе через (TRANSFER_DAYS + 1) дней после возврата. */
export const TRANSFER_DAYS = 2;

/** Блокировка/обслуживание — без города, просто занятый интервал. */
export type Block = { from: string; to: string };

export type CarInput = {
  slug: string;
  baseCity: Loc;
  /** Ручная корректировка текущего города менеджером. */
  manualCity?: Loc;
  /** Дата, с которой действует ручная корректировка (YYYY-MM-DD). */
  manualCitySince?: string;
};

export type Query = {
  pickupCity: Loc;
  pickupDate: string;   // YYYY-MM-DD
  returnCity: Loc;
  returnDate: string;   // YYYY-MM-DD
};

export type Reason =
  | "bad-dates"
  | "overlap-booking"
  | "overlap-block"
  | "transfer-in"    // не хватает буфера, чтобы пригнать авто в город получения
  | "transfer-out"   // не хватает буфера, чтобы отогнать авто к следующей броне
  | "wrong-city";    // авто физически в другом городе и нет брони-якоря

export type AvailResult = { ok: boolean; reason?: Reason };

const MS = 86_400_000;
const toTime = (s: string) => new Date(s + "T00:00:00").getTime();
export const addDays = (s: string, n: number) =>
  new Date(toTime(s) + n * MS).toISOString().slice(0, 10);
export const dayGap = (a: string, b: string) => Math.round((toTime(b) - toTime(a)) / MS);
const overlap = (aF: string, aT: string, bF: string, bT: string) => aF <= bT && aT >= bF;

/** Город, где физически находится авто на дату `date`, если нет броней-якорей. */
function baselineLocation(car: CarInput, date: string): Loc {
  if (car.manualCity && car.manualCitySince && car.manualCitySince <= date) return car.manualCity;
  return car.baseCity;
}

/**
 * Может ли конкретный автомобиль физически выполнить запрошенную бронь.
 * @param car        авто (+ базовый/ручной город)
 * @param bookings   ВСЕ подтверждённые брони (фильтруем по car.slug внутри)
 * @param blocks     блокировки/обслуживание этого авто
 * @param q          запрос questionnaire
 */
export function isCarAvailable(
  car: CarInput,
  bookings: AdminBooking[],
  blocks: Block[],
  q: Query
): AvailResult {
  const { pickupCity, pickupDate, returnCity, returnDate } = q;
  if (!pickupDate || !returnDate || pickupDate > returnDate) return { ok: false, reason: "bad-dates" };

  const bs = bookings
    .filter(b => b.carSlug === car.slug && b.pickupDate && b.returnDate)
    .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));

  // 1. Прямое пересечение с бронями
  for (const b of bs) {
    if (overlap(pickupDate, returnDate, b.pickupDate, b.returnDate)) return { ok: false, reason: "overlap-booking" };
  }
  // 1b. Прямое пересечение с блокировками
  for (const bl of blocks) {
    if (overlap(pickupDate, returnDate, bl.from, bl.to)) return { ok: false, reason: "overlap-block" };
  }

  // 2. Прибытие: где авто было ДО брони и успевает ли доехать до города получения
  const prev = bs.filter(b => b.returnDate <= pickupDate).at(-1); // последняя завершённая ≤ pickup
  const prevCity: Loc = prev ? (prev.returnCity as Loc) : baselineLocation(car, pickupDate);
  if (prevCity !== pickupCity) {
    if (prev) {
      // нужно ≥ (TRANSFER_DAYS + 1) дней, чтобы пригнать авто в город получения
      if (dayGap(prev.returnDate, pickupDate) < TRANSFER_DAYS + 1) return { ok: false, reason: "transfer-in" };
    } else {
      // нет брони-якоря, а базовый/ручной город не совпадает — авто физически не здесь
      return { ok: false, reason: "wrong-city" };
    }
  }

  // 3. Убытие: следующая бронь должна быть достижима из города возврата
  const next = bs.find(b => b.pickupDate >= returnDate); // первая, начинающаяся ≥ return
  if (next && (next.pickupCity as Loc) !== returnCity) {
    if (dayGap(returnDate, next.pickupDate) < TRANSFER_DAYS + 1) return { ok: false, reason: "transfer-out" };
  }

  return { ok: true };
}

/** Вернуть только физически доступные авто под запрос questionnaire. */
export function getAvailableVehicles(
  cars: CarInput[],
  allBookings: AdminBooking[],
  blocksMap: Record<string, Block[]>,
  q: Query
): CarInput[] {
  return cars.filter(car => isCarAvailable(car, allBookings, blocksMap[car.slug] || [], q).ok);
}

// Статусы авто на дату (для календаря/визуализации).
export type CarStatus = "available" | "booked" | "transfer" | "maintenance";

/** Окна перегона (TRANSFER) после каждой брони со сменой города — для календаря. */
export function transferWindows(slug: string, bookings: AdminBooking[]): { from: string; to: string }[] {
  return bookings
    .filter(b => b.carSlug === slug && b.pickupDate && b.returnDate && (b.pickupCity as Loc) !== (b.returnCity as Loc))
    .map(b => ({ from: addDays(b.returnDate, 1), to: addDays(b.returnDate, TRANSFER_DAYS) }));
}
