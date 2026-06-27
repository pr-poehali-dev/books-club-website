import { useEffect, useState } from "react";
import type { Book } from "@/data/randomizerConstants";
import { STYLES, GOLD_H, GOLD_V, Rivet, Bulb, LedDisplay } from "@/components/roulette/SlotMachineAtoms";
import Reel from "@/components/roulette/SlotMachineReel";
import { Lever, SpinButton } from "@/components/roulette/SlotMachineControls";

export interface SlotMachineProps {
  books: Book[];
  targets: [number, number, number];
  spinning: boolean;
  onSpin: () => void;
  onDone: () => void;
}

/* ── Shared gold gradient strings ── */
const G_H   = GOLD_H;
const G_V   = GOLD_V;
const G_BODY = "linear-gradient(175deg,#e8c84a 0%,#c89010 12%,#a87000 28%,#c09018 45%,#ddb830 62%,#c89010 78%,#b07800 100%)";
const G_DARK = "linear-gradient(180deg,#c89010 0%,#8a5c00 40%,#c89010 100%)";

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

  const bulbOn = spinning || done;
  const bulbColors = ["#ff3030", "#ffcc00", "#ff6600", "#ff3030", "#ffcc00", "#ff6600", "#ff3030", "#ffcc00", "#ff6600"];

  return (
    <>
      <style>{STYLES}</style>

      {/* Outer wrapper — extra space right for lever */}
      <div style={{ position: "relative", width: "100%", maxWidth: 520, margin: "0 auto", paddingRight: 60 }}>

        {/* ════════════════════════════════════
            MAIN GOLD BODY
        ════════════════════════════════════ */}
        <div style={{
          position: "relative",
          /* Rich gold body like reference */
          background: G_BODY,
          borderRadius: 20,
          boxShadow: [
            "0 0 0 3px #7a5000",
            "0 0 0 6px #c89010",
            "0 0 0 8px #7a5000",
            "0 30px 80px rgba(0,0,0,0.9)",
            "0 8px 24px rgba(0,0,0,0.6)",
            "inset 0 2px 0 rgba(255,240,140,0.5)",
            "inset 0 -3px 0 rgba(80,40,0,0.6)",
          ].join(","),
        }}>

          {/* ── ARCH TOP (like reference — arch above main body) ── */}
          <div style={{
            position: "relative",
            borderRadius: "20px 20px 0 0",
            overflow: "hidden",
            marginBottom: -2,
          }}>
            {/* Arch background */}
            <div style={{
              height: 28,
              background: G_BODY,
              borderRadius: "20px 20px 0 0",
              boxShadow: "inset 0 -3px 8px rgba(0,0,0,0.35)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* Gold star at top center — like reference */}
              <div style={{
                position: "absolute",
                top: -18,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
              }}>
                <div style={{
                  fontSize: 26,
                  lineHeight: 1,
                  filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7)) drop-shadow(0 0 12px rgba(255,200,0,0.5))",
                  color: "#ffd700",
                }}>★</div>
              </div>
              {/* Gold arch rim lines */}
              <div style={{
                position: "absolute", inset: 0,
                background: [
                  "linear-gradient(180deg,rgba(255,240,140,0.25) 0%,transparent 40%)",
                ].join(","),
                pointerEvents: "none",
              }} />
            </div>
          </div>

          {/* ── MARQUEE PANEL — deep red with "Literary Slots" neon ── */}
          <div style={{
            position: "relative",
            margin: "0 10px",
            borderRadius: 10,
            overflow: "hidden",
            border: "3px solid transparent",
            /* Gold border via background-clip trick */
            backgroundImage: `${G_H}`,
            padding: 3,
          }}>
            <div style={{
              borderRadius: 8,
              padding: "14px 20px 12px",
              background: [
                "linear-gradient(180deg,",
                "#6a0a22 0%,",
                "#4a0618 25%,",
                "#380412 55%,",
                "#280208 80%,",
                "#380412 100%)"
              ].join(""),
              boxShadow: [
                "inset 0 0 40px rgba(0,0,0,0.5)",
                "inset 0 2px 0 rgba(255,80,80,0.1)",
              ].join(","),
              position: "relative",
            }}>
              {/* Tiny stars/sparkles in background */}
              {[
                {top:"20%",left:"8%"},{top:"60%",left:"15%"},
                {top:"30%",left:"85%"},{top:"70%",left:"90%"},
                {top:"50%",left:"50%"},{top:"15%",left:"55%"},
              ].map((pos,i) => (
                <div key={i} style={{
                  position:"absolute", fontSize:6, color:"rgba(255,200,160,0.4)",
                  top:pos.top, left:pos.left, lineHeight:1,
                }}>✦</div>
              ))}

              {/* "Literary Slots" — neon script like "Casino" on reference */}
              <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "#ff6060",
                  letterSpacing: "0.04em",
                  display: "block",
                  lineHeight: 1.1,
                  animation: "neon-casino 2.4s ease-in-out infinite",
                }}>
                  Literary Slots
                </span>
              </div>

              {/* Gold ornament lines below title */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6, marginTop: 6,
                justifyContent: "center",
              }}>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(to right,transparent,rgba(200,144,16,0.6))" }} />
                <span style={{ color:"rgba(200,144,16,0.7)", fontSize:8 }}>◆</span>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(to left,transparent,rgba(200,144,16,0.6))" }} />
              </div>
            </div>
          </div>

          {/* ── GOLD SEPARATOR LEDGE under marquee ── */}
          <div style={{
            margin: "6px 10px",
            height: 10,
            background: G_H,
            borderRadius: 5,
            boxShadow: [
              "0 3px 8px rgba(0,0,0,0.5)",
              "inset 0 1px 0 rgba(255,240,120,0.6)",
              "inset 0 -2px 0 rgba(80,40,0,0.5)",
            ].join(","),
          }} />

          {/* ── REELS SECTION ── */}
          <div style={{
            margin: "0 10px",
            position: "relative",
          }}>
            {/* Gold outer bezel */}
            <div style={{
              borderRadius: 10,
              padding: 6,
              background: G_H,
              boxShadow: [
                "0 0 0 1px #7a5000",
                "0 6px 18px rgba(0,0,0,0.75)",
                "inset 0 2px 0 rgba(255,240,130,0.4)",
                "inset 0 -2px 0 rgba(80,40,0,0.5)",
              ].join(","),
            }}>
              {/* Corner rivets on bezel */}
              <Rivet style={{ top: 4, left: 4 }} />
              <Rivet style={{ top: 4, right: 4 }} />
              <Rivet style={{ bottom: 4, left: 4 }} />
              <Rivet style={{ bottom: 4, right: 4 }} />

              {/* Dark reel housing */}
              <div style={{
                borderRadius: 6,
                padding: "10px 10px",
                background: "#180e06",
                boxShadow: [
                  "inset 0 6px 20px rgba(0,0,0,0.95)",
                  "inset 0 -4px 12px rgba(0,0,0,0.8)",
                  "inset 4px 0 12px rgba(0,0,0,0.6)",
                  "inset -4px 0 12px rgba(0,0,0,0.6)",
                ].join(","),
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
                    delay={i * 400}
                    onDone={handleReelDone}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── GOLD SEPARATOR LEDGE between reels and control panel ── */}
          <div style={{
            margin: "6px 10px",
            height: 10,
            background: G_H,
            borderRadius: 5,
            boxShadow: [
              "0 3px 8px rgba(0,0,0,0.5)",
              "inset 0 1px 0 rgba(255,240,120,0.6)",
              "inset 0 -2px 0 rgba(80,40,0,0.5)",
            ].join(","),
          }} />

          {/* ── CONTROL PANEL — buttons row ── */}
          <div style={{
            margin: "0 10px",
            borderRadius: 8,
            padding: "8px 12px",
            background: G_DARK,
            boxShadow: [
              "inset 0 3px 8px rgba(0,0,0,0.55)",
              "inset 0 -1px 0 rgba(255,240,80,0.15)",
            ].join(","),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}>
            {/* Small cream/gold buttons like reference keyboard */}
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", flex: 1 }}>
              {["◀","●","▶","■","▲"].map((sym, i) => (
                <div key={i} style={{
                  width: 28, height: 22,
                  borderRadius: 4,
                  background: "linear-gradient(180deg,#f0e8d0 0%,#d8c8a0 50%,#c0b080 100%)",
                  boxShadow: "0 3px 5px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,200,0.5),inset 0 -2px 0 rgba(80,60,0,0.4)",
                  border: "1px solid rgba(120,90,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ fontSize: 8, color: "#4a3010", fontWeight: 700 }}>{sym}</span>
                </div>
              ))}
            </div>

            {/* Spin button center */}
            <SpinButton onClick={onSpin} spinning={spinning} done={done} />

            {/* Right: coin slot + labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end", flex: 1 }}>
              {/* Coin slot */}
              <div style={{
                width: 50, height: 7,
                background: "linear-gradient(180deg,#0a0604,#1a1008,#0a0604)",
                borderRadius: 3,
                boxShadow: "inset 0 2px 6px rgba(0,0,0,1),0 1px 0 rgba(255,200,80,0.15)",
                border: "1px solid rgba(100,70,0,0.5)",
              }} />
              <span style={{ fontFamily: "monospace", fontSize: 7, color: "#c8a020", letterSpacing: "0.12em" }}>◂ COIN ▸</span>
              {/* Small utility buttons */}
              <div style={{ display: "flex", gap: 4 }}>
                {["BET","MAX"].map(l => (
                  <div key={l} style={{
                    padding: "2px 7px",
                    background: "linear-gradient(180deg,#f0e8d0,#c8b880)",
                    borderRadius: 3,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,200,0.5)",
                    border: "1px solid rgba(100,70,0,0.4)",
                  }}>
                    <span style={{ fontFamily:"monospace", fontSize:7, fontWeight:700, color:"#4a3010", letterSpacing:"0.08em" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── GOLD LEDGE between control and bottom panel ── */}
          <div style={{
            margin: "6px 10px",
            height: 10,
            background: G_H,
            borderRadius: 5,
            boxShadow: [
              "0 3px 8px rgba(0,0,0,0.5)",
              "inset 0 1px 0 rgba(255,240,120,0.6)",
              "inset 0 -2px 0 rgba(80,40,0,0.5)",
            ].join(","),
          }} />

          {/* ── BOTTOM PANEL — dark red with neon "Literary" and LED ── */}
          <div style={{
            margin: "0 10px",
            borderRadius: 8,
            overflow: "hidden",
            border: "2px solid transparent",
            backgroundImage: G_H,
            padding: 3,
          }}>
            <div style={{
              borderRadius: 6,
              padding: "12px 16px",
              background: [
                "linear-gradient(180deg,",
                "#5a0820 0%,",
                "#3c0414 40%,",
                "#280210 70%,",
                "#3c0414 100%)"
              ].join(""),
              boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              position: "relative",
            }}>
              {/* Stars background */}
              {[
                {top:"15%",left:"6%"},{top:"65%",left:"12%"},
                {top:"25%",left:"88%"},{top:"75%",left:"82%"},
                {top:"45%",left:"45%"},
              ].map((pos,i) => (
                <div key={i} style={{
                  position:"absolute",fontSize:5,color:"rgba(255,180,140,0.3)",
                  top:pos.top, left:pos.left,
                }}>✦</div>
              ))}

              {/* "Literary" neon — like "Colts" on reference */}
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 700,
                fontStyle: "italic",
                color: "#ff5050",
                letterSpacing: "0.06em",
                animation: "neon-bottom 2.2s ease-in-out infinite",
                position: "relative", zIndex: 2,
              }}>
                Literary
              </span>

              {/* Bulb row */}
              <div style={{ display:"flex", gap:8, alignItems:"center", zIndex:2, position:"relative" }}>
                {bulbColors.map((c, i) => (
                  <Bulb key={i} on={bulbOn} color={c} />
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM BASE — LED display row ── */}
          <div style={{
            margin: "6px 10px 10px",
            borderRadius: 6,
            padding: "6px 12px",
            background: G_DARK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            boxShadow: "inset 0 3px 8px rgba(0,0,0,0.5)",
          }}>
            <LedDisplay spinning={spinning} done={done} />
          </div>

          {/* Body corner rivets */}
          <Rivet style={{ top: 12, left: 12 }} />
          <Rivet style={{ top: 12, right: 12 }} />

          {/* ── LEVER ── */}
          <Lever onClick={onSpin} spinning={spinning} />
        </div>

        {/* Ground shadow */}
        <div style={{
          margin: "8px auto 0",
          width: "75%",
          height: 14,
          background: "radial-gradient(ellipse at 50% 0%,rgba(0,0,0,0.65),transparent)",
          borderRadius: "50%",
        }} />
      </div>
    </>
  );
}
