import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Car Rental in Batumi — FAQ (Insurance, Deposit, Airport) | GEOrent" },
      { name: "description", content: "Answers about renting a car in Batumi, Georgia: prices, deposit, insurance (CASCO), airport delivery, driver age, documents, gravel roads and more." },
    ],
  }),
  component: FaqPage,
});

const FAQ: { q: string; a: string }[] = [
  { q: "Where can I rent a car in Batumi?", a: "GEOrent is a local car rental company in Batumi, Georgia. You can pick up the car at our location or request delivery around the city and to Batumi Airport." },
  { q: "How much does car rental cost in Batumi?", a: "Prices start from $45/day for economy cars and go up to premium SUVs, convertibles and luxury cars. Longer rentals have lower daily rates." },
  { q: "Can I rent a car at Batumi Airport?", a: "Yes. We deliver the car to Batumi Airport for $10 in the daytime and $25 at night." },
  { q: "Do you deliver to Tbilisi Airport?", a: "Yes. Delivery to Tbilisi Airport is $35 in the daytime and $50 at night." },
  { q: "What is the minimum age to rent a car?", a: "Drivers must be at least 21 years old." },
  { q: "How much driving experience do I need?", a: "At least 2 years of driving experience." },
  { q: "Do I need an International Driving Permit (IDP)?", a: "No. A valid national driving license is accepted (for example, an Israeli license). Georgian law allows visitors to drive on their foreign national license." },
  { q: "What documents do I need?", a: "A passport and a physical (plastic) driving license." },
  { q: "Is a deposit required?", a: "Yes. GEOrent requires a refundable security deposit starting from $100, paid in cash and returned when you return the car without new damage." },
  { q: "What is my maximum liability if the car is damaged?", a: "Your maximum liability for damage you are responsible for is $100." },
  { q: "What insurance is included?", a: "All cars include full CASCO insurance. It covers the windshield, windows, mirrors, roof and underbody, and also covers theft of the vehicle. Only the wheels and tires are excluded." },
  { q: "Is damage to another car (third party) covered?", a: "Yes. Our CASCO covers damage you may cause to another vehicle or third-party property the same way it covers our own car, with no additional deductible beyond the $100." },
  { q: "Can I drive on gravel or unpaved roads?", a: "Yes, you may drive on normal, easily passable public gravel or unpaved roads (for example to reach a village, winery or viewpoint), as long as you drive carefully. This does not invalidate the CASCO insurance. Only genuine off-road / 4x4 driving is not covered." },
  { q: "What should I do in case of an accident?", a: "Call the police (112) and contact GEOrent immediately, and do not move the car before the police arrive. Note: if you are at fault, there is a state fine of 250 GEL that is not covered by insurance and is the driver's responsibility." },
  { q: "Do I need to wash the car before returning it?", a: "No. There is no mandatory cleaning fee. A wash fee (from 20 GEL) applies only if the car is returned unusually dirty. If it is returned in normal condition, there is no charge." },
  { q: "How do I pay?", a: "Payment is accepted in cash." },
  { q: "Are the cars automatic?", a: "Yes, our cars have automatic transmission." },
  { q: "Can I pick up the car in Batumi and return it in Tbilisi?", a: "Yes, one-way rental between Batumi and Tbilisi is possible. Contact us on WhatsApp for details." },
  { q: "What are your working hours?", a: "We work every day from 09:00 to 22:00, and reply quickly on WhatsApp." },
];

function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--brand-blue)]">Car Rental in Batumi — FAQ</h1>
        <p className="mt-3 text-muted-foreground">Everything you need to know before renting a car with GEOrent in Batumi, Georgia.</p>
        <div className="mt-8 divide-y rounded-2xl border">
          {FAQ.map(f => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between gap-3">
                {f.q}<span className="text-[var(--brand-blue)] group-open:rotate-45 transition-transform text-xl shrink-0">+</span>
              </summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
