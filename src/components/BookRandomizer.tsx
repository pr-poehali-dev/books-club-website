import { useState } from "react";
import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import { BOOKS, type Mood, type Era, type Volume, type Book } from "@/data/books";

const MOODS: { id: Mood; label: string; emoji: string }[] = [
  { id: "cry", label: "Хочу поплакать", emoji: "😭" },
  { id: "think", label: "Хочу подумать", emoji: "🧠" },
  { id: "adventure", label: "Хочу приключений", emoji: "⚡" },
  { id: "light", label: "Хочу лёгкого", emoji: "☀️" },
];

const ERAS: { id: Era; label: string }[] = [
  { id: "xix", label: "XIX век" },
  { id: "xx", label: "XX век" },
  { id: "modern", label: "Современность" },
];

const VOLUMES: { id: Volume; label: string; desc: string }[] = [
  { id: "story", label: "Рассказ", desc: "час-два" },
  { id: "short", label: "Короткий роман", desc: "несколько дней" },
  { id: "long", label: "Большой роман", desc: "на месяц" },
];

function pickBook(mood: Mood | null, era: Era | null, volume: Volume | null): { book: Book; isFallback: boolean } {
  const filtered = BOOKS.filter((b) => {
    const moodOk = mood ? b.moods.includes(mood) : true;
    const eraOk = era ? b.era === era : true;
    const volumeOk = volume ? b.volume === volume : true;
    return moodOk && eraOk && volumeOk;
  });

  if (filtered.length === 0) {
    return { book: BOOKS[Math.floor(Math.random() * BOOKS.length)], isFallback: true };
  }

  return { book: filtered[Math.floor(Math.random() * filtered.length)], isFallback: false };
}

const ERA_LABELS: Record<Era, string> = { xix: "XIX век", xx: "XX век", modern: "Современность" };
const VOLUME_LABELS: Record<Volume, string> = { story: "Рассказ", short: "Короткий роман", long: "Большой роман" };
const MOOD_LABELS: Record<Mood, string> = { cry: "Поплакать", think: "Подумать", adventure: "Приключения", light: "Лёгкое" };

interface TagButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TagButton({ selected, onClick, children }: TagButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 border text-sm font-body tracking-wide transition-all duration-200
        ${selected
          ? "border-gold bg-gold/10 text-gold"
          : "border-border text-muted-foreground hover:border-gold-dim hover:text-parchment"
        }`}
    >
      {children}
    </button>
  );
}

export default function BookRandomizer() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [era, setEra] = useState<Era | null>(null);
  const [volume, setVolume] = useState<Volume | null>(null);
  const [result, setResult] = useState<{ book: Book; isFallback: boolean } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePick = () => {
    setIsAnimating(true);
    setResult(null);
    setTimeout(() => {
      setResult(pickBook(mood, era, volume));
      setIsAnimating(false);
    }, 400);
  };

  const handleRetry = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setResult(pickBook(mood, era, volume));
      setIsAnimating(false);
    }, 300);
  };

  const handleReset = () => {
    setMood(null);
    setEra(null);
    setVolume(null);
    setResult(null);
  };

  const hasAnyFilter = mood || era || volume;

  return (
    <section id="randomizer" className="py-24 bg-card border-y border-border">
      <div className="px-6 max-w-4xl mx-auto">
        <SectionTitle sub="Что почитать?">Подобрать книгу</SectionTitle>

        <p className="text-center text-muted-foreground font-body italic mb-10 text-lg">
          Выберите параметры — или нажмите кнопку без настроек, чтобы получить случайную книгу.
        </p>

        {/* Filters */}
        <div className="space-y-8 mb-10">
          {/* Mood */}
          <div>
            <p className="text-gold-dim text-xs tracking-[0.3em] uppercase font-body mb-4">Настроение</p>
            <div className="flex flex-wrap gap-3">
              {MOODS.map((m) => (
                <TagButton key={m.id} selected={mood === m.id} onClick={() => setMood(mood === m.id ? null : m.id)}>
                  <span className="mr-1.5">{m.emoji}</span>{m.label}
                </TagButton>
              ))}
            </div>
          </div>

          {/* Era */}
          <div>
            <p className="text-gold-dim text-xs tracking-[0.3em] uppercase font-body mb-4">Эпоха</p>
            <div className="flex flex-wrap gap-3">
              {ERAS.map((e) => (
                <TagButton key={e.id} selected={era === e.id} onClick={() => setEra(era === e.id ? null : e.id)}>
                  {e.label}
                </TagButton>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div>
            <p className="text-gold-dim text-xs tracking-[0.3em] uppercase font-body mb-4">Объём</p>
            <div className="flex flex-wrap gap-3">
              {VOLUMES.map((v) => (
                <TagButton key={v.id} selected={volume === v.id} onClick={() => setVolume(volume === v.id ? null : v.id)}>
                  {v.label}
                  <span className="ml-1.5 text-xs opacity-60">— {v.desc}</span>
                </TagButton>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <button
            onClick={handlePick}
            disabled={isAnimating}
            className="w-full sm:w-auto px-10 py-4 bg-gold text-ink font-body tracking-widest text-sm uppercase hover:bg-gold/90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Icon name="Shuffle" size={16} />
            {result ? "Подобрать снова" : "Подобрать книгу"}
          </button>
          {hasAnyFilter && (
            <button
              onClick={handleReset}
              className="text-muted-foreground text-sm font-body hover:text-parchment transition-colors flex items-center gap-1.5"
            >
              <Icon name="X" size={14} />
              Сбросить фильтры
            </button>
          )}
        </div>

        {/* Result card */}
        {(result || isAnimating) && (
          <div
            className={`border border-gold-dim bg-background transition-all duration-300 ${
              isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
            }`}
          >
            {result && (
              <div className="p-8 md:p-10">
                {result.isFallback && (
                  <div className="flex items-center gap-2 text-gold-dim text-xs tracking-widest uppercase font-body mb-6 border border-gold-dim/30 bg-gold/5 px-4 py-2.5 inline-flex">
                    <Icon name="Sparkles" size={13} />
                    А вдруг понравится?
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Book cover placeholder */}
                  <div className="shrink-0 mx-auto md:mx-0">
                    <div className="w-32 h-44 bg-leather border border-gold-dim flex flex-col items-center justify-center text-center p-3 shadow-lg shadow-black/40">
                      <div className="text-3xl mb-2">{result.book.emoji}</div>
                      <div className="font-display text-parchment text-xs leading-tight">{result.book.title}</div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-3xl md:text-4xl text-parchment mb-1 leading-tight">
                      {result.book.title}
                    </h3>
                    <p className="text-gold font-body italic mb-5">
                      {result.book.author}, {result.book.year}
                    </p>
                    <p className="text-muted-foreground font-body text-lg leading-relaxed mb-7">
                      {result.book.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {result.book.moods.map((m) => (
                        <span key={m} className="border border-gold-dim/50 text-gold-dim text-xs px-2.5 py-1 font-body">
                          {MOOD_LABELS[m]}
                        </span>
                      ))}
                      <span className="border border-border text-muted-foreground text-xs px-2.5 py-1 font-body">
                        {ERA_LABELS[result.book.era]}
                      </span>
                      <span className="border border-border text-muted-foreground text-xs px-2.5 py-1 font-body">
                        {VOLUME_LABELS[result.book.volume]}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleRetry}
                        className="px-6 py-3 border border-gold-dim text-gold-dim font-body tracking-wider text-sm uppercase hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
                      >
                        <Icon name="RefreshCw" size={14} />
                        Попробовать другую
                      </button>
                      <button
                        className="px-6 py-3 border border-border text-muted-foreground font-body tracking-wider text-sm uppercase hover:border-gold-dim hover:text-parchment transition-all flex items-center justify-center gap-2"
                      >
                        <Icon name="MessageSquare" size={14} />
                        Обсудить в клубе
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
