import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import { BOOKS, type Mood, type Era, type Volume, type Book } from "@/data/books";

/* ─── Constants ──────────────────────────────────────────────── */

const MOOD_OPTIONS: { id: Mood | null; label: string; emoji: string }[] = [
  { id: "cry",       label: "Поплакать",   emoji: "😭" },
  { id: "think",     label: "Подумать",    emoji: "🧠" },
  { id: "adventure", label: "Приключения", emoji: "⚡" },
  { id: "light",     label: "Лёгкое",      emoji: "☀️" },
];
const ERA_OPTIONS: { id: Era | null; label: string; emoji: string }[] = [
  { id: "xix",    label: "XIX век",        emoji: "🪶" },
  { id: "xx",     label: "XX век",         emoji: "📻" },
  { id: "modern", label: "Современность",  emoji: "💻" },
];
const VOLUME_OPTIONS: { id: Volume | null; label: string; emoji: string }[] = [
  { id: "story", label: "Рассказ",       emoji: "📄" },
  { id: "short", label: "Короткий",      emoji: "📕" },
  { id: "long",  label: "Большой роман", emoji: "📖" },
];

const ERA_LABEL:    Record<Era,    string> = { xix: "XIX век", xx: "XX век", modern: "Современность" };
const VOLUME_LABEL: Record<Volume, string> = { story: "Рассказ", short: "Короткий роман", long: "Большой роман" };
const MOOD_LABEL:   Record<Mood,   string> = { cry: "Поплакать", think: "Подумать", adventure: "Приключения", light: "Лёгкое" };

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

function pickFiltered(mood: Mood|null, era: Era|null, volume: Volume|null): Book[] {
  const f = BOOKS.filter(b =>
    (mood   ? b.moods.includes(mood) : true) &&
    (era    ? b.era    === era        : true) &&
    (volume ? b.volume === volume     : true)
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
      className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-body tracking-wide transition-all duration-150
        ${selected
          ? "border-gold bg-gold/15 text-gold shadow-sm shadow-gold/20"
          : "border-border text-muted-foreground hover:border-gold-dim hover:text-parchment"}`}>
      <span>{emoji}</span>{label}
    </button>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */

export default function BookRandomizer() {
  const [mood,   setMood]   = useState<Mood   | null>(null);
  const [era,    setEra]    = useState<Era    | null>(null);
  const [volume, setVolume] = useState<Volume | null>(null);

  const [spinning,   setSpinning]   = useState(false);
  const [result,     setResult]     = useState<{book:Book; isFallback:boolean} | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [winGlow,    setWinGlow]    = useState(false);
  const [targetIdx,  setTargetIdx]  = useState(0);

  const pool = pickFiltered(mood, era, volume);
  const isFallback = pool === BOOKS && (mood || era || volume);
  const wheelBooks = pool.slice(0, 16);
  const segments   = wheelBooks.map(b => `${b.emoji}|${b.title}`);

  function pickFiltered(m: Mood|null, e: Era|null, v: Volume|null) {
    const f = BOOKS.filter(b =>
      (m ? b.moods.includes(m) : true) &&
      (e ? b.era    === e       : true) &&
      (v ? b.volume === v       : true)
    );
    return f.length >= 4 ? f : BOOKS;
  }

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
    <section id="randomizer" className="py-20 border-y border-border overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1200 0%, #0a0800 50%, hsl(var(--background)) 100%)" }}>
      <div className="px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Что почитать?">Книжная рулетка</SectionTitle>

        {/* Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
          <span className="text-gold-dim text-xs tracking-widest uppercase font-body mr-1">Настроение:</span>
          {MOOD_OPTIONS.map(m => (
            <Chip key={String(m.id)} label={m.label} emoji={m.emoji}
              selected={mood === m.id}
              onClick={() => setMood(mood === m.id ? null : m.id)} />
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          <span className="text-gold-dim text-xs tracking-widest uppercase font-body mr-1">Эпоха:</span>
          {ERA_OPTIONS.map(e => (
            <Chip key={String(e.id)} label={e.label} emoji={e.emoji}
              selected={era === e.id}
              onClick={() => setEra(era === e.id ? null : e.id)} />
          ))}
          <div className="w-px h-5 bg-border mx-1" />
          <span className="text-gold-dim text-xs tracking-widest uppercase font-body mr-1">Объём:</span>
          {VOLUME_OPTIONS.map(v => (
            <Chip key={String(v.id)} label={v.label} emoji={v.emoji}
              selected={volume === v.id}
              onClick={() => setVolume(volume === v.id ? null : v.id)} />
          ))}
          {(mood || era || volume) && (
            <button onClick={() => { setMood(null); setEra(null); setVolume(null); }}
              className="text-muted-foreground text-xs font-body hover:text-parchment flex items-center gap-1 ml-2 transition-colors">
              <Icon name="X" size={12} /> Сбросить
            </button>
          )}
        </div>

        {/* Wheel + Result */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-20">

          <div className="flex flex-col items-center gap-10">
            <RouletteWheel
              segments={segments}
              spinning={spinning}
              targetIdx={targetIdx}
              onDone={handleDone}
            />
            <button onClick={handleSpin} disabled={spinning}
              className={`px-14 py-4 font-body tracking-[0.35em] text-sm uppercase transition-all duration-200 min-w-[220px]
                ${spinning
                  ? "bg-transparent border border-gold-dim text-gold-dim cursor-not-allowed"
                  : "bg-gold text-ink hover:brightness-110 active:scale-95"}`}
              style={!spinning ? {
                boxShadow: "0 0 24px rgba(218,165,32,0.5), 0 4px 20px rgba(0,0,0,0.6)",
              } : {}}>
              {spinning ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-gold-dim border-t-gold rounded-full animate-spin inline-block" />
                  Вращается…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Icon name="Shuffle" size={16} />
                  {showResult ? "Крутить ещё" : "Крутить колесо"}
                </span>
              )}
            </button>
          </div>

          {/* Result panel */}
          <div className="flex-1 w-full lg:max-w-md">
            {!showResult && (
              <div className="flex flex-col items-center justify-center gap-5 py-20 opacity-50">
                <div className="text-gold text-5xl animate-pulse">✦</div>
                <p className="text-gold-dim font-display text-xl italic">Нажмите — колесо выберет</p>
              </div>
            )}

            {showResult && result && (
              <div className={`border border-gold-dim p-7 animate-result-rise
                ${winGlow ? "animate-winner-glow" : ""}`}
                style={{ background: "linear-gradient(135deg, #1a1200, #0d0900)" }}>

                {result.isFallback && (
                  <div className="inline-flex items-center gap-2 text-gold-dim text-xs tracking-widest uppercase font-body mb-5 border border-gold-dim/30 bg-gold/5 px-3 py-1.5">
                    <Icon name="Sparkles" size={12} />А вдруг понравится?
                  </div>
                )}

                <div className="flex gap-5 items-start mb-5">
                  <div className="shrink-0 w-[76px] h-28 flex flex-col items-center justify-center text-center p-2 border border-gold-dim/60"
                    style={{ background: "linear-gradient(145deg, #2a1800, #110c00)", boxShadow: "4px 4px 16px rgba(0,0,0,0.7)" }}>
                    <div className="text-2xl mb-1.5">{result.book.emoji}</div>
                    <div className="font-display text-parchment text-[9px] leading-snug">{result.book.title}</div>
                    <div className="text-gold-dim text-[7px] mt-1 font-body italic truncate w-full text-center">{result.book.author}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-2xl md:text-3xl text-parchment leading-tight mb-1">{result.book.title}</h3>
                    <p className="text-gold text-sm font-body italic mb-3">{result.book.author}, {result.book.year}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.book.moods.map(m => (
                        <span key={m} className="border border-gold-dim/50 text-gold-dim text-[10px] px-2 py-0.5 font-body">{MOOD_LABEL[m]}</span>
                      ))}
                      <span className="border border-border text-muted-foreground text-[10px] px-2 py-0.5 font-body">{ERA_LABEL[result.book.era]}</span>
                      <span className="border border-border text-muted-foreground text-[10px] px-2 py-0.5 font-body">{VOLUME_LABEL[result.book.volume]}</span>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6 border-l-2 border-gold-dim/30 pl-4">
                  {result.book.description}
                </p>

                <div className="flex gap-3">
                  <button onClick={handleSpin} disabled={spinning}
                    className="flex-1 py-2.5 bg-gold text-ink font-body tracking-wider text-xs uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-40">
                    <Icon name="RefreshCw" size={13} />Другую
                  </button>
                  <button className="flex-1 py-2.5 border border-border text-muted-foreground font-body tracking-wider text-xs uppercase hover:border-gold-dim hover:text-parchment transition-all flex items-center justify-center gap-2">
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
