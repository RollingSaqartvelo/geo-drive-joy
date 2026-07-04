import { Crown, Sparkles, Building2, ShieldCheck, Shield, Clock, MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

const VIP_PHOTOS = ["/vip-1.webp", "/vip-2.webp", "/vip-3.webp", "/vip-4.webp", "/vip-5.webp", "/vip-6.webp", "/vip-7.webp"];

const VIP_SERVICES = [
  { icon: Crown, title: "Wedding Cortèges", text: "Breathtaking luxury processions that turn your wedding day into an unforgettable spectacle." },
  { icon: Sparkles, title: "Event & Gala Transfers", text: "Arrive in commanding style at any celebration, premiere, concert or private event." },
  { icon: Building2, title: "Forums & Delegations", text: "Flawless logistics for business forums, conferences and official diplomatic visits." },
  { icon: ShieldCheck, title: "Personal Security", text: "Trained close-protection officers dedicated to individuals, families and their peace of mind." },
  { icon: Shield, title: "VIP Escort", text: "Discreet, professional protection for public figures, executives and high-profile guests." },
  { icon: Clock, title: "24/7 On Call", text: "Anywhere in Georgia, at any hour — always ready, always composed, always one step ahead." },
];

export function VipTransfersSection() {
  return (
    <section className="bg-[var(--brand-blue)] text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
        {/* Heading */}
        <div className="max-w-3xl">
          <p className="uppercase tracking-[0.3em] text-xs text-[var(--brand-tomato)] font-semibold mb-4">Beyond the Wheel</p>
          <h2 className="text-4xl sm:text-6xl font-black leading-[1.05]">
            VIP Transfers <span className="text-[var(--brand-tomato)]">&</span> Executive Protection
          </h2>
          <p className="mt-6 text-lg text-white/80 leading-relaxed">
            When the moment cannot be left to chance, we step in. From the breathless glamour of your wedding day
            to high-stakes forums, private events and diplomatic visits — we deliver far more than a vehicle.
            We deliver presence, discretion and absolute peace of mind.
          </p>
          <p className="mt-5 text-lg text-white/90 leading-relaxed font-medium">
            We don't simply do a job. We are a professional protection and escort team — trained, discreet and
            unwavering — entrusted with safeguarding the people who matter most. Your safety. Your image.
            Your moment. Handled flawlessly, every time.
          </p>
        </div>

        {/* Services */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VIP_SERVICES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.07] hover:border-[var(--brand-tomato)]/40 transition-colors">
              <div className="h-12 w-12 rounded-xl bg-[var(--brand-tomato)]/15 text-[var(--brand-tomato)] flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Gallery */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {VIP_PHOTOS.map((src, i) => (
            <div key={src} className={`overflow-hidden rounded-xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
              <img src={src} alt="VIP transfer" loading="lazy" decoding="async"
                className="h-full w-full object-cover aspect-square hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[var(--brand-tomato)]/20 to-transparent border border-[var(--brand-tomato)]/30 p-8">
          <div>
            <h3 className="text-2xl font-black">Ready when you are.</h3>
            <p className="mt-2 text-white/80">Tell us the occasion — we'll handle every detail, discreetly.</p>
          </div>
          <a
            href="https://wa.me/995500194533?text=Hello!%20I%20would%20like%20to%20request%20VIP%20transfer%20%2F%20security%20service."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source: "vip_section" })}
            className="shrink-0 inline-flex items-center gap-2 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-[var(--brand-blue)] font-bold rounded-full px-7 h-14 text-base transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            Request VIP Service
          </a>
        </div>
      </div>
    </section>
  );
}
