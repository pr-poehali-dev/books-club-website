import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";

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

const ARTICLES = [
  {
    source: "Ксюша поясни за литру",
    sourceUrl: "https://vk.com/ksyushapoyasni",
    tag: "Пушкин",
    title: "Почему Онегин — это токсичный мужчина, а не загадочный герой",
    excerpt: "Онегин убил друга на дуэли из-за того, что не хотел выглядеть трусом перед соседями. Это не романтизм — это трагедия человека, который так и не научился быть честным с собой.",
    readTime: "7 мин",
    emoji: "🖤",
  },
  {
    source: "Ксюша поясни за литру",
    sourceUrl: "https://vk.com/ksyushapoyasni",
    tag: "Достоевский",
    title: "Достоевский писал «Игрока» за 26 дней — и проиграл всё ещё раз",
    excerpt: "Он надиктовывал роман стенографистке, чтобы расплатиться с долгами. Потом женился на ней. Это не байка — это история о том, как дедлайн буквально спас жизнь.",
    readTime: "5 мин",
    emoji: "🎲",
  },
  {
    source: "Ксюша поясни за литру",
    sourceUrl: "https://vk.com/ksyushapoyasni",
    tag: "Толстой",
    title: "Лев Толстой ушёл из дома в 82 года и умер на станции",
    excerpt: "Он всю жизнь проповедовал опрощение, а сам жил в графском имении. В конце концов решился — и сбежал от семьи ночью. История о том, когда убеждения победили.",
    readTime: "6 мин",
    emoji: "🚂",
  },
  {
    source: "Ксюша поясни за литру",
    sourceUrl: "https://vk.com/ksyushapoyasni",
    tag: "Чехов",
    title: "Чехов написал «Три сестры» о реальных сёстрах — и они обиделись",
    excerpt: "Три сестры Книппер — прототипы героинь пьесы. Одна из них потом вышла замуж за Чехова. Так что финал был счастливее, чем в тексте.",
    readTime: "4 мин",
    emoji: "🌸",
  },
  {
    source: "Горький медиа",
    sourceUrl: "https://gorky.media",
    tag: "Эссе",
    title: "Почему русская литература такая депрессивная — и зачем это нужно",
    excerpt: "Климат, история, традиция — или просто так сложилось? Разбираем, откуда берётся «достоевщина» и почему западный читатель так любит наш пессимизм.",
    readTime: "10 мин",
    emoji: "❄️",
  },
  {
    source: "Полка",
    sourceUrl: "https://polka.academy",
    tag: "Список",
    title: "100 главных книг русской литературы: что читать и в каком порядке",
    excerpt: "Редакция «Полки» составила канон — с комментариями, почему каждая книга важна. Не просто список, а навигатор по столетиям.",
    readTime: "15 мин",
    emoji: "📚",
  },
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

const AUTHOR_FACTS = [
  { icon: "⚓", fact: "Во время Второй мировой служил офицером британского флота и участвовал в потоплении «Бисмарка»." },
  { icon: "📖", fact: "«Повелитель мух» был отклонён более 20 издательствами прежде чем выйти в 1954 году." },
  { icon: "🏆", fact: "В 1983 году получил Нобелевскую премию по литературе — через 30 лет после публикации дебютного романа." },
  { icon: "🎓", fact: "До писательской карьеры преподавал английский язык и греческий в школе." },
];

export default function MainSections() {
  return (
    <>
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
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="text-center md:text-left">
              <div className="inline-block border border-gold-dim p-1 mb-8">
                <div className="bg-leather p-12 text-center w-48 mx-auto md:mx-0">
                  <div className="font-display text-gold text-sm tracking-widest uppercase mb-4">Книга</div>
                  <div className="font-display text-parchment text-2xl leading-tight">Повелитель<br/>мух</div>
                  <div className="mt-4 text-gold-dim text-xs font-body italic">У. Голдинг</div>
                </div>
              </div>

              <div className="border border-border bg-background p-6 text-left">
                <p className="text-gold-dim text-xs tracking-widest uppercase font-body mb-4">Об авторе</p>
                <h4 className="font-display text-xl text-parchment mb-4">Уильям Голдинг</h4>
                <div className="space-y-3">
                  {AUTHOR_FACTS.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-base shrink-0 mt-0.5">{item.icon}</span>
                      <p className="text-muted-foreground text-sm font-body leading-relaxed">{item.fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-4xl text-parchment mb-2">Повелитель мух</h3>
              <p className="text-gold-dim font-body italic mb-6">Уильям Голдинг, 1954</p>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-5">
                Группа мальчиков оказывается на необитаемом острове после авиакатастрофы. Без взрослых. Они пытаются построить общество — и терпят крах. Голдинг задаёт вопрос, который не имеет удобного ответа: что происходит с человеком, когда исчезают правила?
              </p>
              <p className="text-muted-foreground font-body text-base leading-relaxed mb-8 italic border-l-2 border-gold-dim pl-4">
                «Роман написан как ответ на «Коралловый остров» Баллантайна, где дети-колонизаторы всё делали правильно. Голдинг, переживший войну, в это не верил.»
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Британская классика", "Антиутопия", "Психология", "XX век"].map((tag) => (
                  <span key={tag} className="border border-gold-dim text-gold-dim text-xs px-3 py-1 font-body tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-8 py-3 bg-gold text-ink font-body tracking-widest text-sm uppercase hover:bg-gold/90 transition-all">
                  Присоединиться к чтению
                </button>
                <button className="px-8 py-3 border border-gold-dim text-gold-dim font-body tracking-widest text-sm uppercase hover:border-gold hover:text-gold transition-all">
                  Обсудить в клубе
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section id="articles" className="py-24 px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Читаем в сети">Статьи о литературе</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ARTICLES.map((a, i) => (
            <a
              key={i}
              href={a.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border bg-card p-6 hover:border-gold-dim transition-all group flex flex-col cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gold-dim text-xs tracking-widest uppercase font-body border border-gold-dim px-2 py-0.5">
                  {a.tag}
                </span>
                <span className="text-2xl">{a.emoji}</span>
              </div>
              <h4 className="font-display text-lg text-parchment group-hover:text-gold transition-colors mb-3 leading-snug flex-1">
                {a.title}
              </h4>
              <p className="text-muted-foreground text-sm font-body leading-relaxed mb-5 italic">
                {a.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gold-dim font-body mt-auto pt-4 border-t border-border">
                <span>{a.source}</span>
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={11} />
                  <span>{a.readTime}</span>
                </div>
              </div>
            </a>
          ))}
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
    </>
  );
}
