// ─────────────────────────────────────────────────────────────────────────
// Sync layer: Supabase = источник истины, localStorage = мгновенный кэш.
// Все обращения к базе обёрнуты в try/catch — при сбое приложение работает
// как раньше (на localStorage), просто без кросс-девайс синхронизации.
// ─────────────────────────────────────────────────────────────────────────

import { supabase } from "@/integrations/supabase/client";
import { CARS } from "@/routes/cars";
import {
  type AdminBooking, calcDays, loadBookings, saveBookings,
} from "./adminBookings";

// Generated Supabase types не содержат наших таблиц — работаем через нетипизированный клиент.
const sb = supabase as unknown as {
  from: (t: string) => any;
};

export type BlocksMap = Record<string, { from: string; to: string }[]>;
const BLOCKS_KEY = "georent_blocks";
const MIGRATED_KEY = "georent_sb_migrated_v1";

function loadBlocksLocal(): BlocksMap {
  try { return JSON.parse(localStorage.getItem(BLOCKS_KEY) || "{}"); } catch { return {}; }
}
function saveBlocksLocal(b: BlocksMap) { localStorage.setItem(BLOCKS_KEY, JSON.stringify(b)); }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const newUuid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

function bookingToRow(b: AdminBooking) {
  return {
    id: UUID_RE.test(b.id) ? b.id : newUuid(),
    vehicle_slug: b.carSlug,
    vehicle_name: b.carName,
    start_date: b.pickupDate,
    end_date: b.returnDate,
    pickup_city: b.pickupCity,
    dropoff_city: b.returnCity,
    status: "confirmed",
    client_name: b.clientName || null,
    client_passport: b.clientPassport || null,
    client_license: b.clientLicense || null,
    client_phone: b.clientPhone || null,
    client_contact: b.clientContact || null,
    pickup_time: b.pickupTime || null,
    return_time: b.returnTime || null,
    pickup_type: b.pickupType || null,
    delivery_address: b.deliveryAddress || null,
    services: b.services || [],
    price_per_day: b.pricePerDay || 0,
    total_price: b.totalPrice || 0,
    deposit: b.deposit ?? 150,
    contract_number: b.contractNumber || null,
    note: b.note || null,
    created_at: b.createdAt || new Date().toISOString(),
  };
}

function bookingFromRow(r: any): AdminBooking {
  const car = CARS.find(c => c.slug === r.vehicle_slug);
  return {
    id: r.id,
    carSlug: r.vehicle_slug,
    carName: r.vehicle_name || car?.name || "",
    carBaseCity: car?.city || r.pickup_city,
    pickupCity: r.pickup_city,
    returnCity: r.dropoff_city,
    pickupDate: r.start_date,
    returnDate: r.end_date,
    pickupTime: r.pickup_time || "11:00",
    returnTime: r.return_time || "11:00",
    pickupType: r.pickup_type || "office",
    deliveryAddress: r.delivery_address || "",
    services: r.services || [],
    clientName: r.client_name || "",
    clientPassport: r.client_passport || "",
    clientLicense: r.client_license || "",
    clientPhone: r.client_phone || "",
    clientContact: r.client_contact || "whatsapp",
    pricePerDay: r.price_per_day || 0,
    totalPrice: r.total_price || 0,
    deposit: r.deposit ?? 150,
    days: calcDays(r.start_date, r.end_date, r.pickup_time || "11:00", r.return_time || "11:00"),
    contractNumber: r.contract_number || "",
    note: r.note || "",
    createdAt: r.created_at || "",
  };
}

// ── one-time migration: залить локальные данные в базу при первом запуске ──
async function migrateOnce(): Promise<void> {
  if (localStorage.getItem(MIGRATED_KEY) === "1") return;
  const localB = loadBookings();
  for (const b of localB) {
    try { await sb.from("bookings").upsert(bookingToRow(b)); } catch (e) { console.error("[migrate booking]", e); }
  }
  const localBlocks = loadBlocksLocal();
  for (const slug of Object.keys(localBlocks)) {
    for (const bl of localBlocks[slug]) {
      try { await sb.from("blocks").insert({ vehicle_slug: slug, date_from: bl.from, date_to: bl.to }); }
      catch (e) { console.error("[migrate block]", e); }
    }
  }
  localStorage.setItem(MIGRATED_KEY, "1");
}

// ── bookings ──
export async function syncBookings(): Promise<AdminBooking[]> {
  try {
    await migrateOnce();
    const { data, error } = await sb.from("bookings").select("*").order("start_date", { ascending: true });
    if (error) throw error;
    const remote = (data || []).map(bookingFromRow);
    saveBookings(remote); // обновляем кэш (его читают finance и др.)
    return remote;
  } catch (e) {
    console.error("[sync bookings] fallback to cache", e);
    return loadBookings();
  }
}

export async function pushBooking(b: AdminBooking): Promise<void> {
  try {
    const { error } = await sb.from("bookings").upsert(bookingToRow(b));
    if (error) throw error;
  } catch (e) { console.error("[push booking]", e); }
}

export async function pushDeleteBooking(id: string): Promise<void> {
  try {
    const { error } = await sb.from("bookings").delete().eq("id", id);
    if (error) throw error;
  } catch (e) { console.error("[delete booking]", e); }
}

// ── blocks ──
export async function syncBlocks(): Promise<BlocksMap> {
  try {
    await migrateOnce();
    const { data, error } = await sb.from("blocks").select("*");
    if (error) throw error;
    const map: BlocksMap = {};
    for (const r of (data || [])) (map[r.vehicle_slug] ||= []).push({ from: r.date_from, to: r.date_to });
    saveBlocksLocal(map);
    return map;
  } catch (e) {
    console.error("[sync blocks] fallback to cache", e);
    return loadBlocksLocal();
  }
}

export async function pushAddBlock(slug: string, from: string, to: string): Promise<void> {
  try {
    const { error } = await sb.from("blocks").insert({ vehicle_slug: slug, date_from: from, date_to: to });
    if (error) throw error;
  } catch (e) { console.error("[add block]", e); }
}

export async function pushRemoveBlock(slug: string, from: string, to: string): Promise<void> {
  try {
    const { error } = await sb.from("blocks").delete().eq("vehicle_slug", slug).eq("date_from", from).eq("date_to", to);
    if (error) throw error;
  } catch (e) { console.error("[remove block]", e); }
}

// ── ручной город машины («переброс» между Батуми/Тбилиси, общий для всех) ──
export type Loc = "batumi" | "tbilisi";
export type CarLocations = Record<string, Loc>;
const CAR_LOC_KEY = "georent_car_locations";

function loadCarLocationsLocal(): CarLocations {
  try { return JSON.parse(localStorage.getItem(CAR_LOC_KEY) || "{}"); } catch { return {}; }
}
function saveCarLocationsLocal(m: CarLocations) { localStorage.setItem(CAR_LOC_KEY, JSON.stringify(m)); }

export async function syncCarLocations(): Promise<CarLocations> {
  try {
    const { data, error } = await sb.from("car_locations").select("vehicle_slug,city");
    if (error) throw error;
    const map: CarLocations = {};
    for (const r of (data || [])) map[r.vehicle_slug] = r.city as Loc;
    saveCarLocationsLocal(map);
    return map;
  } catch (e) {
    console.error("[car locations] fallback to cache", e);
    return loadCarLocationsLocal();
  }
}

export async function setCarLocation(slug: string, city: Loc): Promise<void> {
  const m = loadCarLocationsLocal();
  m[slug] = city;
  saveCarLocationsLocal(m);
  try {
    const { error } = await sb.from("car_locations").upsert({
      vehicle_slug: slug, city, since: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  } catch (e) { console.error("[set car location]", e); }
}

// ── публичное чтение (без PII): только поля, нужные движку доступности ──
export async function fetchSlotsPublic(): Promise<AdminBooking[]> {
  try {
    const { data, error } = await sb
      .from("bookings")
      .select("vehicle_slug,start_date,end_date,pickup_city,dropoff_city,status");
    if (error) throw error;
    // Возвращаем частичные объекты — движок читает только эти поля.
    return (data || []).map((r: any) => ({
      carSlug: r.vehicle_slug,
      pickupDate: r.start_date,
      returnDate: r.end_date,
      pickupCity: r.pickup_city,
      returnCity: r.dropoff_city,
    })) as unknown as AdminBooking[];
  } catch (e) { console.error("[public slots]", e); return []; }
}

export async function fetchBlocksPublic(): Promise<BlocksMap> {
  try {
    const { data, error } = await sb.from("blocks").select("vehicle_slug,date_from,date_to");
    if (error) throw error;
    const map: BlocksMap = {};
    for (const r of (data || [])) (map[r.vehicle_slug] ||= []).push({ from: r.date_from, to: r.date_to });
    return map;
  } catch (e) { console.error("[public blocks]", e); return {}; }
}
