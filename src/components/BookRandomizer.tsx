import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import { BOOKS, type Mood, type Era, type Volume, type Genre, type Book } from "@/data/books";

/* ─── Constants ──────────────────────────────────────────────── */

const MOOD_OPTIONS: { id: Mood; label: string; emoji: string }[] = [
  { id: "romance",  label: "Романтика",   emoji: "🌹" },
  { id: "comedy",   label: "Комедия",     emoji: "😄" },
  { id: "tragedy",  label: "Трагедия",    emoji: "😭" },
  { id: "lyric",    label: "Лирика",      emoji: "🎵" },
  { id: "heroic",   label: "Героическое", emoji: "⚡" },
  { id: "drama",    label: "Драма",       emoji: "🎭" },
];

const ERA_OPTIONS: { id: Era; label: string; emoji: string; hint: string }[] = [
  { id: "antique",  label: "Античность",    emoji: "🏛️", hint: "Гомер, Платон, Овидий" },
  { id: "medieval", label: "Средневековье", emoji: "🏰", hint: "Данте, Шекспир, Боккаччо" },
  { id: "xix",      label: "XIX век",       emoji: "🪶", hint: "Толстой, Пушкин, Достоевский" },
  { id: "xx",       label: "XX век",        emoji: "📻", hint: "Булгаков, Камю, Оруэлл" },
  { id: "modern",   label: "Современность", emoji: "💻", hint: "Мураками, Харари, Коэльо" },
];

const VOLUME_OPTIONS: { id: Volume; label: string; emoji: string; hint: string }[] = [
  { id: "sketch",  label: "Очерк / рассказ / новелла", emoji: "📄", hint: "Чехов, Гоголь, Хемингуэй" },
  { id: "story",   label: "Рассказ",                   emoji: "📝", hint: "Чехов, Бунин, По" },
  { id: "novella", label: "Новелла / повесть",          emoji: "📋", hint: "Булгаков, Камю, Голдинг" },
  { id: "tale",    label: "Повесть",                   emoji: "📕", hint: "Лермонтов, Тургенев" },
  { id: "novel",   label: "Роман",                     emoji: "📗", hint: "Достоевский, Мураками" },
  { id: "epic",    label: "Роман-эпопея",              emoji: "📖", hint: "Толстой, Гомер, Данте" },
];

const GENRE_OPTIONS: { id: Genre; label: string; emoji: string }[] = [
  { id: "fiction",    label: "Художественная проза", emoji: "✍️" },
  { id: "philosophy", label: "Философия",            emoji: "🧠" },
  { id: "nonfiction", label: "Нон-фикшн",            emoji: "📰" },
  { id: "drama",      label: "Пьеса / драма",        emoji: "🎬" },
  { id: "poetry",     label: "Поэзия",               emoji: "🌿" },
];

const ERA_LABEL:    Record<Era,    string> = { antique: "Античность", medieval: "Средневековье", xix: "XIX век", xx: "XX век", modern: "Современность" };
const VOLUME_LABEL: Record<Volume, string> = { sketch: "Очерк", story: "Рассказ", novella: "Новелла / повесть", tale: "Повесть", novel: "Роман", epic: "Роман-эпопея" };
const MOOD_LABEL:   Record<Mood,   string> = { romance: "Романтика", comedy: "Комедия", tragedy: "Трагедия", lyric: "Лирика", heroic: "Героическое", drama: "Драма" };
const GENRE_LABEL:  Record<Genre,  string> = { fiction: "Проза", philosophy: "Философия", nonfiction: "Нон-фикшн", drama: "Пьеса", poetry: "Поэзия" };

const SIZE  = 480;
const CX    = SIZE / 2;
const CY    = SIZE / 2;
const R_OUT = SIZE / 2 - 4;
const R_SEG = R_OUT - 30;
const R_IN  = 88;
const BALL_R = 9;

const SEG_COLORS = [
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
];

/* ─── Helpers ────────────────────────────────────────────────── */

function pickFiltered(mood: Mood|null, era: Era|null, volume: Volume|null, genre: Genre|null): Book[] {
  const f = BOOKS.filter(b =>
    (mood   ? b.moods.includes(mood) : true) &&
    (era    ? b.era    === era        : true) &&
    (volume ? b.volume === volume     : true) &&
    (genre  ? b.genre  === genre      : true)
  );
  return f.length >= 4 ? f : BOOKS;
}

/* ─── Canvas wheel drawing ───────────────────────────────────── */

function drawWheel(ctx: CanvasRenderingContext2D, angle: number, segments: string[], ballAngle: number, ballR: number) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  const n = segments.length;
  const step = (Math.PI * 2) / n;

  /* Outer metallic rim */
  const rimG = ctx.createRadialGradient(CX, CY, R_SEG + 2, CX, CY, R_OUT + 2);
  rimG.addColorStop(0,   "#b8860b");
  rimG.addColorStop(0.3, "#ffd700");
  rimG.addColorStop(0.65,"#daa520");
  rimG.addColorStop(1,   "#7a5c00");
  ctx.beginPath(); ctx.arc(CX, CY, R_OUT, 0, Math.PI * 2);
  ctx.fillStyle = rimG; ctx.fill();

  /* Rim inner shadow */
  const rimShadow = ctx.createRadialGradient(CX, CY, R_SEG, CX, CY, R_SEG + 10);
  rimShadow.addColorStop(0, "rgba(0,0,0,0.5)");
  rimShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath(); ctx.arc(CX, CY, R_SEG + 10, 0, Math.PI * 2);
  ctx.fillStyle = rimShadow; ctx.fill();

  /* Segments */
  for (let i = 0; i < n; i++) {
    const a0  = angle + i * step;
    const a1  = a0 + step;
    const mid = a0 + step / 2;

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R_SEG, a0, a1);
    ctx.closePath();
    ctx.fillStyle = SEG_COLORS[i % SEG_COLORS.length];
    ctx.fill();

    /* 3D sheen */
    const grd = ctx.createRadialGradient(
      CX + Math.cos(mid) * R_SEG * 0.45,
      CY + Math.sin(mid) * R_SEG * 0.45,
      0,
      CX, CY, R_SEG
    );
    grd.addColorStop(0, "rgba(255,255,255,0.09)");
    grd.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R_SEG, a0, a1);
    ctx.closePath();
    ctx.fillStyle = grd; ctx.fill();

    /* Gold divider */
    ctx.beginPath();
    ctx.moveTo(CX + Math.cos(a0) * (R_IN + 2), CY + Math.sin(a0) * (R_IN + 2));
    ctx.lineTo(CX + Math.cos(a0) * R_SEG,      CY + Math.sin(a0) * R_SEG);
    ctx.strokeStyle = "#c8a000"; ctx.lineWidth = 1.5; ctx.stroke();

    /* Label */
    const lr = (R_SEG + R_IN) / 2 + 6;
    const lx = CX + Math.cos(mid) * lr;
    const ly = CY + Math.sin(mid) * lr;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(mid + Math.PI / 2);

    const parts = segments[i].split("|");
    const emoji = parts[0] || "";
    const text  = parts[1] || "";

    const emojiSize = Math.max(10, Math.min(15, (R_SEG - R_IN) * 0.27));
    const textSize  = Math.max(7,  Math.min(9,  (R_SEG - R_IN) * 0.17));

    ctx.font = `${emojiSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#fff";
    ctx.fillText(emoji, 0, 1);

    ctx.font = `bold ${textSize}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    const words = text.split(" ");
    if (text.length <= 10 || words.length <= 1) {
      ctx.fillText(text, 0, 3);
    } else {
      const half = Math.ceil(words.length / 2);
      ctx.fillText(words.slice(0, half).join(" "), 0, 3);
      ctx.fillText(words.slice(half).join(" "),    0, 3 + textSize + 1);
    }
    ctx.restore();
  }

  /* Inner hub rings */
  for (const [r, stop0, stop1, stop2] of [
    [R_IN,       "#3a2a00","#1a1000","#0a0800"],
    [R_IN * 0.7, "#2a1e00","#140e00","#060400"],
    [R_IN * 0.45,"#1e1600","#0e0900","#040200"],
  ] as [number, string, string, string][]) {
    const g = ctx.createRadialGradient(CX - r * 0.2, CY - r * 0.2, r * 0.05, CX, CY, r);
    g.addColorStop(0, stop0); g.addColorStop(0.5, stop1); g.addColorStop(1, stop2);
    ctx.beginPath(); ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "#c8a000"; ctx.lineWidth = 1.2; ctx.stroke();
  }

  /* Center jewel */
  const jg = ctx.createRadialGradient(CX - 6, CY - 6, 2, CX, CY, 22);
  jg.addColorStop(0, "#ffe066"); jg.addColorStop(0.5, "#daa520"); jg.addColorStop(1, "#5a3e00");
  ctx.beginPath(); ctx.arc(CX, CY, 22, 0, Math.PI * 2);
  ctx.fillStyle = jg; ctx.fill();
  ctx.strokeStyle = "#ffe066"; ctx.lineWidth = 2; ctx.stroke();

  /* Ball */
  const bx = CX + Math.cos(ballAngle) * ballR;
  const by = CY + Math.sin(ballAngle) * ballR;
  const bg = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, BALL_R);
  bg.addColorStop(0, "#ffffff"); bg.addColorStop(0.4, "#ddd"); bg.addColorStop(1, "#888");
  ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
  ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1; ctx.stroke();

  /* Pointer */
  ctx.save();
  ctx.translate(CX, 10);
  ctx.beginPath();
  ctx.moveTo(-11, 0); ctx.lineTo(11, 0); ctx.lineTo(0, 24);
  ctx.closePath();
  const pg = ctx.createLinearGradient(-11, 0, 11, 0);
  pg.addColorStop(0, "#daa520"); pg.addColorStop(0.5, "#ffe066"); pg.addColorStop(1, "#b8860b");
  ctx.fillStyle = pg; ctx.fill();
  ctx.strokeStyle = "#7a5c00"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

/* ─── Wheel component ────────────────────────────────────────── */

interface WheelProps {
  segments: string[];
  spinning: boolean;
  targetIdx: number;
  onDone: () => void;
}

function RouletteWheel({ segments, spinning, targetIdx, onDone }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const angleRef  = useRef(0);
  const ballRef   = useRef({ angle: -Math.PI / 4, r: R_SEG - 14 });
  const doneRef   = useRef(false);

  const n = segments.length;

  const render = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    drawWheel(ctx, angleRef.current, segments, ballRef.current.angle, ballRef.current.r);
  }, [segments]);

  useEffect(() => { render(); }, [render]);

  useEffect(() => {
    if (!spinning) { doneRef.current = false; return; }
    doneRef.current = false;
    cancelAnimationFrame(rafRef.current);

    const segStep  = (Math.PI * 2) / n;
    // Target: pointer at top (−π/2) aligns with centre of segment targetIdx
    // wheel angle when segment i centre is at pointer: −π/2 − (i·step + step/2)
    const baseTarget = -Math.PI / 2 - (targetIdx * segStep + segStep / 2);
    const extraTurns = Math.PI * 2 * (12 + Math.floor(Math.random() * 5));
    const totalDelta = baseTarget - angleRef.current - extraTurns;
    // force backward (more negative) so wheel spins clockwise
    const startAngle = angleRef.current;
    const endAngle   = startAngle + totalDelta;

    const startBallAngle = ballRef.current.angle;
    const FRAMES = 240; // ~4 s at 60 fps
    let f = 0;

    const tick = () => {
      f++;
      const t = Math.min(f / FRAMES, 1);
      // easeInOutQuint
      const eased = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

      angleRef.current = startAngle + totalDelta * eased;

      // Ball: counter-rotate fast then settle
      const ballSpeed = t < 0.55
        ? 0.21 * (1 - t * 0.25)
        : 0.21 * (1 - 0.55 * 0.25) * Math.pow(1 - (t - 0.55) / 0.45, 1.6);
      ballRef.current.angle = startBallAngle - (startBallAngle - ballRef.current.angle) + (startBallAngle - (startBallAngle + ballSpeed * FRAMES * t * 0.8));
      // simpler: just decrement each frame
      ballRef.current.angle -= ballSpeed;

      // Ball falls inward after 55%
      if (t > 0.55) {
        const prog = (t - 0.55) / 0.45;
        ballRef.current.r = (R_SEG - 14) - prog * ((R_SEG - 14) - 92);
      }

      render();

      if (f >= FRAMES) {
        angleRef.current = endAngle;
        ballRef.current.r = 92;
        render();
        if (!doneRef.current) { doneRef.current = true; onDone(); }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spinning, targetIdx, n, render, onDone]);

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Dark decorative surround */}
      <div className="absolute rounded-full pointer-events-none"
        style={{
          width: SIZE + 40, height: SIZE + 40,
          top: -20, left: -20,
          background: "radial-gradient(circle at 35% 30%, #2a1a00, #120d00 55%, #060400)",
          boxShadow: "0 0 0 5px #c8a000, 0 0 0 8px #7a5c00, 0 0 60px rgba(200,160,0,0.25), inset 0 0 40px rgba(0,0,0,0.9)",
          zIndex: 0,
        }} />
      {/* Bolt dots on rim */}
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
        const r = SIZE / 2 + 14;
        return (
          <div key={i} className="absolute w-2 h-2 rounded-full z-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 40% 35%, #ffe066, #7a5c00)",
              boxShadow: "0 0 4px rgba(200,160,0,0.6)",
              left: CX + Math.cos(a) * r - 4,
              top:  CY + Math.sin(a) * r - 4,
            }} />
        );
      })}
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="relative z-10 rounded-full cursor-pointer"
        style={{ filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.9))" }}
        onClick={() => {}}
      />
    </div>
  );
}

/* ─── Filter chip ────────────────────────────────────────────── */

function Chip({ label, emoji, selected, onClick }: { label:string; emoji:string; selected:boolean; onClick:()=>void }) {
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

/* ─── Main ───────────────────────────────────────────────────── */

export default function BookRandomizer() {
  const [mood,   setMood]   = useState<Mood   | null>(null);
  const [era,    setEra]    = useState<Era    | null>(null);
  const [volume, setVolume] = useState<Volume | null>(null);
  const [genre,  setGenre]  = useState<Genre  | null>(null);

  const [spinning,   setSpinning]   = useState(false);
  const [result,     setResult]     = useState<{book:Book; isFallback:boolean} | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [winGlow,    setWinGlow]    = useState(false);
  const [targetIdx,  setTargetIdx]  = useState(0);

  const pool = pickFiltered(mood, era, volume, genre);
  const hasFilters = !!(mood || era || volume || genre);
  const isFallback = pool === BOOKS && hasFilters;
  const wheelBooks = pool.slice(0, 16);
  const segments   = wheelBooks.map(b => `${b.emoji}|${b.title}`);

  const handleSpin = () => {
    if (spinning) return;
    setShowResult(false);
    setWinGlow(false);
    const idx = Math.floor(Math.random() * wheelBooks.length);
    setTargetIdx(idx);
    setResult({ book: wheelBooks[idx], isFallback: !!isFallback });
    setSpinning(true);
  };

  const handleDone = useCallback(() => {
    setSpinning(false);
    setShowResult(true);
    setWinGlow(true);
    setTimeout(() => setWinGlow(false), 1400);
  }, []);

  return (
    <section id="randomizer" className="py-20 overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <div className="px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Что почитать?">Книжная рулетка</SectionTitle>

        {/* Filters */}
        <div className="space-y-4 mb-12 max-w-3xl mx-auto">
          {/* Настроение */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs font-body font-medium w-24 shrink-0">Настроение</span>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_OPTIONS.map(m => (
                <Chip key={m.id} label={m.label} emoji={m.emoji}
                  selected={mood === m.id}
                  onClick={() => setMood(mood === m.id ? null : m.id)} />
              ))}
            </div>
          </div>

          {/* Эпоха */}
          <div className="flex flex-wrap items-start gap-2">
            <span className="text-muted-foreground text-xs font-body font-medium w-24 shrink-0 pt-1.5">Эпоха</span>
            <div className="flex flex-wrap gap-1.5">
              {ERA_OPTIONS.map(e => (
                <button key={e.id}
                  onClick={() => setEra(era === e.id ? null : e.id)}
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
                  onClick={() => setVolume(volume === v.id ? null : v.id)}
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
                  onClick={() => setGenre(genre === g.id ? null : g.id)} />
              ))}
            </div>
          </div>

          {/* Сброс */}
          {hasFilters && (
            <div className="flex justify-end">
              <button onClick={() => { setMood(null); setEra(null); setVolume(null); setGenre(null); }}
                className="text-muted-foreground text-xs font-body hover:text-parchment flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all">
                <Icon name="X" size={12} /> Сбросить фильтры
              </button>
            </div>
          )}
        </div>

        {/* Wheel + Result */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-20">

          <div className="flex flex-col items-center gap-8">
            <RouletteWheel
              segments={segments}
              spinning={spinning}
              targetIdx={targetIdx}
              onDone={handleDone}
            />
            <button onClick={handleSpin} disabled={spinning}
              className={`px-12 py-3.5 rounded-2xl font-body font-medium text-sm transition-all duration-200 min-w-[220px]
                ${spinning
                  ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                  : "bg-gold text-ink hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5 active:scale-95"}`}>
              {spinning ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-muted-foreground border-t-parchment rounded-full animate-spin inline-block" />
                  Вращается…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Shuffle" size={15} />
                  {showResult ? "Крутить ещё" : "Крутить колесо"}
                </span>
              )}
            </button>
          </div>

          {/* Result panel */}
          <div className="flex-1 w-full lg:max-w-md">
            {!showResult && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 opacity-40">
                <div className="text-gold text-5xl animate-pulse">◈</div>
                <p className="text-muted-foreground font-body text-base">Нажмите — колесо выберет</p>
              </div>
            )}

            {showResult && result && (
              <div className={`bg-background rounded-2xl p-7 border border-white/5 animate-result-rise
                ${winGlow ? "animate-winner-glow" : ""}`}>

                {result.isFallback && (
                  <span className="inline-flex items-center gap-1.5 text-gold text-xs font-body font-medium mb-5 px-3 py-1.5 rounded-full bg-gold/10">
                    <Icon name="Sparkles" size={12} />А вдруг понравится?
                  </span>
                )}

                <div className="flex gap-5 items-start mb-5">
                  <div className="shrink-0 w-[72px] h-[104px] rounded-xl flex flex-col items-center justify-center text-center p-2 shadow-lg shadow-black/40"
                    style={{ background: "linear-gradient(145deg, #2a1800, #110c00)" }}>
                    <div className="text-2xl mb-1.5">{result.book.emoji}</div>
                    <div className="font-display text-parchment text-[9px] leading-snug">{result.book.title}</div>
                    <div className="text-gold-dim text-[7px] mt-1 font-body truncate w-full text-center">{result.book.author}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-2xl text-parchment font-semibold leading-tight mb-1">{result.book.title}</h3>
                    <p className="text-gold text-sm font-body italic mb-3">{result.book.author}, {result.book.year}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.book.moods.map(m => (
                        <span key={m} className="bg-gold/10 text-gold text-[10px] px-2 py-0.5 rounded-full font-body font-medium">{MOOD_LABEL[m]}</span>
                      ))}
                      <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{ERA_LABEL[result.book.era]}</span>
                      <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{VOLUME_LABEL[result.book.volume]}</span>
                      <span className="bg-white/5 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full font-body">{GENRE_LABEL[result.book.genre]}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 pl-4 border-l-2 border-gold/20 rounded-sm">
                  {result.book.description}
                </p>

                <div className="flex gap-3">
                  <button onClick={handleSpin} disabled={spinning}
                    className="flex-1 py-2.5 rounded-xl bg-gold text-ink font-body font-medium text-xs hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-gold/20">
                    <Icon name="RefreshCw" size={13} />Другую
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-white/5 text-muted-foreground font-body font-medium text-xs hover:bg-white/10 hover:text-parchment transition-all flex items-center justify-center gap-2">
                    <Icon name="MessageSquare" size={13} />В клуб
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}