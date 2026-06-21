import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react";
import { loadBookings } from "@/lib/adminBookings";
import { CARS } from "./cars";

export const Route = createFileRoute("/admin/finance")({
  component: AdminFinance,
});

type EntryType = "income" | "expense";

type Entry = {
  id: string;
  type: EntryType;
  date: string;
  description: string;
  category: string;
  amount: number;
  bookingId?: string;
};

const EXPENSE_CATEGORIES = [
  "Google Ads",
  "Meta Ads (Instagram/Facebook)",
  "Аренда офиса",
  "Топливо",
  "Мойка/Обслуживание",
  "Прочее",
];

const INCOME_CATEGORIES = [
  "Аренда авто (комиссия)",
  "Доставка",
  "Доп. услуги",
  "Прочее",
];

const STORAGE_KEY = "georent_finance_entries";
const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEntries(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function AdminFinance() {
  const now = new Date();
  const [entries, setEntries] = useState<Entry[]>(loadEntries);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{
    type: EntryType; date: string; description: string; category: string; amount: string;
  }>({
    type: "expense",
    date: now.toISOString().slice(0, 10),
    description: "",
    category: "Google Ads",
    amount: "",
  });

  // Bookings for this month that have commission and not yet imported
  const allBookings = loadBookings();
  const importedIds = new Set(entries.filter(e => e.bookingId).map(e => e.bookingId));

  const pendingBookings = allBookings.filter(b => {
    const d = new Date(b.pickupDate);
    const inMonth = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    const car = CARS.find(c => c.slug === b.carSlug);
    return inMonth && car?.commission && !importedIds.has(b.id);
  });

  const importBooking = (bookingId: string) => {
    const b = allBookings.find(x => x.id === bookingId);
    if (!b) return;
    const car = CARS.find(c => c.slug === b.carSlug);
    const pct = car?.commission ?? 30;
    const myIncome = Math.round(b.totalPrice * pct / 100);
    const entry: Entry = {
      id: Date.now().toString(),
      type: "income",
      date: b.pickupDate,
      description: `${b.carName}${b.clientName ? " — " + b.clientName : ""} (${b.days} дн. × $${b.pricePerDay})`,
      category: "Аренда авто (комиссия)",
      amount: myIncome,
      bookingId: b.id,
    };
    const next = [entry, ...entries].sort((a, b) => b.date.localeCompare(a.date));
    setEntries(next);
    saveEntries(next);
  };

  const filtered = entries.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalIncome = filtered.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0);
  const totalExpense = filtered.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const addEntry = () => {
    if (!form.amount || !form.date) return;
    const entry: Entry = {
      id: Date.now().toString(),
      type: form.type,
      date: form.date,
      description: form.description,
      category: form.category,
      amount: parseFloat(form.amount),
    };
    const next = [entry, ...entries].sort((a, b) => b.date.localeCompare(a.date));
    setEntries(next);
    saveEntries(next);
    setForm(f => ({ ...f, description: "", amount: "" }));
    setShowForm(false);
  };

  const remove = (id: string) => {
    const next = entries.filter(e => e.id !== id);
    setEntries(next);
    saveEntries(next);
  };

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => ({
    cat,
    total: filtered.filter(e => e.type === "expense" && e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Финансы агентства</h1>
          <p className="text-gray-400 text-sm mt-0.5">Ваша комиссия минус расходы на рекламу</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-[var(--brand-blue)] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Добавить расход
        </button>
      </div>

      {/* Add expense form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Новый расход</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Дата</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Сумма ($)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Категория</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]">
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Описание</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Например: Google Ads июнь" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border text-sm text-gray-500 hover:bg-gray-50">Отмена</button>
            <button onClick={addEntry} className="px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:opacity-90">Сохранить расход</button>
          </div>
        </div>
      )}

      {/* Month selector */}
      <div className="flex items-center gap-4 mb-5">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">‹</button>
        <span className="font-bold text-gray-700 text-lg min-w-[160px] text-center">{MONTHS[selectedMonth]} {selectedYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">›</button>
      </div>

      {/* Pending bookings to import */}
      {pendingBookings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Бронирования этого месяца — добавить доход (30%)
          </p>
          <div className="flex flex-col gap-2">
            {pendingBookings.map(b => {
              const car = CARS.find(c => c.slug === b.carSlug);
              const pct = car?.commission ?? 30;
              const myIncome = Math.round(b.totalPrice * pct / 100);
              return (
                <div key={b.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{b.carName}</p>
                    <p className="text-xs text-gray-400">{b.clientName || "—"} · {b.days} дн. · ${b.totalPrice} общая</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 font-black text-lg">+${myIncome}</span>
                    <span className="text-xs text-gray-400">({pct}%)</span>
                    <button onClick={() => importBooking(b.id)}
                      className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors">
                      Добавить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Мои доходы</p>
          </div>
          <p className="text-3xl font-black text-green-700">${totalIncome}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Расходы</p>
          </div>
          <p className="text-3xl font-black text-red-600">${totalExpense}</p>
          {expenseByCategory.length > 0 && (
            <div className="mt-2 flex flex-col gap-0.5">
              {expenseByCategory.map(({ cat, total }) => (
                <p key={cat} className="text-xs text-red-400">{cat}: ${total}</p>
              ))}
            </div>
          )}
        </div>
        <div className={`border rounded-2xl px-5 py-4 ${netProfit >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? "text-[var(--brand-blue)]" : "text-orange-500"}`} />
            <p className={`text-xs font-semibold uppercase tracking-wide ${netProfit >= 0 ? "text-[var(--brand-blue)]" : "text-orange-500"}`}>Чистая прибыль</p>
          </div>
          <p className={`text-3xl font-black ${netProfit >= 0 ? "text-[var(--brand-blue)]" : "text-orange-600"}`}>${netProfit}</p>
          <p className="text-xs text-gray-400 mt-1">доходы − расходы</p>
        </div>
      </div>

      {/* Entries table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-bold text-gray-700">Записи за {MONTHS[selectedMonth]} {selectedYear}</p>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Нет записей за этот месяц</p>
            <p className="text-xs mt-1">Добавьте расходы или импортируйте бронирования выше</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3 text-left">Дата</th>
                <th className="px-5 py-3 text-left">Категория</th>
                <th className="px-5 py-3 text-left">Описание</th>
                <th className="px-5 py-3 text-right">Сумма</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{e.date.slice(5).replace("-", ".")}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${e.type === "income" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                      {e.type === "income" ? "↑" : "↓"} {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600 text-xs">{e.description || "—"}</td>
                  <td className={`px-5 py-3 text-right font-bold ${e.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {e.type === "income" ? "+" : "−"}${e.amount}
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => remove(e.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
