import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import { LanguageSwitcher, useI18n } from "@/lib/i18n";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-[var(--brand-blue)] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo.url} alt="GEOrent" className="h-24 w-auto" />
            <span className="sr-only">GEOrent</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
              <Link to="/" activeOptions={{ exact: true }} className="px-3 py-2 rounded-md hover:bg-white/10 [&.active]:bg-white/15">{t("nav_home")}</Link>
              <Link to="/cars" className="px-3 py-2 rounded-md hover:bg-white/10 [&.active]:bg-white/15">{t("nav_cars")}</Link>
              <Link to="/tours" className="px-3 py-2 rounded-md hover:bg-white/10 [&.active]:bg-white/15">{t("nav_tours")}</Link>
              <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-white/10 [&.active]:bg-white/15">{t("nav_contact")}</Link>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/995500194533?text=Hello!%20I%20would%20like%20to%20rent%20a%20car."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group"
        aria-label="WhatsApp"
      >
        <span className="flex items-center justify-center w-14 h-14 shrink-0">
          <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
            <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.77L0 32l8.481-2.001A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.856l-.486-.289-5.034 1.187 1.254-4.893-.317-.502A13.27 13.27 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.896.199-.266.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.2-1.681-.62-3.203-1.977-1.184-1.056-1.984-2.36-2.216-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.2-.232.266-.398.399-.664.132-.265.066-.498-.033-.697-.1-.2-.896-2.161-1.228-2.96-.323-.776-.652-.671-.896-.683l-.764-.013c-.265 0-.696.1-1.061.498-.365.398-1.394 1.362-1.394 3.322 0 1.96 1.427 3.854 1.626 4.12.2.265 2.808 4.287 6.803 6.015.951.41 1.693.655 2.272.839.954.303 1.823.26 2.51.158.765-.114 2.354-.963 2.687-1.893.332-.93.332-1.727.232-1.893-.1-.166-.365-.265-.763-.464z"/>
          </svg>
        </span>
        <span className="pr-5 text-sm hidden group-hover:block whitespace-nowrap">Book via WhatsApp</span>
      </a>

      <footer className="bg-[var(--brand-blue-dark)] text-white/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-3 items-center">
          <div className="flex flex-col items-start">
            <img src={logo.url} alt="GEOrent" className="h-80 w-auto -mt-[15px]" />
            <p className="text-sm text-white/70 max-w-xs -mt-2">{t("footer_tagline")}</p>
          </div>
          <div className="text-sm space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-3">{t("footer_contact")}</h4>
            <p>212V Airport Hwy, Batumi 6000, Georgia</p>
            <p><a href="https://wa.me/995500194533" className="hover:text-white">WhatsApp: +995 500 194 533</a></p>
            <p><a href="mailto:rolling_saqartvelo@outlook.com" className="hover:text-white break-all">rolling_saqartvelo@outlook.com</a></p>
          </div>
          <div className="text-sm space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-3">{t("footer_navigate")}</h4>
            <Link to="/" className="block hover:text-white">{t("nav_home")}</Link>
            <Link to="/cars" className="block hover:text-white">{t("nav_cars")}</Link>
            <Link to="/tours" className="block hover:text-white">{t("nav_tours")}</Link>
            <Link to="/contact" className="block hover:text-white">{t("nav_contact")}</Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} GEOrent. All rights reserved.
        </div>
      </footer>

    </div>
  );
}