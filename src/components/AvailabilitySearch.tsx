import { useState } from "react";
import { Search } from "lucide-react";
import {
  getAvailableVehicles, type CarInput, type Block, type Query, type Loc,
} from "@/lib/availability";
import type { AdminBooking } from "@/lib/adminBookings";

export type AvailCar = CarInput & { name: string; priceFrom: number; image?: string };

const CITY_LABEL: Record<Loc, string> = { batumi: "Батуми", tbilisi: "Тбилиси" };

/**
 * Единый questionnaire доступности (тот же движок для админки и сайта).
 * 4 шага: город получения → дата получения → дата возврата → город возврата.
 */
export function AvailabilitySearch({
  cars, bookings, blocks, onPick, ctaLabel = "Выбрать",
}: {
  cars: AvailCar[];
  bookings: AdminBooking[];
  blocks: Record<string, Block[]>;
  onPick: (carSlug: string, q: Query) => void;
  ctaLabel?: string;
}) {
  const [pickupCity, setPickupCity] = useState<Loc>("batumi");
  const [returnCity, setReturnCity] = useState<Loc>("batumi");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ready = pickupDate && returnDate && pickupDate <= returnDate;
  const query: Query = { pickupCity, pickupDate, returnCity, returnDate };
  const available = submitted && ready
    ? (getAvailableVehicles(cars, bookings, blocks, query) as AvailCar[])
    : [];

  const selectCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-blue)] bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <p className="font-bold text-gray-800 flex items-center gap-2 mb-3">
        <Search className="h-4 w-4 text-[var(--brand-blue)]" /> Подбор свободного авто
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Город получения</label>
          <select value={pickupCity} onChange={e => { setPickupCity(e.target.value as Loc); setSubmitted(false); }} className={selectCls}>
            <option value="batumi">Батуми</option>
            <option value="tbilisi">Тбилиси</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Город возврата</label>
          <select value={returnCity} onChange={e => { setReturnCity(e.target.value as Loc); setSubmitted(false); }} className={selectCls}>
            <option value="batumi">Батуми</option>
            <option value="tbilisi">Тбилиси</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Дата получения</label>
          <input type="date" value={pickupDate} onChange={e => { setPickupDate(e.target.value); setSubmitted(false); }} className={selectCls} />
        </div>
        <div>
          <label className={labelCls}>Дата возврата</label>
          <input type="date" value={returnDate} onChange={e => { setReturnDate(e.target.value); setSubmitted(false); }} className={selectCls} />
        </div>
      </div>

      <button
        disabled={!ready}
        onClick={() => setSubmitted(true)}
        className="mt-4 w-full h-11 rounded-xl bg-[var(--brand-blue)] text-white font-bold text-sm disabled:opacity-40 active:opacity-80 transition-opacity"
      >
        Показать доступные автомобили
      </button>

      {submitted && ready && (
        <div className="mt-4">
          <p className="text-sm font-bold text-gray-700 mb-2">
            {available.length > 0
              ? `Доступно: ${available.length} · ${CITY_LABEL[pickupCity]} → ${CITY_LABEL[returnCity]}`
              : "Нет доступных авто на эти даты и направление"}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {available.map(car => (
              <button
                key={car.slug}
                onClick={() => onPick(car.slug, query)}
                className="flex items-center gap-3 text-left rounded-xl bg-green-50 border border-green-200 px-3 py-2.5 active:bg-green-100 hover:bg-green-100 transition-colors"
              >
                {car.image && <img src={car.image} alt="" className="h-10 w-14 object-cover rounded-md shrink-0" />}
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-green-900 truncate">{car.name}</span>
                  <span className="block text-xs text-green-700">от ${car.priceFrom}/день · {ctaLabel}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
