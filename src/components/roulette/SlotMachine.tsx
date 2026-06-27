import { useRef, useEffect, useState } from "react";
import type { Book } from "@/data/randomizerConstants";

const ITEM_H = 88;
const VISIBLE = 3;
const SPIN_ROWS = 28;

/* ═══════════════════════════════════════════════
   REEL STRIP — бумажный барабан с текстом
═══════════════════════════════════════════════ */
interface ReelProps {
  books: Book[];
  targetIdx: number;
  spinning: boolean;
  delay: number;
  onDone: () => void;
}

function Reel({ books, targetIdx, spinning, delay, onDone }: ReelProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const doneRef  = useRef(false);

  const tape = [
    ...Array.from({ length: SPIN_ROWS }, (_, i) => books[i % books.length]),
    books[targetIdx],
  ];

  useEffect(() => {
    if (!spinning) { doneRef.current = false; return; }
    doneRef.current = false;
    const el = stripRef.current;
    if (!el) return;

    el.style.transition = "none";
    el.style.transform  = "translateY(0px)";

    const totalPx  = SPIN_ROWS * ITEM_H;
    const duration = 1.8 + delay / 1000;

    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}s cubic-bezier(0.08, 0.9, 0.2, 1.0)`;
      el.style.transform  = `translateY(-${totalPx}px)`;
    }));

    const timer = setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone(); }
    }, (duration + delay / 1000) * 1000);
    return () => clearTimeout(timer);
  }, [spinning]);

  return (
    /* Outer chrome bezel of one reel window */
    <div style={{
      position: "relative",
      width: "100%",
      height: ITEM_H * VISIBLE,
      borderRadius: 6,
      overflow: "hidden",
      /* Inset chrome */
      boxShadow: "inset 0 3px 10px rgba(0,0,0,0.9), inset 0 -2px 6px rgba(0,0,0,0.7), inset 2px 0 6px rgba(0,0,0,0.5), inset -2px 0 6px rgba(0,0,0,0.5)",
      background: "#f5f0e8",
    }}>
      {/* Paper reel strip */}
      <div ref={stripRef} style={{ willChange: "transform" }}>
        {tape.map((book, i) => (
          <div key={i} style={{
            height: ITEM_H,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 10px",
            textAlign: "center",
            /* Horizontal ruled lines like real slot paper */
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            background: i % 2 === 0 ? "#fdfaf4" : "#f5f0e8",
          }}>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#1a0f00",
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: 3,
            }}>
              {book.title}
            </p>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 10,
              color: "#7a5a30",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              textAlign: "center",
            }}>
              {book.author}
            </p>
          </div>
        ))}
      </div>

      {/* Top dark fade */}
      <div style={{
        position: "absolute", inset: "0 0 auto 0", height: 28, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(20,14,4,0.85) 0%, rgba(20,14,4,0) 100%)",
      }} />
      {/* Bottom dark fade */}
      <div style={{
        position: "absolute", inset: "auto 0 0 0", height: 28, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(20,14,4,0.85) 0%, rgba(20,14,4,0) 100%)",
      }} />
      {/* Center gold highlight lines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none",
        top: ITEM_H * ((VISIBLE - 1) / 2),
        height: ITEM_H,
        borderTop: "2px solid rgba(218,165,32,0.8)",
        borderBottom: "2px solid rgba(218,165,32,0.8)",
        boxShadow: "0 0 8px rgba(218,165,32,0.3)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LEVER — красный рычаг сбоку
═══════════════════════════════════════════════ */
interface LeverProps { onClick: () => void; spinning: boolean; }

function Lever({ onClick, spinning }: LeverProps) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (spinning) return;
    setPulled(true);
    setTimeout(() => { setPulled(false); onClick(); }, 180);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: "absolute",
        right: -52,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: spinning ? "default" : "pointer",
        userSelect: "none",
        gap: 0,
        zIndex: 30,
        opacity: spinning ? 0.5 : 1,
        transition: "opacity 0.2s",
      }}>
      {/* Ball */}
      <div style={{
        width: 28, height: 28,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 28%, #ff6b6b, #c0392b 50%, #7b0000)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,180,180,0.4)",
        transform: pulled ? "translateY(8px) scale(0.92)" : "translateY(0) scale(1)",
        transition: "transform 0.15s",
        flexShrink: 0,
      }} />
      {/* Arm */}
      <div style={{
        width: 8, height: pulled ? 50 : 80,
        background: "linear-gradient(90deg, #e8e0d0, #b0a898, #c8c0b0, #888074)",
        borderRadius: 4,
        boxShadow: "2px 0 4px rgba(0,0,0,0.4)",
        transition: "height 0.15s",
        transformOrigin: "top center",
        flexShrink: 0,
      }} />
      {/* Base */}
      <div style={{
        width: 20, height: 10,
        background: "linear-gradient(180deg, #c8a000, #8a6e00)",
        borderRadius: 3,
        boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
        flexShrink: 0,
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BIG SPIN BUTTON — красная кнопка
═══════════════════════════════════════════════ */
interface SpinButtonProps { onClick: () => void; spinning: boolean; done: boolean; }

function SpinButton({ onClick, spinning, done }: SpinButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (spinning) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 150);
    onClick();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      {/* Button outer ring */}
      <div style={{
        width: 72, height: 72,
        borderRadius: "50%",
        background: "linear-gradient(145deg, #5a4400, #3a2c00)",
        boxShadow: "0 0 0 3px #c8a000, 0 6px 20px rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Button top */}
        <div
          onClick={handleClick}
          style={{
            width: 58, height: 58,
            borderRadius: "50%",
            background: spinning
              ? "radial-gradient(circle at 38% 32%, #ff9999, #c0392b 45%, #7b0000)"
              : done
              ? "radial-gradient(circle at 38% 32%, #ffe066, #daa520 45%, #7a5c00)"
              : "radial-gradient(circle at 38% 32%, #ff6b6b, #c0392b 45%, #8b0000)",
            boxShadow: pressed
              ? "0 1px 4px rgba(0,0,0,0.8), inset 0 3px 8px rgba(0,0,0,0.4)"
              : spinning
              ? "0 2px 8px rgba(200,50,50,0.4), 0 0 16px rgba(200,50,50,0.3)"
              : done
              ? "0 4px 12px rgba(218,165,32,0.7), 0 0 20px rgba(218,165,32,0.4)"
              : "0 4px 12px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,150,150,0.3)",
            cursor: spinning ? "not-allowed" : "pointer",
            transform: pressed ? "scale(0.93) translateY(2px)" : "scale(1)",
            transition: "all 0.12s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.9)",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}>
            {spinning ? "SPIN" : done ? "AGAIN" : "SPIN"}
          </span>
        </div>
      </div>
      <span style={{
        fontFamily: "monospace",
        fontSize: 9,
        color: "#7a5c30",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}>Press</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DISPLAY — монохромный дисплей
═══════════════════════════════════════════════ */
function Display({ spinning, done }: { spinning: boolean; done: boolean }) {
  return (
    <div style={{
      background: "#0a1a0a",
      border: "2px solid #1a3a1a",
      borderRadius: 4,
      padding: "4px 12px",
      minWidth: 100,
      textAlign: "center",
      boxShadow: "inset 0 2px 6px rgba(0,0,0,0.8), 0 0 0 1px #0a2a0a",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Scanlines overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      }} />
      <span style={{
        fontFamily: "monospace",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.18em",
        color: done ? "#22ff44" : spinning ? "#44dd22" : "#228844",
        textShadow: `0 0 6px ${done ? "#22ff44" : "#228844"}`,
        position: "relative", zIndex: 2,
      }}>
        {done ? "JACKPOT!" : spinning ? "ROLLING.." : "INSERT>>>"}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INDICATOR LIGHTS
═══════════════════════════════════════════════ */
function Lights({ spinning, done }: { spinning: boolean; done: boolean }) {
  const colors = spinning
    ? ["#ff4444", "#ff8800", "#ff4444"]
    : done
    ? ["#ffd700", "#ffee00", "#ffd700"]
    : ["#331100", "#221100", "#331100"];

  const glows = spinning
    ? ["rgba(255,68,68,0.8)", "rgba(255,136,0,0.8)", "rgba(255,68,68,0.8)"]
    : done
    ? ["rgba(255,215,0,0.9)", "rgba(255,238,0,0.9)", "rgba(255,215,0,0.9)"]
    : ["none", "none", "none"];

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {colors.map((c, i) => (
        <div key={i} style={{
          width: 12, height: 12,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, ${c}, rgba(0,0,0,0.4))`,
          boxShadow: glows[i] !== "none" ? `0 0 8px ${glows[i]}, 0 0 16px ${glows[i]}` : "inset 0 1px 2px rgba(0,0,0,0.6)",
          border: "1px solid rgba(0,0,0,0.4)",
          transition: "all 0.3s",
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COIN SLOT — декоративная щель для монет
═══════════════════════════════════════════════ */
function CoinSlot() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: 40, height: 5,
        background: "linear-gradient(180deg, #111, #333)",
        borderRadius: 2,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.05)",
        border: "1px solid #555",
      }} />
      <span style={{ fontFamily: "monospace", fontSize: 7, color: "#555", letterSpacing: "0.1em" }}>COIN</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SLOT MACHINE — главный компонент
═══════════════════════════════════════════════ */
export interface SlotMachineProps {
  books: Book[];
  targets: [number, number, number];
  spinning: boolean;
  onSpin: () => void;
  onDone: () => void;
}

export default function SlotMachine({ books, targets, spinning, onSpin, onDone }: SlotMachineProps) {
  const [doneCount, setDoneCount] = useState(0);
  const done = doneCount >= 3;

  useEffect(() => {
    if (spinning) setDoneCount(0);
  }, [spinning]);

  const handleReelDone = () => {
    setDoneCount(prev => {
      const next = prev + 1;
      if (next >= 3) onDone();
      return next;
    });
  };

  return (
    /* Outer wrapper — room for lever */
    <div style={{ position: "relative", width: "100%", maxWidth: 580, margin: "0 auto" }}>

      {/* ── MACHINE BODY ── */}
      <div style={{
        position: "relative",
        borderRadius: 16,
        overflow: "visible",
        /* Brushed steel base */
        background: "linear-gradient(160deg, #d4cfc8 0%, #b8b3aa 20%, #9c9890 50%, #b0aba3 80%, #c8c3bc 100%)",
        boxShadow: [
          "0 0 0 2px #888480",
          "0 0 0 4px #706c68",
          "0 30px 80px rgba(0,0,0,0.9)",
          "inset 0 1px 0 rgba(255,255,255,0.4)",
          "inset 0 -2px 0 rgba(0,0,0,0.3)",
        ].join(", "),
        padding: "0 0 20px 0",
      }}>

        {/* ── TOP MARQUEE PANEL ── */}
        <div style={{
          borderRadius: "16px 16px 0 0",
          padding: "14px 20px 10px",
          background: "linear-gradient(180deg, #c0392b 0%, #9b2722 60%, #7a1f1a 100%)",
          boxShadow: "inset 0 -3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,180,160,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}>
          {/* Title plate */}
          <div style={{
            background: "linear-gradient(90deg, #f5e6c8, #fff8e8, #f0ddb0, #fff8e8, #f5e6c8)",
            borderRadius: 3,
            padding: "4px 24px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "1px solid #c8a000",
          }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#3a1000",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}>
              Literary Slots
            </span>
          </div>

          {/* Decorative bulbs row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{
                width: i === 4 ? 10 : 7,
                height: i === 4 ? 10 : 7,
                borderRadius: "50%",
                background: spinning
                  ? `radial-gradient(circle at 35% 30%, ${i % 3 === 0 ? "#ffe066" : i % 3 === 1 ? "#ff6b6b" : "#66ddff"}, rgba(0,0,0,0.3))`
                  : done
                  ? `radial-gradient(circle at 35% 30%, #ffd700, #8a6000)`
                  : `radial-gradient(circle at 35% 30%, #ccc, #555)`,
                boxShadow: (spinning || done) ? "0 0 6px rgba(255,220,0,0.8)" : "inset 0 1px 2px rgba(0,0,0,0.5)",
                border: "1px solid rgba(0,0,0,0.3)",
                transition: "all 0.2s",
              }} />
            ))}
          </div>
        </div>

        {/* ── SIDE PANEL TEXTURE (chrome strips) ── */}
        <div style={{ display: "flex", gap: 0, padding: "0 16px" }}>
          {/* Left chrome strip */}
          <div style={{
            width: 14,
            background: "linear-gradient(90deg, #888, #ccc, #aaa, #ddd, #999)",
            boxShadow: "inset 2px 0 4px rgba(0,0,0,0.3)",
          }} />

          {/* ── CENTER CONTENT ── */}
          <div style={{ flex: 1, padding: "16px 12px" }}>

            {/* Reels window — chrome bezel */}
            <div style={{
              borderRadius: 8,
              padding: 6,
              background: "linear-gradient(145deg, #888480, #5a5652, #706c68, #3a3834)",
              boxShadow: [
                "0 0 0 2px #2a2826",
                "0 4px 12px rgba(0,0,0,0.7)",
                "inset 0 2px 4px rgba(255,255,255,0.15)",
              ].join(", "),
              marginBottom: 14,
            }}>
              {/* Inner reel housing */}
              <div style={{
                borderRadius: 5,
                padding: "8px 10px",
                background: "#1a1408",
                boxShadow: "inset 0 4px 20px rgba(0,0,0,0.95), inset 0 -2px 8px rgba(0,0,0,0.7)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}>
                {([0, 1, 2] as const).map(i => (
                  <Reel
                    key={i}
                    books={books}
                    targetIdx={targets[i]}
                    spinning={spinning}
                    delay={i * 380}
                    onDone={handleReelDone}
                  />
                ))}
              </div>
            </div>

            {/* ── BOTTOM CONTROL PANEL ── */}
            <div style={{
              background: "linear-gradient(180deg, #7a7672 0%, #5a5652 50%, #6a6662 100%)",
              borderRadius: 6,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 0 rgba(255,255,255,0.1)",
              gap: 12,
            }}>
              {/* Left: lights + display */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                <Lights spinning={spinning} done={done} />
                <Display spinning={spinning} done={done} />
              </div>

              {/* Center: big red button */}
              <SpinButton onClick={onSpin} spinning={spinning} done={done} />

              {/* Right: coin slot + decorative buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                <CoinSlot />
                {/* Small utility buttons row */}
                <div style={{ display: "flex", gap: 5 }}>
                  {["BET", "MAX", "PAY"].map(label => (
                    <div key={label} style={{
                      padding: "3px 6px",
                      background: "linear-gradient(180deg, #e8e0d0, #c8c0b0)",
                      borderRadius: 3,
                      boxShadow: "0 2px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
                      border: "1px solid #888",
                      cursor: "default",
                    }}>
                      <span style={{
                        fontFamily: "monospace",
                        fontSize: 7,
                        fontWeight: 700,
                        color: "#3a3028",
                        letterSpacing: "0.08em",
                      }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right chrome strip */}
          <div style={{
            width: 14,
            background: "linear-gradient(90deg, #999, #ddd, #aaa, #ccc, #888)",
            boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3)",
          }} />
        </div>

        {/* ── BOTTOM BASE ── */}
        <div style={{
          margin: "0 16px",
          height: 20,
          background: "linear-gradient(180deg, #6a6662, #4a4642)",
          borderRadius: "0 0 8px 8px",
          boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.5)",
        }} />

        {/* ── LEVER ── */}
        <Lever onClick={onSpin} spinning={spinning} />

        {/* Bolt corners */}
        {[
          { top: 6, left: 6 }, { top: 6, right: 6 },
          { bottom: 22, left: 6 }, { bottom: 22, right: 6 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 10, height: 10,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #e8e0d0, #888480)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.3)",
            border: "1px solid #666",
            ...pos,
            zIndex: 10,
          }} />
        ))}
      </div>
    </div>
  );
}
