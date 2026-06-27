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
        <div className="grid md:grid-cols-3 gap-5">
          {EVENTS.map((ev, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-6 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-200 group cursor-pointer border border-white/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-gold font-display text-3xl font-semibold">{ev.date}</div>
                  <div className="text-gold-dim text-xs tracking-wider uppercase font-body mt-0.5">{ev.weekday}</div>
                </div>
                <span className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs group-hover:bg-gold/20 transition-colors">✦</span>
              </div>
              <h3 className="font-display text-xl text-parchment mb-2 group-hover:text-gold transition-colors">
                {ev.title}
              </h3>
              <p className="text-muted-foreground text-sm font-body mb-4 leading-relaxed">{ev.desc}</p>
              <div className="flex items-center gap-2 text-gold-dim text-xs font-body">
                <Icon name="MapPin" size={12} />
                <span>{ev.place}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOOK OF MONTH */}
      <section id="book-of-month" className="py-24" style={{ background: "hsl(var(--card))" }}>
        <div className="px-6 max-w-6xl mx-auto">
          <SectionTitle sub="Май 2026">Книга месяца</SectionTitle>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="text-center md:text-left">
              <div className="inline-block mb-8">
                <div className="bg-leather rounded-2xl p-10 text-center w-48 mx-auto md:mx-0 shadow-2xl shadow-black/50">
                  <div className="font-display text-gold text-xs tracking-widest uppercase mb-3 font-semibold">Книга</div>
                  <div className="font-display text-parchment text-2xl leading-tight font-semibold">Повелитель<br/>мух</div>
                  <div className="mt-3 text-gold-dim text-xs font-body italic">У. Голдинг</div>
                </div>
              </div>

              <div className="bg-background rounded-2xl p-6 text-left border border-white/5">
                <p className="text-gold text-xs tracking-wider uppercase font-body font-medium mb-4 flex items-center gap-2">
                  <span className="w-4 h-px bg-gold inline-block" />Об авторе
                </p>
                <h4 className="font-display text-xl text-parchment mb-4 font-semibold">Уильям Голдинг</h4>
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
              <h3 className="font-display text-4xl text-parchment mb-2 font-semibold">Повелитель мух</h3>
              <p className="text-gold-dim font-body italic mb-6">Уильям Голдинг, 1954</p>
              <p className="text-muted-foreground font-body text-lg leading-relaxed mb-5">
                Группа мальчиков оказывается на необитаемом острове после авиакатастрофы. Без взрослых. Они пытаются построить общество — и терпят крах. Голдинг задаёт вопрос, который не имеет удобного ответа: что происходит с человеком, когда исчезают правила?
              </p>
              <p className="text-muted-foreground font-body text-base leading-relaxed mb-8 italic border-l-2 border-gold-dim/50 pl-4 rounded-sm">
                «Роман написан как ответ на «Коралловый остров» Баллантайна, где дети-колонизаторы всё делали правильно. Голдинг, переживший войну, в это не верил.»
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Британская классика", "Антиутопия", "Психология", "XX век"].map((tag) => (
                  <span key={tag} className="bg-gold/10 text-gold text-xs px-3 py-1.5 rounded-full font-body font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-7 py-3 bg-gold text-ink font-body font-medium text-sm rounded-xl hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 transition-all">
                  Присоединиться к чтению
                </button>
                <button className="px-7 py-3 rounded-xl border border-gold-dim/50 text-gold-dim font-body font-medium text-sm hover:border-gold hover:text-gold hover:bg-gold/5 transition-all">
                  Обсудить в клубе
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}