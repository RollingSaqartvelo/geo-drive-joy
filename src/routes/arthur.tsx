import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ARTHUR, ARTHUR_CARS } from "./admin";

export const Route = createFileRoute("/arthur")({
  component: ArthurEntry,
});

// Персональная ссылка Arthur: авто-вход в админку под его аккаунтом.
function ArthurEntry() {
  const nav = useNavigate();
  useEffect(() => {
    sessionStorage.setItem("georent_role", "manager");
    sessionStorage.setItem("georent_user", ARTHUR.name);
    sessionStorage.setItem("georent_mycars", JSON.stringify(ARTHUR_CARS));
    nav({ to: "/admin/calendar" });
  }, [nav]);
  return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Вход…</div>;
}
