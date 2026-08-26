import { Link } from "@tanstack/react-router";
import { MessageCircle, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { RequestRentalModal } from "@/components/RequestRentalModal";
import { Button } from "@/components/ui/button";
import { CARS } from "@/routes/cars";
import { trackWhatsAppClick } from "@/lib/analytics";

const WA = "https://wa.me/995500194533?text=Hello!%20I%20would%20like%20to%20rent%20a%20car%20in%20Batumi.";

type Lang = "en" | "ru";

const CONTENT: Record<Lang, {
  h1: string; intro: string; whyTitle: string; why: string[];
  carsTitle: string; from: string; day: string;
  deliveryTitle: string; deliveryRows: [string, string][];
  condTitle: string; cond: string[];
  faqTitle: string; faq: { q: string; a: string }[];
  ctaTitle: string; ctaText: string; ctaBtn: string; browse: string;
}> = {
  en: {
    h1: "Car Rental in Batumi, Georgia",
    intro: "GEOrent is a local car rental service in Batumi, Georgia. Rent reliable, well-maintained cars for daily trips, vacations and travel across Georgia — from $45/day, with airport delivery, full insurance and fast WhatsApp booking.",
    whyTitle: "Why rent with GEOrent?",
    why: [
      "50+ cars in Batumi — SUVs, sedans, minivans, convertibles",
      "Delivery to Batumi Airport and around the city",
      "Fully insured vehicles (CASCO)",
      "Transparent conditions, no hidden fees",
      "Automatic transmission, daily and long-term rental",
      "Fast WhatsApp support, pickup and return in Batumi",
    ],
    carsTitle: "Cars available in Batumi",
    from: "from", day: "/day",
    deliveryTitle: "Delivery & prices",
    deliveryRows: [
      ["Batumi Airport (daytime)", "$10"],
      ["Batumi Airport (night)", "$25"],
      ["Tbilisi Airport (daytime)", "$35"],
      ["Tbilisi Airport (night)", "$50"],
      ["Batumi city delivery", "on request"],
    ],
    condTitle: "Rental conditions",
    cond: [
      "Minimum age: 21 years",
      "Driving experience: 2+ years",
      "Refundable deposit from $100",
      "Payment: cash",
      "Documents: passport + physical driving license",
      "Insurance: CASCO included",
    ],
    faqTitle: "Frequently Asked Questions",
    faq: [
      { q: "Where can I rent a car in Batumi?", a: "GEOrent provides car rental in Batumi, Georgia, with pickup at our location and delivery options around the city and to Batumi Airport." },
      { q: "Can I rent a car at Batumi Airport?", a: "Yes. We deliver your car to Batumi Airport for $10 in the daytime and $25 at night." },
      { q: "Do you deliver to Tbilisi Airport?", a: "Yes. Delivery to Tbilisi Airport is $35 in the daytime and $50 at night." },
      { q: "How much is car rental in Batumi?", a: "Prices start from $45/day for economy cars and go up to premium SUVs and convertibles. Longer rentals get lower daily rates." },
      { q: "Do you require a deposit?", a: "Yes, GEOrent requires a refundable deposit starting from $100." },
      { q: "What age do I need to be?", a: "Drivers must be at least 21 years old." },
      { q: "How much driving experience do I need?", a: "At least 2 years of driving experience." },
      { q: "What insurance is included?", a: "All cars include CASCO insurance." },
      { q: "How do I pay?", a: "Payment is accepted in cash." },
      { q: "Can I pick up in Batumi and return in Tbilisi?", a: "Yes, one-way rental between Batumi and Tbilisi is possible — contact us on WhatsApp for details." },
    ],
    ctaTitle: "Book your car in Batumi",
    ctaText: "Message us on WhatsApp — we reply in minutes.",
    ctaBtn: "Book on WhatsApp",
    browse: "Browse all cars",
  },
  ru: {
    h1: "Прокат автомобилей в Батуми, Грузия",
    intro: "GEOrent — местный прокат автомобилей в Батуми, Грузия. Арендуйте надёжные, ухоженные машины для поездок, отдыха и путешествий по Грузии — от $45 в день, с доставкой в аэропорт, полной страховкой и быстрым бронированием в WhatsApp.",
    whyTitle: "Почему GEOrent?",
    why: [
      "Более 50 авто в Батуми — внедорожники, седаны, минивэны, кабрио",
      "Доставка в аэропорт Батуми и по городу",
      "Полностью застрахованные авто (КАСКО)",
      "Прозрачные условия, без скрытых платежей",
      "Автоматическая коробка, посуточно и на долгий срок",
      "Быстрая поддержка в WhatsApp, выдача и возврат в Батуми",
    ],
    carsTitle: "Автомобили в Батуми",
    from: "от", day: "/день",
    deliveryTitle: "Доставка и цены",
    deliveryRows: [
      ["Аэропорт Батуми (днём)", "$10"],
      ["Аэропорт Батуми (ночью)", "$25"],
      ["Аэропорт Тбилиси (днём)", "$35"],
      ["Аэропорт Тбилиси (ночью)", "$50"],
      ["Доставка по Батуми", "по запросу"],
    ],
    condTitle: "Условия аренды",
    cond: [
      "Минимальный возраст: 21 год",
      "Стаж вождения: от 2 лет",
      "Возвращаемый депозит от $100",
      "Оплата: наличные",
      "Документы: паспорт + физические водительские права",
      "Страховка: КАСКО включена",
    ],
    faqTitle: "Частые вопросы",
    faq: [
      { q: "Где арендовать машину в Батуми?", a: "GEOrent сдаёт автомобили в аренду в Батуми, Грузия — выдача у нас и доставка по городу и в аэропорт Батуми." },
      { q: "Можно взять авто в аэропорту Батуми?", a: "Да. Доставка авто в аэропорт Батуми — $10 днём и $25 ночью." },
      { q: "Есть доставка в аэропорт Тбилиси?", a: "Да. Доставка в аэропорт Тбилиси — $35 днём и $50 ночью." },
      { q: "Сколько стоит прокат авто в Батуми?", a: "Цены начинаются от $45 в день за эконом и выше — для премиум-внедорожников и кабрио. На длительный срок дневная ставка ниже." },
      { q: "Нужен ли депозит?", a: "Да, требуется возвращаемый депозит от $100." },
      { q: "Какой нужен возраст?", a: "Водителю должно быть не менее 21 года." },
      { q: "Какой нужен стаж вождения?", a: "Не менее 2 лет стажа." },
      { q: "Какая страховка включена?", a: "Все авто идут с КАСКО." },
      { q: "Как оплатить?", a: "Оплата принимается наличными." },
      { q: "Можно взять в Батуми, а вернуть в Тбилиси?", a: "Да, аренда в одну сторону между Батуми и Тбилиси возможна — уточните детали в WhatsApp." },
    ],
    ctaTitle: "Забронируйте авто в Батуми",
    ctaText: "Напишите нам в WhatsApp — отвечаем за минуты.",
    ctaBtn: "Бронь в WhatsApp",
    browse: "Смотреть все авто",
  },
};

export function BatumiLanding({ lang }: { lang: Lang }) {
  const c = CONTENT[lang];
  const cars = CARS.filter(car => car.city === "batumi").slice(0, 9);
  const priceOf = (car: typeof CARS[number]) =>
    car.tiers && car.tiers.length ? car.tiers[car.tiers.length - 1].price : car.price;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SiteLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--brand-blue)] leading-tight">{c.h1}</h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-3xl">{c.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <RequestRentalModal trigger={
            <Button className="h-12 px-7 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white font-semibold rounded-full">{c.ctaBtn}</Button>
          } />
          <Link to="/cars"><Button variant="outline" className="h-12 px-7 rounded-full font-semibold">{c.browse}</Button></Link>
        </div>

        {/* Why */}
        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">{c.whyTitle}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {c.why.map(w => (
            <li key={w} className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center"><Check className="h-3.5 w-3.5" /></span>
              <span className="text-muted-foreground">{w}</span>
            </li>
          ))}
        </ul>

        {/* Cars */}
        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">{c.carsTitle}</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map(car => (
            <Link key={car.slug} to="/car/$slug" params={{ slug: car.slug }} className="group rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                {car.images?.[0]?.url && <img src={car.images[0].url} alt={`${car.name} rental in Batumi`} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition-transform" />}
              </div>
              <div className="p-4">
                <p className="font-bold text-[var(--brand-blue)]">{car.name}</p>
                <p className="text-sm text-muted-foreground">{c.from} ${priceOf(car)}{c.day}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Delivery */}
        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">{c.deliveryTitle}</h2>
        <div className="mt-5 rounded-2xl border overflow-hidden max-w-xl">
          {c.deliveryRows.map(([label, price], i) => (
            <div key={label} className={`flex items-center justify-between px-5 py-3 ${i % 2 ? "bg-muted/40" : ""}`}>
              <span className="text-muted-foreground">{label}</span>
              <span className="font-bold text-[var(--brand-blue)]">{price}</span>
            </div>
          ))}
        </div>

        {/* Conditions */}
        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">{c.condTitle}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {c.cond.map(x => (
            <li key={x} className="flex items-start gap-3">
              <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] flex items-center justify-center"><Check className="h-3.5 w-3.5" /></span>
              <span className="text-muted-foreground">{x}</span>
            </li>
          ))}
        </ul>

        {/* FAQ */}
        <h2 className="mt-14 text-2xl font-black text-[var(--brand-blue)]">{c.faqTitle}</h2>
        <div className="mt-5 divide-y rounded-2xl border">
          {c.faq.map(f => (
            <details key={f.q} className="group px-5 py-4">
              <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between">
                {f.q}<span className="text-[var(--brand-blue)] group-open:rotate-45 transition-transform text-xl">+</span>
              </summary>
              <p className="mt-2 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-3xl bg-[var(--brand-blue)] text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black">{c.ctaTitle}</h2>
            <p className="mt-1 text-white/80">{c.ctaText}</p>
          </div>
          <a href={WA} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick({ source: `batumi_landing_${lang}` })}
            className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-full px-7 h-14 transition-colors">
            <MessageCircle className="h-5 w-5" /> {c.ctaBtn}
          </a>
        </div>
      </div>
    </SiteLayout>
  );
}
