import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/rental-conditions")({
  head: () => ({
    meta: [
      { title: "Rental Conditions — Car Rental in Batumi, Georgia | GEOrent" },
      { name: "description", content: "GEOrent rental conditions in Batumi: driver age 21+, 2+ years experience, refundable deposit from $100, full CASCO insurance, cash payment, airport delivery." },
    ],
  }),
  component: ConditionsPage,
});

const SECTIONS: { title: string; items: string[] }[] = [
  { title: "Driver requirements", items: ["Minimum age: 21 years", "Driving experience: 2+ years", "Documents: passport + physical driving license", "Foreign national licenses accepted (e.g. Israeli) — no International Driving Permit required"] },
  { title: "Deposit & liability", items: ["Refundable security deposit from $100 (paid in cash)", "Maximum renter liability for damage at fault: $100", "State fine of 250 GEL in an at-fault accident is not covered by insurance"] },
  { title: "Insurance (CASCO)", items: ["Full CASCO included on all cars", "Covers windshield, windows, mirrors, roof and underbody", "Covers theft of the vehicle", "Third-party damage covered with no extra deductible", "Only wheels and tires are excluded", "Valid on paved and normal passable gravel/unpaved roads; genuine off-road / 4x4 not covered"] },
  { title: "Payment", items: ["Cash"] },
  { title: "Delivery", items: ["Batumi Airport: $10 daytime, $25 at night", "Tbilisi Airport: $35 daytime, $50 at night", "Batumi city delivery: on request", "One-way Batumi ↔ Tbilisi rental available on request"] },
  { title: "Return & cleaning", items: ["No mandatory cleaning fee", "Wash fee (from 20 GEL) only if the car is returned unusually dirty", "In an accident: call police (112) and GEOrent, do not move the car"] },
];

function ConditionsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--brand-blue)]">Rental Conditions</h1>
        <p className="mt-3 text-muted-foreground">Transparent terms for renting a car with GEOrent in Batumi, Georgia. Questions? See our <Link to="/faq" className="text-[var(--brand-blue)] underline">FAQ</Link> or message us on WhatsApp.</p>
        <div className="mt-8 space-y-6">
          {SECTIONS.map(s => (
            <div key={s.title} className="rounded-2xl border p-6">
              <h2 className="text-xl font-black text-[var(--brand-blue)] mb-4">{s.title}</h2>
              <ul className="space-y-2.5">
                {s.items.map(i => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center"><Check className="h-3.5 w-3.5" /></span>
                    <span className="text-muted-foreground">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
