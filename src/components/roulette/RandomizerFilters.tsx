import Icon from "@/components/ui/icon";
import {
  MOOD_OPTIONS, ERA_OPTIONS, VOLUME_OPTIONS, GENRE_OPTIONS,
  type Mood, type Era, type Volume, type Genre,
} from "@/data/randomizerConstants";

function Chip({ label, emoji, selected, onClick }: { label: string; emoji: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-150
        ${selected
          ? "bg-gold/20 text-gold shadow-sm shadow-gold/20"
          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-parchment"}`}>
      <span>{emoji}</span>{label}
    </button>
  );
}

interface RandomizerFiltersProps {
  mood:   Mood   | null;
  era:    Era    | null;
  volume: Volume | null;
  genre:  Genre  | null;
  onMood:   (v: Mood   | null) => void;
  onEra:    (v: Era    | null) => void;
  onVolume: (v: Volume | null) => void;
  onGenre:  (v: Genre  | null) => void;
  onReset: () => void;
}

export default function RandomizerFilters({
  mood, era, volume, genre,
  onMood, onEra, onVolume, onGenre, onReset,
}: RandomizerFiltersProps) {
  const hasFilters = !!(mood || era || volume || genre);

  return (
    <div className="space-y-4 mb-12 max-w-3xl mx-auto">
      {/* Настроение */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-body font-medium w-24 shrink-0">Настроение</span>
        <div className="flex flex-wrap gap-1.5">
          {MOOD_OPTIONS.map(m => (
            <Chip key={m.id} label={m.label} emoji={m.emoji}
              selected={mood === m.id}
              onClick={() => onMood(mood === m.id ? null : m.id)} />
          ))}
        </div>
      </div>

      {/* Эпоха */}
      <div className="flex flex-wrap items-start gap-2">
        <span className="text-muted-foreground text-xs font-body font-medium w-24 shrink-0 pt-1.5">Эпоха</span>
        <div className="flex flex-wrap gap-1.5">
          {ERA_OPTIONS.map(e => (
            <button key={e.id}
              onClick={() => onEra(era === e.id ? null : e.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-150 group relative
                ${era === e.id
                  ? "bg-gold/20 text-gold"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-parchment"}`}>
              <span>{e.emoji}</span>
              {e.label}
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-card rounded-lg text-[10px] text-muted-foreground whitespace-nowrap border border-white/10 shadow-lg z-10">
                {e.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Объём */}
      <div className="flex flex-wrap items-start gap-2">
        <span className="text-muted-foreground text-xs font-body font-medium w-24 shrink-0 pt-1.5">Объём</span>
        <div className="flex flex-wrap gap-1.5">
          {VOLUME_OPTIONS.map(v => (
            <button key={v.id}
              onClick={() => onVolume(volume === v.id ? null : v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-150 group relative
                ${volume === v.id
                  ? "bg-gold/20 text-gold"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-parchment"}`}>
              <span>{v.emoji}</span>
              {v.label}
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-card rounded-lg text-[10px] text-muted-foreground whitespace-nowrap border border-white/10 shadow-lg z-10">
                {v.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Жанр */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-xs font-body font-medium w-24 shrink-0">Жанр</span>
        <div className="flex flex-wrap gap-1.5">
          {GENRE_OPTIONS.map(g => (
            <Chip key={g.id} label={g.label} emoji={g.emoji}
              selected={genre === g.id}
              onClick={() => onGenre(genre === g.id ? null : g.id)} />
          ))}
        </div>
      </div>

      {/* Сброс */}
      {hasFilters && (
        <div className="flex justify-end">
          <button onClick={onReset}
            className="text-muted-foreground text-xs font-body hover:text-parchment flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all">
            <Icon name="X" size={12} /> Сбросить фильтры
          </button>
        </div>
      )}
    </div>
  );
}
