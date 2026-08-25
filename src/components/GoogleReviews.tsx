import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

// Ключ Google Places (New). Создаётся в Google Cloud, ограничивается по домену geo-rent.com.
// Кладётся в переменную окружения VITE_GOOGLE_PLACES_KEY (в Lovable → Project → Env).
const KEY = import.meta.env.VITE_GOOGLE_PLACES_KEY as string | undefined;
const PLACE_QUERY = "GEOrent car rental Batumi Georgia";
const MAPS_URL = "https://maps.app.goo.gl/bAU4wYApNtH1naF58";

type Review = {
  rating: number;
  when: string;
  author: string;
  photo?: string;
  originalText: string;
  originalLang: string;
  translatedText?: string;
};

const Stars = ({ n }: { n: number }) => (
  <span className="text-amber-400 text-sm" aria-label={`${n} / 5`}>
    {"★".repeat(Math.round(n))}<span className="text-gray-300">{"★".repeat(5 - Math.round(n))}</span>
  </span>
);

export function GoogleReviews() {
  const { t } = useI18n();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [showOriginal, setShowOriginal] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!KEY) return;
    let alive = true;
    (async () => {
      try {
        const s = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "places.id" },
          body: JSON.stringify({ textQuery: PLACE_QUERY }),
        }).then(r => r.json());
        const id = s?.places?.[0]?.id;
        if (!id) return;
        const d = await fetch(`https://places.googleapis.com/v1/places/${id}`, {
          headers: { "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "rating,userRatingCount,reviews" },
        }).then(r => r.json());
        if (!alive) return;
        setRating(d?.rating ?? null);
        setTotal(d?.userRatingCount ?? null);
        const list: Review[] = (d?.reviews || []).map((r: any) => ({
          rating: r.rating || 5,
          when: r.relativePublishTimeDescription || "",
          author: r.authorAttribution?.displayName || "Guest",
          photo: r.authorAttribution?.photoUri,
          originalText: r.originalText?.text || r.text?.text || "",
          originalLang: r.originalText?.languageCode || r.text?.languageCode || "",
          translatedText: r.text?.text && r.text?.text !== r.originalText?.text ? r.text.text : undefined,
        })).filter((r: Review) => r.originalText);
        setReviews(list);
      } catch { /* fallback CTA */ }
    })();
    return () => { alive = false; };
  }, []);

  // Фолбэк: ключа нет или отзывы не загрузились — карточка со ссылкой на Google
  if (!KEY || (reviews && reviews.length === 0) || reviews === null) {
    return (
      <div className="rounded-2xl border shadow-sm bg-card p-8 flex flex-col justify-center items-start">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl font-black text-[var(--brand-blue)]">{rating ? rating.toFixed(1) : "5.0"}</span>
          <Stars n={rating || 5} />
        </div>
        <p className="text-muted-foreground mb-6">{t("reviews_body")}</p>
        <div className="flex flex-wrap gap-3">
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            <Button className="h-12 px-6 bg-[var(--brand-blue)] hover:bg-[var(--brand-blue)]/90 text-white font-semibold rounded-full">{t("reviews_read")}</Button>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-12 px-6 rounded-full font-semibold">{t("reviews_write")}</Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black text-[var(--brand-blue)]">{rating?.toFixed(1) ?? "5.0"}</span>
          <div>
            <Stars n={rating || 5} />
            {total != null && <p className="text-xs text-muted-foreground">{total} Google reviews</p>}
          </div>
        </div>
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="rounded-full font-semibold">{t("reviews_read")}</Button>
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-2xl border shadow-sm bg-card p-5 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              {r.photo
                ? <img src={r.photo} alt={r.author} className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                : <span className="h-9 w-9 rounded-full bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] flex items-center justify-center font-bold">{r.author[0]}</span>}
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{r.author}</p>
                <p className="text-xs text-muted-foreground">{r.when}</p>
              </div>
            </div>
            <Stars n={r.rating} />
            <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">
              {showOriginal[i] || !r.translatedText ? r.originalText : r.translatedText}
            </p>
            {r.translatedText && (
              <button onClick={() => setShowOriginal(s => ({ ...s, [i]: !s[i] }))}
                className="mt-2 text-xs font-medium text-[var(--brand-blue)] hover:underline self-start">
                {showOriginal[i] ? t("reviews_show_translated") : `${t("reviews_show_original")} (${r.originalLang.toUpperCase()})`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
