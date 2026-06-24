import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, MapPin, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

const WA = "https://wa.me/995500194533";

const TOURS = [
  {
    slug: "makhuntseti",
    title: "Водопад Махунцети · Винный дом · Фольклор",
    price: 450,
    currency: "₾",
    description:
      "Приглашаем вас отправиться в одно из самых живописных мест Аджарии. Во время путешествия вы увидите знаменитый водопад Махунцети — один из самых красивых водопадов Грузии, расположенный среди зелёных гор. Затем посетите древний арочный мост царицы Тамары, сохранившийся со средневековья.\n\nПосле прогулки вас ждёт настоящий грузинский винный дом, где вы познакомитесь с традиционной технологией изготовления вина, попробуете несколько сортов домашнего вина и знаменитую грузинскую чачу.\n\nЗавершением экскурсии станет традиционный грузинский обед с национальной кухней и яркая фольклорная программа с живым пением и танцами.",
    program: [
      "Водопад Махунцети",
      "Мост царицы Тамары",
      "Горные панорамы Аджарии",
      "Винный дом",
      "Дегустация вина",
      "Национальный обед",
      "Грузинский фольклор",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Makhuntseti_Waterfall.jpg/1280px-Makhuntseti_Waterfall.jpg",
  },
  {
    slug: "goderdzi",
    title: "Курорт Годердзи",
    price: 700,
    currency: "₾",
    description:
      "Годердзи — один из самых красивых высокогорных курортов Грузии, расположенный на высоте более 2000 метров над уровнем моря. Дорога проходит через живописные горные перевалы, хвойные леса и альпийские луга.\n\nВо время экскурсии вы посетите современный горный курорт, подниметесь на канатной дороге (при работе подъёмников), насладитесь панорамными видами Кавказских гор и сможете сделать невероятные фотографии. В любое время года Годердзи поражает своей природой: летом — зелёными лугами, осенью — яркими красками лесов, зимой — снежными вершинами.",
    program: [
      "Горный перевал Годердзи",
      "Канатная дорога",
      "Панорамные площадки",
      "Альпийские пейзажи",
      "Свободное время",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Goderdzi_Pass_Georgia.jpg/1280px-Goderdzi_Pass_Georgia.jpg",
  },
  {
    slug: "petra",
    title: "Дендропарк · Музыкальный парк · Крепость Петра",
    price: 450,
    currency: "₾",
    description:
      "Экскурсия сочетает в себе природу, современное искусство и древнюю историю.\n\nСначала вы посетите знаменитый Дендрологический парк, где собраны сотни редких растений и деревьев со всего мира. Здесь свободно гуляют павлины, фламинго и другие экзотические птицы.\n\nПосле этого отправитесь в музыкальный парк «Мини-Грузия», где представлены миниатюрные копии самых известных достопримечательностей страны.\n\nФинальной точкой станет древняя крепость Петра, построенная во времена Византийской империи. С её стен открываются потрясающие виды на Чёрное море.",
    program: [
      "Дендрологический парк",
      "Мини-Грузия",
      "Крепость Петра",
      "Видовые площадки",
      "История Аджарии",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Shekvetili_Dendrology_Park_Georgia.jpg/1280px-Shekvetili_Dendrology_Park_Georgia.jpg",
  },
  {
    slug: "prometheus",
    title: "Пещера Прометея",
    price: 600,
    currency: "₾",
    description:
      "Одна из самых известных природных достопримечательностей Грузии.\n\nВо время прогулки вы пройдёте по огромным залам пещеры, украшенным сталактитами, сталагмитами, подземными реками и необычной подсветкой. Миллионы лет природа создавала эти удивительные формы, которые сегодня считаются настоящим чудом.\n\nПри благоприятных условиях возможно путешествие по подземной реке на лодке.",
    program: [
      "Пещера Прометея",
      "Подземные залы",
      "Световое оформление",
      "Лодочная прогулка (по погоде)",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Prometheus_Cave_Georgia.jpg/1280px-Prometheus_Cave_Georgia.jpg",
  },
  {
    slug: "canyons",
    title: "Каньон Мартвили · Каньон Окаце",
    price: 700,
    currency: "₾",
    description:
      "Путешествие по двум самым красивым каньонам Грузии.\n\nВ каньоне Мартвили вас ждут прогулка вдоль бирюзовой реки и возможность прокатиться на лодке среди высоких скал и водопадов.\n\nПосле этого вы отправитесь в каньон Окаце, где пройдётесь по знаменитой подвесной смотровой дорожке, расположенной высоко над ущельем. Незабываемые виды гарантированы.",
    program: [
      "Каньон Мартвили",
      "Прогулка на лодке",
      "Каньон Окаце",
      "Подвесная смотровая площадка",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Martvili_canyon.jpg/1280px-Martvili_canyon.jpg",
  },
  {
    slug: "tbilisi",
    title: "Тбилиси — экскурсия на 1 день",
    price: 800,
    currency: "₾",
    description:
      "Познакомьтесь со столицей Грузии всего за один день.\n\nВо время экскурсии вы увидите Старый город, серные бани, площадь Европы, мост Мира, крепость Нарикала, храм Метехи, современный парк Рике и знаменитую улицу Шардени с уютными кафе.\n\nТбилиси сочетает древнюю архитектуру, современные районы и особую атмосферу грузинского гостеприимства.",
    program: [
      "Старый Тбилиси",
      "Крепость Нарикала",
      "Канатная дорога",
      "Мост Мира",
      "Серные бани",
      "Шардени",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Tbilisi_view_from_Narikala.jpg/1280px-Tbilisi_view_from_Narikala.jpg",
  },
  {
    slug: "gomismta",
    title: "Gomis Mta",
    price: 600,
    currency: "₾",
    description:
      "Gomis Mta — одно из самых красивых мест Грузии, знаменитое облаками, которые буквально плывут под ногами.\n\nВо время поездки вы поднимитесь в горы, где сможете увидеть невероятные панорамы Кавказа, альпийские луга и знаменитое «море облаков». Это одно из лучших мест в стране для фотосессий и встречи заката.",
    program: [
      "Горная дорога",
      "Панорамные виды",
      "Море облаков",
      "Фотостопы",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Gomismta.jpg/1280px-Gomismta.jpg",
  },
  {
    slug: "mtirala",
    title: "Национальный парк Мтирала",
    price: 400,
    currency: "₾",
    description:
      "Национальный парк Мтирала — настоящий тропический лес Грузии.\n\nВо время прогулки вы увидите густые субтропические леса, красивые водопады, чистейшие горные реки и подвесные мосты. Маршрут проходит по одному из самых зелёных уголков страны и отлично подходит для любителей природы.",
    program: [
      "Национальный парк",
      "Водопады",
      "Подвесной мост",
      "Пеший маршрут",
      "Смотровые площадки",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Mtirala_National_Park.jpg/1280px-Mtirala_National_Park.jpg",
  },
  {
    slug: "vardzia",
    title: "Вардзия + крепость Рабати — 2 дня",
    price: 1300,
    currency: "₾",
    badge: "2 дня",
    description:
      "Уникальное двухдневное путешествие по югу Грузии.\n\nВ первый день вы посетите знаменитую крепость Рабати — величественный средневековый комплекс, сочетающий грузинскую, турецкую и европейскую архитектуру.\n\nВо второй день отправитесь в легендарный пещерный город Вардзия, высеченный прямо в скале в XII веке. Вы увидите древние тоннели, монастырские кельи, храм с уникальными фресками и насладитесь невероятными видами на долину реки Куры.",
    program: [
      "Крепость Рабати",
      "Ночь в регионе",
      "Пещерный город Вардзия",
      "Монастырь",
      "Панорамные виды",
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Vardzia_Cave_Monastery.jpg/1280px-Vardzia_Cave_Monastery.jpg",
  },
];

export const Route = createFileRoute("/tours")({
  head: () => ({
    meta: [
      { title: "Туры и экскурсии по Грузии — GEOrent" },
      { name: "description", content: "Незабываемые туры по Грузии — горы, море, история. Организуем из Батуми." },
      { property: "og:title", content: "Туры по Грузии — GEOrent" },
    ],
  }),
  component: ToursPage,
});

function ToursPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-[var(--brand-blue)] text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="uppercase tracking-[0.25em] text-xs text-white/70 mb-3">GEOrent</p>
          <h1 className="text-4xl sm:text-6xl font-black max-w-3xl leading-tight">
            Туры и экскурсии<br />по Грузии
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl text-lg">
            Организуем поездки из Батуми — горы, море, пещеры, исторические города. Комфортный минивэн, русскоязычный гид.
          </p>
        </div>
      </section>

      {/* Tours grid */}
      <section className="py-14 sm:py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TOURS.map((tour) => (
              <article key={tour.slug} className="rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
                {/* Photo */}
                <div className="relative h-52 bg-gray-200 overflow-hidden">
                  <img
                    src={tour.photo}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {tour.badge && (
                    <span className="absolute top-3 left-3 bg-[var(--brand-tomato)] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {tour.badge}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[var(--brand-blue)] leading-snug">{tour.title}</h3>

                  {/* Price */}
                  <div className="mt-3 inline-flex items-baseline gap-1 self-start rounded-full bg-[var(--brand-olive)]/15 text-[var(--brand-olive)] px-3 py-1.5 font-black text-lg">
                    {tour.price} {tour.currency}
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">
                    {tour.description.split("\n\n")[0]}
                  </p>

                  {/* Program */}
                  <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {tour.program.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <Check className="h-3.5 w-3.5 text-[var(--brand-olive)] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    className="mt-5 w-full h-11 bg-[var(--brand-tomato)] hover:bg-[var(--brand-tomato)]/90 text-white font-semibold"
                  >
                    <a href={WA} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Узнать подробности
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles section */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10">
            <p className="uppercase tracking-[0.25em] text-xs text-muted-foreground mb-2">Комфорт и безопасность</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--brand-blue)]">Машины для туров</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Все экскурсии проводятся на комфортабельных минивэнах Mercedes-Benz Vito. Кондиционер, просторный салон, панорамные окна.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* White Vito */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="h-64 bg-gray-100 overflow-hidden">
                <img
                  src="/vito-1.jpeg"
                  alt="Mercedes-Benz Vito белый"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-[var(--brand-blue)]">Mercedes-Benz Vito — белый</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["До 8 пассажиров", "Кондиционер", "Русскоязычный гид", "WiFi"].map((f) => (
                    <span key={f} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                      <MapPin className="h-3 w-3" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Black Vito */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="h-64 bg-gray-100 overflow-hidden">
                <img
                  src="/vito-black.jpeg"
                  alt="Mercedes-Benz Vito чёрный"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-[var(--brand-blue)]">Mercedes-Benz Vito — чёрный</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["До 8 пассажиров", "Кондиционер", "Русскоязычный гид", "Детское кресло"].map((f) => (
                    <span key={f} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                      <MapPin className="h-3 w-3" /> {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[var(--brand-blue)] text-white text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-black mb-3">Хотите организовать тур?</h2>
          <p className="text-white/80 mb-7">Напишите нам в WhatsApp — подберём маршрут, ответим на вопросы.</p>
          <Button asChild size="lg" className="bg-white text-[var(--brand-blue)] hover:bg-white/90 font-bold px-8 h-12">
            <a href={WA} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              Написать в WhatsApp
            </a>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
