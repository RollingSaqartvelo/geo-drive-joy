import { createFileRoute } from "@tanstack/react-router";
import { ReadOnlyCalendar } from "@/components/ReadOnlyCalendar";
import { CARS } from "./cars";
import { KAKHA_CARS, SEMEN_CARS } from "./admin";

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
  } else if (scope === "semen") {
    cars = CARS.filter(c => SEMEN_CARS.includes(c.slug)).map(c => ({ slug: c.slug, name: c.name }));
    title = "Календарь — Semen";
  }

  return <ReadOnlyCalendar cars={cars} title={title} />;
}
