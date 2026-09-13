import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { trackWhatsAppClick } from "@/lib/analytics";

const WA = "https://wa.me/995500194533?text=Hello!%20I%20would%20like%20to%20rent%20a%20car%20at%20Batumi%20Airport.";

export const Route = createFileRoute("/batumi-airport-car-rental")({
  head: () => ({
    meta: [
      { title: "Car Rental at Batumi Airport (BUS) — Delivery from $10 | GEOrent" },
      { name: "description", content: "Rent a car at Batumi Airport with GEOrent. Airport delivery from $10 (daytime) / $25 (night), full insurance, from $45/day. Book on WhatsApp." },
      { property: "og:title", content: "Car Rental at Batumi Airport | GEOrent" },
      { property: "og:description", content: "Batumi Airport car rental with delivery from $10. Full insurance, from $45/day." },
    ],
  }),
  component: AirportPage,
});

const FAQ = [
  { q: "Can I pick up a rental car at Batumi Airport?", a: "Yes. GEOrent delivers your car directly to Batumi International Airport (BUS). Delivery is $10 in the daytime and $25 at night." },
  { q: "How does airport delivery work?", a: "Send us your flight details and arrival time on WhatsApp. Our team meets you at Batumi Airport with the car, documents and keys — no office visit needed." },
  { q: "How much does it cost to rent a car at Batumi Airport?", a: "Cars start from $45/day plus the airport delivery fee of $10 (daytime) or $25 (night). Longer rentals get lower daily rates." },
  { q: "Can I return the car at the airport?", a: "Yes, you can return the car at Batumi Airport as well — just let us know in advance." },
];

function AirportPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--brand-blue)] leading-tight">Car Rental at Batumi Airport</h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
          Rent a car at Batumi International Airport (BUS) with GEOrent. We meet you right at the airport with the car — no queues, no office visit. Cars from $45/day, full insurance, fast WhatsApp booking.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick({ source: "airport_page" })}>
            <Button className="h-12 px-7 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold rounded-full inline-flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Book on WhatsApp</Button>
          </a>
          <Link to="/cars"><Button variant="outline" className="h-12 px-7 rounded-full font-semibold">Browse cars</Button></Link>
        </div>

        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">Airport delivery prices</h2>
        <div className="mt-5 rounded-2xl border overflow-hidden max-w-md">
          {[["Batumi Airport — daytime", "$10"], ["Batumi Airport — night", "$25"], ["Tbilisi Airport — daytime", "$35"], ["Tbilisi Airport — night", "$50"]].map(([l, p], i) => (
            <div key={l} className={`flex items-center justify-between px-5 py-3 ${i % 2 ? "bg-muted/40" : ""}`}>
              <span className="text-muted-foreground">{l}</span><span className="font-bold text-[var(--brand-blue)]">{p}</span>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">Why GEOrent at Batumi Airport</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {["Meet & greet right at the airport", "Full CASCO insurance included", "From $45/day, no hidden fees", "Refundable deposit from $100", "Automatic transmission", "24/7 WhatsApp support"].map(w => (
            <li key={w} className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center"><Check className="h-3.5 w-3.5" /></span>
              <span className="text-muted-foreground">{w}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">Frequently Asked Questions</h2>
        <div className="mt-5 divide-y rounded-2xl border">
          {FAQ.map(f => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between gap-3">
                {f.q}<span className="text-[var(--brand-blue)] group-open:rotate-45 transition-transform text-xl shrink-0">+</span>
              </summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-[var(--brand-blue)] text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black">Landing in Batumi soon?</h2>
            <p className="mt-1 text-white/80">Send us your flight — your car will be waiting at the airport.</p>
          </div>
          <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick({ source: "airport_cta" })}
            className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-full px-7 h-14 transition-colors">
            <MessageCircle className="h-5 w-5" /> Book on WhatsApp
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}
