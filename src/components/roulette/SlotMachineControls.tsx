import { useState } from "react";
import { GOLD_H, GOLD_V } from "@/components/roulette/SlotMachineAtoms";

/* ══════════════════════════════════════════
   LEVER — gold arm with red ball, right side
   like reference image
══════════════════════════════════════════ */

export function Lever({ onClick, spinning }: { onClick: () => void; spinning: boolean }) {
  const [pulled, setPulled] = useState(false);

  const handleClick = () => {
    if (spinning) return;
    setPulled(true);
    setTimeout(() => { setPulled(false); onClick(); }, 280);
  };

  return (
    <div
      onClick={handleClick}
      title="Pull lever"
      style={{
        position: "absolute",
        right: -54,
        top: "32%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: spinning ? "default" : "pointer",
        userSelect: "none",
        zIndex: 50,
        opacity: spinning ? 0.5 : 1,
        transition: "opacity 0.25s",
        animation: pulled ? "lever-anim 0.45s ease-out" : "none",
        transformOrigin: "bottom center",
        gap: 0,
      }}>

      {/* Red ball knob — like reference */}
      <div style={{
        width: 36, height: 36,
        borderRadius: "50%",
        background: [
          "radial-gradient(circle at 30% 22%,",
          "rgba(255,220,210,0.95) 0%,",
          "#f03030 22%,",
          "#c01818 50%,",
          "#800000 78%,",
          "#3a0000 100%)"
        ].join(""),
        boxShadow: [
          "0 5px 14px rgba(0,0,0,0.75)",
          "0 2px 4px rgba(0,0,0,0.5)",
          "inset 0 -3px 6px rgba(0,0,0,0.4)",
        ].join(","),
        transform: pulled ? "translateY(32px) scale(0.88)" : "scale(1)",
        transition: "transform 0.2s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        position: "relative",
      }}>
        {/* Specular highlight */}
        <div style={{
          position: "absolute",
          top: 6, left: 7,
          width: 13, height: 9,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.75), transparent)",
          transform: "rotate(-20deg)",
        }} />
        {/* Secondary sheen */}
        <div style={{
          position: "absolute",
          bottom: 6, right: 7,
          width: 7, height: 5,
          borderRadius: "50%",
          background: "rgba(255,100,100,0.3)",
        }} />
      </div>

      {/* Gold arm shaft */}
      <div style={{
        width: 12,
        height: pulled ? 56 : 96,
        background: GOLD_V,
        borderRadius: 6,
        boxShadow: [
          "3px 0 8px rgba(0,0,0,0.55)",
          "-1px 0 3px rgba(255,255,180,0.2)",
          "inset 2px 0 4px rgba(255,240,100,0.25)",
          "inset -2px 0 4px rgba(100,60,0,0.4)",
        ].join(","),
        transition: "height 0.2s cubic-bezier(0.4,0,0.2,1)",
        flexShrink: 0,
        marginTop: -2,
        marginBottom: -2,
      }} />

      {/* Gold pivot base — like reference */}
      <div style={{
        width: 28, height: 18,
        borderRadius: "0 0 8px 8px",
        background: GOLD_H,
        boxShadow: [
          "0 4px 10px rgba(0,0,0,0.65)",
          "inset 0 2px 0 rgba(255,240,120,0.5)",
          "inset 0 -2px 0 rgba(100,60,0,0.5)",
        ].join(","),
        flexShrink: 0,
        position: "relative",
      }}>
        {/* Pivot line detail */}
        <div style={{
          position: "absolute",
          top: "50%", left: "15%", right: "15%",
          height: 1,
          background: "rgba(100,60,0,0.4)",
          transform: "translateY(-50%)",
        }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SPIN BUTTON — round gold-rimmed button
   (used as backup; main trigger is the lever)
══════════════════════════════════════════ */

export function SpinButton({ onClick, spinning, done }: { onClick: () => void; spinning: boolean; done: boolean }) {
  const [pressed, setPressed] = useState(false);

  const handle = () => {
    if (spinning) return;
    setPressed(true);
    setTimeout(() => setPressed(false), 140);
    onClick();
  };

  return (
    <button
      onClick={handle}
      disabled={spinning}
      style={{
        border: "none",
        cursor: spinning ? "not-allowed" : "pointer",
        outline: "none",
        padding: 0,
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}>
      {/* Outer gold ring */}
      <div style={{
        width: 72, height: 72,
        borderRadius: "50%",
        background: GOLD_RING,
        boxShadow: [
          "0 6px 20px rgba(0,0,0,0.7)",
          "0 2px 4px rgba(0,0,0,0.5)",
          "inset 0 2px 0 rgba(255,240,120,0.5)",
          "inset 0 -2px 0 rgba(80,40,0,0.5)",
        ].join(","),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Dark recess */}
        <div style={{
          width: 60, height: 60,
          borderRadius: "50%",
          background: "linear-gradient(145deg,#2a1a08,#180e02)",
          boxShadow: "inset 0 3px 10px rgba(0,0,0,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          {/* Button cap */}
          <div
            style={{
              width: 50, height: 50,
              borderRadius: "50%",
              transform: pressed ? "scale(0.88) translateY(3px)" : "scale(1)",
              transition: "transform 0.1s",
              background: done && !spinning
                ? "radial-gradient(circle at 32% 24%,#ffe870 0%,#daa020 38%,#a07000 68%,#5a4000 100%)"
                : spinning
                ? "radial-gradient(circle at 32% 24%,#ffaaaa 0%,#d02020 40%,#880000 70%,#3a0000 100%)"
                : "radial-gradient(circle at 32% 24%,#ff8888 0%,#e03030 34%,#a81818 60%,#680000 84%,#2a0000 100%)",
              boxShadow: pressed
                ? "inset 0 4px 10px rgba(0,0,0,0.6)"
                : done && !spinning
                ? "0 0 0 2px #ffd700,0 4px 14px rgba(218,165,32,0.8),0 0 28px rgba(218,165,32,0.35)"
                : spinning
                ? "0 2px 6px rgba(0,0,0,0.5)"
                : "0 5px 14px rgba(0,0,0,0.65),inset 0 1px 2px rgba(255,160,160,0.2)",
              position: "relative",
            }}>
            <div style={{
              position: "absolute", top: 8, left: 9,
              width: 18, height: 11,
              borderRadius: "50%",
              background: "radial-gradient(ellipse,rgba(255,255,255,0.5),transparent)",
              transform: "rotate(-22deg)",
            }} />
            <span style={{
              fontFamily: "monospace",
              fontSize: 8, fontWeight: 900,
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.9)",
              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
              position: "relative", zIndex: 2,
            }}>
              {spinning ? "..." : done ? "▶▶" : "SPIN"}
            </span>
          </div>
        </div>
      </div>
      <span style={{
        fontFamily: "monospace", fontSize: 8,
        color: "#c8a000", letterSpacing: "0.14em",
        textShadow: "0 1px 3px rgba(0,0,0,0.5)",
      }}>PUSH</span>
    </button>
  );
}

/* local alias so atoms can import */
const GOLD_RING = "linear-gradient(135deg,#ffe680 0%,#d4a010 30%,#ffd040 55%,#9a6800 80%,#ffe680 100%)";
