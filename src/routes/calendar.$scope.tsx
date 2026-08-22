import { createFileRoute } from "@tanstack/react-router";
import { ReadOnlyCalendar } from "@/components/ReadOnlyCalendar";
import { CARS } from "./cars";
import { KAKHA_CARS, KAKHA } from "./admin";

export const Route = createFileRoute("/calendar/$scope")({
  component: PartnerCalendar,
});

// Публичная read-only ссылка на календарь для партнёров.
// /calendar/kakha — машины Кахи; /calendar/all — весь автопарк.
function PartnerCalendar() {
  const { scope } = Route.useParams();

  let cars = CARS.map(c => ({ slug: c.slug, name: c.name }));
  let title = "Календарь автопарка";

  if (scope === "kakha") {
    cars = CARS.filter(c => KAKHA_CARS.includes(c.slug)).map(c => ({ slug: c.slug, name: c.name }));
    title = "Календарь — Каха";
  }

  return <ReadOnlyCalendar cars={cars} title={title} />;
}
