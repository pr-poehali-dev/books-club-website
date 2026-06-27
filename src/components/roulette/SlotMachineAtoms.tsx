export const ITEM_H    = 96;
export const VISIBLE   = 3;
export const SPIN_ROWS = 30;

/* ── Shared gold gradients ── */
export const GOLD_H   = "linear-gradient(180deg,#fdeea0 0%,#e8c040 15%,#c89010 35%,#e0b828 55%,#f5d870 75%,#c09000 100%)";
export const GOLD_V   = "linear-gradient(90deg, #a06800 0%,#f5d870 20%,#fffacc 45%,#e8c040 70%,#a06800 100%)";
export const GOLD_RING = "linear-gradient(135deg,#ffe680 0%,#d4a010 30%,#ffd040 55%,#9a6800 80%,#ffe680 100%)";

export const STYLES = `
  @keyframes neon-casino {
    0%,100%{text-shadow:0 0 8px #ff8080,0 0 18px #ff3030,0 0 36px #cc0000,0 0 60px #aa0000}
    48%{text-shadow:0 0 4px #ff8080,0 0 10px #ff3030}
    50%{text-shadow:0 0 8px #ff8080,0 0 18px #ff3030,0 0 36px #cc0000}
  }
  @keyframes neon-bottom {
    0%,100%{text-shadow:0 0 8px #ff6060,0 0 16px #ff2020,0 0 32px #cc0000}
    48%{text-shadow:0 0 4px #ff6060,0 0 8px #ff2020}
    50%{text-shadow:0 0 8px #ff6060,0 0 16px #ff2020}
  }
  @keyframes bulb-on {
    0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.3} 95%{opacity:1} 97%{opacity:0.5} 98%{opacity:1}
  }
  @keyframes jackpot-glow {
    0%,100%{text-shadow:0 0 10px #ffdd00,0 0 22px #ffaa00,0 0 44px #ff8800}
    50%{text-shadow:0 0 18px #ffee44,0 0 36px #ffcc00,0 0 70px #ff9900}
  }
  @keyframes reel-blur {
    0%,100%{filter:blur(0px)} 25%,75%{filter:blur(2.5px)}
  }
  @keyframes lever-anim {
    0%{transform:rotate(0deg)}
    35%{transform:rotate(24deg)}
    100%{transform:rotate(0deg)}
  }
  @keyframes star-spin {
    from{transform:rotate(0deg)} to{transform:rotate(360deg)}
  }
`;

/* ── Corner gold rivet ── */
export function Rivet({ style = {} }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute",
      width: 14, height: 14,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 28%, #ffe090, #d4a010 45%, #8a5c00 80%, #5a3800)",
      boxShadow: "0 2px 5px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,240,120,0.5)",
      zIndex: 10,
      ...style,
    }} />
  );
}

/* ── Small decorative bulb ── */
export function Bulb({ on, color = "#ff3030" }: { on: boolean; color?: string }) {
  const glow = color === "#ff3030"
    ? "0 0 6px rgba(255,48,48,0.9), 0 0 12px rgba(255,0,0,0.5)"
    : color === "#ffcc00"
    ? "0 0 6px rgba(255,200,0,0.9), 0 0 12px rgba(255,160,0,0.5)"
    : "0 0 6px rgba(255,160,48,0.9), 0 0 12px rgba(255,100,0,0.5)";

  return (
    <div style={{
      width: 12, height: 12,
      borderRadius: "50%",
      flexShrink: 0,
      background: on
        ? `radial-gradient(circle at 33% 28%, rgba(255,255,200,0.9) 0%, ${color} 40%, rgba(60,0,0,0.4) 100%)`
        : "radial-gradient(circle at 33% 28%, #4a3020, #2a1808 60%, #1a0c04)",
      boxShadow: on ? glow : "inset 0 2px 4px rgba(0,0,0,0.8)",
      border: "1px solid rgba(0,0,0,0.4)",
      animation: on ? `bulb-on ${1.8 + Math.random() * 0.6}s ease-in-out infinite` : "none",
      position: "relative",
    }}>
      {on && <div style={{
        position: "absolute", top: 2, left: 2,
        width: 4, height: 3, borderRadius: "50%",
        background: "rgba(255,255,255,0.65)",
        transform: "rotate(-15deg)",
      }} />}
    </div>
  );
}

/* ── Bottom LED display (like "SLO T9" on the reference) ── */
export function LedDisplay({ spinning, done }: { spinning: boolean; done: boolean }) {
  const text = done ? "JACKPOT" : spinning ? "SPIN..." : "READY";
  return (
    <div style={{
      background: "#050e18",
      border: "2px solid #0a2030",
      borderRadius: 3,
      padding: "4px 18px",
      minWidth: 120,
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9), 0 0 0 1px #0a1828",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.03) 3px,rgba(0,200,255,0.03) 4px)",
        pointerEvents: "none",
      }} />
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 13,
        fontWeight: 900,
        letterSpacing: "0.22em",
        color: done ? "#44ffaa" : "#00ccff",
        textShadow: done
          ? "0 0 6px #44ffaa, 0 0 14px #00ffaa"
          : "0 0 6px #00ccff, 0 0 14px #0088ff",
        animation: done ? "jackpot-glow 0.6s ease-in-out infinite" : "none",
        position: "relative", zIndex: 2,
        display: "block",
      }}>
        {text}
      </span>
    </div>
  );
}
