import { useRef, useEffect, useState } from "react";
import type { Book } from "@/data/randomizerConstants";

/* ─── Reel item height ─── */
const ITEM_H = 96; // px per cell in the reel
const VISIBLE = 3; // cells visible through the window
const SPIN_FAKE_ROWS = 24; // how many fake rows before the winner

/* ─── Single reel ─────────────────────────────────────────────── */

interface ReelProps {
  books: Book[];          // all books in pool
  targetIdx: number;      // index in `books` of the winner
  spinning: boolean;
  delay: number;          // ms before this reel starts stopping
  onDone: () => void;
}

function Reel({ books, targetIdx, spinning, delay, onDone }: ReelProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const doneRef  = useRef(false);

  // Build the tape: SPIN_FAKE_ROWS random items, then winner, then 1 extra above/below for seamless look
  const tape = [
    ...Array.from({ length: SPIN_FAKE_ROWS }, (_, i) => books[i % books.length]),
    books[targetIdx],
  ];

  useEffect(() => {
    if (!spinning) { doneRef.current = false; return; }
    doneRef.current = false;

    const el = stripRef.current;
    if (!el) return;

    // Reset instantly to top
    el.style.transition = "none";
    el.style.transform  = "translateY(0px)";

    // Scroll down by SPIN_FAKE_ROWS items (winner ends up in center)
    const totalPx  = SPIN_FAKE_ROWS * ITEM_H;
    const duration = 1.6 + delay / 1000;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${duration}s cubic-bezier(0.12, 0.8, 0.25, 1.0)`;
        el.style.transform  = `translateY(-${totalPx}px)`;
      });
    });

    const timer = setTimeout(() => {
      if (!doneRef.current) { doneRef.current = true; onDone(); }
    }, (duration + delay / 1000) * 1000);

    return () => clearTimeout(timer);
  }, [spinning]);

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      style={{
        height: ITEM_H * VISIBLE,
        width: "100%",
        background: "linear-gradient(180deg, #0a0700 0%, #1a1200 15%, #1a1200 85%, #0a0700 100%)",
        boxShadow: "inset 0 0 24px rgba(0,0,0,0.8), inset 0 2px 8px rgba(0,0,0,0.6)",
      }}>

      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-16 z-10 pointer-events-none rounded-t-lg"
        style={{ background: "linear-gradient(to bottom, #0d0a04 0%, rgba(13,10,4,0.7) 50%, transparent 100%)" }} />
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-16 z-10 pointer-events-none rounded-b-lg"
        style={{ background: "linear-gradient(to top, #0d0a04 0%, rgba(13,10,4,0.7) 50%, transparent 100%)" }} />

      {/* Winner highlight line top */}
      <div className="absolute inset-x-0 z-20 pointer-events-none"
        style={{ top: ITEM_H * ((VISIBLE - 1) / 2), height: ITEM_H, borderTop: "1.5px solid rgba(218,165,32,0.6)", borderBottom: "1.5px solid rgba(218,165,32,0.6)" }} />

      {/* Strip */}
      <div ref={stripRef} className="will-change-transform">
        {tape.map((book, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center px-3 text-center"
            style={{ height: ITEM_H }}>
            <p className="font-display text-parchment text-sm font-semibold leading-tight line-clamp-2 mb-1">
              {book.title}
            </p>
            <p className="text-gold-dim text-[11px] font-body truncate w-full text-center">
              {book.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Slot Machine frame ──────────────────────────────────────── */

export interface SlotMachineProps {
  books: Book[];
  targets: [number, number, number]; // indices of 3 winning books
  spinning: boolean;
  onDone: () => void;
}

export default function SlotMachine({ books, targets, spinning, onDone }: SlotMachineProps) {
  const [doneCount, setDoneCount] = useState(0);

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
    <div className="w-full max-w-2xl mx-auto select-none">
      {/* Machine body */}
      <div
        className="relative rounded-2xl p-6 pb-8"
        style={{
          background: "linear-gradient(160deg, #2a1f0a 0%, #1a1200 40%, #120e00 100%)",
          boxShadow: "0 0 0 2px #c8a000, 0 0 0 5px #5a3e00, 0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,220,80,0.15)",
        }}>

        {/* Top panel label */}
        <div className="text-center mb-5">
          <div
            className="inline-block px-8 py-1.5 rounded-sm mb-1"
            style={{
              background: "linear-gradient(90deg, #8b0000, #c0392b, #8b0000)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}>
            <span className="font-display text-parchment text-sm tracking-[0.25em] uppercase font-semibold">
              Книжный автомат
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`rounded-full ${i === 3 ? "w-2.5 h-2.5" : "w-1.5 h-1.5"}`}
                style={{ background: i % 2 === 0 ? "#ffd700" : "#c8a000", boxShadow: i === 3 ? "0 0 6px #ffd700" : undefined }} />
            ))}
          </div>
        </div>

        {/* Reels window — chrome bezel */}
        <div
          className="relative rounded-xl p-1 mb-6"
          style={{
            background: "linear-gradient(145deg, #4a3800, #2a1f00, #4a3800)",
            boxShadow: "0 0 0 1px #7a5c00, inset 0 2px 4px rgba(0,0,0,0.4)",
          }}>
          <div
            className="rounded-lg p-3 grid grid-cols-3 gap-3"
            style={{
              background: "#0d0a04",
              boxShadow: "inset 0 4px 16px rgba(0,0,0,0.9)",
            }}>
            {([0, 1, 2] as const).map(i => (
              <Reel
                key={i}
                books={books}
                targetIdx={targets[i]}
                spinning={spinning}
                delay={i * 350}
                onDone={handleReelDone}
              />
            ))}
          </div>
        </div>

        {/* Bottom decorative row */}
        <div className="flex items-center justify-center gap-3">
          {/* Left indicator lights */}
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full"
                style={{
                  background: spinning
                    ? `radial-gradient(circle at 35% 35%, #ff6b6b, #8b0000)`
                    : doneCount > 0
                    ? `radial-gradient(circle at 35% 35%, #ffd700, #b8860b)`
                    : `radial-gradient(circle at 35% 35%, #444, #222)`,
                  boxShadow: spinning ? "0 0 6px rgba(255,100,100,0.7)" : doneCount > 0 ? "0 0 6px rgba(255,215,0,0.7)" : "none",
                  transition: "all 0.3s",
                }} />
            ))}
          </div>

          {/* Credit display */}
          <div
            className="px-4 py-1 rounded font-body text-xs tracking-widest"
            style={{
              background: "#050300",
              border: "1px solid #3a2a00",
              color: doneCount === 3 ? "#ffd700" : "#5a4500",
              boxShadow: doneCount === 3 ? "0 0 8px rgba(255,215,0,0.3)" : "none",
              fontFamily: "monospace",
              minWidth: 80,
              textAlign: "center",
              transition: "all 0.5s",
            }}>
            {doneCount === 3 ? "WINNER!" : spinning ? "SPIN..." : "READY"}
          </div>

          {/* Right indicator lights */}
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full"
                style={{
                  background: spinning
                    ? `radial-gradient(circle at 35% 35%, #ff6b6b, #8b0000)`
                    : doneCount > 0
                    ? `radial-gradient(circle at 35% 35%, #ffd700, #b8860b)`
                    : `radial-gradient(circle at 35% 35%, #444, #222)`,
                  boxShadow: spinning ? "0 0 6px rgba(255,100,100,0.7)" : doneCount > 0 ? "0 0 6px rgba(255,215,0,0.7)" : "none",
                  transition: "all 0.3s",
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* Side chrome bolts */}
      <div className="absolute -left-3 top-8 flex flex-col gap-6 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full"
            style={{ background: "radial-gradient(circle at 35% 35%, #daa520, #5a3e00)", boxShadow: "0 1px 3px rgba(0,0,0,0.6)" }} />
        ))}
      </div>
      <div className="absolute -right-3 top-8 flex flex-col gap-6 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full"
            style={{ background: "radial-gradient(circle at 35% 35%, #daa520, #5a3e00)", boxShadow: "0 1px 3px rgba(0,0,0,0.6)" }} />
        ))}
      </div>
    </div>
  );
}
