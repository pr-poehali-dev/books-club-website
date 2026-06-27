import { useState } from "react";

/* ── Lever ── */

interface LeverProps {
  onClick: () => void;
  spinning: boolean;
}

export function Lever({ onClick, spinning }: LeverProps) {
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
        background: "radial-gradient(circle at 30% 22%, rgba(255,200,200,0.9) 0%, #e84040 25%, #c0292b 55%, #7a0a0a 85%, #3a0000 100%)",
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
        {/* Screw on base */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 8, height: 8, borderRadius: "50%",
          background: "radial-gradient(circle at 38% 30%, #e0d8cc, #a09890 40%, #706860 75%, #504840)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.7)",
        }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: 1, height: 5, background: "rgba(0,0,0,0.5)", borderRadius: 1 }} />
            <div style={{ position: "absolute", width: 5, height: 1, background: "rgba(0,0,0,0.5)", borderRadius: 1 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── BigButton ── */

interface BigButtonProps {
  onClick: () => void;
  spinning: boolean;
  done: boolean;
}

export function BigButton({ onClick, spinning, done }: BigButtonProps) {
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
