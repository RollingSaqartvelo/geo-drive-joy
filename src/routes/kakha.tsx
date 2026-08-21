import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { KAKHA, KAKHA_CARS } from "./admin";

export const Route = createFileRoute("/kakha")({
  component: KakhaEntry,
});

// Персональная ссылка Кахи: авто-вход в админку под его аккаунтом.
function KakhaEntry() {
  const nav = useNavigate();
  useEffect(() => {
    sessionStorage.setItem("georent_role", "manager");
    sessionStorage.setItem("georent_user", KAKHA.name);
    sessionStorage.setItem("georent_mycars", JSON.stringify(KAKHA_CARS));
    nav({ to: "/admin/calendar" });
  }, [nav]);
  return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Вход…</div>;
}
