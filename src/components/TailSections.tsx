import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import Divider from "@/components/Divider";

const COMMUNITY_LINKS = [
  { label: "Основной чат", icon: "MessageCircle", desc: "Ежедневные обсуждения книг", href: "#" },
  { label: "Канал анонсов", icon: "Bell", desc: "События и новости клуба", href: "#" },

];


export default function TailSections() {
  return (
    <>
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