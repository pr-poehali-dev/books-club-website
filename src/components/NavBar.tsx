import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "events", label: "События" },
  { id: "book-of-month", label: "Книга месяца" },
  { id: "articles", label: "Статьи" },
  { id: "discussions", label: "Обсуждения" },
  { id: "reviews", label: "Рецензии" },
  { id: "randomizer", label: "Подобрать книгу" },
  { id: "library", label: "Библиотека" },
  { id: "community", label: "Сообщество" },
];

interface NavBarProps {
  activeSection: string;
  mobileOpen: boolean;
  onNav: (id: string) => void;
  onToggleMobile: () => void;
}

export default function NavBar({ activeSection, mobileOpen, onNav, onToggleMobile }: NavBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <button
          onClick={() => onNav("home")}
          className="font-display text-xl text-gold font-semibold hover:opacity-80 transition-opacity"
        >
          Литературный клуб
        </button>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`text-sm font-body px-3 py-2 rounded-lg transition-all duration-150
                ${activeSection === item.id
                  ? "text-gold bg-gold/10"
                  : "text-muted-foreground hover:text-parchment hover:bg-white/5"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="lg:hidden text-gold-dim hover:text-gold transition-colors p-2 rounded-lg hover:bg-white/5"
          onClick={onToggleMobile}
        >
          <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-card/95 backdrop-blur-xl py-3 px-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`text-left text-sm font-body px-3 py-2.5 rounded-lg transition-all
                ${activeSection === item.id ? "text-gold bg-gold/10" : "text-muted-foreground hover:text-parchment hover:bg-white/5"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}