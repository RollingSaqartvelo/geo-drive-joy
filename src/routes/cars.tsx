import { createFileRoute } from "@tanstack/react-router";
import { Users, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { RequestRentalModal } from "@/components/RequestRentalModal";
import { useI18n } from "@/lib/i18n";
import mustang1 from "@/assets/mustang-1.jpg.asset.json";
import mustang2 from "@/assets/mustang-2.jpg.asset.json";
import mustang3 from "@/assets/mustang-3.jpg.asset.json";
import mustang4 from "@/assets/mustang-4.jpg.asset.json";
import disc1 from "@/assets/discovery-1.webp.asset.json";
import disc2 from "@/assets/discovery-2.webp.asset.json";
import disc3 from "@/assets/discovery-3.webp.asset.json";
import pac1 from "@/assets/pacifica-1.webp.asset.json";
import pac2 from "@/assets/pacifica-2.webp.asset.json";
import pac3 from "@/assets/pacifica-3.webp.asset.json";
import pac4 from "@/assets/pacifica-4.webp.asset.json";
import bmwx4a from "@/assets/bmwx4-1.jpg.asset.json";
import bmwx4b from "@/assets/bmwx4-2.jpg.asset.json";
import bmwx4c from "@/assets/bmwx4-3.jpg.asset.json";
import rrred1 from "@/assets/rrsport-red-1.jpg.asset.json";
import rrred2 from "@/assets/rrsport-red-2.jpg.asset.json";
import rrred3 from "@/assets/rrsport-red-3.jpg.asset.json";
import rrw1 from "@/assets/rrsport-white-1.jpg.asset.json";
import rrw2 from "@/assets/rrsport-white-2.jpg.asset.json";
import rrw3 from "@/assets/rrsport-white-3.jpg.asset.json";
import rr7a from "@/assets/rr7-1.jpg.asset.json";
import rr7b from "@/assets/rr7-2.jpg.asset.json";
import rr7c from "@/assets/rr7-3.jpg.asset.json";
import gx1 from "@/assets/lexus-gx470-1.jpg.asset.json";
import gx2 from "@/assets/lexus-gx470-2.jpg.asset.json";
import gx3 from "@/assets/lexus-gx470-3.jpg.asset.json";
import gx4 from "@/assets/lexus-gx470-4.jpg.asset.json";
import gx5 from "@/assets/lexus-gx470-5.jpg.asset.json";
import sedona1 from "@/assets/sedona-1.jpg.asset.json";
import sedona2 from "@/assets/sedona-2.jpg.asset.json";
import sedona3 from "@/assets/sedona-3.jpg.asset.json";
import wrangler1 from "@/assets/wrangler-1.jpg.asset.json";
import wrangler2 from "@/assets/wrangler-2.jpg.asset.json";
import bmw740a from "@/assets/bmw740-1.jpg.asset.json";
import bmw740b from "@/assets/bmw740-2.jpg.asset.json";
import bmw740c from "@/assets/bmw740-3.jpg.asset.json";
import bmw740d from "@/assets/bmw740-4.jpg.asset.json";
import bmw740e from "@/assets/bmw740-5.jpg.asset.json";
import bmw740f from "@/assets/bmw740-6.jpg.asset.json";
import bmw740g from "@/assets/bmw740-7.jpg.asset.json";
import prius1 from "@/assets/prius-1.jpg.asset.json";
import prius2 from "@/assets/prius-2.jpg.asset.json";
import wr19a from "@/assets/wrangler2019-1.jpg.asset.json";
import wr19b from "@/assets/wrangler2019-2.jpg.asset.json";
import wr19c from "@/assets/wrangler2019-3.jpg.asset.json";
import wr19d from "@/assets/wrangler2019-4.jpg.asset.json";
import wr19e from "@/assets/wrangler2019-5.jpg.asset.json";
import wr19f from "@/assets/wrangler2019-6.jpg.asset.json";
import x5a from "@/assets/bmwx5-1.avif.asset.json";
import x5b from "@/assets/bmwx5-2.avif.asset.json";
import x5c from "@/assets/bmwx5-3.avif.asset.json";
import x5e from "@/assets/bmwx5-5.avif.asset.json";
import x5f from "@/assets/bmwx5-6.avif.asset.json";

type City = "batumi" | "tbilisi";

type PriceTier = { label: string; price: number };

type Car = {
  name: string;
  year: number;
  seats?: number;
  price: number;
  priceMax?: number;
  tiers?: PriceTier[];
  city: City;
  images?: { url: string }[];
};

const CARS: Car[] = [
  { name: "Range Rover Sport", year: 2016, price: 150, city: "batumi", images: [rrw1, rrw2, rrw3] },
  { name: "Range Rover Sport Red", year: 2016, price: 140, city: "batumi", images: [rrred1, rrred2, rrred3] },
  { name: "Range Rover 7 Seats", year: 2018, seats: 7, price: 160, city: "batumi", images: [rr7a, rr7b, rr7c] },
  { name: "Chrysler Pacifica", year: 2015, seats: 8, price: 90, city: "tbilisi", images: [pac1, pac2, pac3, pac4] },
  { name: "Discovery Land Rover", year: 2023, price: 200, city: "tbilisi", images: [disc3, disc1, disc2] },
  { name: "Ford Mustang Cabrio", year: 2020, price: 130, city: "batumi", images: [mustang2, mustang1, mustang3, mustang4] },
  { name: "BMW X4 3.0L", year: 2019, price: 120, city: "batumi", images: [bmwx4a, bmwx4b, bmwx4c] },
  { name: "Lexus GX 470", year: 2008, price: 60, city: "tbilisi", images: [gx1, gx2, gx3, gx4, gx5] },
  { name: "KIA Sedona", year: 2016, seats: 8, price: 90, city: "batumi", images: [sedona1, sedona2, sedona3] },
  { name: "Jeep Wrangler", year: 2016, price: 160, city: "batumi", images: [wrangler1, wrangler2] },
  { name: "BMW 740i", year: 2014, price: 150, city: "batumi", images: [bmw740a, bmw740b, bmw740c, bmw740d, bmw740e, bmw740f, bmw740g] },
  { name: "BMW X5 Hybrid", year: 2020, price: 125, city: "tbilisi", images: [x5a, x5b, x5c, x5e, x5f],
    tiers: [{ label: "1–3 days", price: 125 }, { label: "4–7 days", price: 115 }, { label: "8–30 days", price: 110 }] },
  { name: "Toyota Prius", year: 2017, price: 45, city: "batumi", images: [prius1, prius2] },
  { name: "Ford Escape", year: 2015, seats: 5, price: 50, city: "batumi",
    images: [{ url: "/ford-escape-1.jpg" }, { url: "/ford-escape-2.jpg" }, { url: "/ford-escape-3.jpg" }, { url: "/ford-escape-4.jpg" }, { url: "/ford-escape-5.jpg" }, { url: "/ford-escape-6.jpg" }, { url: "/ford-escape-7.jpg" }],
    tiers: [{ label: "1–3 days", price: 50 }, { label: "4–15 days", price: 45 }, { label: "15–30 days", price: 40 }] },
  { name: "Jeep Wrangler Sahara", year: 2019, price: 170, city: "tbilisi", images: [wr19a, wr19b, wr19c, wr19d, wr19e, wr19f],
    tiers: [{ label: "1–3 days", price: 170 }, { label: "4–7 days", price: 140 }, { label: "8–15 days", price: 125 }] },
  { name: "BMW 430i", year: 2016, seats: 4, price: 100, city: "tbilisi",
    images: [{ url: "/bmw430i-1.avif" }, { url: "/bmw430i-2.avif" }, { url: "/bmw430i-3.webp" }],
    tiers: [{ label: "1–3 days", price: 100 }, { label: "4–15 days", price: 90 }, { label: "15–30 days", price: 60 }] },
  { name: "Mercedes GLE 350", year: 2020, seats: 5, price: 220, city: "tbilisi",
    images: [{ url: "/mercedes-gle-2.jpg" }, { url: "/mercedes-gle-1.jpg" }, { url: "/mercedes-gle-3.jpg" }, { url: "/mercedes-gle-4.jpg" }, { url: "/mercedes-gle-5.jpg" }, { url: "/mercedes-gle-6.jpg" }, { url: "/mercedes-gle-7.jpg" }, { url: "/mercedes-gle-8.jpg" }],
    tiers: [{ label: "1–2 days", price: 220 }, { label: "3–5 days", price: 200 }, { label: "5+ days", price: 180 }] },
  { name: "Nissan Rogue Sport", year: 2022, seats: 5, price: 60, city: "tbilisi",
    images: [{ url: "/nissan-rogue-1.avif" }, { url: "/nissan-rogue-2.webp" }, { url: "/nissan-rogue-3.avif" }, { url: "/nissan-rogue-4.avif" }],
    tiers: [{ label: "1–3 days", price: 60 }, { label: "4–7 days", price: 55 }, { label: "8–30 days", price: 40 }] },
  { name: "Lexus RX 350", year: 2022, seats: 5, price: 110, city: "tbilisi",
    images: [{ url: "/lexus-rx350-1.avif" }, { url: "/lexus-rx350-2.avif" }, { url: "/lexus-rx350-3.avif" }, { url: "/lexus-rx350-4.avif" }, { url: "/lexus-rx350-5.avif" }],
    tiers: [{ label: "1–3 days", price: 110 }, { label: "4–7 days", price: 100 }, { label: "8–30 days", price: 75 }] },
];

export const Route = createFileRoute("/cars")({
  head: () => ({
    meta: [
      { title: "Our Cars — GEOrent" },
      { name: "description", content: "Browse GEOrent's premium fleet in Batumi: Range Rover, Discovery, Mustang Cabrio, Chrysler Pacifica and more." },
      { property: "og:title", content: "Our Cars — GEOrent" },
      { property: "og:description", content: "Premium fleet for rent in Georgia." },
    ],
  }),
  component: CarsPage,
});

function CarCard({ car }: { car: Car }) {
  const { t } = useI18n();
  const hero = car.images?.[0];
  return (
    <article className="group rounded-2xl overflow-hidden bg-card border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {hero ? (
          <img src={hero.url} alt={car.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10 text-center p-4">
            <span className="text-muted-foreground font-medium">{car.name}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold text-[var(--brand-blue)]">{car.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] whitespace-nowrap">
            <MapPin className="h-3 w-3" />
            {car.city === "batumi" ? "Batumi" : "Tbilisi"}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{car.year}</span>
          {car.seats && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{car.seats} seats</span>}
        </div>
        <div className="mt-4">
          {car.tiers ? (
            <div className="flex flex-col gap-1">
              {car.tiers.map((t) => (
                <div key={t.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.label}</span>
                  <span className="font-bold text-[var(--brand-olive)]">${t.price}<span className="text-xs font-medium opacity-80">/day</span></span>
                </div>
              ))}
            </div>
          ) : (
            <span className="inline-flex items-baseline gap-1 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] px-3 py-1.5 font-bold">
              ${car.price}{car.priceMax ? `–$${car.priceMax}` : ""}<span className="text-xs font-medium opacity-80">/day</span>
            </span>
          )}
        </div>
        <RequestRentalModal
          car={{ name: car.name, year: car.year }}
          trigger={
            <Button className="mt-5 w-full h-11 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white font-semibold">
              {t("book")}
            </Button>
          }
        />
      </div>
    </article>
  );
}

function CarsPage() {
  const [city, setCity] = useState<City>("batumi");
  const filtered = CARS.filter((c) => c.city === city);

  return (
    <SiteLayout>
      <section className="bg-[var(--brand-blue)] text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="uppercase tracking-[0.25em] text-xs text-white/70 mb-3">Our Fleet</p>
          <h1 className="text-4xl sm:text-6xl font-black">Choose Your Drive</h1>
          <p className="mt-4 text-white/80 max-w-xl">Premium, reliable vehicles ready for the roads of Georgia.</p>
        </div>
      </section>

      {/* City filter */}
      <div className="sticky top-16 z-30 bg-background border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-muted-foreground mr-2">City:</span>
          {(["batumi", "tbilisi"] as City[]).map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={
                "px-6 py-2 rounded-full text-sm font-semibold transition-all border-2 " +
                (city === c
                  ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)] shadow-md"
                  : "bg-white text-[var(--brand-blue)] border-[var(--brand-blue)]/30 hover:border-[var(--brand-blue)]")
              }
            >
              {c === "batumi" ? "🌊 Batumi" : "🏙️ Tbilisi"}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} cars</span>
        </div>
      </div>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => <CarCard key={c.name} car={c} />)}
        </div>
      </section>
    </SiteLayout>
  );
}