import { createFileRoute } from "@tanstack/react-router";
import { Car, Map, MapPin } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { RequestRentalModal } from "@/components/RequestRentalModal";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import hero from "@/assets/hero.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GEOrent — Premium Car Rental in Batumi, Georgia" },
      { name: "description", content: "Premium car rental in Batumi & across Georgia. Mustang, Range Rover, Discovery. Tours & transfers." },
      { property: "og:title", content: "GEOrent — Premium Car Rental in Georgia" },
      { property: "og:description", content: "Rent premium cars in Batumi & Tbilisi." },
      { property: "og:image", content: hero.url },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[calc(100vh-4rem)] min-h-[560px] w-full overflow-hidden">
        <img src={hero.url} alt="Premium car on a Georgian mountain road" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-blue)]/85 via-[var(--brand-blue)]/55 to-black/40" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 h-full flex flex-col justify-center text-white">
          <p className="uppercase tracking-[0.25em] text-xs sm:text-sm text-white/80 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">GEOrent</p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t("hero_title")}
          </h1>
          <p className="mt-6 text-lg sm:text-2xl text-white/85 max-w-xl">
            {t("hero_subtitle")}
          </p>
          <div className="mt-10">
            <RequestRentalModal
              trigger={
                <Button className="h-14 px-10 text-base font-bold tracking-wide bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white rounded-full shadow-2xl shadow-black/30">
                  {t("request_rental").toUpperCase()}
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { Icon: Car, titleKey: "feature_fleet_title", bodyKey: "feature_fleet_body" },
              { Icon: Map, titleKey: "feature_tours_title", bodyKey: "feature_tours_body" },
              { Icon: MapPin, titleKey: "feature_offices_title", bodyKey: "feature_offices_body" },
            ].map(({ Icon, titleKey, bodyKey }) => (
              <div key={titleKey} className="rounded-2xl border bg-card p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="h-14 w-14 rounded-xl bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[var(--brand-blue)] mb-2">{t(titleKey)}</h3>
                <p className="text-muted-foreground">{t(bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rental Terms */}
      <section className="py-20 sm:py-24 bg-[var(--brand-blue)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-white/50 mb-4">Conditions</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>
            {t("terms_title")}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--brand-gold,#c9a84c)]" />
            <span className="text-[var(--brand-gold,#c9a84c)] text-xl">✦</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--brand-gold,#c9a84c)]" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {[
              { icon: "🪪", titleKey: "term_exp", subKey: "term_exp_sub" },
              { icon: "🎂", titleKey: "term_age", subKey: "term_age_sub" },
              { icon: "💵", titleKey: "term_deposit", subKey: "term_deposit_sub" },
              { icon: "💴", titleKey: "term_cash", subKey: "term_cash_sub" },
            ].map(({ icon, titleKey, subKey }) => (
              <div key={titleKey} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                <span className="text-2xl shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-white">{t(titleKey)}</p>
                  <p className="text-sm text-white/60 mt-0.5">{t(subKey)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-4 bg-amber-500/10 border border-amber-400/30 rounded-xl p-5 max-w-2xl mx-auto text-left">
            <span className="text-2xl shrink-0">📋</span>
            <div>
              <p className="font-bold text-amber-300">{t("term_license")}</p>
              <p className="text-sm text-white/70 mt-0.5">{t("term_license_sub")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-[var(--brand-blue-dark,#0f1729)] text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">{t("cta_title")}</h2>
            <p className="text-white/90 mt-2 text-sm font-medium">{t("cta_insurance")}</p>
            <p className="text-white/60 mt-1 text-sm">{t("cta_sub")}</p>
          </div>
          <RequestRentalModal
            trigger={
              <Button className="h-12 px-8 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white font-semibold rounded-full">
                {t("request_rental")}
              </Button>
            }
          />
        </div>
      </section>
    </SiteLayout>
  );
}
