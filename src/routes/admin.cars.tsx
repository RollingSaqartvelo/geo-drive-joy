import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, Plus, ImageIcon, TrendingUp } from "lucide-react";
import { CARS } from "./cars";
import { loadBookings } from "@/lib/adminBookings";

export const Route = createFileRoute("/admin/cars")({
  component: AdminCars,
});

// --- Photo storage helpers ---
function photosKey(slug: string) { return `georent_car_photos_${slug}`; }

function loadPhotos(slug: string, defaults: string[]): string[] {
  try {
    const raw = localStorage.getItem(photosKey(slug));
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaults;
}

function savePhotos(slug: string, urls: string[]) {
  localStorage.setItem(photosKey(slug), JSON.stringify(urls));
}

// --- Photo modal ---
function PhotoModal({ car, onClose }: { car: typeof CARS[0]; onClose: () => void }) {
  const defaultUrls = (car.images ?? []).map(i => i.url);
  const [photos, setPhotos] = useState<string[]>(() => loadPhotos(car.slug, defaultUrls));
  const [addUrl, setAddUrl] = useState("");
  const [err, setErr] = useState("");

  const remove = (idx: number) => {
    const next = photos.filter((_, i) => i !== idx);
    setPhotos(next);
    savePhotos(car.slug, next);
  };

  const add = () => {
    const url = addUrl.trim();
    if (!url) return;
    if (!url.startsWith("/") && !url.startsWith("http")) {
      setErr("Начните URL с / или http");
      return;
    }
    const next = [...photos, url];
    setPhotos(next);
    savePhotos(car.slug, next);
    setAddUrl("");
    setErr("");
  };

  const reset = () => {
    savePhotos(car.slug, defaultUrls);
    setPhotos(defaultUrls);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[var(--brand-blue)] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">{car.name}</h2>
            <p className="text-white/60 text-xs mt-0.5">Управление фотографиями</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Photo grid */}
          {photos.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Нет фотографий</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {photos.map((url, idx) => (
                <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-gray-100">
                  <img src={url} alt={`${car.name} ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button onClick={() => remove(idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center shadow-lg hover:bg-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  {idx === 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-[var(--brand-blue)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Главное
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add photo */}
          <div className="flex gap-2">
            <input
              value={addUrl}
              onChange={e => { setAddUrl(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && add()}
              placeholder="/photo.avif или https://..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--brand-blue)]"
            />
            <button onClick={add}
              className="h-11 w-11 rounded-xl bg-[var(--brand-blue)] text-white flex items-center justify-center hover:opacity-90 transition-opacity shrink-0">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {err && <p className="text-red-500 text-xs mt-1">{err}</p>}

          <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
            <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors">
              Сбросить к исходным
            </button>
            <button onClick={onClose}
              className="px-6 py-2 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:opacity-90 transition-opacity">
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function loadRequestsWrapped() {
  try {
    const raw = localStorage.getItem("georent_requests");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function AdminCars() {
  const [photoCarSlug, setPhotoCarSlug] = useState<string | null>(null);

  const bookings = loadBookings();
  const requests = loadRequestsWrapped();

  const stats = CARS.map(car => {
    const reqs = requests.filter((r: { carSlug: string }) => r.carSlug === car.slug).length;
    const rentals = bookings.filter(b => b.carSlug === car.slug).length;
    const revenue = bookings.filter(b => b.carSlug === car.slug).reduce((s, b) => s + (b.totalPrice || 0), 0);
    return { car, reqs, rentals, revenue };
  });

  const photoCar = photoCarSlug ? CARS.find(c => c.slug === photoCarSlug) : null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Автомобили</h1>
          <p className="text-gray-400 text-sm mt-0.5">Нажмите на карточку, чтобы управлять фотографиями</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] rounded-xl px-4 py-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4" />
          {CARS.length} автомобилей
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Всего запросов", value: requests.length, color: "bg-yellow-50 border-yellow-100 text-yellow-700" },
          { label: "Активных аренд", value: bookings.length, color: "bg-blue-50 border-blue-100 text-blue-700" },
          { label: "Общая выручка", value: `$${bookings.reduce((s: number, b) => s + (b.totalPrice || 0), 0)}`, color: "bg-green-50 border-green-100 text-green-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl border px-5 py-4 ${color}`}>
            <p className="text-xs font-semibold opacity-70 mb-1">{label}</p>
            <p className="text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      {/* Car grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map(({ car, reqs, rentals, revenue }) => {
          const thumbs = loadPhotos(car.slug, (car.images ?? []).map(i => i.url));
          const thumb = thumbs[0] ?? null;

          return (
            <div key={car.slug} onClick={() => setPhotoCarSlug(car.slug)}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[var(--brand-blue)]/40 transition-all cursor-pointer group">
              {/* Thumbnail */}
              <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                {thumb
                  ? <img src={thumb} alt={car.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                  : <div className="h-full w-full flex items-center justify-center text-gray-300"><ImageIcon className="h-12 w-12" /></div>
                }
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full px-2.5 py-1 font-semibold">
                  {thumbs.length} фото
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 text-gray-700 text-xs rounded-full px-2.5 py-1 font-medium">
                  {car.city === "batumi" ? "🌊 Батуми" : "🏙️ Тбилиси"}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-bold text-gray-800 leading-tight">{car.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{car.year} · {car.seats} мест</p>
                    {car.plate && <p className="text-xs text-gray-500 mt-0.5 font-mono">🔢 {car.plate}</p>}
                    {car.vin && <p className="text-xs text-gray-400 mt-0.5 font-mono truncate max-w-[160px]" title={car.vin}>VIN: {car.vin}</p>}
                    {car.receiptNo && <p className="text-xs text-gray-400 mt-0.5">Receipt: {car.receiptNo}</p>}
                    {car.vehicleOwner && <p className="text-xs text-gray-500 mt-0.5">👤 {car.vehicleOwner}</p>}
                    {car.mileage && <p className="text-xs text-gray-400 mt-0.5">📍 {car.mileage.toLocaleString()} {car.mileageUnit ?? "mi"}</p>}
                  </div>
                  <span className="text-lg font-black text-[var(--brand-blue)] shrink-0">${car.price}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Запросы", value: reqs, bg: "bg-yellow-50 text-yellow-600" },
                    { label: "Аренды", value: rentals, bg: "bg-blue-50 text-blue-600" },
                    { label: "Выручка", value: `$${revenue}`, bg: "bg-green-50 text-green-600" },
                  ].map(({ label, value, bg }) => (
                    <div key={label} className={`rounded-xl py-2 ${bg}`}>
                      <p className="text-xs font-medium opacity-70">{label}</p>
                      <p className="font-bold text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {photoCar && <PhotoModal car={photoCar} onClose={() => setPhotoCarSlug(null)} />}
    </div>
  );
}
