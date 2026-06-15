import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Phone, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Method = "WhatsApp" | "Telegram" | "Phone call";
const METHODS: { value: Method; icon: React.ReactNode }[] = [
  { value: "WhatsApp", icon: <MessageCircle className="h-4 w-4" /> },
  { value: "Telegram", icon: <Send className="h-4 w-4" /> },
  { value: "Phone call", icon: <Phone className="h-4 w-4" /> },
];

export function RequestRentalModal({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pickup, setPickup] = useState<Date>();
  const [ret, setRet] = useState<Date>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [methods, setMethods] = useState<Method[]>(["WhatsApp"]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (m: Method) =>
    setMethods((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !phone || !pickup || !ret) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/ROLLING_SAQARTVELO@OUTLOOK.COM", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "New GEOrent Rental Request",
          name,
          phone,
          pickup_date: format(pickup, "yyyy-MM-dd"),
          return_date: format(ret, "yyyy-MM-dd"),
          preferred_contact: methods.join(", "),
        }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setDone(true);
    } catch {
      setError("Could not send. Please try WhatsApp instead.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDone(false);
    setName("");
    setPhone("");
    setPickup(undefined);
    setRet(undefined);
    setMethods(["WhatsApp"]);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setTimeout(reset, 200); }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[var(--brand-blue)]">Request a Rental</DialogTitle>
          <DialogDescription>We'll get back to you within minutes.</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center mb-3">
              ✓
            </div>
            <p className="font-medium">Thank you! We'll contact you shortly.</p>
            <Button className="mt-6" onClick={() => setOpen(false)}>Close</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Pick-up date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className={cn("w-full justify-start font-normal", !pickup && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickup ? format(pickup, "MMM d") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={pickup} onSelect={setPickup} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label>Return date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button type="button" variant="outline" className={cn("w-full justify-start font-normal", !ret && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {ret ? format(ret, "MMM d") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={ret} onSelect={setRet} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Your phone number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} required />
            </div>

            <div className="space-y-2">
              <Label>Preferred contact method</Label>
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
                      {m.value}
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
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Request"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}