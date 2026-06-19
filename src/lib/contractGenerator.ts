import type { AdminBooking } from "./adminBookings";

const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];

function fmtDate(d: string): string {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${parseInt(day)} ${MONTHS[parseInt(m) - 1]} ${y} г.`;
}

function cityName(c: string): string {
  return c === "tbilisi" ? "г. Тбилиси" : "г. Батуми";
}

function pickupPlace(type: string, addr: string, city: string): string {
  const c = cityName(city);
  if (type === "airport") return `Международный аэропорт ${c}`;
  if (type === "delivery") return addr || `Адрес доставки: по договорённости`;
  return `Офис проката ${c}`;
}

function daysWord(n: number): string {
  if (n === 1) return "день";
  if (n >= 2 && n <= 4) return "дня";
  return "дней";
}

export function openContract(b: AdminBooking) {
  const isOneWay = b.pickupCity !== b.returnCity;
  const cityStr = b.pickupCity === "tbilisi" ? "Тбилиси" : "Батуми";
  const servicesList = b.services.length > 0 ? b.services.join(", ") : "—";

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Договор № ${b.contractNumber}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:"Times New Roman",Times,serif;font-size:10pt;line-height:1.55;color:#000;padding:14mm 18mm 16mm}
  h1{font-size:11pt;text-align:center;font-weight:bold;text-transform:uppercase;letter-spacing:.04em;margin-bottom:1pt}
  .center{text-align:center}
  .bold{font-weight:bold}
  .intro{margin:8pt 0 6pt;text-align:justify}
  h3{font-size:10pt;font-weight:bold;text-align:center;text-transform:uppercase;margin:8pt 0 4pt;padding:3pt 0;border-top:1.2px solid #666;border-bottom:1.2px solid #666}
  p{margin-bottom:3pt;text-align:justify}
  table{width:100%;border-collapse:collapse;font-size:9.5pt}
  td,th{border:1px solid #555;padding:3pt 6pt;vertical-align:middle}
  th{background:#f0f0f0;font-weight:bold;text-align:left}
  .car-table td{padding:4pt 6pt}
  .fine-td-val{text-align:right;font-weight:bold;white-space:nowrap;color:#990000;width:110px}
  .sigs{display:flex;justify-content:space-between;margin-top:18pt;gap:20pt;page-break-inside:avoid}
  .sig-block{flex:1}
  .sig-block p{margin-bottom:2pt;font-size:9.5pt;text-align:left}
  .sig-line{border-top:1px solid #444;margin-top:28pt;margin-bottom:2pt}
  .diagram-area{width:100%;height:120px;border:1px solid #aaa;background:#fafafa;display:flex;align-items:center;justify-content:center;color:#999;font-size:9pt;font-style:italic}
  .oneway-note{background:#fffbe6;border:1px solid #e6c800;padding:4pt 8pt;margin:5pt 0;font-size:9pt}
  @media print{body{padding:8mm 12mm 10mm}h3{page-break-after:avoid}.sigs{page-break-inside:avoid}}
</style>
</head>
<body>

<h1>Договор аренды транспортного средства<br>без экипажа № ${b.contractNumber}</h1>
<p class="center">${fmtDate(b.pickupDate)} &nbsp; ${cityStr}</p>

<p class="intro"><span class="bold">ИП GEOrent</span>, именуемый в дальнейшем Арендодатель с одной стороны, и <span class="bold">${b.clientName || "_______________"}</span>, именуемый(-ая) в дальнейшем Арендатор, совместно именуемые «Стороны», составили настоящий договор о нижеследующем:</p>

<h3>1. Предмет договора и срок действия договора</h3>
<p>1.1. В соответствии с условиями договора Арендодатель обязуется предоставить Арендатору за плату во временное владение и пользование (аренду) транспортное средство (далее — ТС) без оказания услуг по управлению им и технической эксплуатации. Транспортное средство предоставляется для некоммерческого использования Арендатором.</p>
<p>1.2. Настоящий договор вступает в силу с момента подписания договора Сторонами и действует до полного исполнения Сторонами своих обязательств.</p>
<p>1.3. Срок аренды исчисляется с момента приёма ТС Арендатором, указанного в п.2 Договора, и действует до момента фактического возврата ТС Арендатором, который оформляется Актом возврата ТС и подписывается обеими Сторонами.</p>

<h3>2. Сведения о передаваемом в аренду транспортном средстве</h3>
<table class="car-table">
  <tr>
    <td colspan="2" style="text-align:center;font-weight:bold;background:#f0f0f0">Автомобиль</td>
    <td colspan="2" style="text-align:center;font-weight:bold;background:#f0f0f0">Состояние автомобиля при передаче Арендатору</td>
  </tr>
  <tr>
    <td style="background:#f0f0f0;font-weight:bold;width:22%">Марка и модель</td>
    <td style="width:28%"><b>${b.carName}</b></td>
    <td colspan="2" rowspan="4">
      <div class="diagram-area">Фото-видеофиксация повреждений&nbsp;☐</div>
    </td>
  </tr>
  <tr>
    <td style="background:#f0f0f0;font-weight:bold">Номер кузова</td>
    <td>—</td>
  </tr>
  <tr>
    <td style="background:#f0f0f0;font-weight:bold">Пробег</td>
    <td>—</td>
  </tr>
  <tr>
    <td style="background:#f0f0f0;font-weight:bold">Водит. удост.</td>
    <td>${b.clientLicense || "—"}</td>
  </tr>
  <tr>
    <td colspan="2" style="background:#f0f0f0;font-weight:bold">Дополнительные услуги</td>
    <td colspan="2">${servicesList}</td>
  </tr>
  <tr>
    <td style="background:#f0f0f0;font-weight:bold">Время передачи ТС</td>
    <td colspan="1"><b>${fmtDate(b.pickupDate)}</b>, ${b.pickupTime}</td>
    <td style="background:#f0f0f0;font-weight:bold;width:22%">Время возврата ТС</td>
    <td><b>${fmtDate(b.returnDate)}</b>, ${b.returnTime}</td>
  </tr>
  <tr>
    <td style="background:#f0f0f0;font-weight:bold">Место передачи</td>
    <td>${pickupPlace(b.pickupType, b.deliveryAddress, b.pickupCity)}</td>
    <td style="background:#f0f0f0;font-weight:bold">Место возврата</td>
    <td>${isOneWay ? `<b>${cityName(b.returnCity)}</b> (межгородная аренда)` : pickupPlace(b.pickupType, b.deliveryAddress, b.returnCity)}</td>
  </tr>
  <tr>
    <td style="background:#f0f0f0;font-weight:bold">Залог</td>
    <td><b>${b.deposit} $</b></td>
    <td style="background:#f0f0f0;font-weight:bold">Лимит суточного пробега</td>
    <td>Нет</td>
  </tr>
  <tr>
    <td colspan="4" style="text-align:center;background:#f0f0f0;font-weight:bold">Стоимость аренды: <span style="font-size:11pt">${b.totalPrice} $</span> (${b.pricePerDay} $/день × ${b.days} ${daysWord(b.days)})</td>
  </tr>
</table>
${isOneWay ? `<p class="oneway-note">⚠ <b>Межгородная аренда:</b> автомобиль получен в ${cityName(b.pickupCity)}, возвращается в ${cityName(b.returnCity)}. После возврата ТС остаётся в ${cityName(b.returnCity)}.</p>` : ""}

<h3>3. Порядок приёма-передачи транспортного средства</h3>
<p>3.1. Место и время передачи ТС Арендатору и возврата производится в офисе Арендодателя или в другом месте по предварительной договорённости.</p>
<p>3.2. При передаче ТС Арендатору Стороны совместно фиксируют техническое состояние кузова, салона, уровень топлива, показания одометра.</p>
<p>3.3. ТС возвращается с количеством топлива не меньшим, чем при передаче. Нехватка топлива оплачивается из расчёта 4 GEL за литр.</p>

<h3>4. Платежи и расчёты по договору</h3>
<p>4.1. Арендная плата за весь согласованный срок вносится Арендатором в полном объёме в момент подписания договора.</p>
<p>4.2. Стороны вправе согласовать продление срока аренды. Оплата за дополнительное время вносится банковским переводом или удерживается из залога.</p>
<p>4.3. При досрочном расторжении по инициативе Арендатора Арендодатель возвращает остаток за полные сутки, удерживая неустойку в размере одних суток аренды.</p>
<p>4.4. Задержка возврата без согласования: до 2 ч — 50 GEL/час; более 2 ч — 250 GEL/сутки.</p>

<h3>5. Права и обязанности сторон</h3>
<p><b>5.1. Арендодатель обязан:</b> в случае неисправности ТС по своей вине — заменить его или произвести перерасчёт; оказывать консультационную помощь по техническим вопросам эксплуатации.</p>
<p><b>5.2. Арендатор обязан:</b></p>
<p>5.2.1. Использовать ТС строго по назначению, соблюдать ПДД, не управлять в состоянии опьянения. Не использовать в качестве такси, для буксировки, с прицепом, по бездорожью, в соревнованиях и обучении вождению.</p>
<p>5.2.2. Не курить в салоне, не перевозить предметы, оставляющие запахи или повреждения в салоне.</p>
<p>5.2.3. Не передавать управление третьим лицам без письменного согласия Арендодателя, не сдавать ТС в субаренду.</p>
<p>5.2.4. Эксплуатировать ТС только на дорогах с твёрдым покрытием (асфальт, бетон), только на территории Грузии.</p>
<p>5.2.5. Использовать бензин марки не ниже АИ-95.</p>
<p>5.2.6. Не оставлять в ТС регистрационные документы и ключи. Утрата СТС, ключей замка или брелока — 300 $ каждое.</p>
<p>5.2.7. Нести все расходы по эксплуатации ТС: топливо, шиномонтаж, мойка, парковка, штрафы ПДД.</p>
<p>5.2.8. Незамедлительно сообщать Арендодателю о неисправностях и ДТП. При ДТП — прекратить движение и вызвать Полицию Грузии.</p>
<p>5.2.9. Не производить ремонт ТС без согласования. По окончании срока вернуть ТС в том же состоянии и комплектации.</p>

<h3>6. Ответственность сторон</h3>
<p>6.1. Арендатор несёт ответственность за сохранность ТС, документов и ключей на весь срок аренды.</p>
<p>6.2. При добросовестном исполнении всех обязанностей и предоставлении подтверждающих документов — ответственность не более <b>${b.deposit} $</b> (залог).</p>
<p>6.3. При нарушении хотя бы одного из условий договора — полная материальная ответственность в размере фактического ущерба Арендодателя.</p>

<h3>7. Порядок изменения и расторжения договора</h3>
<p>7.1. Арендодатель вправе в одностороннем порядке расторгнуть договор и требовать немедленного возврата ТС в случае нарушения условий договора.</p>
<p>7.2. Арендатор вправе расторгнуть договор в любое время, уведомив Арендодателя не менее чем за 24 часа.</p>

<h3>8. Дополнительные условия</h3>
<p>8.1. Договор может быть изменён или дополнен по письменному соглашению Сторон.</p>
<p>8.2. Договор составлен в двух экземплярах, по одному для каждой из Сторон.</p>

<br>
<p style="text-align:center;font-weight:bold;font-size:9.5pt;margin-bottom:5pt">Таблица ниже применяется в случае ДТП без уведомления Арендодателя и возврата автомобиля с повреждениями</p>
<table>
  <tr><td>Повреждение бампера под покраску, без дополнительных работ</td><td class="fine-td-val">200 $</td></tr>
  <tr><td>Повреждение бампера под покраску, с дополнительными работами (пайка)</td><td class="fine-td-val">от 300 $</td></tr>
  <tr><td>Повреждение элемента кузова (металл) под покраску, без доп. работ</td><td class="fine-td-val">300 $</td></tr>
  <tr><td>Повреждение элемента кузова (металл) под покраску, с доп. работами</td><td class="fine-td-val">от 400 $</td></tr>
  <tr><td>Курение в салоне автомобиля</td><td class="fine-td-val">200 $</td></tr>
  <tr><td>Перевозка животных без согласования</td><td class="fine-td-val">200 $</td></tr>
  <tr><td>Опоздание более 2-х часов без согласования</td><td class="fine-td-val">100 $</td></tr>
  <tr><td>Превышение действующих скоростных ограничений согласно участка автодороги</td><td class="fine-td-val">100 $</td></tr>
  <tr><td>Повышенная амортизация автомобиля (резкие наборы и сбросы скорости, экстремальное вождение)</td><td class="fine-td-val">от 200 $, ограничение движения</td></tr>
  <tr><td>Повреждение салона, химчистка</td><td class="fine-td-val">от 200 $</td></tr>
  <tr><td>Эксплуатация по бездорожью</td><td class="fine-td-val">200 $</td></tr>
  <tr><td>Утрата документов на транспортное средство, ключа зажигания</td><td class="fine-td-val">300 $</td></tr>
</table>

<div class="sigs">
  <div class="sig-block">
    <p><b>Арендодатель:</b></p>
    <p>ИП GEOrent</p>
    <p>Телефон: +995 599 160 564</p>
    <div class="sig-line"></div>
    <p>______________________________</p>
  </div>
  <div class="sig-block">
    <p><b>Арендатор:</b></p>
    <p><b>${b.clientName || "—"}</b></p>
    <p>Паспорт: ${b.clientPassport || "—"}</p>
    <p>Тел.: ${b.clientPhone || "—"}</p>
    <p style="margin-top:4pt;font-size:8.5pt;font-style:italic">С условиями аренды и прайсом на стоимость ознакомлен(а), в случае возникновения данных ситуаций обязуюсь оплатить стоимость согласно прайсу, ответственность принимаю полностью.</p>
    <div class="sig-line"></div>
    <p>______________________________</p>
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
