import type { AdminBooking } from "./adminBookings";

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

function fmtDate(d: string): string {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${parseInt(day)} ${MONTHS[parseInt(m) - 1]} ${y} г.`;
}

function cityName(c: string): string {
  return c === "tbilisi" ? "Тбилиси" : "Батуми";
}

function pickupDesc(type: string, addr: string): string {
  if (type === "office") return "Офис проката: 212V Airport Hwy, Батуми 6000";
  if (type === "airport") return "Международный аэропорт Батуми";
  return addr || "По договорённости";
}

function daysWord(n: number): string {
  if (n === 1) return "день";
  if (n >= 2 && n <= 4) return "дня";
  return "дней";
}

export function openContract(b: AdminBooking) {
  const isOneWay = b.pickupCity !== b.returnCity;
  const city = cityName(b.pickupCity);

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Договор аренды № ${b.contractNumber}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Times New Roman",serif;font-size:10pt;line-height:1.6;color:#111;padding:16mm 20mm}
  h1{font-size:11.5pt;text-align:center;font-weight:bold;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3pt}
  .sub{text-align:center;font-size:9.5pt;margin-bottom:12pt;color:#333}
  .intro{margin-bottom:10pt;text-align:justify}
  h3{font-size:10pt;font-weight:bold;text-align:center;text-transform:uppercase;letter-spacing:.04em;margin:10pt 0 5pt;padding:4pt 0;border-top:1.5px solid #999;border-bottom:1.5px solid #999}
  p{margin-bottom:4pt;text-align:justify}
  table{width:100%;border-collapse:collapse;margin:6pt 0;font-size:9.5pt}
  td,th{border:1px solid #888;padding:4pt 7pt;vertical-align:middle}
  th{background:#f5f5f5;font-weight:bold;text-align:left}
  .fine-t td:last-child{text-align:right;font-weight:bold;white-space:nowrap;color:#c00}
  .sigs{display:flex;justify-content:space-between;margin-top:20pt;gap:24pt;page-break-inside:avoid}
  .sig-block{flex:1}
  .sig-block p{margin-bottom:3pt;font-size:9.5pt}
  .sig-line{border-top:1px solid #555;margin-top:32pt;margin-bottom:3pt}
  .note{font-size:8.5pt;color:#444;margin-top:5pt}
  .oneway{background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:5pt 8pt;margin:6pt 0;font-size:9pt}
  @media print{body{padding:8mm 12mm}h3{page-break-after:avoid}}
</style>
</head>
<body>

<h1>Договор аренды транспортного средства без экипажа № ${b.contractNumber}</h1>
<div class="sub">${fmtDate(b.pickupDate)} &nbsp;&nbsp; г. ${city}</div>

<p class="intro"><b>ИП GEOrent</b>, именуемый в дальнейшем «Арендодатель», и <b>${b.clientName || "_________________________"}</b>${b.clientPassport ? `, паспорт № <b>${b.clientPassport}</b>` : ""}, именуемый(-ая) в дальнейшем «Арендатор», заключили настоящий договор о нижеследующем.</p>

<h3>1. Предмет договора и срок аренды</h3>
<p>1.1. Арендодатель предоставляет Арендатору во временное пользование (аренду) транспортное средство без оказания услуг по управлению для личного некоммерческого использования.</p>
<p>1.2. Договор вступает в силу с момента подписания обеими Сторонами и действует до полного исполнения обязательств.</p>
<p>1.3. Срок аренды исчисляется с момента фактической передачи ТС Арендатору и до его возврата, оформляемого подписанием Акта возврата.</p>

<h3>2. Транспортное средство и условия аренды</h3>
<table>
  <tr><th style="width:28%">Марка и модель</th><td><b>${b.carName}</b></td><th style="width:28%">Водительское удостоверение</th><td>${b.clientLicense || "—"}</td></tr>
  <tr><th>Дата и время передачи</th><td>${fmtDate(b.pickupDate)}, ${b.pickupTime}</td><th>Дата и время возврата</th><td>${fmtDate(b.returnDate)}, ${b.returnTime}</td></tr>
  <tr><th>Место получения ТС</th><td>${pickupDesc(b.pickupType, b.deliveryAddress)}</td><th>Место возврата ТС</th><td>${isOneWay ? `<b>${cityName(b.returnCity)}</b> (межгородная аренда)` : pickupDesc(b.pickupType, b.deliveryAddress)}</td></tr>
  <tr><th>Срок аренды</th><td><b>${b.days} ${daysWord(b.days)}</b></td><th>Стоимость аренды</th><td><b>${b.totalPrice} $</b> (${b.pricePerDay}$/день)</td></tr>
  <tr><th>Залог (возвратный)</th><td><b>${b.deposit} $</b></td><th>Способ связи</th><td>${b.clientContact === "whatsapp" ? "WhatsApp" : b.clientContact === "telegram" ? "Telegram" : "Телефон"}: ${b.clientPhone}</td></tr>
  ${b.services.length > 0 ? `<tr><th>Дополнительные услуги</th><td colspan="3">${b.services.join(", ")}</td></tr>` : ""}
  ${b.note ? `<tr><th>Примечание</th><td colspan="3">${b.note}</td></tr>` : ""}
</table>
${isOneWay ? `<div class="oneway">⚠️ <b>Межгородная аренда:</b> автомобиль получен в ${cityName(b.pickupCity)}, возвращается в ${cityName(b.returnCity)}. После возврата ТС остаётся в ${cityName(b.returnCity)}.</div>` : ""}

<h3>3. Порядок приёма-передачи ТС</h3>
<p>3.1. Передача и возврат ТС производятся в офисе Арендодателя (212V Airport Hwy, Батуми 6000, Грузия) или в ином месте по предварительной договорённости.</p>
<p>3.2. При передаче Стороны совместно фиксируют техническое состояние кузова, салона, уровень топлива и показания одометра.</p>
<p>3.3. ТС возвращается с уровнем топлива не меньшим, чем при передаче. Нехватка компенсируется из расчёта 4 GEL/литр.</p>

<h3>4. Платежи и расчёты</h3>
<p>4.1. Арендная плата за весь согласованный срок вносится Арендатором наличными в момент подписания договора.</p>
<p>4.2. Залог в размере ${b.deposit} $ вносится Арендатором при получении ТС и возвращается в полном объёме при возврате ТС без повреждений.</p>
<p>4.3. При досрочном расторжении по инициативе Арендатора Арендодатель возвращает остаток за полные сутки, удерживая неустойку в размере одних суток аренды.</p>
<p>4.4. Задержка возврата без согласования: до 2 ч — 50 GEL/час; более 2 ч — 250 GEL/сутки.</p>

<h3>5. Обязательства Арендатора</h3>
<p>5.1. Соблюдать ПДД и правила эксплуатации ТС; не управлять в состоянии опьянения.</p>
<p>5.2. Не использовать ТС в коммерческих целях, не передавать управление третьим лицам без письменного согласия Арендодателя.</p>
<p>5.3. Не курить в салоне (300 GEL); не перевозить животных без согласования (200 $).</p>
<p>5.4. Эксплуатировать ТС только на дорогах с твёрдым покрытием в пределах Грузии; использовать топливо AI-95 и выше.</p>
<p>5.5. Не оставлять в ТС документы и ключи. Утрата СТС/ключей/брелока — 300 $ каждое.</p>
<p>5.6. При ДТП немедленно прекратить движение, сообщить Арендодателю и обратиться в Полицию Грузии. Все штрафы за нарушения ПДД оплачивает Арендатор.</p>

<h3>6. Ответственность сторон</h3>
<p>6.1. Арендатор несёт полную ответственность за сохранность ТС, документов и ключей на весь срок аренды.</p>
<p>6.2. При добросовестном выполнении условий договора и наличии подтверждающих документов — ответственность ограничена суммой залога (${b.deposit} $).</p>
<p>6.3. При нарушении условий — полная материальная ответственность в размере фактического ущерба Арендодателя.</p>

<h3>Таблица штрафов (при ДТП без уведомления / возврат с повреждениями)</h3>
<table class="fine-t">
  <tr><th>Нарушение / повреждение</th><th style="text-align:right">Штраф</th></tr>
  <tr><td>Повреждение бампера под покраску (без доп. работ)</td><td>200 $</td></tr>
  <tr><td>Повреждение бампера под покраску (с доп. работами)</td><td>от 300 $</td></tr>
  <tr><td>Повреждение элемента кузова (металл, без доп. работ)</td><td>300 $</td></tr>
  <tr><td>Повреждение элемента кузова (металл, с доп. работами)</td><td>от 400 $</td></tr>
  <tr><td>Курение в салоне автомобиля</td><td>300 GEL</td></tr>
  <tr><td>Перевозка животных без согласования</td><td>200 $</td></tr>
  <tr><td>Задержка возврата более 2-х часов (без согласования)</td><td>250 GEL/сутки</td></tr>
  <tr><td>Повреждение салона / химчистка</td><td>от 200 $</td></tr>
  <tr><td>Эксплуатация по бездорожью</td><td>200 $</td></tr>
  <tr><td>Утрата документов / ключей зажигания</td><td>300 $</td></tr>
  <tr><td>Экстремальное вождение / повышенная амортизация</td><td>от 200 $</td></tr>
</table>

<div class="sigs">
  <div class="sig-block">
    <p><b>Арендодатель:</b></p>
    <p>ИП GEOrent</p>
    <p>Тел: +995 500 194 533</p>
    <p>212V Airport Hwy, Batumi 6000, Georgia</p>
    <div class="sig-line"></div>
    <p>Подпись: ____________________________</p>
  </div>
  <div class="sig-block">
    <p><b>Арендатор / Renter:</b></p>
    <p><b>${b.clientName || "—"}</b></p>
    <p>Паспорт / Passport: ${b.clientPassport || "—"}</p>
    <p>Вод. уд. / License: ${b.clientLicense || "—"}</p>
    <p>Тел / Phone: ${b.clientPhone || "—"}</p>
    <div class="sig-line"></div>
    <p>Подпись: ____________________________</p>
    <p class="note">С условиями аренды ознакомлен(а) и согласен(а).<br>I have read and agree to the rental terms and conditions.</p>
  </div>
</div>

</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank", "noopener");
  if (w) {
    setTimeout(() => { try { w.print(); } catch {} URL.revokeObjectURL(url); }, 900);
  }
}
