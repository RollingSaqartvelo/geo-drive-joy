import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ka" | "ru" | "he";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ka", label: "KA", flag: "🇬🇪" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "he", label: "HE", flag: "🇮🇱" },
];

type Dict = Record<string, string>;

const T: Record<Lang, Dict> = {
  en: {
    nav_home: "Home", nav_cars: "Cars", nav_tours: "Tours",
    book: "Book", request_rental: "Request Rental",
    // General form
    check_availability: "Check Availability",
    check_availability_sub: "To check availability, please answer the following questions:",
    q_dates: "What dates do you need the car?",
    q_city: "What city do you need the car?",
    q_destination: "Where are you planning to go?",
    q_car_type: "What type of car do you prefer?",
    q_car_type_ph: "e.g. SUV, convertible, minivan…",
    q_name: "Your name",
    q_phone: "Your phone number",
    q_comments: "Any additional comments?",
    q_contact: "Preferred contact method",
    pickup_date: "Pick-up date", return_date: "Return date",
    pick_date: "Pick a date",
    whatsapp: "WhatsApp", telegram: "Telegram", phone_call: "Phone call",
    send_request: "Send Request",
    sending: "Sending…",
    fill_all: "Please fill in the required fields.",
    send_error: "Could not send. Please try WhatsApp instead.",
    thanks: "Thank you! We'll contact you shortly.",
    close: "Close",
    book_title: "Book",
  },
  ka: {
    nav_home: "მთავარი", nav_cars: "ავტომობილები", nav_tours: "ტურები",
    book: "ჯავშანი", request_rental: "მოითხოვე ქირაობა",
    check_availability: "ხელმისაწვდომობის შემოწმება",
    check_availability_sub: "ხელმისაწვდომობის შესამოწმებლად გთხოვთ უპასუხოთ შემდეგ კითხვებს:",
    q_dates: "რომელ თარიღებზე გჭირდებათ ავტომობილი?",
    q_city: "რომელ ქალაქში გჭირდებათ ავტომობილი?",
    q_destination: "სად აპირებთ წასვლას?",
    q_car_type: "რა ტიპის ავტომობილს ანიჭებთ უპირატესობას?",
    q_car_type_ph: "მაგ. SUV, კაბრიოლეტი, მინივენი…",
    q_name: "თქვენი სახელი",
    q_phone: "თქვენი ტელეფონის ნომერი",
    q_comments: "დამატებითი კომენტარები?",
    q_contact: "სასურველი კონტაქტის მეთოდი",
    pickup_date: "აღების თარიღი", return_date: "დაბრუნების თარიღი",
    pick_date: "აირჩიეთ თარიღი",
    whatsapp: "WhatsApp", telegram: "Telegram", phone_call: "ზარი",
    send_request: "მოთხოვნის გაგზავნა",
    sending: "იგზავნება…",
    fill_all: "გთხოვთ შეავსოთ ყველა საჭირო ველი.",
    send_error: "ვერ გაიგზავნა. სცადეთ WhatsApp.",
    thanks: "გმადლობთ! მალე დაგიკავშირდებით.",
    close: "დახურვა",
    book_title: "დაჯავშნე",
  },
  ru: {
    nav_home: "Главная", nav_cars: "Автомобили", nav_tours: "Туры",
    book: "Забронировать", request_rental: "Запросить аренду",
    check_availability: "Проверить наличие",
    check_availability_sub: "Чтобы проверить наличие, пожалуйста, ответьте на следующие вопросы:",
    q_dates: "На какие даты вам нужен автомобиль?",
    q_city: "В каком городе вам нужен автомобиль?",
    q_destination: "Куда вы планируете поехать?",
    q_car_type: "Какой тип автомобиля вы предпочитаете?",
    q_car_type_ph: "напр. SUV, кабриолет, минивэн…",
    q_name: "Ваше имя",
    q_phone: "Ваш номер телефона",
    q_comments: "Дополнительные комментарии?",
    q_contact: "Предпочтительный способ связи",
    pickup_date: "Дата получения", return_date: "Дата возврата",
    pick_date: "Выберите дату",
    whatsapp: "WhatsApp", telegram: "Telegram", phone_call: "Звонок",
    send_request: "Отправить запрос",
    sending: "Отправка…",
    fill_all: "Пожалуйста, заполните все обязательные поля.",
    send_error: "Не удалось отправить. Попробуйте WhatsApp.",
    thanks: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    close: "Закрыть",
    book_title: "Забронировать",
  },
  he: {
    nav_home: "בית", nav_cars: "רכבים", nav_tours: "טיולים",
    book: "להזמין", request_rental: "בקשת השכרה",
    check_availability: "בדיקת זמינות",
    check_availability_sub: "לבדיקת זמינות, אנא ענה על השאלות הבאות:",
    q_dates: "באילו תאריכים אתה צריך את הרכב?",
    q_city: "באיזו עיר אתה צריך את הרכב?",
    q_destination: "לאן אתה מתכנן לנסוע?",
    q_car_type: "איזה סוג רכב אתה מעדיף?",
    q_car_type_ph: "לדוגמה SUV, קבריולט, מיניוואן…",
    q_name: "השם שלך",
    q_phone: "מספר הטלפון שלך",
    q_comments: "הערות נוספות?",
    q_contact: "אמצעי קשר מועדף",
    pickup_date: "תאריך איסוף", return_date: "תאריך החזרה",
    pick_date: "בחר תאריך",
    whatsapp: "WhatsApp", telegram: "Telegram", phone_call: "שיחה",
    send_request: "שלח בקשה",
    sending: "שולח…",
    fill_all: "אנא מלא את כל השדות הנדרשים.",
    send_error: "השליחה נכשלה. נסה דרך WhatsApp.",
    thanks: "תודה! ניצור איתך קשר בקרוב.",
    close: "סגור",
    book_title: "להזמין",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof T["en"]) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("lang") as Lang | null)) || null;
    if (saved && T[saved]) setLangState(saved);
  }, []);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
    }
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };
  const t = (k: keyof typeof T["en"]) => T[lang][k] ?? T.en[k] ?? String(k);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-white/10 p-0.5 text-xs font-semibold">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={
            "px-2.5 py-1 rounded-full transition-colors " +
            (lang === l.code ? "bg-white text-[var(--brand-blue)]" : "text-white/80 hover:text-white")
          }
          aria-pressed={lang === l.code}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}