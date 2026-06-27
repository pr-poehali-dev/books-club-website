export const ITEM_H    = 90;
export const VISIBLE   = 3;
export const SPIN_ROWS = 30;

export const STYLES = `
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

/* ── Screw ── */
export function Screw({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 12, height: 12, borderRadius: "50%",
      background: "radial-gradient(circle at 38% 30%, #e0d8cc, #a09890 40%, #706860 75%, #504840)",
      boxShadow: "0 1px 4px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.25)",
      position: "absolute",
      zIndex: 20,
      ...style,
    }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 1, height: 7, background: "rgba(0,0,0,0.5)", borderRadius: 1 }} />
        <div style={{ position: "absolute", width: 7, height: 1, background: "rgba(0,0,0,0.5)", borderRadius: 1 }} />
      </div>
    </div>
  );
}

/* ── Bulb ── */
export function Bulb({ color, glow, animate }: { color: string; glow: string; animate?: boolean }) {
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

/* ── LCD Display ── */
export function LCD({ spinning, done }: { spinning: boolean; done: boolean }) {
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
      <div style={{
        position: "absolute", inset: 0,
        background: done
          ? "radial-gradient(ellipse at 50% 50%, rgba(34,200,60,0.12), transparent)"
          : spinning
          ? "radial-gradient(ellipse at 50% 50%, rgba(34,180,40,0.08), transparent)"
          : "radial-gradient(ellipse at 50% 50%, rgba(20,120,20,0.06), transparent)",
        pointerEvents: "none",
      }} />
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
        textShadow: done ? "0 0 6px #22ff44, 0 0 12px #22ff44" : "0 0 4px #1acc38",
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

/* ── Coin Slot ── */
export function CoinSlot() {
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
