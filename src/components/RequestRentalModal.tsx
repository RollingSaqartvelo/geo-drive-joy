import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Phone, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Method = "WhatsApp" | "Telegram" | "Phone call";

type Props = {
  trigger: React.ReactNode;
  car?: { name: string; year: number };
};

export function RequestRentalModal({ trigger, car }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [pickup, setPickup] = useState<Date>();
  const [ret, setRet] = useState<Date>();
  const [city, setCity] = useState("");
  const [destination, setDestination] = useState("");
  const [carType, setCarType] = useState("");
  const [comments, setComments] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [methods, setMethods] = useState<Method[]>(["WhatsApp"]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const METHODS: { value: Method; icon: React.ReactNode; labelKey: "whatsapp" | "telegram" | "phone_call" }[] = [
    { value: "WhatsApp", icon: <MessageCircle className="h-4 w-4" />, labelKey: "whatsapp" },
    { value: "Telegram", icon: <Send className="h-4 w-4" />, labelKey: "telegram" },
    { value: "Phone call", icon: <Phone className="h-4 w-4" />, labelKey: "phone_call" },
  ];

  const toggle = (m: Method) =>
    setMethods((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !phone || !pickup || !ret) {
      setError(t("fill_all"));
      return;
    }
    setLoading(true);
    try {
      const lines = car
        ? [
            `🚗 *Бронирование: ${car.name} ${car.year}*`,
            ``,
            `👤 Имя: ${name}`,
            `📞 Телефон: ${phone}`,
            `📅 Дата получения: ${format(pickup, "dd.MM.yyyy")}`,
            `📅 Дата возврата: ${format(ret, "dd.MM.yyyy")}`,
            `💬 Связь: ${methods.join(", ")}`,
          ]
        : [
            `📋 *Новая заявка на аренду*`,
            ``,
            `👤 Имя: ${name}`,
            `📞 Телефон: ${phone}`,
            `📅 Дата получения: ${format(pickup, "dd.MM.yyyy")}`,
            `📅 Дата возврата: ${format(ret, "dd.MM.yyyy")}`,
            `🏙️ Город: ${city}`,
            `🗺️ Куда едет: ${destination}`,
            `🚙 Тип авто: ${carType}`,
            `💬 Связь: ${methods.join(", ")}`,
            comments ? `📝 Комментарий: ${comments}` : "",
          ].filter(Boolean);

      const text = lines.join("\n");
      const res = await fetch(
        `https://api.telegram.org/bot8916742967:AAEN0QNTVWHjRIbKcdLf4ShH8aOaxhsJDQQ/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: 8430276417,
            text,
          }),
        }
      );
      const data = await res.json();
      if (!data.ok) throw new Error(data.description || "Telegram error");
      setDone(true);
    } catch (err) {
      setError((err as Error).message || t("send_error"));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDone(false);
    setName("");
    setPhone("");
    setCity("");
    setDestination("");
    setCarType("");
    setComments("");
    setPickup(undefined);
    setRet(undefined);
    setMethods(["WhatsApp"]);
    setError(null);
  };

  const title = car ? `${t("book_title")} ${car.name} ${car.year}` : t("check_availability");

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 200); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[var(--brand-blue)]">{title}</DialogTitle>
          {!car && <DialogDescription>{t("check_availability_sub")}</DialogDescription>}
        </DialogHeader>

        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center mb-3">
              ✓
            </div>
            <p className="font-medium">{t("thanks")}</p>
            <Button className="mt-6" onClick={() => setOpen(false)}>{t("close")}</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {!car && <Label>{t("q_dates")}</Label>}
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
                    <Calendar mode="single" selected={pickup} onSelect={setPickup} initialFocus className={cn("p-3 pointer-events-auto")} />
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
                    <Calendar mode="single" selected={ret} onSelect={setRet} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {!car && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="city">{t("q_city")}</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="destination">{t("q_destination")}</Label>
                  <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} maxLength={200} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cartype">{t("q_car_type")}</Label>
                  <Input id="cartype" value={carType} onChange={(e) => setCarType(e.target.value)} placeholder={t("q_car_type_ph")} maxLength={100} />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">{t("q_name")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("q_phone")}</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} required />
            </div>

            {!car && (
              <div className="space-y-1.5">
                <Label htmlFor="comments">{t("q_comments")}</Label>
                <Textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} maxLength={1000} rows={3} />
              </div>
            )}

            <div className="space-y-2">
              <Label>{t("q_contact")}</Label>
              <div className="flex flex-wrap gap-2">
                {METHODS.map((m) => {
                  const active = methods.includes(m.value);
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => toggle(m.value)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                          : "bg-background hover:bg-muted"
                      )}
                    >
                      {m.icon}
                      {t(m.labelKey)}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-sm text-[var(--brand-tomato)]">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white text-base font-semibold"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : t("send_request")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}