import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SEMEN, SEMEN_CARS } from "./admin";

export const Route = createFileRoute("/semen")({
  component: SemenEntry,
});

// Персональная ссылка Semen: авто-вход в админку под его аккаунтом.
function SemenEntry() {
  const nav = useNavigate();
  useEffect(() => {
    sessionStorage.setItem("georent_role", "manager");
    sessionStorage.setItem("georent_user", SEMEN.name);
    sessionStorage.setItem("georent_mycars", JSON.stringify(SEMEN_CARS));
    nav({ to: "/admin/calendar" });
  }, [nav]);
  return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Вход…</div>;
}
