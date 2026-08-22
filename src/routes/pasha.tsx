import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PASHA } from "./admin";

export const Route = createFileRoute("/pasha")({
  component: PashaEntry,
});

// Персональная ссылка Pasha: авто-вход в админку под его аккаунтом.
function PashaEntry() {
  const nav = useNavigate();
  useEffect(() => {
    sessionStorage.setItem("georent_role", "manager");
    sessionStorage.setItem("georent_user", PASHA.name);
    sessionStorage.setItem("georent_mycars", JSON.stringify(PASHA.cars));
    nav({ to: "/admin/calendar" });
  }, [nav]);
  return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Вход…</div>;
}
