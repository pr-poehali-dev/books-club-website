import Icon from "@/components/ui/icon";
import { ERA_LABEL, VOLUME_LABEL, MOOD_LABEL, GENRE_LABEL, type Book } from "@/data/randomizerConstants";

interface SingleBookCardProps {
  book: Book;
  index: number;
}

function SingleBookCard({ book, index }: SingleBookCardProps) {
  const nums = ["I", "II", "III"];
  return (
    <div className="bg-background rounded-2xl p-5 border border-white/5 flex flex-col gap-3 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-gold/15 text-gold text-[10px] font-body font-semibold flex items-center justify-center">
          {nums[index]}
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-base font-semibold text-parchment leading-tight mb-0.5">{book.title}</h4>
          <p className="text-gold text-xs font-body italic">{book.author}, {book.year}</p>
        </div>
      </div>
      <p className="text-muted-foreground font-body text-xs leading-relaxed pl-4 border-l border-gold/20">
        {book.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {book.moods.map(m => (
          <span key={m} className="bg-gold/10 text-gold text-[10px] px-2 py-0.5 rounded-full font-body font-medium">{MOOD_LABEL[m]}</span>
        ))}
        <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{ERA_LABEL[book.era]}</span>
        <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{VOLUME_LABEL[book.volume]}</span>
        <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{GENRE_LABEL[book.genre]}</span>
      </div>
    </div>
  );
}

interface BookResultCardProps {
  books: [Book, Book, Book];
  isFallback: boolean;
  winGlow: boolean;
  spinning: boolean;
  onSpin: () => void;
}

export default function BookResultCard({ books, isFallback, winGlow, spinning, onSpin }: BookResultCardProps) {
  return (
    <div className={`animate-result-rise ${winGlow ? "animate-winner-glow" : ""}`}>
      {isFallback && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-gold text-xs font-body font-medium px-3 py-1.5 rounded-full bg-gold/10">
            <Icon name="Sparkles" size={12} /> Точных совпадений нет — покажем похожее
          </span>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4">
        {books.map((book, i) => (
          <SingleBookCard key={i} book={book} index={i} />
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={onSpin} disabled={spinning}
          className="flex-1 py-2.5 rounded-xl bg-gold text-ink font-body font-medium text-xs hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-gold/20">
          <Icon name="RefreshCw" size={13} /> Крутить снова
        </button>
        <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-muted-foreground font-body font-medium text-xs hover:bg-white/10 hover:text-parchment transition-all flex items-center justify-center gap-2">
          <Icon name="MessageSquare" size={13} /> В клуб
        </button>
      </div>
    </div>
  );
}
