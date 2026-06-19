import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Users, MessageCircle, Send } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { CARS } from "./cars";

export const Route = createFileRoute("/cars/$slug")({
  component: CarDetailPage,
});

const WA_BASE = "https://wa.me/995500194533";
const TG = "https://t.me/+995500194533";

function CarDetailPage() {
  const { slug } = Route.useParams();
  const car = CARS.find((c) => c.slug === slug);
  const [mainIdx, setMainIdx] = useState(0);

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
  const thumbRows: typeof images[] = [];
  if (images.length > 0) {
    thumbRows.push(images.slice(0, 4));
    if (images.length > 4) thumbRows.push(images.slice(4, 8));
  }

  const priceTiers = car.tiers ?? [{ label: "Per day", price: car.price }];

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <Link
          to="/cars"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Cars
        </Link>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* LEFT: Gallery */}
          <div>
            {/* First row thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {images.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainIdx(i)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      mainIdx === i
                        ? "border-[var(--brand-blue)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${car.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main hero image */}
            {mainImage && (
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={mainImage.url}
                  alt={car.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Second row thumbnails if more than 4 photos */}
            {images.length > 4 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.slice(4).map((img, i) => (
                  <button
                    key={i + 4}
                    onClick={() => setMainIdx(i + 4)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                      mainIdx === i + 4
                        ? "border-[var(--brand-blue)] opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${car.name} ${i + 5}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info panel */}
          <div className="lg:sticky lg:top-24">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-3xl font-bold text-[var(--brand-blue)] leading-tight">
                {car.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]">
                <MapPin className="h-3.5 w-3.5" />
                {car.city === "batumi" ? "Batumi" : "Tbilisi"}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />{car.year}
              </span>
              {car.seats && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4" />{car.seats} seats
                </span>
              )}
            </div>

            {car.description && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {car.description}
              </p>
            )}

            {/* Pricing table */}
            <div className="mt-6 border rounded-xl overflow-hidden">
              {priceTiers.map((tier, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-3.5 border-b last:border-0 text-sm"
                >
                  <span className="text-muted-foreground">{tier.label}</span>
                  <span className="font-bold text-xl text-[var(--brand-blue)]">
                    ${tier.price}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/day</span>
                  </span>
                </div>
              ))}
            </div>

            {/* Book buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={`${WA_BASE}?text=Hello! I want to book ${encodeURIComponent(car.name)} (${car.year})`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#25D366] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="h-5 w-5" /> Book via WhatsApp
              </a>
              <a
                href={TG}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-[#2AABEE] text-white font-semibold hover:opacity-90 transition-opacity"
              >
                <Send className="h-5 w-5" /> Book via Telegram
              </a>
            </div>
          </div>
        </div>

        {/* Specs grid */}
        {car.specs && car.specs.length > 0 && (
          <div className="mt-14 border-t pt-10">
            <h2 className="text-2xl font-bold mb-6">Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {car.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="bg-card border rounded-xl p-5 text-center"
                >
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    {spec.label}
                  </p>
                  <p className="font-semibold text-sm">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
