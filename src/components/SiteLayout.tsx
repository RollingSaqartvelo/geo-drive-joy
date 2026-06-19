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

      <footer className="bg-[var(--brand-blue-dark)] text-white/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-3">
          <div>
            <img src={logo.url} alt="GEOrent" className="h-40 w-auto mb-4 -mt-[5px]" />
            <p className="text-sm text-white/70 max-w-xs">Premium car rental & tours across Georgia.</p>
          </div>
          <div className="text-sm space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-3">Contact</h4>
            <p>212V Airport Hwy, Batumi 6000, Georgia</p>
            <p><a href={WA} className="hover:text-white">WhatsApp: +995 500 194 533</a></p>
            <p><a href="mailto:rolling_saqartvelo@outlook.com" className="hover:text-white break-all">rolling_saqartvelo@outlook.com</a></p>
          </div>
          <div className="text-sm space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-3">Navigate</h4>
            <Link to="/" className="block hover:text-white">Home</Link>
            <Link to="/cars" className="block hover:text-white">Cars</Link>
            <Link to="/tours" className="block hover:text-white">Tours & Excursions</Link>
            <Link to="/contact" className="block hover:text-white">Contact & Book</Link>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} GEOrent. All rights reserved.
        </div>
      </footer>

    </div>
  );
}