import { useState } from "react";
import { FileText, X, ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Плавающая кнопка «Условия аренды» — следует за скроллом (fixed).
 * Клик разворачивает панель с условиями; крестик сворачивает обратно в кнопку.
 */
export function RentalTermsButton() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const terms = [
    { icon: "🪪", title: t("term_exp"), sub: t("term_exp_sub") },
    { icon: "🎂", title: t("term_age"), sub: t("term_age_sub") },
    { icon: "💵", title: t("term_deposit"), sub: t("term_deposit_sub") },
    { icon: "💴", title: t("term_cash"), sub: t("term_cash_sub") },
    { icon: "📋", title: t("term_license"), sub: t("term_license_sub") },
  ];

  return (
    <div className="fixed left-6 top-2/3 -translate-y-1/2 z-50">
      {open ? (
        <div className="w-[320px] max-w-[calc(100vw-3rem)] rounded-2xl bg-[var(--brand-blue)] text-white shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="font-bold text-sm">{t("terms_title")}</span>
            <button onClick={() => setOpen(false)} aria-label="Свернуть"
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3 space-y-2 max-h-[65vh] overflow-y-auto">
            {terms.map(term => (
              <div key={term.title} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="text-xl shrink-0">{term.icon}</span>
                <div>
                  <p className="font-bold text-sm leading-tight">{term.title}</p>
                  <p className="text-xs text-white/60 mt-0.5">{term.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="relative">
            {/* пульсирующее свечение */}
            <span className="pointer-events-none absolute inset-0 rounded-full bg-[var(--brand-tomato)] opacity-60 animate-ping" />
            <button onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 bg-[var(--brand-tomato)] text-[var(--brand-blue)] font-extrabold rounded-full shadow-2xl px-5 h-12 text-sm ring-2 ring-white/70 hover:scale-105 active:scale-95 transition-transform"
              style={{ boxShadow: "0 0 22px 4px rgba(201,168,76,0.65)" }}>
              <FileText className="h-4 w-4" />
              {t("terms_title")}
            </button>
          </div>
          {/* стрелка, указывающая на кнопку */}
          <ArrowLeft className="h-8 w-8 text-[var(--brand-tomato)] animate-bounce drop-shadow" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
