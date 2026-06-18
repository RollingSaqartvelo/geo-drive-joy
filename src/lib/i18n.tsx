import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type Lang = "en" | "ka" | "ru" | "he" | "tr";

export const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "https://flagcdn.com/20x15/gb.png" },
  { code: "ka", label: "KA", flag: "https://flagcdn.com/20x15/ge.png" },
  { code: "ru", label: "RU", flag: "https://flagcdn.com/20x15/ru.png" },
  { code: "he", label: "HE", flag: "https://flagcdn.com/20x15/il.png" },
  { code: "tr", label: "TR", flag: "https://flagcdn.com/20x15/tr.png" },
];

type Dict = Record<string, string>;

const T: Record<Lang, Dict> = {
  en: {
    nav_home: "Home", nav_cars: "Cars", nav_tours: "Tours", nav_contact: "Contact",
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
    nav_home: "მთავარი", nav_cars: "ავტომობილები", nav_tours: "ტურები", nav_contact: "კონტაქტი",
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
    nav_home: "Главная", nav_cars: "Автомобили", nav_tours: "Туры", nav_contact: "Контакты",
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
    nav_home: "בית", nav_cars: "רכבים", nav_tours: "טיולים", nav_contact: "צור קשר",
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
  tr: {
    nav_home: "Ana Sayfa", nav_cars: "Araçlar", nav_tours: "Turlar", nav_contact: "İletişim",
    book: "Rezervasyon", request_rental: "Kiralama Talebi",
    check_availability: "Müsaitlik Kontrolü",
    check_availability_sub: "Müsaitliği kontrol etmek için lütfen aşağıdaki soruları yanıtlayın:",
    q_dates: "Arabaya hangi tarihlerde ihtiyacınız var?",
    q_city: "Arabaya hangi şehirde ihtiyacınız var?",
    q_destination: "Nereye gitmeyi planlıyorsunuz?",
    q_car_type: "Hangi tür aracı tercih edersiniz?",
    q_car_type_ph: "örn. SUV, cabrio, minivan…",
    q_name: "Adınız",
    q_phone: "Telefon numaranız",
    q_comments: "Ek yorumlar?",
    q_contact: "Tercih ettiğiniz iletişim yöntemi",
    pickup_date: "Teslim alma tarihi", return_date: "İade tarihi",
    pick_date: "Tarih seçin",
    whatsapp: "WhatsApp", telegram: "Telegram", phone_call: "Telefon",
    send_request: "Talep Gönder",
    sending: "Gönderiliyor…",
    fill_all: "Lütfen tüm zorunlu alanları doldurun.",
    send_error: "Gönderilemedi. Lütfen WhatsApp'ı deneyin.",
    thanks: "Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.",
    close: "Kapat",
    book_title: "Rezervasyon",
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === lang)!;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
      >
        <img src={current.flag} alt={current.label} className="w-5 h-auto rounded-sm shadow-sm" />
        <span>{current.label}</span>
        <span className={`transition-transform duration-200 inline-block ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white shadow-lg overflow-hidden z-50 border border-gray-100">
          {LANGS.filter((l) => l.code !== lang).map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <img src={l.flag} alt={l.label} className="w-5 h-auto rounded-sm shadow-sm" />
              <span className="font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}