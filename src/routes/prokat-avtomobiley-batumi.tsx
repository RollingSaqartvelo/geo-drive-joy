import { createFileRoute } from "@tanstack/react-router";
import { BatumiLanding } from "@/components/BatumiLanding";

export const Route = createFileRoute("/prokat-avtomobiley-batumi")({
  head: () => ({
    meta: [
      { title: "Прокат автомобилей в Батуми, Грузия — от $45/день | GEOrent" },
      { name: "description", content: "Прокат авто в Батуми, Грузия от GEOrent. Более 50 машин от $45/день, доставка в аэропорт Батуми от $10, полная страховка, бронь в WhatsApp." },
      { property: "og:title", content: "Прокат автомобилей в Батуми, Грузия | GEOrent" },
      { property: "og:description", content: "Аренда авто в Батуми от $45/день. Доставка в аэропорт, полная страховка, бронь в WhatsApp." },
    ],
  }),
  component: () => <BatumiLanding lang="ru" />,
});
