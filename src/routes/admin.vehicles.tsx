import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { X, Upload, Trash2, Loader2, Search } from "lucide-react";
import { CARS } from "./cars";
import {
  fetchCarDetails, saveCarDetail, uploadCarDoc, deleteCarDoc,
  type CarDetail, type CarDoc,
} from "@/lib/store";

export const Route = createFileRoute("/admin/vehicles")({
  component: AdminVehicles,
});

function AdminVehicles() {
  const [details, setDetails] = useState<Record<string, CarDetail>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => { fetchCarDetails().then(setDetails).catch(() => {}); }, []);

  const cars = CARS.filter(c => {
    if (!q.trim()) return true;
    const d = details[c.slug];
    const hay = [c.name, d?.vin, d?.owner, d?.idCode].filter(Boolean).join(" ").toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-800">Данные авто</h1>
        <p className="text-gray-400 text-sm mt-0.5">Документы, страховка, VIN и владелец — общие для менеджеров</p>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск: название, VIN, номер, владелец"
          className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[var(--brand-blue)]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map(car => {
          const d = details[car.slug];
          const filled = !!(d && (d.vin || d.owner || d.idCode || (d.docs && d.docs.length)));
          return (
            <button key={car.slug} onClick={() => setEditing(car.slug)}
              className="text-left rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[16/9] bg-gray-100 relative">
                {car.images?.[0]?.url
                  ? <img src={car.images[0].url} alt={car.name} className="h-full w-full object-cover" loading="lazy" />
                  : <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">Нет фото</div>}
                <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${filled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {filled ? "заполнено" : "не заполнено"}
                </span>
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-800 text-sm truncate">{d?.name || car.name}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {d?.vin ? `VIN ${d.vin}` : "VIN не указан"} · {d?.docs?.length || 0} док.
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {editing && (
        <VehicleEditModal
          slug={editing}
          initial={details[editing]}
          onClose={() => setEditing(null)}
          onSaved={(d) => { setDetails(prev => ({ ...prev, [d.slug]: d })); setEditing(null); }}
        />
      )}
    </div>
  );
}

function VehicleEditModal({ slug, initial, onClose, onSaved }: {
  slug: string;
  initial?: CarDetail;
  onClose: () => void;
  onSaved: (d: CarDetail) => void;
}) {
  const car = CARS.find(c => c.slug === slug);
  const [f, setF] = useState<CarDetail>(() => ({
    slug,
    name: initial?.name ?? car?.name ?? "",
    vin: initial?.vin ?? car?.vin ?? "",
    owner: initial?.owner ?? car?.vehicleOwner ?? "",
    idCode: initial?.idCode ?? car?.ownerId ?? "",
    seats: initial?.seats ?? car?.seats,
    insurance: initial?.insurance ?? "",
    docs: initial?.docs ?? [],
  }));
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof CarDetail, v: unknown) => setF(prev => ({ ...prev, [k]: v }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    const added: CarDoc[] = [];
    for (const file of Array.from(files)) {
      const doc = await uploadCarDoc(slug, file);
      if (doc) added.push(doc);
    }
    setF(prev => ({ ...prev, docs: [...prev.docs, ...added] }));
    setUploading(false);
  };

  const removeDoc = async (doc: CarDoc) => {
    setF(prev => ({ ...prev, docs: prev.docs.filter(x => x.url !== doc.url) }));
    deleteCarDoc(doc.url);
  };

  const save = async () => {
    setSaving(true);
    await saveCarDetail(f);
    setSaving(false);
    onSaved(f);
  };

  const fieldCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)] bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white h-full w-full max-w-lg shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-[var(--brand-blue)] text-white px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Данные авто</h2>
            <p className="text-white/70 text-xs mt-0.5">{car?.name}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className={labelCls}>Название</label>
            <input value={f.name} onChange={e => set("name", e.target.value)} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>VIN-код</label>
            <input value={f.vin} onChange={e => set("vin", e.target.value)} className={fieldCls} placeholder="напр. JF2SKACC9PH438138" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Идентификационный код</label>
              <input value={f.idCode} onChange={e => set("idCode", e.target.value)} className={fieldCls} placeholder="номер / ID" />
            </div>
            <div>
              <label className={labelCls}>Кол-во мест</label>
              <input type="number" value={f.seats ?? ""} onChange={e => set("seats", parseInt(e.target.value) || undefined)} className={fieldCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Владелец автомобиля</label>
            <input value={f.owner} onChange={e => set("owner", e.target.value)} className={fieldCls} />
          </div>
          <div>
            <label className={labelCls}>Данные о страховке</label>
            <textarea value={f.insurance} onChange={e => set("insurance", e.target.value)} rows={2} className={`${fieldCls} resize-none`} placeholder="Компания, номер полиса, срок действия…" />
          </div>

          {/* Документы ПТС / СТС */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">📄 Документы (ПТС / СТС)</p>
            <div className="grid grid-cols-3 gap-2">
              {f.docs.map(doc => (
                <div key={doc.url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img src={doc.url} alt={doc.name} className="h-full w-full object-cover" />
                  <button onClick={() => removeDoc(doc)}
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-90">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 text-xs cursor-pointer hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]">
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-5 w-5 mb-1" />Добавить</>}
                <input type="file" accept="image/*" multiple className="sr-only" disabled={uploading}
                  onChange={e => handleFiles(e.target.files)} />
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-2">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50">Отмена</button>
          <button onClick={save} disabled={saving}
            className="flex-1 h-11 rounded-xl bg-[var(--brand-blue)] text-white font-bold text-sm hover:opacity-90 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
