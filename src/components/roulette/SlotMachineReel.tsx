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
    <div style={{
      position: "relative",
      height: ITEM_H * VISIBLE,
      overflow: "hidden",
      borderRadius: 3,
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
