import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
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
type CarSpec = { label: string; value: string };

export type Car = {
  name: string;
  slug: string;
  year: number;
  seats?: number;
  price: number;
  priceMax?: number;
  tiers?: PriceTier[];
  city: City;
  images?: { url: string }[];
  description?: string;
  specs?: CarSpec[];
};

export const CARS: Car[] = [
  { name: "Mercedes E350", slug: "mercedes-e350", year: 2015, seats: 5, price: 100, city: "batumi",
    images: [{ url: "/mercedes-e350-1.jpg" }, { url: "/mercedes-e350-2.jpg" }, { url: "/mercedes-e350-3.jpg" }, { url: "/mercedes-e350-4.jpg" }],
    tiers: [{ label: "1–3 days", price: 100 }, { label: "4–7 days", price: 90 }, { label: "7–15 days", price: 80 }],
    description: "Elegant Mercedes-Benz E350 AMG Line — premium German sedan with refined comfort and powerful performance for Batumi's roads.",
    specs: [{ label: "Engine", value: "3.5L V6" }, { label: "Power", value: "302 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury Sedan" }] },
  { name: "Ford Mustang Cabrio", slug: "ford-mustang-cabrio", year: 2020, price: 150, city: "batumi", images: [{ url: "/mustang-bw.png" }, { url: "/mustang-2-new.png" }, { url: "/mustang-3-new.png" }],
    tiers: [{ label: "1–3 days", price: 150 }, { label: "4–7 days", price: 140 }, { label: "7–15 days", price: 130 }],
    description: "Feel the freedom on Batumi's coastal roads in this iconic American convertible sports car.",
    specs: [{ label: "Engine", value: "2.3L I4 Turbo" }, { label: "Power", value: "310 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "4" }, { label: "Class", value: "Convertible" }] },
  { name: "Ford Mustang Cabrio Red", slug: "ford-mustang-cabrio-red", year: 2020, price: 150, city: "batumi",
    images: [{ url: "/mustang-red-1.jpg" }, { url: "/mustang-red-2.jpg" }, { url: "/mustang-red-3.jpg" }, { url: "/mustang-red-4.jpg" }],
    tiers: [{ label: "1–3 days", price: 150 }, { label: "4–7 days", price: 140 }, { label: "7–15 days", price: 130 }],
    description: "Feel the freedom on Batumi's coastal roads in this iconic red American convertible sports car.",
    specs: [{ label: "Engine", value: "2.3L I4 Turbo" }, { label: "Power", value: "310 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "4" }, { label: "Class", value: "Convertible" }] },
  { name: "Ford Mustang Cabrio 3.7L Dark Black", slug: "ford-mustang-cabrio-dark-black", year: 2016, seats: 4, price: 150, city: "batumi",
    images: [{ url: "/mustang-black-1.jpg" }, { url: "/mustang-black-2.jpg" }, { url: "/mustang-black-3.jpg" }, { url: "/mustang-black-4.jpg" }, { url: "/mustang-black-5.jpg" }, { url: "/mustang-black-6.jpg" }, { url: "/mustang-black-7.jpg" }, { url: "/mustang-black-8.jpg" }],
    tiers: [{ label: "1–3 days", price: 150 }, { label: "4–7 days", price: 140 }, { label: "7–15 days", price: 130 }],
    description: "Iconic Ford Mustang Cabrio in stunning dark black — powerful 3.7L V6 with open-top driving along Batumi's beautiful coastline.",
    specs: [{ label: "Engine", value: "3.7L V6" }, { label: "Power", value: "300 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "4" }, { label: "Class", value: "Convertible" }] },
  { name: "Range Rover Sport", slug: "range-rover-sport", year: 2016, price: 180, city: "batumi", images: [rrw1, rrw2, rrw3],
    tiers: [{ label: "1–3 days", price: 180 }, { label: "4–7 days", price: 160 }, { label: "7–15 days", price: 140 }],
    description: "Premium British luxury SUV with outstanding performance and sophisticated design. Perfect for city drives and Georgia's mountain roads.",
    specs: [{ label: "Engine", value: "5.0L V8" }, { label: "Power", value: "510 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury SUV" }] },
  { name: "Range Rover Sport Red", slug: "range-rover-sport-red", year: 2016, price: 180, city: "batumi", images: [rrred1, rrred2, rrred3],
    tiers: [{ label: "1–3 days", price: 180 }, { label: "4–7 days", price: 160 }, { label: "7–15 days", price: 140 }],
    description: "Striking red Range Rover Sport — turn heads on every road with British luxury and powerful V8 performance.",
    specs: [{ label: "Engine", value: "5.0L V8" }, { label: "Power", value: "510 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury SUV" }] },
  { name: "Range Rover 7 Seats", slug: "range-rover-7-seats", year: 2018, seats: 7, price: 180, city: "batumi", images: [rr7a, rr7b, rr7c],
    tiers: [{ label: "1–3 days", price: 180 }, { label: "4–7 days", price: 150 }, { label: "7–15 days", price: 140 }, { label: "15–30 days", price: 130 }],
    description: "Spacious 7-seat Range Rover — luxury for the whole group with superior off-road capability and first-class comfort.",
    specs: [{ label: "Engine", value: "3.0L V6" }, { label: "Power", value: "340 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "7" }, { label: "Class", value: "Luxury SUV" }] },
  { name: "Chrysler Pacifica", slug: "chrysler-pacifica", year: 2015, seats: 8, price: 90, city: "tbilisi", images: [pac1, pac2, pac3, pac4],
    tiers: [{ label: "1–3 days", price: 90 }, { label: "4–7 days", price: 80 }, { label: "7–15 days", price: 70 }],
    description: "Comfortable 8-seat minivan — ideal for family trips and group tours across Georgia.",
    specs: [{ label: "Engine", value: "3.6L V6" }, { label: "Power", value: "287 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "8" }, { label: "Class", value: "Minivan" }] },
  { name: "Discovery Land Rover", slug: "discovery-land-rover", year: 2023, price: 200, city: "tbilisi", images: [disc3, disc1, disc2],
    tiers: [{ label: "1–3 days", price: 200 }, { label: "4–7 days", price: 180 }, { label: "7–15 days", price: 160 }],
    description: "The latest Land Rover Discovery — premium adventure-ready luxury SUV built for Georgia's diverse terrain.",
    specs: [{ label: "Engine", value: "3.0L I6" }, { label: "Power", value: "395 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury SUV" }] },
  { name: "BMW X4 3.0L", slug: "bmw-x4", year: 2019, price: 150, city: "batumi", images: [bmwx4a, bmwx4b, bmwx4c],
    tiers: [{ label: "1–3 days", price: 150 }, { label: "4–7 days", price: 140 }, { label: "7–15 days", price: 130 }],
    description: "Dynamic BMW X4 with powerful inline-6 engine — sporty coupe SUV for those who demand both style and performance.",
    specs: [{ label: "Engine", value: "3.0L I6" }, { label: "Power", value: "360 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Sports SUV" }] },
  { name: "Lexus GX 470", slug: "lexus-gx470", year: 2008, price: 60, city: "tbilisi", images: [gx1, gx2, gx3, gx4, gx5],
    tiers: [{ label: "1–3 days", price: 60 }, { label: "4–7 days", price: 55 }, { label: "7–15 days", price: 50 }, { label: "15+ days", price: 40 }],
    description: "Legendary Lexus GX 470 — a reliable V8 SUV perfect for mountain roads and off-road adventures in Georgia.",
    specs: [{ label: "Engine", value: "4.7L V8" }, { label: "Power", value: "235 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "SUV" }] },
  { name: "KIA Sedona", slug: "kia-sedona", year: 2016, seats: 8, price: 90, city: "batumi", images: [sedona1, sedona2, sedona3],
    tiers: [{ label: "1–3 days", price: 90 }, { label: "4–7 days", price: 80 }, { label: "8–15 days", price: 70 }],
    description: "Spacious KIA Sedona minivan — comfortable transport for large groups and family vacations in Georgia.",
    specs: [{ label: "Engine", value: "3.3L V6" }, { label: "Power", value: "276 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "8" }, { label: "Class", value: "Minivan" }] },
  { name: "Jeep Wrangler", slug: "jeep-wrangler", year: 2016, price: 160, city: "batumi", images: [wrangler1, wrangler2],
    tiers: [{ label: "1–3 days", price: 160 }, { label: "4–7 days", price: 150 }, { label: "7–15 days", price: 130 }],
    description: "Classic Jeep Wrangler — unstoppable off-road performance for Batumi's wildest adventures.",
    specs: [{ label: "Engine", value: "3.6L V6" }, { label: "Power", value: "285 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Off-Road" }] },
  { name: "BMW 740i", slug: "bmw-740i", year: 2014, price: 150, city: "batumi", images: [bmw740a, bmw740b, bmw740c, bmw740d, bmw740e, bmw740f, bmw740g],
    tiers: [{ label: "1–3 days", price: 150 }, { label: "4–7 days", price: 140 }, { label: "7–15 days", price: 130 }],
    description: "Prestigious BMW 7 Series — the pinnacle of luxury sedans with a smooth inline-6 engine and first-class comfort.",
    specs: [{ label: "Engine", value: "3.0L I6 Turbo" }, { label: "Power", value: "326 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury Sedan" }] },
  { name: "BMW X5 Hybrid", slug: "bmw-x5-hybrid", year: 2020, price: 125, city: "tbilisi", images: [x5a, x5b, x5c, x5e, x5f],
    tiers: [{ label: "1–3 days", price: 125 }, { label: "4–7 days", price: 115 }, { label: "8–30 days", price: 110 }],
    description: "The BMW X5 Hybrid combines a powerful 3.0L inline-6 with electric drive for exceptional efficiency and premium performance.",
    specs: [{ label: "Engine", value: "3.0L I6 Hybrid" }, { label: "Power", value: "394 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury SUV" }] },
  { name: "Toyota Prius", slug: "toyota-prius", year: 2017, price: 45, city: "batumi", images: [prius1, prius2],
    tiers: [{ label: "1–3 days", price: 45 }, { label: "4–7 days", price: 40 }, { label: "7–15 days", price: 35 }],
    description: "Fuel-efficient Toyota Prius hybrid — economical and eco-friendly transport for everyday city driving.",
    specs: [{ label: "Engine", value: "1.8L Hybrid" }, { label: "Power", value: "122 HP" }, { label: "Transmission", value: "CVT" }, { label: "Seats", value: "5" }, { label: "Class", value: "Hybrid" }] },
  { name: "Ford Escape", slug: "ford-escape", year: 2015, seats: 5, price: 50, city: "batumi",
    images: [{ url: "/ford-escape-1.jpg" }, { url: "/ford-escape-2.jpg" }, { url: "/ford-escape-3.jpg" }, { url: "/ford-escape-4.jpg" }, { url: "/ford-escape-5.jpg" }, { url: "/ford-escape-6.jpg" }, { url: "/ford-escape-7.jpg" }],
    tiers: [{ label: "1–3 days", price: 50 }, { label: "4–15 days", price: 45 }, { label: "15–30 days", price: 40 }],
    description: "Practical and reliable Ford Escape compact SUV — great value for exploring all corners of Georgia.",
    specs: [{ label: "Engine", value: "1.6L I4 Turbo" }, { label: "Power", value: "178 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Compact SUV" }] },
  { name: "Jeep Wrangler Sahara", slug: "jeep-wrangler-sahara", year: 2019, price: 170, city: "tbilisi", images: [wr19a, wr19b, wr19c, wr19d, wr19e, wr19f],
    tiers: [{ label: "1–3 days", price: 170 }, { label: "4–7 days", price: 140 }, { label: "8–15 days", price: 125 }],
    description: "The iconic 2019 Jeep Wrangler Sahara — built for adventure, perfect for Georgia's mountain and coastal terrain.",
    specs: [{ label: "Engine", value: "2.0L I4 Turbo" }, { label: "Power", value: "272 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Off-Road SUV" }] },
  { name: "Mini Countryman Cooper S", slug: "mini-countryman-cooper-s", year: 2022, seats: 5, price: 70, city: "tbilisi",
    images: [{ url: "/mini-countryman-1.avif" }, { url: "/mini-countryman-2.avif" }, { url: "/mini-countryman-3.avif" }, { url: "/mini-countryman-4.avif" }, { url: "/mini-countryman-5.avif" }],
    tiers: [{ label: "1–3 days", price: 70 }, { label: "4–15 days", price: 65 }, { label: "15–30 days", price: 45 }],
    description: "Modern premium compact crossover combining MINI's sporty character with all-wheel drive confidence. Keyless entry, Apple CarPlay, heated seats.",
    specs: [{ label: "Engine", value: "2.0L I4 Turbo" }, { label: "Power", value: "178 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Compact SUV" }] },
  { name: "BMW 430i", slug: "bmw-430i", year: 2016, seats: 4, price: 110, city: "tbilisi",
    images: [{ url: "/bmw430i-1.avif" }, { url: "/bmw430i-2.avif" }, { url: "/bmw430i-3.webp" }],
    tiers: [{ label: "1–3 days", price: 110 }, { label: "4–15 days", price: 100 }, { label: "15–30 days", price: 70 }],
    description: "Elegant BMW 4 Series coupe — turbocharged 2.0L engine with premium interior and driver-focused dynamics.",
    specs: [{ label: "Engine", value: "2.0L I4 Turbo" }, { label: "Power", value: "252 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "4" }, { label: "Class", value: "Coupe" }] },
  { name: "Mercedes GLE 350", slug: "mercedes-gle-350", year: 2020, seats: 5, price: 220, city: "tbilisi",
    images: [{ url: "/mercedes-gle-2.jpg" }, { url: "/mercedes-gle-1.jpg" }, { url: "/mercedes-gle-3.jpg" }, { url: "/mercedes-gle-4.jpg" }, { url: "/mercedes-gle-5.jpg" }, { url: "/mercedes-gle-6.jpg" }, { url: "/mercedes-gle-7.jpg" }, { url: "/mercedes-gle-8.jpg" }],
    tiers: [{ label: "1–2 days", price: 220 }, { label: "3–5 days", price: 200 }, { label: "5+ days", price: 180 }],
    description: "The Mercedes-Benz GLE 350 — a masterpiece of German engineering combining luxury, power and cutting-edge technology.",
    specs: [{ label: "Engine", value: "2.0L I4 Turbo" }, { label: "Power", value: "255 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury SUV" }] },
  { name: "Nissan Rogue Sport", slug: "nissan-rogue-sport", year: 2022, seats: 5, price: 60, city: "tbilisi",
    images: [{ url: "/nissan-rogue-1.avif" }, { url: "/nissan-rogue-2.webp" }, { url: "/nissan-rogue-3.avif" }, { url: "/nissan-rogue-4.avif" }],
    tiers: [{ label: "1–3 days", price: 60 }, { label: "4–7 days", price: 55 }, { label: "8–30 days", price: 40 }],
    description: "Stylish and practical Nissan Rogue Sport — reliable compact SUV with modern safety features and comfortable interior.",
    specs: [{ label: "Engine", value: "2.0L I4" }, { label: "Power", value: "141 HP" }, { label: "Transmission", value: "CVT" }, { label: "Seats", value: "5" }, { label: "Class", value: "Compact SUV" }] },
  { name: "Lexus RX 350", slug: "lexus-rx350", year: 2022, seats: 5, price: 110, city: "tbilisi",
    images: [{ url: "/lexus-rx350-1.avif" }, { url: "/lexus-rx350-2.avif" }, { url: "/lexus-rx350-3.avif" }, { url: "/lexus-rx350-4.avif" }, { url: "/lexus-rx350-5.avif" }],
    tiers: [{ label: "1–3 days", price: 110 }, { label: "4–7 days", price: 100 }, { label: "8–30 days", price: 75 }],
    description: "The Lexus RX 350 — Japanese luxury SUV with a smooth V6 engine, plush interior and outstanding reliability.",
    specs: [{ label: "Engine", value: "3.5L V6" }, { label: "Power", value: "295 HP" }, { label: "Transmission", value: "Automatic" }, { label: "Seats", value: "5" }, { label: "Class", value: "Luxury SUV" }] },
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
  const hero = car.images?.[0];
  return (
    <Link to="/car/$slug" params={{ slug: car.slug }} className="block group">
      <article className="rounded-2xl overflow-hidden bg-card border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all h-full">
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
          <div className="mt-5 w-full h-11 bg-[var(--brand-tomato)] text-white font-semibold rounded-lg flex items-center justify-center text-sm transition-colors group-hover:bg-[var(--brand-tomato)]/90">
            View Details →
          </div>
        </div>
      </article>
    </Link>
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