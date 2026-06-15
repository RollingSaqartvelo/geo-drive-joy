import { createFileRoute } from "@tanstack/react-router";
import { Users, Calendar, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import mustang1 from "@/assets/mustang-1.jpg.asset.json";
import mustang2 from "@/assets/mustang-2.jpg.asset.json";
import mustang3 from "@/assets/mustang-3.jpg.asset.json";
import mustang4 from "@/assets/mustang-4.jpg.asset.json";
import disc1 from "@/assets/discovery-1.webp.asset.json";
import disc2 from "@/assets/discovery-2.webp.asset.json";
import disc3 from "@/assets/discovery-3.webp.asset.json";

const WA = "https://wa.me/995500194533";

type Car = {
  name: string;
  year: number;
  seats?: number;
  price: number;
  images?: { url: string }[];
};

const CARS: Car[] = [
  { name: "Range Rover Sport", year: 2016, price: 150 },
  { name: "Range Rover Sport Red", year: 2016, price: 140 },
  { name: "Range Rover 7 Seats", year: 2018, seats: 7, price: 160 },
  { name: "Chrysler Pacifica", year: 2015, seats: 8, price: 90 },
  { name: "Discovery Land Rover", year: 2023, price: 200, images: [disc3, disc1, disc2] },
  { name: "Ford Mustang Cabrio", year: 2020, price: 130, images: [mustang2, mustang1, mustang3, mustang4] },
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
        <h3 className="text-xl font-bold text-[var(--brand-blue)]">{car.name}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{car.year}</span>
          {car.seats && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{car.seats} seats</span>}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-baseline gap-1 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] px-3 py-1.5 font-bold">
            ${car.price}<span className="text-xs font-medium opacity-80">/day</span>
          </span>
        </div>
        <Button asChild className="mt-5 w-full h-11 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white font-semibold">
          <a href={WA} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" />
            Book on WhatsApp
          </a>
        </Button>
      </div>
    </article>
  );
}

function CarsPage() {
  return (
    <SiteLayout>
      <section className="bg-[var(--brand-blue)] text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="uppercase tracking-[0.25em] text-xs text-white/70 mb-3">Our Fleet</p>
          <h1 className="text-4xl sm:text-6xl font-black">Choose Your Drive</h1>
          <p className="mt-4 text-white/80 max-w-xl">Premium, reliable vehicles ready for the roads of Georgia.</p>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CARS.map((c) => <CarCard key={c.name} car={c} />)}
        </div>
      </section>
    </SiteLayout>
  );
}