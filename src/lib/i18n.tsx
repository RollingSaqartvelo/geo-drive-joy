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
    // Nav
    nav_home: "Home", nav_cars: "Cars", nav_tours: "Tours", nav_contact: "Contact",
    book: "Book", request_rental: "Request Rental",
    // Home hero
    hero_title: "Premium Car Rental in Georgia",
    hero_subtitle: "Batumi · Tbilisi · Across Georgia",
    // Home features
    feature_fleet_title: "Premium Fleet",
    feature_fleet_body: "Mustang, Range Rover, Discovery — meticulously maintained.",
    feature_tours_title: "Tours & Transfers",
    feature_tours_body: "Curated trips across Georgia's mountains, sea & wine country.",
    feature_offices_title: "Offices in Batumi & Tbilisi",
    feature_offices_body: "Pick up and return where it works for your route.",
    // CTA band
    cta_title: "Ready when you are.",
    cta_insurance: "All our cars are new, well-maintained and fully insured (CASCO, tires excluded).",
    cta_sub: "Send a request — we'll confirm availability fast.",
    // Rental terms
    terms_title: "Rental Terms",
    terms_conditions: "Please read our rental conditions:",
    term_exp: "2+ years driving experience",
    term_exp_sub: "Minimum driving experience required",
    term_age: "21+ years old",
    term_age_sub: "Required for all drivers",
    term_deposit: "$150 Deposit",
    term_deposit_sub: "Refundable deposit during rental period",
    term_cash: "Cash payment",
    term_cash_sub: "We accept cash only",
    term_license: "Physical license required",
    term_license_sub: "Electronic licenses not valid in Georgia. Without physical license — no car.",
    // Cars page
    fleet_eyebrow: "Our Fleet",
    fleet_title: "Choose Your Drive",
    fleet_body: "Premium, reliable vehicles ready for the roads of Georgia.",
    city_batumi_sub: "Black Sea Coast",
    city_tbilisi_sub: "Capital City",
    cars_available: "cars available",
    view_details: "View Details →",
    selected: "Selected ✓",
    // Car detail
    back_to_cars: "← Back to Cars",
    seats_label: "seats",
    specs_title: "Specifications",
    book_car: "Book this car",
    full_name: "Full Name",
    persons: "Number of persons",
    notes: "Additional notes",
    notes_ph: "Any questions or special requests...",
    cancel: "Cancel",
    request_sent: "✓ Request sent! We'll contact you soon.",
    // Contact page
    contact_title: "Book Your Car",
    contact_sub: "Fill in the form or contact us directly on WhatsApp — we respond fast.",
    contact_us: "Contact Us",
    batumi_office: "Batumi Office",
    hours: "7 days a week, 09:00 – 21:00",
    rental_terms_title: "Rental Terms",
    wa_reply: "+995 500 194 533 — reply in minutes",
    tg_reply: "+995 500 194 533 — write anytime",
    // Footer
    footer_tagline: "Premium car rental & tours across Georgia.",
    footer_contact: "Contact",
    footer_navigate: "Navigate",
    // Form (existing)
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
    hero_title: "პრემიუმ ავტომობილების გაქირავება საქართველოში",
    hero_subtitle: "ბათუმი · თბილისი · საქართველოს მასშტაბით",
    feature_fleet_title: "პრემიუმ ფლოტი",
    feature_fleet_body: "Mustang, Range Rover, Discovery — ყურადღებით მოვლილი.",
    feature_tours_title: "ტურები და ტრანსფერი",
    feature_tours_body: "კურირებული მოგზაურობა საქართველოს მთებში, ზღვასა და ღვინის მხარეში.",
    feature_offices_title: "ოფისები ბათუმში და თბილისში",
    feature_offices_body: "აიღეთ და დააბრუნეთ იქ, სადაც ეს თქვენი მარშრუტისთვის მოსახერხებელია.",
    cta_title: "მზად ვართ, როდესაც თქვენ ხართ მზად.",
    cta_insurance: "ყველა ჩვენი ავტომობილი ახალია, კარგ მდგომარეობაშია და სრულად დაზღვეულია (KASKO, საბურავების გარეშე).",
    cta_sub: "გაგზავნეთ მოთხოვნა — სწრაფად დავადასტურებთ ხელმისაწვდომობას.",
    terms_title: "გაქირავების პირობები",
    terms_conditions: "გთხოვთ გაეცნოთ ჩვენს გაქირავების პირობებს:",
    term_exp: "2+ წლის სამართავი გამოცდილება",
    term_exp_sub: "მინიმალური სამართავი გამოცდილება",
    term_age: "21+ წელი",
    term_age_sub: "სავალდებულო ყველა მძღოლისთვის",
    term_deposit: "$150 დეპოზიტი",
    term_deposit_sub: "დასაბრუნებელი დეპოზიტი გაქირავების პერიოდში",
    term_cash: "გადახდა ნაღდი ფულით",
    term_cash_sub: "ვიღებთ მხოლოდ ნაღდ ფულს",
    term_license: "ფიზიკური მოწმობა სავალდებულოა",
    term_license_sub: "ელ. მოწმობები საქართველოში არ მუშაობს. ფიზიკური მოწმობის გარეშე ავტომობილს არ გადავცემთ.",
    fleet_eyebrow: "ჩვენი ფლოტი",
    fleet_title: "აირჩიეთ თქვენი ავტომობილი",
    fleet_body: "პრემიუმ, საიმედო ავტომობილები საქართველოს გზებისთვის.",
    city_batumi_sub: "შავი ზღვის სანაპირო",
    city_tbilisi_sub: "დედაქალაქი",
    cars_available: "ავტომობილი ხელმისაწვდომია",
    view_details: "დეტალების ნახვა →",
    selected: "არჩეულია ✓",
    back_to_cars: "← ავტომობილებზე დაბრუნება",
    seats_label: "ადგილი",
    specs_title: "მახასიათებლები",
    book_car: "ამ ავტომობილის დაჯავშნა",
    full_name: "სახელი და გვარი",
    persons: "მგზავრების რაოდენობა",
    notes: "დამატებითი შენიშვნები",
    notes_ph: "კითხვები ან სპეციალური მოთხოვნები...",
    cancel: "გაუქმება",
    request_sent: "✓ მოთხოვნა გაიგზავნა! მალე დაგიკავშირდებით.",
    contact_title: "დაჯავშნეთ ავტომობილი",
    contact_sub: "შეავსეთ ფორმა ან დაგვიკავშირდით WhatsApp-ზე — სწრაფად ვპასუხობთ.",
    contact_us: "დაგვიკავშირდით",
    batumi_office: "ბათუმის ოფისი",
    hours: "კვირაში 7 დღე, 09:00 – 21:00",
    rental_terms_title: "გაქირავების პირობები",
    wa_reply: "+995 500 194 533 — სწრაფი პასუხი",
    tg_reply: "+995 500 194 533 — დაგვიწერეთ ნებისმიერ დროს",
    footer_tagline: "პრემიუმ ავტოგაქირავება და ტურები საქართველოში.",
    footer_contact: "კონტაქტი",
    footer_navigate: "ნავიგაცია",
    check_availability: "ხელმისაწვდომობის შემოწმება",
    check_availability_sub: "გთხოვთ უპასუხოთ შემდეგ კითხვებს:",
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
    hero_title: "Прокат автомобилей премиум-класса в Грузии",
    hero_subtitle: "Батуми · Тбилиси · По всей Грузии",
    feature_fleet_title: "Премиальный парк",
    feature_fleet_body: "Mustang, Range Rover, Discovery — безупречно обслуженные.",
    feature_tours_title: "Туры и трансферы",
    feature_tours_body: "Маршруты по горам, морю и винным регионам Грузии.",
    feature_offices_title: "Офисы в Батуми и Тбилиси",
    feature_offices_body: "Получите и верните там, где удобно по вашему маршруту.",
    cta_title: "Готовы, когда готовы вы.",
    cta_insurance: "Все наши автомобили новые, ухоженные и застрахованы полным каско (кроме шин).",
    cta_sub: "Отправьте запрос — быстро подтвердим наличие.",
    terms_title: "Условия аренды",
    terms_conditions: "Пожалуйста, ознакомьтесь с нашими условиями:",
    term_exp: "Стаж от 2 лет",
    term_exp_sub: "Минимальный водительский опыт",
    term_age: "Возраст от 21 года",
    term_age_sub: "Обязательное условие для всех водителей",
    term_deposit: "Депозит $150",
    term_deposit_sub: "Возвратный депозит на время аренды",
    term_cash: "Оплата наличными",
    term_cash_sub: "Принимаем только наличные",
    term_license: "Физические права обязательны",
    term_license_sub: "Электронные права в Грузии не действуют. Без физических прав автомобиль не выдаётся.",
    fleet_eyebrow: "Наш парк",
    fleet_title: "Выберите автомобиль",
    fleet_body: "Премиальные, надёжные автомобили для дорог Грузии.",
    city_batumi_sub: "Черноморское побережье",
    city_tbilisi_sub: "Столица",
    cars_available: "авт. доступно",
    view_details: "Подробнее →",
    selected: "Выбрано ✓",
    back_to_cars: "← К автомобилям",
    seats_label: "мест",
    specs_title: "Характеристики",
    book_car: "Забронировать",
    full_name: "Полное имя",
    persons: "Количество человек",
    notes: "Примечания",
    notes_ph: "Вопросы или особые пожелания...",
    cancel: "Отмена",
    request_sent: "✓ Запрос отправлен! Скоро свяжемся с вами.",
    contact_title: "Забронировать автомобиль",
    contact_sub: "Заполните форму или свяжитесь с нами через WhatsApp — отвечаем быстро.",
    contact_us: "Контакты",
    batumi_office: "Офис в Батуми",
    hours: "7 дней в неделю, 09:00 – 21:00",
    rental_terms_title: "Условия аренды",
    wa_reply: "+995 500 194 533 — ответим за минуты",
    tg_reply: "+995 500 194 533 — пишите в любое время",
    footer_tagline: "Прокат премиальных авто и туры по Грузии.",
    footer_contact: "Контакты",
    footer_navigate: "Навигация",
    check_availability: "Проверить наличие",
    check_availability_sub: "Пожалуйста, ответьте на следующие вопросы:",
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
    hero_title: "השכרת רכב פרימיום בגאורגיה",
    hero_subtitle: "באטומי · טביליסי · ברחבי גאורגיה",
    feature_fleet_title: "צי פרימיום",
    feature_fleet_body: "מוסטנג, ריינג' רובר, דיסקברי — מתוחזקים בקפידה.",
    feature_tours_title: "טיולים והעברות",
    feature_tours_body: "טיולים מאורגנים בהרים, הים ואזורי היין של גאורגיה.",
    feature_offices_title: "משרדים בבאטומי ובטביליסי",
    feature_offices_body: "אסוף והחזר איפה שמתאים למסלול שלך.",
    cta_title: "מוכן כשאתה מוכן.",
    cta_insurance: "כל הרכבים שלנו חדשים, מטופחים ומבוטחים במלואם (קסקו, למעט צמיגים).",
    cta_sub: "שלח בקשה — נאשר זמינות במהירות.",
    terms_title: "תנאי השכרה",
    terms_conditions: "אנא קרא את תנאי ההשכרה שלנו:",
    term_exp: "ניסיון נהיגה 2+ שנים",
    term_exp_sub: "ניסיון נהיגה מינימלי נדרש",
    term_age: "גיל 21+",
    term_age_sub: "חובה לכל הנהגים",
    term_deposit: "דיפוזיט $150",
    term_deposit_sub: "דיפוזיט שניתן להחזרה בזמן השכרה",
    term_cash: "תשלום במזומן",
    term_cash_sub: "אנו מקבלים מזומן בלבד",
    term_license: "רישיון פיזי חובה",
    term_license_sub: "רישיונות אלקטרוניים אינם תקפים בגאורגיה. ללא רישיון פיזי — לא מסגירים רכב.",
    fleet_eyebrow: "הצי שלנו",
    fleet_title: "בחר את הרכב שלך",
    fleet_body: "כלי רכב פרימיום ואמינים מוכנים לדרכי גאורגיה.",
    city_batumi_sub: "חוף הים השחור",
    city_tbilisi_sub: "בירת המדינה",
    cars_available: "רכבים זמינים",
    view_details: "← פרטים נוספים",
    selected: "נבחר ✓",
    back_to_cars: "→ חזרה לרכבים",
    seats_label: "מושבים",
    specs_title: "מפרט טכני",
    book_car: "הזמן רכב זה",
    full_name: "שם מלא",
    persons: "מספר אנשים",
    notes: "הערות נוספות",
    notes_ph: "שאלות או בקשות מיוחדות...",
    cancel: "ביטול",
    request_sent: "✓ הבקשה נשלחה! ניצור קשר בקרוב.",
    contact_title: "הזמן את הרכב שלך",
    contact_sub: "מלא את הטופס או צור קשר ישירות בוואטסאפ — אנו מגיבים מהר.",
    contact_us: "צור קשר",
    batumi_office: "משרד באטומי",
    hours: "7 ימים בשבוע, 09:00 – 21:00",
    rental_terms_title: "תנאי השכרה",
    wa_reply: "+995 500 194 533 — עונים תוך דקות",
    tg_reply: "+995 500 194 533 — כתבו בכל עת",
    footer_tagline: "השכרת רכב פרימיום וטיולים ברחבי גאורגיה.",
    footer_contact: "צור קשר",
    footer_navigate: "ניווט",
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
    hero_title: "Gürcistan'da Premium Araç Kiralama",
    hero_subtitle: "Batum · Tiflis · Gürcistan Genelinde",
    feature_fleet_title: "Premium Filo",
    feature_fleet_body: "Mustang, Range Rover, Discovery — özenle bakımlı.",
    feature_tours_title: "Turlar ve Transferler",
    feature_tours_body: "Gürcistan'ın dağları, denizi ve şarap ülkesinde seçilmiş geziler.",
    feature_offices_title: "Batum ve Tiflis'te Ofisler",
    feature_offices_body: "Güzergahınıza uygun yerde teslim alın ve iade edin.",
    cta_title: "Siz hazır olduğunuzda biz de hazırız.",
    cta_insurance: "Tüm araçlarımız yeni, bakımlı ve tam kasko sigortalıdır (lastikler hariç).",
    cta_sub: "Talep gönderin — müsaitliği hızlıca onaylayalım.",
    terms_title: "Kiralama Koşulları",
    terms_conditions: "Lütfen kiralama koşullarımızı okuyun:",
    term_exp: "2+ yıl sürücülük deneyimi",
    term_exp_sub: "Gerekli minimum sürüş deneyimi",
    term_age: "21 yaş üzeri",
    term_age_sub: "Tüm sürücüler için zorunlu",
    term_deposit: "$150 Depozito",
    term_deposit_sub: "Kiralama süresince iade edilebilir depozito",
    term_cash: "Nakit ödeme",
    term_cash_sub: "Sadece nakit kabul ediyoruz",
    term_license: "Fiziksel ehliyet zorunlu",
    term_license_sub: "Elektronik ehliyet Gürcistan'da geçerli değil. Fiziksel ehliyet olmadan araç verilmez.",
    fleet_eyebrow: "Filomuz",
    fleet_title: "Aracınızı Seçin",
    fleet_body: "Gürcistan yolları için hazır premium, güvenilir araçlar.",
    city_batumi_sub: "Karadeniz Kıyısı",
    city_tbilisi_sub: "Başkent",
    cars_available: "araç mevcut",
    view_details: "Detayları Gör →",
    selected: "Seçildi ✓",
    back_to_cars: "← Araçlara Dön",
    seats_label: "koltuk",
    specs_title: "Özellikler",
    book_car: "Bu Aracı Kirala",
    full_name: "Ad Soyad",
    persons: "Kişi sayısı",
    notes: "Ek notlar",
    notes_ph: "Sorularınız veya özel istekleriniz...",
    cancel: "İptal",
    request_sent: "✓ Talep gönderildi! En kısa sürede iletişime geçeceğiz.",
    contact_title: "Aracınızı Kiralayın",
    contact_sub: "Formu doldurun veya doğrudan WhatsApp'tan bize yazın — hızlı yanıt veriyoruz.",
    contact_us: "Bize Ulaşın",
    batumi_office: "Batum Ofisi",
    hours: "Haftanın 7 günü, 09:00 – 21:00",
    rental_terms_title: "Kiralama Koşulları",
    wa_reply: "+995 500 194 533 — dakikalar içinde yanıt",
    tg_reply: "+995 500 194 533 — istediğiniz zaman yazın",
    footer_tagline: "Gürcistan genelinde premium araç kiralama ve turlar.",
    footer_contact: "İletişim",
    footer_navigate: "Gezinme",
    check_availability: "Müsaitlik Kontrolü",
    check_availability_sub: "Lütfen aşağıdaki soruları yanıtlayın:",
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

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
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
  const t = (k: string) => T[lang][k] ?? T.en[k] ?? k;
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
      <button onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors">
        <img src={current.flag} alt={current.label} className="w-5 h-auto rounded-sm shadow-sm" />
        <span>{current.label}</span>
        <span className={`transition-transform duration-200 inline-block ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white shadow-lg overflow-hidden z-50 border border-gray-100">
          {LANGS.filter((l) => l.code !== lang).map((l) => (
            <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <img src={l.flag} alt={l.label} className="w-5 h-auto rounded-sm shadow-sm" />
              <span className="font-medium">{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
