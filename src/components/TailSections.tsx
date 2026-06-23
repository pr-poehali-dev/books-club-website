import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import Divider from "@/components/Divider";

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

const COMMUNITY_LINKS = [
  { label: "Основной чат", icon: "MessageCircle", desc: "Ежедневные обсуждения книг", href: "#" },
  { label: "Канал анонсов", icon: "Bell", desc: "События и новости клуба", href: "#" },
  { label: "Чат событий", icon: "Calendar", desc: "Обсуждение предстоящих встреч", href: "#" },
  { label: "Книжные советы", icon: "BookOpen", desc: "Рекомендации участников", href: "#" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "text-gold" : "text-muted-foreground"}>★</span>
      ))}
    </div>
  );
}

export default function TailSections() {
  return (
    <>
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
    </>
  );
}
