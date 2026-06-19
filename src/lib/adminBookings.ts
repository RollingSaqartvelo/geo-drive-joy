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
  pricePerDay: number;
  totalPrice: number;
  deposit: number;
  days: number;
  contractNumber: string;
  note: string;
  createdAt: string;
};

export const BOOKINGS_KEY = "georent_admin_bookings";

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

export function calcDays(from: string, to: string): number {
  if (!from || !to) return 0;
  return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000));
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
