import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Phone, IdCard, CalendarDays, X, Pencil } from "lucide-react";
import { loadBookings, saveBookings, type AdminBooking, type ContactType } from "@/lib/adminBookings";
import { syncBookings, pushBooking } from "@/lib/store";
import { CLIENT_SOURCES } from "./admin.calendar";

export const Route = createFileRoute("/admin/clients")({
  component: AdminClients,
});

type Client = {
  name: string;
  phone: string;
  passport: string;
  license: string;
  contact: ContactType;
  source: string;
  count: number;
  lastDate: string;
  cars: string[];
  bookingIds: string[];
};

const contactLabel = (c: ContactType) => c === "whatsapp" ? "WhatsApp" : c === "telegram" ? "Telegram" : "Телефон";

function buildClients(bookings: AdminBooking[]): Client[] {
  const map = new Map<string, Client>();
  for (const b of bookings) {
    const name = (b.clientName || "").trim();
    const key = (b.clientPhone || b.clientPassport || "").trim().toLowerCase();
    if (!key || !name) continue;
    const prev = map.get(key);
    if (prev) {
      prev.count += 1;
      prev.bookingIds.push(b.id);
      if ((b.pickupDate || "") > prev.lastDate) prev.lastDate = b.pickupDate || prev.lastDate;
      if (b.carName && !prev.cars.includes(b.carName)) prev.cars.push(b.carName);
      // Дополняем недостающие поля из более полной брони
      if (!prev.passport && b.clientPassport) prev.passport = b.clientPassport;
      if (!prev.license && b.clientLicense) prev.license = b.clientLicense;
      if (!prev.phone && b.clientPhone) prev.phone = b.clientPhone;
      if (!prev.source && b.source) prev.source = b.source;
    } else {
      map.set(key, {
        name, phone: b.clientPhone || "", passport: b.clientPassport || "", license: b.clientLicense || "",
        contact: (b.clientContact || "whatsapp") as ContactType, source: b.source || "", count: 1,
        lastDate: b.pickupDate || "", cars: b.carName ? [b.carName] : [], bookingIds: [b.id],
      });
    }
  }
  return [...map.values()].sort((a, b) => (b.lastDate || "").localeCompare(a.lastDate || ""));
}

function AdminClients() {
  const [bookings, setBookings] = useState<AdminBooking[]>(loadBookings);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Client | null>(null);
  const isAdmin = typeof sessionStorage !== "undefined" && sessionStorage.getItem("georent_role") === "admin";

  useEffect(() => {
    syncBookings().then(setBookings).catch(() => {});
  }, []);

  // Сохранить правки клиента → обновляем все его брони (источник истины)
  const saveClient = (orig: Client, patch: { name: string; phone: string; passport: string; license: string; source: string }) => {
    const ids = new Set(orig.bookingIds);
    const updated = bookings.map(b => ids.has(b.id)
      ? { ...b, clientName: patch.name, clientPhone: patch.phone, clientPassport: patch.passport, clientLicense: patch.license, source: patch.source }
      : b);
    setBookings(updated);
    saveBookings(updated);
    updated.filter(b => ids.has(b.id)).forEach(b => { pushBooking(b).catch(() => {}); });
    setEdit(null);
  };

  const clients = useMemo(() => buildClients(bookings), [bookings]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return clients;
    return clients.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.phone.toLowerCase().includes(s) ||
      c.passport.toLowerCase().includes(s) ||
      c.license.toLowerCase().includes(s));
  }, [clients, q]);

  return (
    <div className="p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-black text-gray-800">Клиенты</h1>
          <span className="text-sm text-gray-400">{clients.length} чел.</span>
        </div>
        <p className="text-gray-400 text-sm mb-5">База постоянных клиентов — собирается автоматически из бронирований</p>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)}
            placeholder="Поиск по имени, телефону или паспорту…"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[var(--brand-blue)] text-sm" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            {clients.length === 0 ? "Пока нет клиентов — они появятся после первых бронирований." : "Ничего не найдено."}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="text-left font-bold px-4 py-3">Клиент</th>
                    <th className="text-left font-bold px-4 py-3">Телефон / связь</th>
                    <th className="text-left font-bold px-4 py-3">Паспорт</th>
                    <th className="text-left font-bold px-4 py-3">Источник</th>
                    <th className="text-center font-bold px-4 py-3">Аренд</th>
                    <th className="text-left font-bold px-4 py-3">Последняя</th>
                    {isAdmin && <th className="px-4 py-3"></th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{c.name}</p>
                        {c.cars.length > 0 && <p className="text-xs text-gray-400 mt-0.5">{c.cars.join(", ")}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{c.phone || "—"}</p>
                        <p className="text-xs text-gray-400">{contactLabel(c.contact)}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono">{c.passport || "—"}</td>
                      <td className="px-4 py-3">
                        {c.source
                          ? <span className="inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">{c.source}</span>
                          : <span className="text-gray-300 text-xs">не указан</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block min-w-6 px-2 py-0.5 rounded-full bg-blue-50 text-[var(--brand-blue)] font-bold text-xs">{c.count}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{c.lastDate || "—"}</td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => setEdit(c)} className="text-gray-300 hover:text-[var(--brand-blue)]" title="Изменить">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((c, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-gray-800">{c.name}</p>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-blue-50 text-[var(--brand-blue)] font-bold text-xs">{c.count} аренд</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-gray-400" />{c.phone || "—"} <span className="text-xs text-gray-400">· {contactLabel(c.contact)}</span></p>
                    <p className="flex items-center gap-2"><IdCard className="h-3.5 w-3.5 text-gray-400" /><span className="font-mono">{c.passport || "—"}</span>{c.license ? <span className="font-mono text-gray-400">· ВУ {c.license}</span> : null}</p>
                    <p className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-gray-400" />Последняя: {c.lastDate || "—"}</p>
                    <p className="text-xs">Источник: {c.source ? <span className="text-purple-700 font-medium">{c.source}</span> : <span className="text-gray-300">не указан</span>}</p>
                  </div>
                  {c.cars.length > 0 && <p className="text-xs text-gray-400 mt-2">{c.cars.join(", ")}</p>}
                  {isAdmin && (
                    <button onClick={() => setEdit(c)} className="mt-3 w-full h-9 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
                      <Pencil className="h-3.5 w-3.5" /> Изменить
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {edit && isAdmin && <ClientEditModal client={edit} onClose={() => setEdit(null)} onSave={saveClient} />}
    </div>
  );
}

function ClientEditModal({ client, onClose, onSave }: {
  client: Client;
  onClose: () => void;
  onSave: (orig: Client, patch: { name: string; phone: string; passport: string; license: string; source: string }) => void;
}) {
  const [form, setForm] = useState({
    name: client.name, phone: client.phone, passport: client.passport, license: client.license, source: client.source,
  });
  const fieldCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--brand-blue)]";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 space-y-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-800">Карточка клиента</p>
          <button onClick={onClose} className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <p className="text-[11px] text-gray-400 -mt-1">Изменения применятся ко всем броням клиента ({client.count})</p>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">ФИО (латиница)</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={fieldCls} />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Телефон / контакт</label>
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={fieldCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Паспорт</label>
            <input value={form.passport} onChange={e => setForm(f => ({ ...f, passport: e.target.value }))} className={fieldCls} />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Вод. удост.</label>
            <input value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))} className={fieldCls} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Источник (откуда пришёл)</label>
          <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} className={fieldCls}>
            <option value="">— не указан —</option>
            {CLIENT_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-500 font-medium text-sm">Отмена</button>
          <button onClick={() => onSave(client, form)} className="flex-1 h-11 rounded-xl bg-[var(--brand-blue)] text-white font-bold text-sm">Сохранить</button>
        </div>
      </div>
    </div>
  );
}
