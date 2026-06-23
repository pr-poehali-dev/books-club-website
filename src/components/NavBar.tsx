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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => onNav("home")}
          className="font-display text-xl text-gold tracking-wide hover:opacity-80 transition-opacity"
        >
          Литературный клуб
        </button>

        <div className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
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
          onClick={onToggleMobile}
        >
          <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card py-4 px-6 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`text-left text-base font-body py-1.5 transition-colors
                ${activeSection === item.id ? "text-gold" : "text-muted-foreground hover:text-parchment"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}