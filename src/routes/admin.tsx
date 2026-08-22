import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CalendarDays, Car, LogOut, BarChart2, Lock } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { syncBookings, syncBlocks } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const ADMIN_PIN = "2025";

// Машины, закреплённые за Кахой
export const KAKHA_CARS = ["toyota-rav4-white", "toyota-rav4-hybrid", "subaru-crosstrek-limited", "subaru-crosstrek-black", "ford-fusion-plugin"];
export const KAKHA = { name: "Менеджер Каха", pass: "1989", cars: KAKHA_CARS };

// Менеджеры (доступ только к календарю/заявкам, без финансов).
// cars — если задан, у менеджера появляется вид «Мои машины» с этими авто.
const MANAGERS: { name: string; pass: string; cars?: string[] }[] = [
  KAKHA,
  { name: "Менеджер 2", pass: "MGR-7350" },
  { name: "Менеджер 3", pass: "MGR-1964" },
  { name: "Менеджер 4", pass: "MGR-5207" },
  { name: "Менеджер 5", pass: "MGR-8613" },
  { name: "Менеджер 6", pass: "MGR-3092" },
  { name: "Менеджер 7", pass: "MGR-6748" },
];

type Role = "admin" | "manager";

export function AdminLayout() {
  const [role, setRole] = useState<Role | null>(() => {
    const r = sessionStorage.getItem("georent_role");
    return r === "admin" || r === "manager" ? (r as Role) : null;
  });
  const [userName, setUserName] = useState(() => sessionStorage.getItem("georent_user") || "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const location = useLocation();

  // При входе в админку тянем свежие данные из Supabase в локальный кэш
  // (чтобы Финансы и другие разделы видели актуальные брони со всех устройств).
  useEffect(() => {
    if (!role) return;
    syncBookings().catch(() => {});
    syncBlocks().catch(() => {});
  }, [role]);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    const val = pin.trim();
    if (val === ADMIN_PIN) {
      sessionStorage.setItem("georent_role", "admin");
      sessionStorage.setItem("georent_user", "Администратор");
      sessionStorage.setItem("georent_mycars", JSON.stringify([]));
      setRole("admin");
      setUserName("Администратор");
      return;
    }
    const mgr = MANAGERS.find(m => m.pass === val);
    if (mgr) {
      sessionStorage.setItem("georent_role", "manager");
      sessionStorage.setItem("georent_user", mgr.name);
      sessionStorage.setItem("georent_mycars", JSON.stringify(mgr.cars || []));
      setRole("manager");
      setUserName(mgr.name);
      return;
    }
    setError(true);
    setPin("");
  };

  const logout = () => {
    sessionStorage.removeItem("georent_role");
    sessionStorage.removeItem("georent_user");
    sessionStorage.removeItem("georent_mycars");
    setRole(null);
    setUserName("");
  };

  if (!role) {
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
            placeholder="PIN или пароль"
            className={`border-2 rounded-xl px-4 py-3 text-center text-lg tracking-widest outline-none transition-colors ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-[var(--brand-blue)]"}`}
            maxLength={20}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm text-center -mt-2">Неверный код</p>}
          <button type="submit" className="bg-[var(--brand-blue)] text-white font-bold rounded-xl py-3 hover:opacity-90 transition-opacity">
            Войти
          </button>
        </form>
      </div>
    );
  }

  const isManager = role === "manager";
  const path = location.pathname;
  // Менеджеру закрыты финансы и страница авто (там видна выручка)
  const blocked = isManager && (path.startsWith("/admin/finance") || path.startsWith("/admin/cars"));

  const badgeCls = `text-[11px] font-bold px-2.5 py-0.5 rounded-full ${isManager ? "bg-blue-50 text-[var(--brand-blue)]" : "bg-amber-50 text-amber-600"}`;
  const sideLinkCls = "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-[var(--brand-blue)] hover:bg-blue-50 [&.active]:bg-[var(--brand-blue)] [&.active]:text-white transition-all";
  const topLinkCls = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap text-gray-500 bg-gray-100 [&.active]:bg-[var(--brand-blue)] [&.active]:text-white transition-all";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          <img src={logo.url} alt="GEOrent" className="h-9 w-auto" />
          <div className="flex items-center gap-2">
            <span className={badgeCls}>{userName}</span>
            <button onClick={logout} aria-label="Выйти"
              className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 active:text-red-500 active:bg-red-50">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="flex gap-1.5 px-3 pb-2 overflow-x-auto">
          <Link to="/admin/calendar" className={topLinkCls}>
            <CalendarDays className="h-4 w-4 shrink-0" /> Календарь
          </Link>
          {!isManager && (
            <>
              <Link to="/admin/cars" className={topLinkCls}>
                <Car className="h-4 w-4 shrink-0" /> Автомобили
              </Link>
              <Link to="/admin/finance" className={topLinkCls}>
                <BarChart2 className="h-4 w-4 shrink-0" /> Финансы
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 bg-white border-r border-gray-200 flex-col shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-col items-center gap-2">
          <img src={logo.url} alt="GEOrent" className="h-14 w-auto" />
          <span className={badgeCls}>{userName}</span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
          <Link to="/admin/calendar" className={sideLinkCls}>
            <CalendarDays className="h-4 w-4 shrink-0" /> Календарь
          </Link>
          {!isManager && (
            <>
              <Link to="/admin/cars" className={sideLinkCls}>
                <Car className="h-4 w-4 shrink-0" /> Автомобили
              </Link>
              <Link to="/admin/finance" className={sideLinkCls}>
                <BarChart2 className="h-4 w-4 shrink-0" /> Финансы
              </Link>
            </>
          )}
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
        {blocked ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-xs">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
                <Lock className="h-7 w-7" />
              </div>
              <p className="font-bold text-gray-700">Нет доступа</p>
              <p className="text-sm text-gray-400 mt-1">Этот раздел доступен только администратору.</p>
              <Link to="/admin/calendar" className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-[var(--brand-blue)] text-white text-sm font-bold">
                Перейти к календарю
              </Link>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
