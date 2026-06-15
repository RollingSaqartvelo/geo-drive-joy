import { createFileRoute } from "@tanstack/react-router";
import { Mountain, Wine, Waves, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

const WA = "https://wa.me/995500194533";

const TOURS = [
  { Icon: Mountain, title: "Georgian Military Highway", from: 200, body: "Kazbegi, Gergeti Trinity Church, Ananuri & Caucasus panoramas." },
  { Icon: Wine, title: "Wine Region Kakheti", from: 180, body: "Signagi, Telavi, family wineries & traditional Georgian feast." },
  { Icon: Waves, title: "Black Sea Coast Tour", from: 150, body: "Batumi boulevard, botanical garden & coastal viewpoints." },
];

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Tours & Excursions across Georgia — GEOrent" },
      { name: "description", content: "Unforgettable tours across Georgia — mountains, sea and historical sites. Booked through GEOrent." },
      { property: "og:title", content: "Tours & Excursions — GEOrent" },
      { property: "og:description", content: "Mountains, sea and history across Georgia." },
    ],
  }),
  component: ToursPage,
});

function ToursPage() {
  return (
    <SiteLayout>
      <section className="bg-[var(--brand-blue)] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="uppercase tracking-[0.25em] text-xs text-white/70 mb-3">Explore</p>
          <h1 className="text-4xl sm:text-6xl font-black max-w-3xl">Tours & Excursions across Georgia</h1>
          <p className="mt-4 text-white/80 max-w-2xl text-lg">
            We organize unforgettable trips across Georgia — mountains, sea, historical sites.
          </p>
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 md:grid-cols-3">
          {TOURS.map(({ Icon, title, from, body }) => (
            <article key={title} className="rounded-2xl bg-card border p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
              <div className="h-14 w-14 rounded-xl bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center mb-5">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--brand-blue)]">{title}</h3>
              <p className="mt-3 text-muted-foreground flex-1">{body}</p>
              <div className="mt-5 inline-flex items-baseline gap-1 self-start rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] px-3 py-1.5 font-bold">
                from ${from}
              </div>
              <Button asChild className="mt-5 w-full h-11 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white font-semibold">
                <a href={WA} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask on WhatsApp
                </a>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}