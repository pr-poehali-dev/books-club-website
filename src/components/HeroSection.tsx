import Icon from "@/components/ui/icon";
import Divider from "@/components/Divider";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/d1e3655d-4032-44e7-ac28-0afea4a15ee2/files/12997f2b-77f8-40dd-a340-b33f4100e576.jpg";

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export default function HeroSection({ onScrollTo }: HeroSectionProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <span className="inline-block text-gold text-xs font-body font-medium tracking-[0.2em] uppercase mb-6 px-4 py-1.5 rounded-full bg-gold/10 animate-fade-in-up">
          Клуб любителей классической литературы
        </span>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-parchment font-semibold leading-[0.95] mb-6 animate-fade-in-up delay-200">
          Литературный<br />
          <em className="text-gold italic">клуб</em>
        </h1>
        <Divider />
        <p className="text-muted-foreground text-lg md:text-xl font-body italic mt-6 mb-10 animate-fade-in-up delay-400">
          «Читать — значит думать чужой головой вместо собственной»<br />
          <span className="text-gold-dim text-sm not-italic">— Артур Шопенгауэр</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-500">
          <button
            onClick={() => onScrollTo("events")}
            className="px-8 py-3.5 bg-gold text-ink font-body font-medium text-sm rounded-xl hover:bg-gold/90 transition-all hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5"
          >
            Ближайшие события
          </button>
          <button
            onClick={() => onScrollTo("community")}
            className="px-8 py-3.5 rounded-xl border border-gold-dim/50 text-gold-dim font-body font-medium text-sm hover:border-gold hover:text-gold hover:bg-gold/5 transition-all"
          >
            Вступить в клуб
          </button>
        </div>
      </div>
      <button
        onClick={() => onScrollTo("events")}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-dim hover:text-gold transition-colors animate-bounce"
      >
        <Icon name="ChevronDown" size={28} />
      </button>
    </section>
  );
}