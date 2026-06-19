import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Users, CalendarDays } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CARS } from "./cars";

export const Route = createFileRoute("/car/$slug")({
  component: CarDetailPage,
});

const TG_TOKEN = "8916742967:AAEN0QNTVWHjRIbKcdLf4ShH8aOaxhsJDQQ";
const TG_CHAT = "8430276417";

async function sendBookingToTelegram(text: string) {
  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: "HTML" }),
  });
}

function CarDetailPage() {
  const { slug } = Route.useParams();
  const car = CARS.find((c) => c.slug === slug);
  const [mainIdx, setMainIdx] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", from: "", to: "", persons: "1", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!car) {
    return (
      <SiteLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Car not found</h1>
          <Link to="/cars" className="text-[var(--brand-blue)] underline">← Back to Cars</Link>
        </div>
      </SiteLayout>
    );
  }

  const images = car.images ?? [];
  const mainImage = images[mainIdx];
  const priceTiers = car.tiers ?? [{ label: "Per day", price: car.price }];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const text = `🚗 <b>New Booking Request</b>\n\n` +
        `<b>Car:</b> ${car.name} (${car.year})\n` +
        `<b>City:</b> ${car.city === "batumi" ? "Batumi" : "Tbilisi"}\n\n` +
        `<b>Name:</b> ${form.name}\n` +
        `<b>Phone/WhatsApp:</b> ${form.phone}\n` +
        `<b>Pickup date:</b> ${form.from}\n` +
        `<b>Return date:</b> ${form.to}\n` +
        `<b>Persons:</b> ${form.persons}\n` +
        (form.notes ? `<b>Notes:</b> ${form.notes}` : "");
      await sendBookingToTelegram(text);
      setStatus("sent");
      setForm({ name: "", phone: "", from: "", to: "", persons: "1", notes: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Link to="/cars" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Cars
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* LEFT: Gallery */}
          <div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {images.slice(0, 4).map((img, i) => (
                  <button key={i} onClick={() => setMainIdx(i)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${mainIdx === i ? "border-[var(--brand-blue)] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img.url} alt={`${car.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {mainImage && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
                <img src={mainImage.url} alt={car.name} className="h-full w-full object-contain" />
              </div>
            )}
            {images.length > 4 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.slice(4).map((img, i) => (
                  <button key={i + 4} onClick={() => setMainIdx(i + 4)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${mainIdx === i + 4 ? "border-[var(--brand-blue)] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={img.url} alt={`${car.name} ${i + 5}`} className="h-full w-full object-cover object-bottom" />
                  </button>
                ))}
              </div>
            )}

            {/* Specs below photo */}
            {car.specs && car.specs.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold mb-3">Specifications</h2>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {car.specs.map((spec) => (
                    <div key={spec.label} className="bg-card border rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{spec.label}</p>
                      <p className="font-semibold text-sm">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-3xl font-bold text-[var(--brand-blue)] leading-tight">{car.name}</h1>
              <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]">
                <MapPin className="h-3.5 w-3.5" />{car.city === "batumi" ? "Batumi" : "Tbilisi"}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{car.year}</span>
              {car.seats && <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{car.seats} seats</span>}
            </div>
            {car.description && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{car.description}</p>}

            {/* Pricing */}
            <div className="mt-6 border rounded-xl overflow-hidden">
              {priceTiers.map((tier, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b last:border-0 text-sm">
                  <span className="text-muted-foreground">{tier.label}</span>
                  <span className="font-bold text-xl text-[var(--brand-blue)]">${tier.price}<span className="text-xs font-normal text-muted-foreground ml-1">/day</span></span>
                </div>
              ))}
            </div>

            {/* BOOK button */}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 w-full h-12 rounded-xl bg-[var(--brand-tomato)] text-white font-bold text-base hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <CalendarDays className="h-5 w-5" /> Book this car
              </button>
            )}

            {/* Booking form */}
            {showForm && (
              <form onSubmit={handleSubmit} className="mt-6 border rounded-xl p-5 flex flex-col gap-4 bg-card">
                <h3 className="font-bold text-lg text-[var(--brand-blue)]">Book {car.name}</h3>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" placeholder="Your name" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">Phone / WhatsApp *</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" placeholder="+995 ..." />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">Pickup date *</label>
                    <input required type="date" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))}
                      className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">Return date *</label>
                    <input required type="date" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                      className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">Number of persons</label>
                  <select value={form.persons} onChange={e => setForm(f => ({ ...f, persons: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)]">
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">Additional notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--brand-blue)] resize-none" rows={3}
                    placeholder="Any questions or special requests..." />
                </div>

                {status === "sent" && (
                  <div className="text-green-600 text-sm font-medium text-center py-2">✓ Request sent! We'll contact you soon.</div>
                )}
                {status === "error" && (
                  <div className="text-red-500 text-sm text-center py-2">Something went wrong. Please try again.</div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 h-11 rounded-xl border text-sm font-medium hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={status === "sending"}
                    className="flex-1 h-11 rounded-xl bg-[var(--brand-tomato)] text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                    {status === "sending" ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </SiteLayout>
  );
}
