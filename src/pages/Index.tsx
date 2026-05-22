import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/d1e3655d-4032-44e7-ac28-0afea4a15ee2/files/12997f2b-77f8-40dd-a340-b33f4100e576.jpg";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "events", label: "События" },
  { id: "book-of-month", label: "Книга месяца" },
  { id: "discussions", label: "Обсуждения" },
  { id: "reviews", label: "Рецензии" },
  { id: "library", label: "Библиотека" },
  { id: "community", label: "Сообщество" },
];

const EVENTS = [
  {
    date: "28 мая",
    weekday: "Среда",
    title: "Вечер Достоевского",
    desc: "Обсуждение «Братьев Карамазовых» — финальная часть цикла.",
    place: "Библиотека им. Тургенева, зал №3",
  },
  {
    date: "7 июня",
    weekday: "Суббота",
    title: "Открытое чтение",
    desc: "Читаем вслух любимые отрывки из русской классики XIX века.",
    place: "Парк «Зарядье», летний павильон",
  },
  {
    date: "21 июня",
    weekday: "Суббота",
    title: "Лекция: «Серебряный век»",
    desc: "Поэзия Блока, Ахматовой и Цветаевой — контекст эпохи.",
    place: "Онлайн, Zoom",
  },
];

const REVIEWS = [
  {
    title: "Мастер и Маргарита",
    author: "М. Булгаков",
    reviewer: "Елена Соколова",
    rating: 5,
    text: "Роман, который невозможно прочесть лишь однажды. Булгаков создал многослойное произведение, где каждое перечитывание открывает новые смыслы. Особенно восхищает линия Пилата — трагедия власти и совести.",
    date: "12 мая 2026",
  },
  {
    title: "Анна Каренина",
    author: "Л. Толстой",
    reviewer: "Андрей Волков",
    rating: 5,
    text: "Толстой превращает бытовую историю в философский трактат о свободе и долге. Каренина — не жертва обстоятельств, а человек, выбравший собственный путь. Грандиозно и болезненно.",
    date: "3 мая 2026",
  },
  {
    title: "Преступление и наказание",
    author: "Ф. Достоевский",
    reviewer: "Мария Белова",
    rating: 4,
    text: "Достоевский исследует психологию преступления с хирургической точностью. Раскольников — зеркало, в котором каждый читатель видит собственные тёмные углы. Тяжело, но необходимо.",
    date: "25 апреля 2026",
  },
];

const LIBRARY = [
  { title: "Война и мир", author: "Лев Толстой", year: "1869", genre: "Роман" },
  { title: "Идиот", author: "Ф. Достоевский", year: "1869", genre: "Роман" },
  { title: "Вишнёвый сад", author: "А. Чехов", year: "1904", genre: "Пьеса" },
  { title: "Евгений Онегин", author: "А. Пушкин", year: "1833", genre: "Роман в стихах" },
  { title: "Мёртвые души", author: "Н. Гоголь", year: "1842", genre: "Поэма" },
  { title: "Обломов", author: "И. Гончаров", year: "1859", genre: "Роман" },
];

const DISCUSSIONS = [
  {
    topic: "Можно ли оправдать Раскольникова?",
    book: "Преступление и наказание",
    replies: 47,
    active: "2 часа назад",
  },
  {
    topic: "Образ Наташи Ростовой: эволюция или деградация?",
    book: "Война и мир",
    replies: 31,
    active: "вчера",
  },
  {
    topic: "«Тихий Дон» — трагедия или эпос?",
    book: "Тихий Дон",
    replies: 24,
    active: "3 дня назад",
  },
  {
    topic: "Символизм в пьесах Чехова",
    book: "Вишнёвый сад / Три сестры",
    replies: 18,
    active: "неделю назад",
  },
];

const COMMUNITY_LINKS = [
  { label: "Основной чат", icon: "MessageCircle", desc: "Ежедневные обсуждения книг", href: "#" },
  { label: "Канал анонсов", icon: "Bell", desc: "События и новости клуба", href: "#" },
  { label: "Чат событий", icon: "Calendar", desc: "Обсуждение предстоящих встреч", href: "#" },
  { label: "Книжные советы", icon: "BookOpen", desc: "Рекомендации участников", href: "#" },
];

function Divider() {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-dim opacity-40" />
      <span className="text-gold-dim text-lg leading-none">✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-dim opacity-40" />
    </div>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-12">
      {sub && (
        <p className="text-gold-dim text-sm tracking-[0.3em] uppercase mb-3 font-body">{sub}</p>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-parchment font-light">{children}</h2>
      <Divider />
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-gold" : "text-muted-foreground"}>★</span>
      ))}
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo("home")}
            className="font-display text-xl text-gold tracking-wide hover:opacity-80 transition-opacity"
          >
            Литературный клуб
          </button>

          <div className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm tracking-wider font-body transition-colors relative pb-0.5
                  ${activeSection === item.id
                    ? "text-gold"
                    : "text-muted-foreground hover:text-parchment"
                  }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-gold" />
                )}
              </button>
            ))}
          </div>

          <button
            className="lg:hidden text-gold-dim hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-card py-4 px-6 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-left text-base font-body py-1.5 transition-colors
                  ${activeSection === item.id ? "text-gold" : "text-muted-foreground hover:text-parchment"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-gold-dim text-xs tracking-[0.5em] uppercase mb-6 animate-fade-in-up font-body">
            Клуб любителей классической литературы
          </p>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-parchment font-light leading-none mb-6 animate-fade-in-up delay-200">
            Литературный<br />
            <em className="text-gold italic">клуб</em>
          </h1>
          <Divider />
          <p className="text-muted-foreground text-lg md:text-xl font-body italic mt-6 mb-10 animate-fade-in-up delay-400">
            «Читать — значит думать чужой головой вместо собственной»<br />
            <span className="text-gold-dim text-sm not-italic">— Артур Шопенгауэр</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-500">
            <button
              onClick={() => scrollTo("events")}
              className="px-8 py-3 bg-gold text-ink font-body tracking-widest text-sm uppercase hover:bg-gold/90 transition-all hover:shadow-lg hover:shadow-gold/20"
            >
              Ближайшие события
            </button>
            <button
              onClick={() => scrollTo("community")}
              className="px-8 py-3 border border-gold-dim text-gold-dim font-body tracking-widest text-sm uppercase hover:border-gold hover:text-gold transition-all"
            >
              Вступить в клуб
            </button>
          </div>
        </div>
        <button
          onClick={() => scrollTo("events")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-dim hover:text-gold transition-colors animate-bounce"
        >
          <Icon name="ChevronDown" size={28} />
        </button>
      </section>

      {/* EVENTS */}
      <section id="events" className="py-24 px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Расписание">Ближайшие события</SectionTitle>
        <div className="grid md:grid-cols-3 gap-6">
          {EVENTS.map((ev, i) => (
            <div
              key={i}
              className="border border-border bg-card p-6 hover:border-gold-dim transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-gold font-display text-3xl font-light">{ev.date}</div>
                  <div className="text-gold-dim text-xs tracking-widest uppercase">{ev.weekday}</div>
                </div>
                <span className="text-gold-dim opacity-40 group-hover:opacity-100 transition-opacity">✦</span>
              </div>
              <h3 className="font-display text-xl text-parchment mb-2 group-hover:text-gold transition-colors">
                {ev.title}
              </h3>
              <p className="text-muted-foreground text-sm font-body mb-4 leading-relaxed">{ev.desc}</p>
              <div className="flex items-center gap-2 text-gold-dim text-xs">
                <Icon name="MapPin" size={12} />
                <span>{ev.place}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOK OF MONTH */}
      <section id="book-of-month" className="py-24 bg-card border-y border-border">
        <div className="px-6 max-w-6xl mx-auto">
          <SectionTitle sub="Май 2026">Книга месяца</SectionTitle>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block border border-gold-dim p-1 mb-8">
                <div className="bg-leather p-12 text-center w-48 mx-auto md:mx-0">
                  <div className="font-display text-gold text-sm tracking-widest uppercase mb-4">Книга</div>
                  <div className="font-display text-parchment text-2xl leading-tight">Отцы<br/>и дети</div>
                  <div className="mt-4 text-gold-dim text-xs font-body italic">И. С. Тургенев</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-display text-3xl text-parchment mb-2">Отцы и дети</h3>
              <p className="text-gold-dim font-body italic mb-6">Иван Сергеевич Тургенев, 1862</p>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-6">
                Роман о конфликте поколений, нигилизме и вечных вопросах любви и смерти. Образ Базарова — один из самых дискуссионных в русской литературе. Читаем и обсуждаем в июне.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Русская классика", "XIX век", "Нигилизм", "Конфликт поколений"].map((tag) => (
                  <span key={tag} className="border border-gold-dim text-gold-dim text-xs px-3 py-1 font-body tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="px-8 py-3 bg-gold text-ink font-body tracking-widest text-sm uppercase hover:bg-gold/90 transition-all">
                Присоединиться к чтению
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DISCUSSIONS */}
      <section id="discussions" className="py-24 px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Форум">Обсуждения</SectionTitle>
        <div className="space-y-3">
          {DISCUSSIONS.map((d, i) => (
            <div
              key={i}
              className="border border-border bg-card px-6 py-5 hover:border-gold-dim transition-all group cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-lg text-parchment group-hover:text-gold transition-colors mb-1 truncate">
                  {d.topic}
                </h4>
                <p className="text-gold-dim text-xs font-body italic">{d.book}</p>
              </div>
              <div className="flex items-center gap-6 shrink-0 text-muted-foreground text-sm font-body">
                <div className="flex items-center gap-1.5">
                  <Icon name="MessageSquare" size={14} />
                  <span>{d.replies}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-xs">
                  <Icon name="Clock" size={12} />
                  <span>{d.active}</span>
                </div>
                <Icon name="ChevronRight" size={16} className="text-gold-dim group-hover:text-gold transition-colors" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="border border-gold-dim text-gold-dim px-8 py-3 text-sm tracking-widest uppercase font-body hover:border-gold hover:text-gold transition-all">
            Начать новое обсуждение
          </button>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-card border-y border-border">
        <div className="px-6 max-w-6xl mx-auto">
          <SectionTitle sub="Участники о книгах">Рецензии</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="border border-border bg-background p-6 hover:border-gold-dim transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-display text-lg text-parchment group-hover:text-gold transition-colors">{r.title}</h4>
                    <p className="text-gold-dim text-sm font-body italic">{r.author}</p>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-5 italic">
                  «{r.text}»
                </p>
                <div className="flex items-center justify-between text-xs text-gold-dim font-body">
                  <span>{r.reviewer}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="border border-gold-dim text-gold-dim px-8 py-3 text-sm tracking-widest uppercase font-body hover:border-gold hover:text-gold transition-all">
              Написать рецензию
            </button>
          </div>
        </div>
      </section>

      {/* LIBRARY */}
      <section id="library" className="py-24 px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Наш фонд">Библиотека</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LIBRARY.map((book, i) => (
            <div
              key={i}
              className="border border-border bg-card px-5 py-4 hover:border-gold-dim transition-all group cursor-pointer flex items-center gap-4"
            >
              <div className="text-gold-dim text-2xl opacity-50 group-hover:opacity-100 transition-opacity font-display shrink-0">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base text-parchment group-hover:text-gold transition-colors truncate">
                  {book.title}
                </p>
                <p className="text-muted-foreground text-xs font-body italic">{book.author}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gold-dim text-xs font-body">{book.year}</p>
                <p className="text-muted-foreground text-xs font-body">{book.genre}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="border border-gold-dim text-gold-dim px-8 py-3 text-sm tracking-widest uppercase font-body hover:border-gold hover:text-gold transition-all">
            Вся библиотека
          </button>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="py-24 bg-card border-y border-border">
        <div className="px-6 max-w-6xl mx-auto">
          <SectionTitle sub="Присоединяйтесь">Сообщество</SectionTitle>
          <p className="text-center text-muted-foreground font-body text-lg mb-12 max-w-2xl mx-auto italic">
            Мы в Telegram — живое сообщество читателей, где каждый день обсуждаем книги, делимся мыслями и договариваемся о встречах.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMMUNITY_LINKS.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="border border-border bg-background p-6 hover:border-gold-dim transition-all group text-center block"
              >
                <div className="w-12 h-12 border border-gold-dim flex items-center justify-center mx-auto mb-4 group-hover:border-gold transition-colors">
                  <Icon name={link.icon} size={20} className="text-gold-dim group-hover:text-gold transition-colors" fallback="Link" />
                </div>
                <h4 className="font-display text-lg text-parchment group-hover:text-gold transition-colors mb-2">
                  {link.label}
                </h4>
                <p className="text-muted-foreground text-sm font-body">{link.desc}</p>
              </a>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-ink font-body tracking-widest text-sm uppercase hover:bg-gold/90 transition-all"
            >
              <Icon name="Send" size={16} />
              Перейти в Telegram
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 text-center border-t border-border">
        <p className="font-display text-2xl text-gold mb-2">Литературный клуб</p>
        <p className="text-muted-foreground text-sm font-body italic mb-6">
          «Книги — это зеркала: в них можно увидеть лишь то, что уже знаешь»
        </p>
        <Divider />
        <p className="text-muted-foreground text-xs font-body mt-4 tracking-wider">
          © 2026 Литературный клуб
        </p>
      </footer>
    </div>
  );
}
