import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Car, LogOut } from "lucide-react";

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
      <div className="min-h-screen bg-[#0a1020] flex items-center justify-center">
        <form onSubmit={login} className="bg-[#111d30] rounded-2xl p-8 w-80 flex flex-col gap-4 border border-white/5 shadow-2xl">
          <div className="text-center mb-2">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c9a84c]/10 mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-black text-white">GEOrent</h1>
            <p className="text-white/40 text-sm mt-1">Admin Panel</p>
          </div>
          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setError(false); }}
            placeholder="PIN-код"
            className="bg-[#0a1020] text-white border border-white/10 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-[#c9a84c] transition-colors"
            maxLength={6}
            autoFocus
          />
          {error && <p className="text-red-400 text-sm text-center -mt-2">Неверный PIN</p>}
          <button type="submit" className="bg-[#c9a84c] text-[#0a1020] font-bold rounded-xl py-3 hover:opacity-90 transition-opacity">
            Войти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1020] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#111d30] border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <p className="text-[#c9a84c] font-black text-lg tracking-wide">GEOrent</p>
          <p className="text-white/30 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
          <Link to="/admin/calendar"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 [&.active]:bg-[#c9a84c]/10 [&.active]:text-[#c9a84c] transition-all">
            <Calendar className="h-4 w-4 shrink-0" /> Календарь
          </Link>
          <Link to="/admin/cars"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 [&.active]:bg-[#c9a84c]/10 [&.active]:text-[#c9a84c] transition-all">
            <Car className="h-4 w-4 shrink-0" /> Автомобили
          </Link>
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white hover:bg-white/5 w-full transition-all">
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
