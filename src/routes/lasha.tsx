import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LASHA } from "./admin";

export const Route = createFileRoute("/lasha")({
  component: LashaEntry,
});

// Персональная ссылка Lasha: авто-вход в админку под его аккаунтом.
function LashaEntry() {
  const nav = useNavigate();
  useEffect(() => {
    sessionStorage.setItem("georent_role", "manager");
    sessionStorage.setItem("georent_user", LASHA.name);
    sessionStorage.setItem("georent_mycars", JSON.stringify(LASHA.cars));
    nav({ to: "/admin/calendar" });
  }, [nav]);
  return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Вход…</div>;
}
