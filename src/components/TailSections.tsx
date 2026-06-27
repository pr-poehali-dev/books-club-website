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
      <section id="reviews" className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="px-6 max-w-6xl mx-auto">
          <SectionTitle sub="Участники о книгах">Рецензии</SectionTitle>
          <div className="grid md:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="bg-background rounded-2xl p-6 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-200 group border border-white/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-display text-lg text-parchment group-hover:text-gold transition-colors font-semibold">{r.title}</h4>
                    <p className="text-gold-dim text-sm font-body italic">{r.author}</p>
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-5 italic">
                  «{r.text}»
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-body pt-4 border-t border-white/5">
                  <span className="text-gold-dim">{r.reviewer}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button className="px-8 py-3 rounded-xl border border-gold-dim/50 text-gold-dim text-sm font-body font-medium hover:border-gold hover:text-gold hover:bg-gold/5 transition-all">
              Написать рецензию
            </button>
          </div>
        </div>
      </section>

      {/* LIBRARY */}
      <section id="library" className="py-24 px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Наш фонд">Библиотека</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LIBRARY.map((book, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl px-5 py-4 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-150 group cursor-pointer flex items-center gap-4 border border-white/5"
            >
              <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                <span className="text-gold font-display text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base font-semibold text-parchment group-hover:text-gold transition-colors truncate">
                  {book.title}
                </p>
                <p className="text-muted-foreground text-xs font-body">{book.author}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gold-dim text-xs font-body">{book.year}</p>
                <p className="text-muted-foreground text-xs font-body">{book.genre}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="px-8 py-3 rounded-xl border border-gold-dim/50 text-gold-dim text-sm font-body font-medium hover:border-gold hover:text-gold hover:bg-gold/5 transition-all">
            Вся библиотека
          </button>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="px-6 max-w-6xl mx-auto">
          <SectionTitle sub="Присоединяйтесь">Сообщество</SectionTitle>
          <p className="text-center text-muted-foreground font-body text-lg mb-12 max-w-2xl mx-auto">
            Мы в Telegram — живое сообщество читателей, где каждый день обсуждаем книги, делимся мыслями и договариваемся о встречах.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMUNITY_LINKS.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="bg-background rounded-2xl p-6 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-200 group text-center block border border-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                  <Icon name={link.icon} size={20} className="text-gold group-hover:text-gold transition-colors" fallback="Link" />
                </div>
                <h4 className="font-display text-lg font-semibold text-parchment group-hover:text-gold transition-colors mb-1.5">
                  {link.label}
                </h4>
                <p className="text-muted-foreground text-sm font-body">{link.desc}</p>
              </a>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-ink font-body font-medium text-sm rounded-2xl hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5 transition-all"
            >
              <Icon name="Send" size={16} />
              Перейти в Telegram
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 text-center">
        <p className="font-display text-2xl font-semibold text-gold mb-2">Литературный клуб</p>
        <p className="text-muted-foreground text-sm font-body italic mb-6">
          «Книги — это зеркала: в них можно увидеть лишь то, что уже знаешь»
        </p>
        <Divider />
        <p className="text-muted-foreground text-xs font-body mt-4">
          © 2026 Литературный клуб
        </p>
      </footer>
    </>
  );
}