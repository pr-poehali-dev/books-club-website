import { useEffect, useState } from "react";
import type { Book } from "@/data/randomizerConstants";
import { STYLES, Screw, Bulb, LCD, CoinSlot } from "@/components/roulette/SlotMachineAtoms";
import Reel from "@/components/roulette/SlotMachineReel";
import { Lever, BigButton } from "@/components/roulette/SlotMachineControls";

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

      <div style={{ position: "relative", width: "100%", maxWidth: 560, margin: "0 auto" }}>

        {/* ══ MACHINE BODY ══ */}
        <div style={{
          position: "relative",
          borderRadius: "18px 18px 14px 14px",
          overflow: "visible",
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
          <div style={{ borderRadius: "18px 18px 0 0", overflow: "hidden", position: "relative" }}>
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

                {/* Payline indicator */}
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
                {/* Left: LCD + status lights */}
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

                {/* Right: coin slot + utility buttons */}
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
            <Screw style={{ position: "relative", top: "auto", left: "auto" }} />
            <Screw style={{ position: "relative", top: "auto", left: "auto" }} />
            <Screw style={{ position: "relative", top: "auto", left: "auto" }} />
          </div>

          {/* Corner screws */}
          <Screw style={{ top: 10, left: 10 }} />
          <Screw style={{ top: 10, right: 10 }} />

          {/* Lever */}
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
