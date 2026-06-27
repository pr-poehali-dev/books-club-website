import { useRef, useEffect } from "react";
import type { Book } from "@/data/randomizerConstants";
import { ITEM_H, VISIBLE, SPIN_ROWS } from "@/components/roulette/SlotMachineAtoms";

export interface ReelProps {
  books: Book[];
  targetIdx: number;
  spinning: boolean;
  delay: number;
  onDone: () => void;
}

export default function Reel({ books, targetIdx, spinning, delay, onDone }: ReelProps) {
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
    /* White drum window — like reference image */
    <div style={{
      position: "relative",
      height: ITEM_H * VISIBLE,
      overflow: "hidden",
      borderRadius: 6,
      /* White reel background */
      background: "#f8f6f0",
      boxShadow: [
        "inset 0 5px 18px rgba(0,0,0,0.7)",
        "inset 0 -4px 14px rgba(0,0,0,0.6)",
        "inset 3px 0 12px rgba(0,0,0,0.4)",
        "inset -3px 0 12px rgba(0,0,0,0.4)",
        "0 0 0 2px rgba(180,130,0,0.6)",
      ].join(","),
    }}>
      {/* Drum strip */}
      <div
        ref={stripRef}
        style={{
          willChange: "transform",
          animation: spinning ? "reel-blur 0.25s ease infinite" : "none",
        }}>
        {tape.map((book, i) => (
          <div key={i} style={{
            height: ITEM_H,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 10px",
            textAlign: "center",
            /* Alternating cream / white stripes like real drum */
            background: i % 2 === 0
              ? "linear-gradient(180deg,#ffffff 0%,#f5f2ea 100%)"
              : "linear-gradient(180deg,#eee8d8 0%,#e4dcca 100%)",
            borderBottom: "1px solid rgba(180,140,60,0.3)",
            position: "relative",
          }}>
            {/* Horizontal ruled lines */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "repeating-linear-gradient(180deg,transparent,transparent 15px,rgba(0,0,0,0.04) 15px,rgba(0,0,0,0.04) 16px)",
              pointerEvents: "none",
            }} />
            {/* Book title — bold dark red like "7" on casino machine */}
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 13,
              fontWeight: 900,
              color: "#8b0000",
              lineHeight: 1.2,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: 3,
              position: "relative",
              /* Text stroke for realism */
              WebkitTextStroke: "0.3px rgba(60,0,0,0.4)",
              textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            } as React.CSSProperties}>
              {book.title}
            </p>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 9,
              fontWeight: 600,
              color: "#6a4010",
              letterSpacing: "0.03em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: "100%",
              textAlign: "center",
              position: "relative",
              textTransform: "uppercase",
            }}>
              {book.author}
            </p>
          </div>
        ))}
      </div>

      {/* Top curved shadow — barrel depth */}
      <div style={{
        position: "absolute", inset: "0 0 auto 0", height: 40, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 55%, transparent 100%)",
      }} />
      {/* Bottom curved shadow */}
      <div style={{
        position: "absolute", inset: "auto 0 0 0", height: 40, zIndex: 10, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 55%, transparent 100%)",
      }} />
      {/* Left edge barrel curve */}
      <div style={{
        position: "absolute", inset: "0 auto 0 0", width: 10, zIndex: 9, pointerEvents: "none",
        background: "linear-gradient(to right, rgba(0,0,0,0.4), transparent)",
      }} />
      {/* Right edge barrel curve */}
      <div style={{
        position: "absolute", inset: "0 0 0 auto", width: 10, zIndex: 9, pointerEvents: "none",
        background: "linear-gradient(to left, rgba(0,0,0,0.4), transparent)",
      }} />
      {/* Center payline — gold lines like reference */}
      <div style={{
        position: "absolute", zIndex: 20, pointerEvents: "none",
        top: ITEM_H * ((VISIBLE - 1) / 2),
        left: 0, right: 0,
        height: ITEM_H,
        borderTop: "2px solid rgba(218,165,32,0.9)",
        borderBottom: "2px solid rgba(218,165,32,0.9)",
        boxShadow: "0 0 12px rgba(218,165,32,0.4), inset 0 0 8px rgba(218,165,32,0.08)",
      }} />
    </div>
  );
}
