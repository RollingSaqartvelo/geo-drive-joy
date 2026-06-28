// Google Ads + GA4 conversion tracking.
// Base tags (AW-18241492414, G-FDQ4E2400V) are loaded in routes/__root.tsx.
//
// HOW TO FINISH SETUP (one manual step in Google Ads):
//   Цели → Конверсии → + Новое действие-конверсия → «Вручную с помощью кода» (Веб-сайт).
//   Создай ДВА действия:
//     1) "Заявка на аренду"  (категория: Отправка формы / Lead)
//     2) "Клик WhatsApp"     (категория: Контакт / Lead)
//   У каждого Google выдаст строку send_to вида:  AW-18241492414/AbC-D_efGh12...
//   Вставь label (часть после слэша) в AD_CONVERSIONS ниже.
// Пока label пустой — событие уходит только в GA4 (Google Ads-конверсия не дублируется).

const GOOGLE_ADS_ID = "AW-18241492414";

const AD_CONVERSIONS = {
  // вставь сюда label из Google Ads (то, что после "AW-18241492414/")
  lead: "2DguCMnMjsccEL6rnPpD",     // действие "Заявка на аренду"
  whatsapp: "NzFKCPfzisccEL6rnPpD", // действие "Клик WhatsApp"
};

type Gtag = (...args: unknown[]) => void;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag };
  if (typeof w.gtag === "function") w.gtag(...args);
}

/** Отправка заявки на аренду (любая из форм сайта). */
export function trackLead(detail?: { car?: string; source?: string }) {
  // GA4 — работает сразу, можно импортировать как конверсию из GA4 в Google Ads.
  gtag("event", "generate_lead", {
    currency: "USD",
    value: 1,
    car: detail?.car,
    source: detail?.source ?? "rental_form",
  });
  // Google Ads — прямая конверсия (активируется, когда задан label).
  if (AD_CONVERSIONS.lead) {
    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${AD_CONVERSIONS.lead}`,
      value: 1,
      currency: "USD",
    });
  }
}

/** Клик по кнопке/ссылке WhatsApp. */
export function trackWhatsAppClick(detail?: { source?: string }) {
  gtag("event", "whatsapp_click", {
    source: detail?.source ?? "floating_button",
  });
  if (AD_CONVERSIONS.whatsapp) {
    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${AD_CONVERSIONS.whatsapp}`,
    });
  }
}
