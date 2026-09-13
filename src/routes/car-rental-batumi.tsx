import { createFileRoute } from "@tanstack/react-router";
import { BatumiLanding } from "@/components/BatumiLanding";

export const Route = createFileRoute("/car-rental-batumi")({
  head: () => ({
    meta: [
      { title: "Car Rental in Batumi, Georgia — from $45/day | GEOrent" },
      { name: "description", content: "Rent a car in Batumi, Georgia with GEOrent. 50+ cars from $45/day, Batumi Airport delivery from $10, full insurance, WhatsApp booking." },
      { property: "og:title", content: "Car Rental in Batumi, Georgia | GEOrent" },
      { property: "og:description", content: "Rent a car in Batumi from $45/day. Airport delivery, full insurance, WhatsApp booking." },
    ],
    links: [
      { rel: "canonical", href: "https://geo-rent.com/car-rental-batumi" },
      { rel: "alternate", hrefLang: "en", href: "https://geo-rent.com/car-rental-batumi" },
      { rel: "alternate", hrefLang: "ru", href: "https://geo-rent.com/prokat-avtomobiley-batumi" },
      { rel: "alternate", hrefLang: "x-default", href: "https://geo-rent.com/car-rental-batumi" },
    ],
  }),
  component: () => <BatumiLanding lang="en" />,
});
