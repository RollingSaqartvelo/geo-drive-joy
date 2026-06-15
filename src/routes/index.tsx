import { createFileRoute } from "@tanstack/react-router";
import { Car, Map, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { RequestRentalModal } from "@/components/RequestRentalModal";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GEOrent — Premium Car Rental in Batumi, Georgia" },
      { name: "description", content: "Premium car rental in Batumi & across Georgia. Mustang, Range Rover, Discovery. Tours & transfers." },
      { property: "og:title", content: "GEOrent — Premium Car Rental in Georgia" },
      { property: "og:description", content: "Rent premium cars in Batumi & Tbilisi." },
      { property: "og:image", content: hero.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[calc(100vh-4rem)] min-h-[560px] w-full overflow-hidden">
        <img src={hero.url} alt="Premium car on a Georgian mountain road" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-blue)]/85 via-[var(--brand-blue)]/55 to-black/40" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 h-full flex flex-col justify-center text-white">
          <p className="uppercase tracking-[0.25em] text-xs sm:text-sm text-white/80 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">GEOrent</p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            Premium Car Rental<br />in Georgia
          </h1>
          <p className="mt-6 text-lg sm:text-2xl text-white/85 max-w-xl">
            Batumi · Tbilisi · Across Georgia
          </p>
          <div className="mt-10">
            <RequestRentalModal
              trigger={
                <Button className="h-14 px-10 text-base font-bold tracking-wide bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white rounded-full shadow-2xl shadow-black/30">
                  REQUEST RENTAL
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { Icon: Car, title: "Premium Fleet", body: "Mustang, Range Rover, Discovery — meticulously maintained." },
              { Icon: Map, title: "Tours & Transfers", body: "Curated trips across Georgia's mountains, sea & wine country." },
              { Icon: MapPin, title: "Offices in Batumi & Tbilisi", body: "Pick up and return where it works for your route." },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="h-14 w-14 rounded-xl bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-blue)] mb-2">{title}</h3>
                <p className="text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-[var(--brand-blue)] text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready when you are.</h2>
            <p className="text-white/75 mt-2">Send a request — we'll confirm availability fast.</p>
          </div>
          <RequestRentalModal
            trigger={
              <Button className="h-12 px-8 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white font-semibold rounded-full">
                Request Rental
              </Button>
            }
          />
        </div>
      </section>
    </SiteLayout>
  );
}
