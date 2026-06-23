import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import { BOOKS, type Mood, type Era, type Volume, type Book } from "@/data/books";

/* ─── Constants ─────────────────────────────────────────────── */

const MOODS: { id: Mood | "any"; label: string; emoji: string }[] = [
  { id: "any",       label: "Любое",          emoji: "🎲" },
  { id: "cry",       label: "Поплакать",       emoji: "😭" },
  { id: "think",     label: "Подумать",        emoji: "🧠" },
  { id: "adventure", label: "Приключения",     emoji: "⚡" },
  { id: "light",     label: "Лёгкое",          emoji: "☀️" },
];

const ERAS: { id: Era | "any"; label: string; emoji: string }[] = [
  { id: "any",     label: "Любая",       emoji: "⏳" },
  { id: "xix",    label: "XIX век",     emoji: "🪶" },
  { id: "xx",     label: "XX век",      emoji: "📻" },
  { id: "modern", label: "Современность", emoji: "💻" },
];

const VOLUMES: { id: Volume | "any"; label: string; emoji: string }[] = [
  { id: "any",   label: "Любой",         emoji: "📚" },
  { id: "story", label: "Рассказ",       emoji: "📄" },
  { id: "short", label: "Короткий",      emoji: "📕" },
  { id: "long",  label: "Большой роман", emoji: "📖" },
];

const ERA_LABELS: Record<Era, string> = { xix: "XIX век", xx: "XX век", modern: "Современность" };
const VOLUME_LABELS: Record<Volume, string> = { story: "Рассказ", short: "Короткий роман", long: "Большой роман" };
const MOOD_LABELS: Record<Mood, string> = { cry: "Поплакать", think: "Подумать", adventure: "Приключения", light: "Лёгкое" };

const REEL_ITEM_H = 64; // px, height of one reel cell
const SPIN_ROWS   = 18; // how many fake rows scroll before stopping

/* ─── Helpers ───────────────────────────────────────────────── */

function pickBook(mood: Mood | null, era: Era | null, volume: Volume | null): { book: Book; isFallback: boolean } {
  const filtered = BOOKS.filter((b) => {
    const moodOk   = mood   ? b.moods.includes(mood) : true;
    const eraOk    = era    ? b.era    === era        : true;
    const volumeOk = volume ? b.volume === volume     : true;
    return moodOk && eraOk && volumeOk;
  });
  if (!filtered.length) return { book: BOOKS[Math.floor(Math.random() * BOOKS.length)], isFallback: true };
  return { book: filtered[Math.floor(Math.random() * filtered.length)], isFallback: false };
}

/* ─── Reel component ────────────────────────────────────────── */

interface ReelItem { id: string; label: string; emoji: string }
interface ReelProps {
  items: ReelItem[];
  spinning: boolean;
  targetIndex: number;
  delay: number;
  label: string;
  onDone: () => void;
}

function Reel({ items, spinning, targetIndex, delay, label, onDone }: ReelProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const doneRef  = useRef(false);

  // Build a long looped tape: SPIN_ROWS fakes + target at the end
  const tape = [
    ...Array.from({ length: SPIN_ROWS }, (_, i) => items[i % items.length]),
    items[targetIndex],
  ];

  useEffect(() => {
    if (!spinning) { doneRef.current = false; return; }
    doneRef.current = false;

    const el = stripRef.current;
    if (!el) return;

    // Reset to top instantly
    el.style.transition = "none";
    el.style.transform  = "translateY(0)";

    const totalPx = SPIN_ROWS * REEL_ITEM_H;
    const duration = 1.4 + delay * 0.4; // seconds

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${duration}s cubic-bezier(0.17, 0.67, 0.25, 1.0)`;
        el.style.transform  = `translateY(-${totalPx}px)`;
      });
    });

    const timer = setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone(); }
    }, (duration + delay) * 1000);

    return () => clearTimeout(timer);
  }, [spinning]);

  return (
    <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
      <p className="text-gold-dim text-xs tracking-[0.25em] uppercase font-body">{label}</p>

      {/* Window */}
      <div className="relative w-full overflow-hidden border border-gold-dim bg-background"
           style={{ height: REEL_ITEM_H }}>
        {/* Top/bottom fades */}
        <div className="absolute inset-x-0 top-0 h-6 z-10 pointer-events-none"
             style={{ background: "linear-gradient(to bottom, hsl(var(--background)), transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-6 z-10 pointer-events-none"
             style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }} />
        {/* Gold selection line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gold z-20" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gold z-20" />

        {/* Strip */}
        <div ref={stripRef} className="will-change-transform">
          {tape.map((item, i) => (
            <div key={i}
                 className="flex items-center justify-center gap-2 font-body text-sm text-parchment"
                 style={{ height: REEL_ITEM_H }}>
              <span className="text-xl">{item.emoji}</span>
              <span className="truncate max-w-[80px] sm:max-w-[100px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Lever ─────────────────────────────────────────────────── */

interface LeverProps { onClick: () => void; disabled: boolean; spinning: boolean }

function Lever({ onClick, disabled, spinning }: LeverProps) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setPulled(true);
    setTimeout(() => setPulled(false), 500);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 group disabled:opacity-40 transition-opacity select-none"
      title="Крутить!"
    >
      {/* Ball */}
      <div className={`w-9 h-9 rounded-full border-2 border-gold bg-gold/20 flex items-center justify-center
        shadow-lg shadow-gold/20 group-hover:bg-gold/40 transition-colors
        ${pulled ? "scale-90" : "scale-100"} transition-transform duration-150`}>
        <span className="text-gold text-lg">●</span>
      </div>
      {/* Arm */}
      <div
        className={`w-1.5 rounded-full bg-gradient-to-b from-gold to-gold-dim transition-all duration-500 origin-top
          ${pulled ? "h-8 rotate-12" : "h-14"}`}
        style={{ transformOrigin: "top center" }}
      />
      {/* Base */}
      <div className="w-6 h-2 rounded-sm bg-gold-dim" />
      <span className="text-gold-dim text-xs font-body tracking-widest mt-1 uppercase">
        {spinning ? "..." : "Крутить"}
      </span>
    </button>
  );
}

/* ─── Main component ────────────────────────────────────────── */

export default function BookRandomizer() {
  const [mood,   setMood]   = useState<Mood | null>(null);
  const [era,    setEra]    = useState<Era  | null>(null);
  const [volume, setVolume] = useState<Volume | null>(null);

  const [spinning,   setSpinning]   = useState(false);
  const [doneCount,  setDoneCount]  = useState(0);
  const [result,     setResult]     = useState<{ book: Book; isFallback: boolean } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [leverAnim,  setLeverAnim]  = useState(false);
  const [winGlow,    setWinGlow]    = useState(false);

  // Indices into the reel arrays for the target item
  const [moodIdx,   setMoodIdx]   = useState(0);
  const [eraIdx,    setEraIdx]    = useState(0);
  const [volumeIdx, setVolumeIdx] = useState(0);

  const pendingResult = useRef<{ book: Book; isFallback: boolean } | null>(null);

  const spin = () => {
    if (spinning) return;

    const picked = pickBook(mood, era, volume);
    pendingResult.current = picked;

    // Find target indices in reel arrays (first item is "any", skip it)
    const moodTarget   = mood   ? MOODS.findIndex(m => m.id === mood)     : Math.floor(Math.random() * (MOODS.length   - 1)) + 1;
    const eraTarget    = era    ? ERAS.findIndex(e => e.id === era)        : Math.floor(Math.random() * (ERAS.length    - 1)) + 1;
    const volumeTarget = volume ? VOLUMES.findIndex(v => v.id === volume)  : Math.floor(Math.random() * (VOLUMES.length - 1)) + 1;

    setMoodIdx(moodTarget   >= 0 ? moodTarget   : 1);
    setEraIdx(eraTarget     >= 0 ? eraTarget    : 1);
    setVolumeIdx(volumeTarget >= 0 ? volumeTarget : 1);

    setShowResult(false);
    setWinGlow(false);
    setDoneCount(0);
    setSpinning(true);
    setLeverAnim(true);
    setTimeout(() => setLeverAnim(false), 600);
  };

  const handleReelDone = () => {
    setDoneCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        // All 3 reels done
        setTimeout(() => {
          setSpinning(false);
          setResult(pendingResult.current);
          setShowResult(true);
          setWinGlow(true);
          setTimeout(() => setWinGlow(false), 1200);
        }, 200);
      }
      return next;
    });
  };

  const moods_reel   = MOODS.map(m => ({ id: m.id, label: m.label, emoji: m.emoji }));
  const eras_reel    = ERAS.map(e => ({ id: e.id, label: e.label, emoji: e.emoji }));
  const volumes_reel = VOLUMES.map(v => ({ id: v.id, label: v.label, emoji: v.emoji }));

  const hasFilter = mood || era || volume;

  return (
    <section id="randomizer" className="py-24 bg-card border-y border-border">
      <div className="px-6 max-w-4xl mx-auto">
        <SectionTitle sub="Что почитать?">Подобрать книгу</SectionTitle>

        <p className="text-center text-muted-foreground font-body italic mb-12 text-lg">
          Выберите фильтры — или сразу крутите барабан. Удача сама выберет.
        </p>

        {/* ── Slot machine ── */}
        <div className={`border border-gold-dim bg-background p-6 md:p-8 mb-8 transition-all duration-700
          ${winGlow ? "animate-winner-glow" : ""}`}>

          {/* Decorative top bar */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {["●","◆","●","◆","●"].map((s, i) => (
              <span key={i} className={`text-xs ${i % 2 === 0 ? "text-gold" : "text-gold-dim opacity-40"}`}>{s}</span>
            ))}
            <span className="mx-3 font-display text-gold text-sm tracking-[0.3em] uppercase">Книжное казино</span>
            {["●","◆","●","◆","●"].map((s, i) => (
              <span key={i} className={`text-xs ${i % 2 === 0 ? "text-gold" : "text-gold-dim opacity-40"}`}>{s}</span>
            ))}
          </div>

          {/* Reels + Lever */}
          <div className="flex items-end gap-4 md:gap-6">
            <Reel items={moods_reel}   spinning={spinning} targetIndex={moodIdx}   delay={0}   label="Настроение" onDone={handleReelDone} />
            <Reel items={eras_reel}    spinning={spinning} targetIndex={eraIdx}    delay={0.3} label="Эпоха"      onDone={handleReelDone} />
            <Reel items={volumes_reel} spinning={spinning} targetIndex={volumeIdx} delay={0.6} label="Объём"      onDone={handleReelDone} />

            {/* Lever */}
            <div className={`shrink-0 pb-6 transition-transform duration-150 ${leverAnim ? "translate-y-1" : ""}`}>
              <Lever onClick={spin} disabled={spinning} spinning={spinning} />
            </div>
          </div>

          {/* Decorative bottom bar */}
          <div className="flex items-center justify-center gap-1 mt-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-colors duration-300
                ${winGlow ? "bg-gold" : "bg-gold-dim opacity-30"}`}
                   style={{ width: i === 4 ? 24 : 8 }} />
            ))}
          </div>
        </div>

        {/* ── Filter row ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          <span className="text-gold-dim text-xs tracking-widest uppercase font-body mr-1">Фильтры:</span>

          {MOODS.slice(1).map(m => (
            <button key={m.id}
              onClick={() => setMood(mood === m.id as Mood ? null : m.id as Mood)}
              className={`px-3 py-1.5 border text-xs font-body tracking-wide transition-all
                ${mood === m.id ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold-dim hover:text-parchment"}`}>
              {m.emoji} {m.label}
            </button>
          ))}

          <div className="w-px h-4 bg-border mx-1" />

          {ERAS.slice(1).map(e => (
            <button key={e.id}
              onClick={() => setEra(era === e.id as Era ? null : e.id as Era)}
              className={`px-3 py-1.5 border text-xs font-body tracking-wide transition-all
                ${era === e.id ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold-dim hover:text-parchment"}`}>
              {e.emoji} {e.label}
            </button>
          ))}

          <div className="w-px h-4 bg-border mx-1" />

          {VOLUMES.slice(1).map(v => (
            <button key={v.id}
              onClick={() => setVolume(volume === v.id as Volume ? null : v.id as Volume)}
              className={`px-3 py-1.5 border text-xs font-body tracking-wide transition-all
                ${volume === v.id ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold-dim hover:text-parchment"}`}>
              {v.emoji} {v.label}
            </button>
          ))}

          {hasFilter && (
            <button onClick={() => { setMood(null); setEra(null); setVolume(null); }}
              className="px-3 py-1.5 text-xs font-body text-muted-foreground hover:text-parchment flex items-center gap-1 ml-1">
              <Icon name="X" size={12} /> Сбросить
            </button>
          )}
        </div>

        {/* ── Result card ── */}
        <div className={`transition-all duration-500 ${showResult && result ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
          {result && (
            <div className="border border-gold-dim bg-background p-8 md:p-10">
              {result.isFallback && (
                <div className="inline-flex items-center gap-2 text-gold-dim text-xs tracking-widest uppercase font-body mb-6 border border-gold-dim/30 bg-gold/5 px-4 py-2">
                  <Icon name="Sparkles" size={13} />
                  А вдруг понравится?
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Cover */}
                <div className="shrink-0 mx-auto md:mx-0">
                  <div className="w-32 h-44 bg-leather border border-gold-dim flex flex-col items-center justify-center text-center p-3 shadow-xl shadow-black/50">
                    <div className="text-4xl mb-3">{result.book.emoji}</div>
                    <div className="font-display text-parchment text-xs leading-snug">{result.book.title}</div>
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

                  <div className="flex flex-wrap gap-2 mb-8">
                    {result.book.moods.map(m => (
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

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={spin} disabled={spinning}
                      className="px-6 py-3 bg-gold text-ink font-body tracking-wider text-sm uppercase hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      <Icon name="RefreshCw" size={14} />
                      Ещё раз!
                    </button>
                    <button className="px-6 py-3 border border-border text-muted-foreground font-body tracking-wider text-sm uppercase hover:border-gold-dim hover:text-parchment transition-all flex items-center justify-center gap-2">
                      <Icon name="MessageSquare" size={14} />
                      Обсудить в клубе
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
