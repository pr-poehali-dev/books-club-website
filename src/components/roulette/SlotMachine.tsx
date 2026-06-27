import { useRef, useEffect, useState } from "react";
import type { Book } from "@/data/randomizerConstants";

const ITEM_H = 90;
const VISIBLE = 3;
const SPIN_ROWS = 30;

/* ─────────────────────────────────────────────
   CSS injected once for animations
───────────────────────────────────────────── */
const STYLES = `
  @keyframes bulb-flicker {
    0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.4} 95%{opacity:1} 97%{opacity:0.6} 98%{opacity:1}
  }
  @keyframes scanline {
    0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)}
  }
  @keyframes jackpot-glow {
    0%,100%{text-shadow:0 0 6px #22ff44,0 0 12px #22ff44}
    50%{text-shadow:0 0 12px #22ff44,0 0 24px #22ff44,0 0 40px #22ff44}
  }
  @keyframes lever-return {
    0%{transform:rotate(0deg)} 30%{transform:rotate(22deg)} 100%{transform:rotate(0deg)}
  }
  @keyframes reel-blur {
    0%,100%{filter:blur(0px)} 20%,80%{filter:blur(1.5px)}
  }
`;

/* ─────────────────────────────────────────────
   REEL
───────────────────────────────────────────── */
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
    const duration = 1.9 + delay / 1000;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = `transform ${duration}s cubic-bezier(0.05,0.92,0.18,1.0)`;
      el.style.transform  = `translateY(-${totalPx}px)`;
    }));
    const timer = setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone(); }
    }, (duration + delay / 1000) * 1000);
    return () => clearTimeout(timer);
  }, [spinning]);

  return (
    <div style={{
      position: "relative",
      height: ITEM_H * VISIBLE,
      overflow: "hidden",
      borderRadius: 3,
      /* Deep inset well */
      background: "#e8e2d6",
      boxShadow: [
        "inset 0 4px 16px rgba(0,0,0,0.95)",
        "inset 0 -3px 10px rgba(0,0,0,0.8)",
        "inset 3px 0 10px rgba(0,0,0,0.7)",
        "inset -3px 0 10px rgba(0,0,0,0.7)",
      ].join(","),
    }}>
      {/* Reel drum strip */}
      <div
        ref={stripRef}
        style={{
          willChange: "transform",
          animation: spinning ? `reel-blur ${0.3}s ease infinite` : "none",
        }}>
        {tape.map((book, i) => (
          <div key={i} style={{
            height: ITEM_H,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 8px",
            textAlign: "center",
            background: i % 2 === 0
              ? "linear-gradient(180deg,#fefefc 0%,#f8f4ec 100%)"
              : "linear-gradient(180deg,#f4efE5 0%,#ede8db 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            /* Subtle drum curvature simulation */
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
          }}>
            {/* Thin ruled lines */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "repeating-linear-gradient(180deg,transparent,transparent 14px,rgba(0,0,0,0.04) 14px,rgba(0,0,0,0.04) 15px)",
              pointerEvents: "none",
            }} />
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 11.5,
              fontWeight: 700,
              color: "#180c00",
              lineHeight: 1.25,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: 2,
              position: "relative",
            }}>
              {book.title}
            </p>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 9.5,
              color: "#7a5a30",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
              textAlign: "center",
              position: "relative",
              letterSpacing: "0.02em",
            }}>
              {book.author}
            </p>
          </div>
        ))}
      </div>

      {/* Top depth shadow */}
      <div style={{
        position: "absolute", inset: "0 0 auto 0", height: 36, zIndex: 10,
        pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(10,6,2,0.92) 0%, rgba(10,6,2,0.5) 60%, transparent 100%)",
      }} />
      {/* Bottom depth shadow */}
      <div style={{
        position: "absolute", inset: "auto 0 0 0", height: 36, zIndex: 10,
        pointerEvents: "none",
        background: "linear-gradient(to top, rgba(10,6,2,0.92) 0%, rgba(10,6,2,0.5) 60%, transparent 100%)",
      }} />
      {/* Drum-curve sheen — left */}
      <div style={{
        position: "absolute", inset: "0 auto 0 0", width: 8, zIndex: 9,
        pointerEvents: "none",
        background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent)",
      }} />
      {/* Drum-curve sheen — right */}
      <div style={{
        position: "absolute", inset: "0 0 0 auto", width: 8, zIndex: 9,
        pointerEvents: "none",
        background: "linear-gradient(to left, rgba(0,0,0,0.35), transparent)",
      }} />
      {/* Center payline highlight */}
      <div style={{
        position: "absolute", zIndex: 20, pointerEvents: "none",
        top: ITEM_H * ((VISIBLE - 1) / 2),
        left: 0, right: 0,
        height: ITEM_H,
        borderTop: "1.5px solid rgba(255,210,60,0.85)",
        borderBottom: "1.5px solid rgba(255,210,60,0.85)",
        boxShadow: "0 0 0 1px rgba(255,210,60,0.15), 0 0 10px rgba(255,210,60,0.15)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCREW — маленький металлический винт
───────────────────────────────────────────── */
function Screw({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 12, height: 12, borderRadius: "50%",
      background: "radial-gradient(circle at 38% 30%, #e0d8cc, #a09890 40%, #706860 75%, #504840)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.25)",
      position: "absolute",
      zIndex: 20,
      ...style,
    }}>
      {/* Phillips cross */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 1, height: 7, background: "rgba(0,0,0,0.5)", borderRadius: 1 }} />
        <div style={{ position: "absolute", width: 7, height: 1, background: "rgba(0,0,0,0.5)", borderRadius: 1 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LEVER
───────────────────────────────────────────── */
function Lever({ onClick, spinning }: { onClick: () => void; spinning: boolean }) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (spinning) return;
    setPulled(true);
    setTimeout(() => { setPulled(false); onClick(); }, 220);
  };

  return (
    <div
      onClick={handleClick}
      title="Дёрнуть рычаг"
      style={{
        position: "absolute",
        right: -58,
        top: "38%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: spinning ? "default" : "grab",
        userSelect: "none",
        zIndex: 40,
        opacity: spinning ? 0.45 : 1,
        transition: "opacity 0.3s",
        transformOrigin: "bottom center",
        animation: pulled ? "lever-return 0.4s ease-out" : "none",
        gap: 0,
      }}>

      {/* Ball knob */}
      <div style={{
        width: 32, height: 32,
        borderRadius: "50%",
        background: [
          "radial-gradient(circle at 30% 22%, rgba(255,200,200,0.9) 0%, #e84040 25%, #c0292b 55%, #7a0a0a 85%, #3a0000 100%)"
        ].join(","),
        boxShadow: [
          "0 4px 12px rgba(0,0,0,0.7)",
          "0 1px 0 rgba(255,180,180,0.3) inset",
          "0 -2px 4px rgba(0,0,0,0.5) inset",
        ].join(","),
        transform: pulled ? "translateY(28px) scale(0.9)" : "translateY(0) scale(1)",
        transition: "transform 0.18s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        position: "relative",
      }}>
        {/* Specular highlight */}
        <div style={{
          position: "absolute",
          top: 5, left: 6,
          width: 10, height: 7,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.7), transparent)",
          transform: "rotate(-20deg)",
        }} />
      </div>

      {/* Arm shaft */}
      <div style={{
        width: 10,
        height: pulled ? 52 : 88,
        background: "linear-gradient(90deg, #d8d0c4 0%, #f0ece4 30%, #c8c0b4 60%, #a09890 80%, #888078 100%)",
        borderRadius: 5,
        boxShadow: [
          "2px 0 6px rgba(0,0,0,0.5)",
          "-1px 0 2px rgba(255,255,255,0.15)",
          "inset 2px 0 3px rgba(255,255,255,0.2)",
        ].join(","),
        transition: "height 0.18s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        marginTop: -1,
        marginBottom: -1,
      }} />

      {/* Pivot base */}
      <div style={{
        width: 22, height: 14,
        borderRadius: "0 0 6px 6px",
        background: "linear-gradient(180deg, #c8a000 0%, #8a6800 50%, #5a4200 100%)",
        boxShadow: "0 3px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,220,80,0.3)",
        flexShrink: 0,
        position: "relative",
      }}>
        <Screw style={{ top: 1, left: "50%", transform: "translateX(-50%)", width: 8, height: 8 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BIG RED BUTTON
───────────────────────────────────────────── */
function BigButton({ onClick, spinning, done }: { onClick: () => void; spinning: boolean; done: boolean }) {
  const [pressed, setPressed] = useState(false);

  const handle = () => {
    if (spinning) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 140);
    onClick();
  };

  const isGold = done && !spinning;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      {/* Outer chrome ring */}
      <div style={{
        width: 80, height: 80,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #f0ece4, #c0b8ac 40%, #9a9288 70%, #706860)",
        boxShadow: [
          "0 0 0 1px rgba(255,255,255,0.15)",
          "0 6px 24px rgba(0,0,0,0.8)",
          "0 2px 4px rgba(0,0,0,0.6)",
          "inset 0 1px 0 rgba(255,255,255,0.3)",
        ].join(","),
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {/* Inner recess ring */}
        <div style={{
          width: 68, height: 68,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #2a2018, #1a1208)",
          boxShadow: "inset 0 3px 8px rgba(0,0,0,0.9), inset 0 1px 0 rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {/* The button cap */}
          <div
            onClick={handle}
            style={{
              width: 58, height: 58,
              borderRadius: "50%",
              cursor: spinning ? "not-allowed" : "pointer",
              transform: pressed ? "scale(0.9) translateY(3px)" : "scale(1) translateY(0)",
              transition: "transform 0.1s, box-shadow 0.1s",
              position: "relative",
              background: isGold
                ? "radial-gradient(circle at 32% 24%, #ffe888 0%, #daa520 40%, #a07800 70%, #5a4200 100%)"
                : spinning
                ? "radial-gradient(circle at 32% 24%, #ff9999 0%, #d03030 40%, #900000 70%, #4a0000 100%)"
                : "radial-gradient(circle at 32% 24%, #ff8888 0%, #e03535 35%, #b02020 60%, #700000 85%, #3a0000 100%)",
              boxShadow: pressed
                ? "0 1px 3px rgba(0,0,0,0.9), inset 0 4px 10px rgba(0,0,0,0.5)"
                : isGold
                ? "0 0 0 2px #ffd700, 0 4px 16px rgba(218,165,32,0.8), 0 0 30px rgba(218,165,32,0.4)"
                : spinning
                ? "0 2px 6px rgba(0,0,0,0.6)"
                : "0 5px 16px rgba(0,0,0,0.7), 0 2px 4px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,160,160,0.2)",
            }}>
            {/* Specular */}
            <div style={{
              position: "absolute",
              top: 8, left: 10, width: 20, height: 13,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.55), transparent)",
              transform: "rotate(-25deg)",
              pointerEvents: "none",
            }} />
            {/* Label */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "monospace",
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.85)",
                textShadow: "0 1px 3px rgba(0,0,0,0.7)",
              }}>
                {spinning ? "SPIN" : isGold ? "AGAIN" : "SPIN"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <span style={{ fontFamily: "monospace", fontSize: 8, color: "#888", letterSpacing: "0.12em" }}>PUSH</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BULB — декоративная лампочка
───────────────────────────────────────────── */
function Bulb({ color, glow, animate }: { color: string; glow: string; animate?: boolean }) {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: "50%",
      background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.7) 0%, ${color} 40%, rgba(0,0,0,0.3) 100%)`,
      boxShadow: glow,
      border: "1px solid rgba(0,0,0,0.4)",
      animation: animate ? `bulb-flicker ${2.1 + Math.random()}s ease-in-out infinite` : "none",
      flexShrink: 0,
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 2, left: 2, width: 5, height: 3,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.6)",
        transform: "rotate(-15deg)",
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   LCD DISPLAY
───────────────────────────────────────────── */
function LCD({ spinning, done }: { spinning: boolean; done: boolean }) {
  const text = done ? "JACKPOT!" : spinning ? "ROLLING.." : "INSERT >>>";

  return (
    <div style={{
      background: "#0a1a08",
      border: "2px solid #1a3010",
      borderRadius: 4,
      padding: "5px 14px",
      minWidth: 110,
      position: "relative",
      overflow: "hidden",
      boxShadow: [
        "inset 0 2px 8px rgba(0,0,0,0.9)",
        "inset 0 0 0 1px rgba(0,50,0,0.5)",
        "0 1px 0 rgba(255,255,255,0.05)",
      ].join(","),
    }}>
      {/* Screen glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: done
          ? "radial-gradient(ellipse at 50% 50%, rgba(34,200,60,0.12), transparent)"
          : spinning
          ? "radial-gradient(ellipse at 50% 50%, rgba(34,180,40,0.08), transparent)"
          : "radial-gradient(ellipse at 50% 50%, rgba(20,120,20,0.06), transparent)",
        pointerEvents: "none",
      }} />
      {/* Scanline */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
      }} />
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.15em",
        color: done ? "#22ff44" : "#1acc38",
        textShadow: done
          ? "0 0 6px #22ff44, 0 0 12px #22ff44"
          : "0 0 4px #1acc38",
        position: "relative", zIndex: 3,
        animation: done ? "jackpot-glow 0.7s ease-in-out infinite" : "none",
        display: "block",
        textAlign: "center",
      }}>
        {text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COIN SLOT
───────────────────────────────────────────── */
function CoinSlot() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{
        width: 44, height: 6,
        background: "linear-gradient(180deg, #0a0806 0%, #1a1610 50%, #0a0806 100%)",
        borderRadius: 2,
        boxShadow: "inset 0 2px 5px rgba(0,0,0,1), 0 1px 0 rgba(255,255,255,0.06), 0 -1px 0 rgba(255,255,255,0.04)",
        border: "1px solid rgba(80,70,60,0.6)",
      }} />
      <span style={{ fontFamily: "monospace", fontSize: 6.5, color: "#6a5a40", letterSpacing: "0.12em" }}>◂ INSERT ▸</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SLOT MACHINE
───────────────────────────────────────────── */
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
      const n = prev + 1;
      if (n >= 3) onDone();
      return n;
    });
  };

  // Bulb colors cycling
  const bulbCfg = [
    { c: "#ff4444", g: spinning ? "0 0 10px rgba(255,60,60,0.9)" : done ? "0 0 8px rgba(255,200,0,0.8)" : "inset 0 1px 2px rgba(0,0,0,0.8)" },
    { c: "#ffd700", g: spinning ? "0 0 10px rgba(255,210,0,0.9)" : done ? "0 0 8px rgba(255,200,0,0.8)" : "inset 0 1px 2px rgba(0,0,0,0.8)" },
    { c: "#44aaff", g: spinning ? "0 0 10px rgba(60,150,255,0.9)" : done ? "0 0 8px rgba(255,200,0,0.8)" : "inset 0 1px 2px rgba(0,0,0,0.8)" },
    { c: "#ff4444", g: spinning ? "0 0 10px rgba(255,60,60,0.9)" : done ? "0 0 8px rgba(255,200,0,0.8)" : "inset 0 1px 2px rgba(0,0,0,0.8)" },
    { c: "#ffd700", g: spinning ? "0 0 14px rgba(255,215,0,1)" : done ? "0 0 10px rgba(255,200,0,0.9)" : "inset 0 1px 2px rgba(0,0,0,0.8)" },
    { c: "#44aaff", g: spinning ? "0 0 10px rgba(60,150,255,0.9)" : done ? "0 0 8px rgba(255,200,0,0.8)" : "inset 0 1px 2px rgba(0,0,0,0.8)" },
    { c: "#ff4444", g: spinning ? "0 0 10px rgba(255,60,60,0.9)" : done ? "0 0 8px rgba(255,200,0,0.8)" : "inset 0 1px 2px rgba(0,0,0,0.8)" },
  ];

  const off = { c: "#332820", g: "inset 0 2px 4px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.03)" };

  return (
    <>
      <style>{STYLES}</style>

      {/* Room for lever on the right */}
      <div style={{ position: "relative", width: "100%", maxWidth: 560, margin: "0 auto" }}>

        {/* ══════════════════════════════
            MACHINE BODY
        ══════════════════════════════ */}
        <div style={{
          position: "relative",
          borderRadius: "18px 18px 14px 14px",
          overflow: "visible",
          /* Aged painted steel — warm grey-beige */
          background: [
            "linear-gradient(175deg,",
            "#d8d2c8 0%,",
            "#c8c2b6 8%,",
            "#b8b2a6 20%,",
            "#a8a29a 35%,",
            "#b2ac9e 55%,",
            "#c4beb0 75%,",
            "#cac4b6 100%)"
          ].join(""),
          boxShadow: [
            "0 0 0 1.5px #888078",
            "0 0 0 3px #5a5448",
            "0 40px 100px rgba(0,0,0,0.95)",
            "0 10px 30px rgba(0,0,0,0.7)",
            "inset 0 2px 0 rgba(255,255,255,0.35)",
            "inset 0 -3px 0 rgba(0,0,0,0.4)",
          ].join(","),
        }}>

          {/* ── MARQUEE TOP ── */}
          <div style={{
            borderRadius: "18px 18px 0 0",
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Marquee background — deep red lacquer */}
            <div style={{
              padding: "18px 28px 14px",
              background: [
                "linear-gradient(180deg,",
                "#b02020 0%,",
                "#8a1818 25%,",
                "#701010 60%,",
                "#580a0a 100%)"
              ].join(""),
              boxShadow: [
                "inset 0 -4px 12px rgba(0,0,0,0.5)",
                "inset 0 2px 0 rgba(255,100,80,0.15)",
                "inset 4px 0 8px rgba(0,0,0,0.2)",
                "inset -4px 0 8px rgba(0,0,0,0.2)",
              ].join(","),
              position: "relative",
            }}>

              {/* Chrome title plate */}
              <div style={{
                margin: "0 auto 12px",
                width: "fit-content",
                padding: "5px 28px",
                background: [
                  "linear-gradient(180deg,",
                  "#f8f2e0 0%,",
                  "#fff8e8 30%,",
                  "#ede0b8 65%,",
                  "#f8eecc 100%)"
                ].join(""),
                borderRadius: 3,
                border: "1px solid rgba(200,160,0,0.7)",
                boxShadow: [
                  "0 2px 8px rgba(0,0,0,0.6)",
                  "0 1px 0 rgba(255,255,255,0.8)",
                  "inset 0 1px 0 rgba(255,255,255,0.9)",
                  "inset 0 -1px 0 rgba(0,0,0,0.1)",
                ].join(","),
              }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#2a1200",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  display: "block",
                  textAlign: "center",
                }}>
                  LITERARY SLOTS
                </span>
              </div>

              {/* Bulb row */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
                {bulbCfg.map((b, i) => (
                  <Bulb
                    key={i}
                    color={(spinning || done) ? b.c : off.c}
                    glow={(spinning || done) ? b.g : off.g}
                    animate={spinning}
                  />
                ))}
              </div>

              {/* Worn paint texture overlay */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "inherit",
                backgroundImage: [
                  "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.04) 0%, transparent 40%)",
                  "radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.08) 0%, transparent 40%)",
                ].join(","),
                pointerEvents: "none",
              }} />
            </div>

            {/* Chrome trim strip under marquee */}
            <div style={{
              height: 8,
              background: "linear-gradient(180deg, #e8e0d0 0%, #c0b8a8 40%, #d8d0c0 70%, #a8a098 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.4)",
            }} />
          </div>

          {/* ── BODY SIDE STRUCTURE ── */}
          <div style={{ display: "flex", alignItems: "stretch" }}>

            {/* Left chrome rail */}
            <div style={{
              width: 18, flexShrink: 0,
              background: [
                "linear-gradient(90deg,",
                "#888078 0%,",
                "#d0c8b8 20%,",
                "#f0e8d8 40%,",
                "#c8c0b0 60%,",
                "#a09890 80%,",
                "#888078 100%)"
              ].join(""),
              boxShadow: "inset -2px 0 6px rgba(0,0,0,0.3), inset 2px 0 4px rgba(255,255,255,0.1)",
            }}>
              {/* Rail rivets */}
              {[20, 60, 100, 140].map(top => (
                <Screw key={top} style={{ top, left: "50%", transform: "translateX(-50%)", width: 9, height: 9 }} />
              ))}
            </div>

            {/* CENTER */}
            <div style={{ flex: 1, padding: "16px 14px" }}>

              {/* ── REELS HOUSING ── */}
              <div style={{
                borderRadius: 8,
                marginBottom: 14,
                padding: 8,
                position: "relative",
                /* Chrome bezel */
                background: [
                  "linear-gradient(145deg,",
                  "#c0b8a8 0%,",
                  "#7a7268 20%,",
                  "#5a5248 40%,",
                  "#6a6258 65%,",
                  "#9a9288 85%,",
                  "#c0b8a8 100%)"
                ].join(""),
                boxShadow: [
                  "0 0 0 1.5px #3a3228",
                  "0 6px 20px rgba(0,0,0,0.8)",
                  "inset 0 2px 4px rgba(255,255,255,0.2)",
                  "inset 0 -2px 4px rgba(0,0,0,0.4)",
                ].join(","),
              }}>
                {/* Corner screws on bezel */}
                <Screw style={{ top: 4, left: 4 }} />
                <Screw style={{ top: 4, right: 4 }} />
                <Screw style={{ bottom: 4, left: 4 }} />
                <Screw style={{ bottom: 4, right: 4 }} />

                {/* Reel window — black housing */}
                <div style={{
                  borderRadius: 5,
                  padding: "10px 12px",
                  background: "#0e0c08",
                  boxShadow: [
                    "inset 0 6px 24px rgba(0,0,0,1)",
                    "inset 0 -4px 12px rgba(0,0,0,0.9)",
                    "inset 3px 0 10px rgba(0,0,0,0.7)",
                    "inset -3px 0 10px rgba(0,0,0,0.7)",
                  ].join(","),
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}>
                  {([0, 1, 2] as const).map(i => (
                    <Reel
                      key={i}
                      books={books}
                      targetIdx={targets[i]}
                      spinning={spinning}
                      delay={i * 400}
                      onDone={handleReelDone}
                    />
                  ))}
                </div>

                {/* Payline indicator on right */}
                <div style={{
                  position: "absolute",
                  right: -28,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}>
                  <div style={{
                    width: 20, height: 1.5,
                    background: "rgba(255,210,60,0.6)",
                    boxShadow: "0 0 4px rgba(255,210,60,0.4)",
                  }} />
                  <span style={{ fontFamily: "monospace", fontSize: 6, color: "#c8a000", letterSpacing: "0.05em", writingMode: "vertical-rl" }}>
                    PAYLINE
                  </span>
                </div>
              </div>

              {/* ── CONTROL PANEL ── */}
              <div style={{
                borderRadius: 6,
                padding: "12px 16px",
                background: [
                  "linear-gradient(180deg,",
                  "#908880 0%,",
                  "#706860 30%,",
                  "#606058 60%,",
                  "#706860 100%)"
                ].join(""),
                boxShadow: [
                  "inset 0 2px 6px rgba(0,0,0,0.5)",
                  "inset 0 -1px 0 rgba(255,255,255,0.08)",
                  "inset 3px 0 6px rgba(0,0,0,0.2)",
                  "inset -3px 0 6px rgba(0,0,0,0.2)",
                ].join(","),
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}>

                {/* Left group: LCD + indicator lights */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <LCD spinning={spinning} done={done} />
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {[
                      spinning ? { c: "#ff3030", g: "0 0 10px rgba(255,50,50,0.9), 0 0 20px rgba(255,50,50,0.4)" } : done ? { c: "#ffd700", g: "0 0 10px rgba(255,215,0,0.9)" } : { c: "#221810", g: "inset 0 2px 4px rgba(0,0,0,0.9)" },
                      spinning ? { c: "#ffaa00", g: "0 0 10px rgba(255,170,0,0.9)" } : done ? { c: "#ffd700", g: "0 0 8px rgba(255,215,0,0.8)" } : { c: "#201808", g: "inset 0 2px 4px rgba(0,0,0,0.9)" },
                      spinning ? { c: "#ff3030", g: "0 0 10px rgba(255,50,50,0.9)" } : done ? { c: "#ffd700", g: "0 0 10px rgba(255,215,0,0.9)" } : { c: "#221810", g: "inset 0 2px 4px rgba(0,0,0,0.9)" },
                    ].map((b, i) => (
                      <div key={i} style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: `radial-gradient(circle at 33% 27%, rgba(255,255,255,0.5) 0%, ${b.c} 50%, rgba(0,0,0,0.4) 100%)`,
                        boxShadow: b.g,
                        border: "1px solid rgba(0,0,0,0.5)",
                        transition: "all 0.25s",
                      }} />
                    ))}
                    <span style={{ fontFamily: "monospace", fontSize: 7, color: "#6a5a40", letterSpacing: "0.08em" }}>STATUS</span>
                  </div>
                </div>

                {/* Center: big button */}
                <BigButton onClick={onSpin} spinning={spinning} done={done} />

                {/* Right group: coin slot + utility buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", flex: 1 }}>
                  <CoinSlot />
                  <div style={{ display: "flex", gap: 4 }}>
                    {["BET", "MAX", "PAY"].map(label => (
                      <div key={label} style={{
                        padding: "3px 7px",
                        background: "linear-gradient(180deg, #e0d8c8 0%, #b8b0a0 50%, #c8c0b0 100%)",
                        borderRadius: 3,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.2)",
                        border: "1px solid rgba(80,70,60,0.5)",
                        cursor: "default",
                      }}>
                        <span style={{ fontFamily: "monospace", fontSize: 7, fontWeight: 700, color: "#282018", letterSpacing: "0.1em" }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right chrome rail */}
            <div style={{
              width: 18, flexShrink: 0,
              background: [
                "linear-gradient(90deg,",
                "#888078 0%,",
                "#a09890 20%,",
                "#c8c0b0 40%,",
                "#f0e8d8 60%,",
                "#d0c8b8 80%,",
                "#888078 100%)"
              ].join(""),
              boxShadow: "inset 2px 0 6px rgba(0,0,0,0.3), inset -2px 0 4px rgba(255,255,255,0.1)",
            }}>
              {[20, 60, 100, 140].map(top => (
                <Screw key={top} style={{ top, left: "50%", transform: "translateX(-50%)", width: 9, height: 9 }} />
              ))}
            </div>
          </div>

          {/* ── BOTTOM BASE PLATE ── */}
          <div style={{
            margin: "0 0",
            height: 22,
            borderRadius: "0 0 14px 14px",
            background: "linear-gradient(180deg, #888078 0%, #605850 40%, #504840 100%)",
            boxShadow: [
              "inset 0 2px 4px rgba(0,0,0,0.5)",
              "inset 0 1px 0 rgba(255,255,255,0.08)",
            ].join(","),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}>
            {/* Bottom screws */}
            <Screw style={{ position: "relative", top: "auto", left: "auto" }} />
            <Screw style={{ position: "relative", top: "auto", left: "auto" }} />
            <Screw style={{ position: "relative", top: "auto", left: "auto" }} />
          </div>

          {/* Corner screws on main body */}
          <Screw style={{ top: 10, left: 10 }} />
          <Screw style={{ top: 10, right: 10 }} />

          {/* ── LEVER ── */}
          <Lever onClick={onSpin} spinning={spinning} />
        </div>

        {/* Ground shadow */}
        <div style={{
          margin: "6px auto 0",
          width: "80%",
          height: 12,
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.6), transparent)",
          borderRadius: "50%",
        }} />
      </div>
    </>
  );
}
