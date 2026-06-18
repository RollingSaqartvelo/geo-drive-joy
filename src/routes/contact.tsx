import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Phone, MessageCircle, Send, MapPin, Clock } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const WA = "https://wa.me/995500194533";
const TG = "https://t.me/+995500194533";
type Method = "WhatsApp" | "Telegram" | "Phone call";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book — GEOrent" },
      { name: "description", content: "Book a premium rental car in Batumi or Tbilisi. Contact GEOrent via WhatsApp or fill in the form." },
      { property: "og:title", content: "Contact & Book — GEOrent" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  const [pickup, setPickup] = useState<Date>();
  const [ret, setRet] = useState<Date>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [destination, setDestination] = useState("");
  const [carType, setCarType] = useState("");
  const [methods, setMethods] = useState<Method[]>(["WhatsApp"]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (m: Method) =>
    setMethods((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]));

  const METHODS: { value: Method; icon: React.ReactNode; label: string }[] = [
    { value: "WhatsApp", icon: <MessageCircle className="h-4 w-4" />, label: "WhatsApp" },
    { value: "Telegram", icon: <Send className="h-4 w-4" />, label: "Telegram" },
    { value: "Phone call", icon: <Phone className="h-4 w-4" />, label: t("phone_call") },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !phone) { setError(t("fill_all")); return; }
    setLoading(true);
    try {
      const lines = [
        `📋 *Новая заявка с /contact*`,
        ``,
        `👤 Имя: ${name}`,
        `📞 Телефон: ${phone}`,
        pickup ? `📅 Дата получения: ${format(pickup, "dd.MM.yyyy")}` : "",
        ret ? `📅 Дата возврата: ${format(ret, "dd.MM.yyyy")}` : "",
        city ? `🏙️ Город: ${city}` : "",
        destination ? `🗺️ Куда едет: ${destination}` : "",
        carType ? `🚙 Тип авто: ${carType}` : "",
        `💬 Связь: ${methods.join(", ")}`,
      ].filter(Boolean);

      const res = await fetch(
        `https://api.telegram.org/bot8916742967:AAEN0QNTVWHjRIbKcdLf4ShH8aOaxhsJDQQ/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: 8430276417, text: lines.join("\n") }),
        }
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.description);
      setDone(true);
    } catch (err) {
      setError((err as Error).message || t("send_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[var(--brand-blue)] text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="uppercase tracking-[0.25em] text-xs text-white/70 mb-3">GEOrent</p>
          <h1 className="text-4xl sm:text-6xl font-black">Book Your Car</h1>
          <p className="mt-4 text-white/80 max-w-xl">Fill in the form or contact us directly on WhatsApp — we respond fast.</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-12 lg:grid-cols-2">

          {/* Form */}
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            {done ? (
              <div className="py-12 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center mb-4 text-2xl">✓</div>
                <h2 className="text-2xl font-bold text-[var(--brand-blue)] mb-2">{t("thanks")}</h2>
                <Button className="mt-6 bg-[var(--brand-blue)]" onClick={() => setDone(false)}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <h2 className="text-2xl font-bold text-[var(--brand-blue)] mb-6">{t("check_availability")}</h2>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{t("pickup_date")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className={cn("w-full justify-start font-normal", !pickup && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {pickup ? format(pickup, "MMM d") : t("pick_date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={pickup} onSelect={setPickup} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">{t("return_date")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className={cn("w-full justify-start font-normal", !ret && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {ret ? format(ret, "MMM d") : t("pick_date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={ret} onSelect={setRet} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-name">{t("q_name")} *</Label>
                  <Input id="c-name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-phone">{t("q_phone")} *</Label>
                  <Input id="c-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-city">{t("q_city")}</Label>
                  <Input id="c-city" value={city} onChange={e => setCity(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-dest">{t("q_destination")}</Label>
                  <Input id="c-dest" value={destination} onChange={e => setDestination(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-car">{t("q_car_type")}</Label>
                  <Input id="c-car" value={carType} onChange={e => setCarType(e.target.value)} placeholder={t("q_car_type_ph")} />
                </div>

                <div className="space-y-2">
                  <Label>{t("q_contact")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {METHODS.map((m) => (
                      <button key={m.value} type="button" onClick={() => toggle(m.value)}
                        className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                          methods.includes(m.value) ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]" : "bg-background hover:bg-muted")}>
                        {m.icon}{m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" disabled={loading}
                  className="w-full h-12 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white text-base font-semibold">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t("send_request")}
                </Button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-[var(--brand-blue)] mb-6">Contact Us</h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[var(--brand-blue)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Batumi Office</p>
                    <p>212V Airport Hwy, Batumi 6000, Georgia</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[var(--brand-blue)] shrink-0" />
                  <a href="tel:+995500194533" className="hover:text-foreground">+995 500 194 533</a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--brand-blue)] shrink-0" />
                  <p>7 days a week, 09:00 – 21:00</p>
                </div>
              </div>
            </div>

            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-[#25D366] text-white px-6 py-5 hover:opacity-90 transition-opacity">
              <MessageCircle className="h-8 w-8 shrink-0" />
              <div>
                <p className="font-bold text-lg">WhatsApp</p>
                <p className="text-white/85 text-sm">+995 500 194 533 — reply in minutes</p>
              </div>
            </a>

            <a href={TG} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-[#2AABEE] text-white px-6 py-5 hover:opacity-90 transition-opacity">
              <Send className="h-8 w-8 shrink-0" />
              <div>
                <p className="font-bold text-lg">Telegram</p>
                <p className="text-white/85 text-sm">+995 500 194 533 — write anytime</p>
              </div>
            </a>
          </div>

        </div>
      </section>
    </SiteLayout>
  );
}
