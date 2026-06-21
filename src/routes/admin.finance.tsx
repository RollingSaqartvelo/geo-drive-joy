import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

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
};

const EXPENSE_CATEGORIES = [
  "Google Ads",
  "Meta Ads (Instagram/Facebook)",
  "Аренда офиса",
  "Топливо",
  "Мойка/Обслуживание",
  "Комиссия владельцу авто",
  "Прочее",
];

const INCOME_CATEGORIES = [
  "Аренда авто",
  "Доставка",
  "Доп. услуги",
  "Прочее",
];

const STORAGE_KEY = "georent_finance_entries";

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEntries(entries: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

function AdminFinance() {
  const now = new Date();
  const [entries, setEntries] = useState<Entry[]>(loadEntries);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [form, setForm] = useState<{
    type: EntryType; date: string; description: string; category: string; amount: string;
  }>({
    type: "income",
    date: now.toISOString().slice(0, 10),
    description: "",
    category: "Аренда авто",
    amount: "",
  });

  const [showForm, setShowForm] = useState(false);

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

  const incomeByCategory = INCOME_CATEGORIES.map(cat => ({
    cat,
    total: filtered.filter(e => e.type === "income" && e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0);

  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => ({
    cat,
    total: filtered.filter(e => e.type === "expense" && e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Финансы</h1>
          <p className="text-gray-400 text-sm mt-0.5">Доходы и расходы агентства</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-[var(--brand-blue)] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Добавить запись
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-4">Новая запись</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={() => setForm(f => ({ ...f, type: "income", category: "Аренда авто" }))}
              className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${form.type === "income" ? "bg-green-50 border-green-400 text-green-700" : "border-gray-200 text-gray-400"}`}>
              + Доход
            </button>
            <button onClick={() => setForm(f => ({ ...f, type: "expense", category: "Google Ads" }))}
              className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${form.type === "expense" ? "bg-red-50 border-red-400 text-red-700" : "border-gray-200 text-gray-400"}`}>
              − Расход
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Дата</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Сумма ($)</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0.00" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Категория</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]">
                {(form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Описание</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Например: RAV4 клиент Иван" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border text-sm text-gray-500 hover:bg-gray-50">Отмена</button>
            <button onClick={addEntry} className="px-5 py-2 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold hover:opacity-90">Сохранить</button>
          </div>
        </div>
      )}

      {/* Month selector */}
      <div className="flex items-center gap-4 mb-5">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">‹</button>
        <span className="font-bold text-gray-700 text-lg min-w-[160px] text-center">{MONTHS[selectedMonth]} {selectedYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">›</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Доходы</p>
          </div>
          <p className="text-3xl font-black text-green-700">${totalIncome.toFixed(0)}</p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <p className="text-xs font-semibold text-red-500 uppercase tracking-wide">Расходы</p>
          </div>
          <p className="text-3xl font-black text-red-600">${totalExpense.toFixed(0)}</p>
        </div>
        <div className={`border rounded-2xl px-5 py-4 ${netProfit >= 0 ? "bg-blue-50 border-blue-100" : "bg-orange-50 border-orange-100"}`}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className={`h-4 w-4 ${netProfit >= 0 ? "text-[var(--brand-blue)]" : "text-orange-500"}`} />
            <p className={`text-xs font-semibold uppercase tracking-wide ${netProfit >= 0 ? "text-[var(--brand-blue)]" : "text-orange-500"}`}>Чистая прибыль</p>
          </div>
          <p className={`text-3xl font-black ${netProfit >= 0 ? "text-[var(--brand-blue)]" : "text-orange-600"}`}>${netProfit.toFixed(0)}</p>
        </div>
      </div>

      {/* Breakdown */}
      {(incomeByCategory.length > 0 || expenseByCategory.length > 0) && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {incomeByCategory.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Доходы по категориям</p>
              {incomeByCategory.map(({ cat, total }) => (
                <div key={cat} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0 text-sm">
                  <span className="text-gray-600">{cat}</span>
                  <span className="font-bold text-green-600">${total.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
          {expenseByCategory.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Расходы по категориям</p>
              {expenseByCategory.map(({ cat, total }) => (
                <div key={cat} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0 text-sm">
                  <span className="text-gray-600">{cat}</span>
                  <span className="font-bold text-red-500">${total.toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Entries table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="font-bold text-gray-700">Записи за {MONTHS[selectedMonth]}</p>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Нет записей за этот месяц</p>
            <p className="text-xs mt-1">Нажмите "Добавить запись" чтобы начать</p>
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
                      {e.type === "income" ? "+" : "−"} {e.category}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{e.description || "—"}</td>
                  <td className={`px-5 py-3 text-right font-bold ${e.type === "income" ? "text-green-600" : "text-red-500"}`}>
                    {e.type === "income" ? "+" : "−"}${e.amount.toFixed(0)}
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
