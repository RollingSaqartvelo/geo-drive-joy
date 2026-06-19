import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Car, LogOut } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const PIN = "2025";

export function AdminLayout() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("georent_admin") === "ok");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === PIN) {
      sessionStorage.setItem("georent_admin", "ok");
      setAuthed(true);
    } else {
      setError(true);
      setPin("");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("georent_admin");
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-blue-dark,#0f1729)] flex items-center justify-center p-4">
        <form onSubmit={login} className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm flex flex-col gap-4">
          <div className="text-center mb-2">
            <img src={logo.url} alt="GEOrent" className="h-20 w-auto mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Панель управления</p>
          </div>
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            placeholder="PIN-код"
            className={`border-2 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.8em] outline-none transition-colors ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--brand-blue)]"}`}
            maxLength={6}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center -mt-2">Неверный PIN</p>}
          <button type="submit" className="bg-[var(--brand-blue)] text-white font-bold rounded-xl py-3 hover:opacity-90 transition-opacity">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-center">
          <img src={logo.url} alt="GEOrent" className="h-14 w-auto" />
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
          <Link to="/admin/calendar"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-[var(--brand-blue)] hover:bg-blue-50 [&.active]:bg-[var(--brand-blue)] [&.active]:text-white transition-all">
            <CalendarDays className="h-4 w-4 shrink-0" /> Календарь
          </Link>
          <Link to="/admin/cars"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-[var(--brand-blue)] hover:bg-blue-50 [&.active]:bg-[var(--brand-blue)] [&.active]:text-white transition-all">
            <Car className="h-4 w-4 shrink-0" /> Автомобили
          </Link>
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 w-full transition-all">
            <LogOut className="h-4 w-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
