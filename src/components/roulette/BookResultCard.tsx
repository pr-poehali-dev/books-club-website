import Icon from "@/components/ui/icon";
import { ERA_LABEL, VOLUME_LABEL, MOOD_LABEL, GENRE_LABEL, type Book } from "@/data/randomizerConstants";

interface BookResultCardProps {
  result: { book: Book; isFallback: boolean };
  winGlow: boolean;
  spinning: boolean;
  onSpin: () => void;
}

export default function BookResultCard({ result, winGlow, spinning, onSpin }: BookResultCardProps) {
  const { book, isFallback } = result;

  return (
    <div className={`bg-background rounded-2xl p-7 border border-white/5 animate-result-rise
      ${winGlow ? "animate-winner-glow" : ""}`}>

      {isFallback && (
        <span className="inline-flex items-center gap-1.5 text-gold text-xs font-body font-medium mb-5 px-3 py-1.5 rounded-full bg-gold/10">
          <Icon name="Sparkles" size={12} />А вдруг понравится?
        </span>
      )}

      <div className="flex gap-5 items-start mb-5">
        <div className="shrink-0 w-[72px] h-[104px] rounded-xl flex flex-col items-center justify-center text-center p-2 shadow-lg shadow-black/40"
          style={{ background: "linear-gradient(145deg, #2a1800, #110c00)" }}>
          <div className="text-2xl mb-1.5">{book.emoji}</div>
          <div className="font-display text-parchment text-[9px] leading-snug">{book.title}</div>
          <div className="text-gold-dim text-[7px] mt-1 font-body truncate w-full text-center">{book.author}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-2xl text-parchment font-semibold leading-tight mb-1">{book.title}</h3>
          <p className="text-gold text-sm font-body italic mb-3">{book.author}, {book.year}</p>
          <div className="flex flex-wrap gap-1.5">
            {book.moods.map(m => (
              <span key={m} className="bg-gold/10 text-gold text-[10px] px-2 py-0.5 rounded-full font-body font-medium">{MOOD_LABEL[m]}</span>
            ))}
            <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{ERA_LABEL[book.era]}</span>
            <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{VOLUME_LABEL[book.volume]}</span>
            <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{GENRE_LABEL[book.genre]}</span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 pl-4 border-l-2 border-gold/20 rounded-sm">
        {book.description}
      </p>

      <div className="flex gap-3">
        <button onClick={onSpin} disabled={spinning}
          className="flex-1 py-2.5 rounded-xl bg-gold text-ink font-body font-medium text-xs hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-gold/20">
          <Icon name="RefreshCw" size={13} />Другую
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-muted-foreground font-body font-medium text-xs hover:bg-white/10 hover:text-parchment transition-all flex items-center justify-center gap-2">
          <Icon name="MessageSquare" size={13} />В клуб
        </button>
      </div>
    </div>
  );
}
