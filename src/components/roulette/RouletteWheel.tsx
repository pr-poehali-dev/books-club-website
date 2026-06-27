import { useRef, useEffect, useCallback } from "react";

const SIZE   = 480;
const CX     = SIZE / 2;
const CY     = SIZE / 2;
const R_OUT  = SIZE / 2 - 4;
const R_SEG  = R_OUT - 30;
const R_IN   = 88;
const BALL_R = 9;

const SEG_COLORS = [
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
  "#1a472a","#0d0d0d","#5c0a0a","#0d0d0d",
];

function drawWheel(ctx: CanvasRenderingContext2D, angle: number, segments: string[], ballAngle: number, ballR: number) {
  ctx.clearRect(0, 0, SIZE, SIZE);
  const n = segments.length;
  const step = (Math.PI * 2) / n;

  /* Outer metallic rim */
  const rimG = ctx.createRadialGradient(CX, CY, R_SEG + 2, CX, CY, R_OUT + 2);
  rimG.addColorStop(0,   "#b8860b");
  rimG.addColorStop(0.3, "#ffd700");
  rimG.addColorStop(0.65,"#daa520");
  rimG.addColorStop(1,   "#7a5c00");
  ctx.beginPath(); ctx.arc(CX, CY, R_OUT, 0, Math.PI * 2);
  ctx.fillStyle = rimG; ctx.fill();

  /* Rim inner shadow */
  const rimShadow = ctx.createRadialGradient(CX, CY, R_SEG, CX, CY, R_SEG + 10);
  rimShadow.addColorStop(0, "rgba(0,0,0,0.5)");
  rimShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.beginPath(); ctx.arc(CX, CY, R_SEG + 10, 0, Math.PI * 2);
  ctx.fillStyle = rimShadow; ctx.fill();

  /* Segments */
  for (let i = 0; i < n; i++) {
    const a0  = angle + i * step;
    const a1  = a0 + step;
    const mid = a0 + step / 2;

    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R_SEG, a0, a1);
    ctx.closePath();
    ctx.fillStyle = SEG_COLORS[i % SEG_COLORS.length];
    ctx.fill();

    /* 3D sheen */
    const grd = ctx.createRadialGradient(
      CX + Math.cos(mid) * R_SEG * 0.45,
      CY + Math.sin(mid) * R_SEG * 0.45,
      0,
      CX, CY, R_SEG
    );
    grd.addColorStop(0, "rgba(255,255,255,0.09)");
    grd.addColorStop(1, "rgba(0,0,0,0.22)");
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, R_SEG, a0, a1);
    ctx.closePath();
    ctx.fillStyle = grd; ctx.fill();

    /* Gold divider */
    ctx.beginPath();
    ctx.moveTo(CX + Math.cos(a0) * (R_IN + 2), CY + Math.sin(a0) * (R_IN + 2));
    ctx.lineTo(CX + Math.cos(a0) * R_SEG,      CY + Math.sin(a0) * R_SEG);
    ctx.strokeStyle = "#c8a000"; ctx.lineWidth = 1.5; ctx.stroke();

    /* Label */
    const lr = (R_SEG + R_IN) / 2 + 6;
    const lx = CX + Math.cos(mid) * lr;
    const ly = CY + Math.sin(mid) * lr;
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(mid + Math.PI / 2);

    const parts = segments[i].split("|");
    const emoji = parts[0] || "";
    const text  = parts[1] || "";

    const emojiSize = Math.max(10, Math.min(15, (R_SEG - R_IN) * 0.27));
    const textSize  = Math.max(7,  Math.min(9,  (R_SEG - R_IN) * 0.17));

    ctx.font = `${emojiSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "#fff";
    ctx.fillText(emoji, 0, 1);

    ctx.font = `bold ${textSize}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    const words = text.split(" ");
    if (text.length <= 10 || words.length <= 1) {
      ctx.fillText(text, 0, 3);
    } else {
      const half = Math.ceil(words.length / 2);
      ctx.fillText(words.slice(0, half).join(" "), 0, 3);
      ctx.fillText(words.slice(half).join(" "),    0, 3 + textSize + 1);
    }
    ctx.restore();
  }

  /* Inner hub rings */
  for (const [r, stop0, stop1, stop2] of [
    [R_IN,       "#3a2a00","#1a1000","#0a0800"],
    [R_IN * 0.7, "#2a1e00","#140e00","#060400"],
    [R_IN * 0.45,"#1e1600","#0e0900","#040200"],
  ] as [number, string, string, string][]) {
    const g = ctx.createRadialGradient(CX - r * 0.2, CY - r * 0.2, r * 0.05, CX, CY, r);
    g.addColorStop(0, stop0); g.addColorStop(0.5, stop1); g.addColorStop(1, stop2);
    ctx.beginPath(); ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "#c8a000"; ctx.lineWidth = 1.2; ctx.stroke();
  }

  /* Center jewel */
  const jg = ctx.createRadialGradient(CX - 6, CY - 6, 2, CX, CY, 22);
  jg.addColorStop(0, "#ffe066"); jg.addColorStop(0.5, "#daa520"); jg.addColorStop(1, "#5a3e00");
  ctx.beginPath(); ctx.arc(CX, CY, 22, 0, Math.PI * 2);
  ctx.fillStyle = jg; ctx.fill();
  ctx.strokeStyle = "#ffe066"; ctx.lineWidth = 2; ctx.stroke();

  /* Ball */
  const bx = CX + Math.cos(ballAngle) * ballR;
  const by = CY + Math.sin(ballAngle) * ballR;
  const bg = ctx.createRadialGradient(bx - 3, by - 3, 1, bx, by, BALL_R);
  bg.addColorStop(0, "#ffffff"); bg.addColorStop(0.4, "#ddd"); bg.addColorStop(1, "#888");
  ctx.beginPath(); ctx.arc(bx, by, BALL_R, 0, Math.PI * 2);
  ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1; ctx.stroke();

  /* Pointer */
  ctx.save();
  ctx.translate(CX, 10);
  ctx.beginPath();
  ctx.moveTo(-11, 0); ctx.lineTo(11, 0); ctx.lineTo(0, 24);
  ctx.closePath();
  const pg = ctx.createLinearGradient(-11, 0, 11, 0);
  pg.addColorStop(0, "#daa520"); pg.addColorStop(0.5, "#ffe066"); pg.addColorStop(1, "#b8860b");
  ctx.fillStyle = pg; ctx.fill();
  ctx.strokeStyle = "#7a5c00"; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.restore();
}

export interface RouletteWheelProps {
  segments: string[];
  spinning: boolean;
  targetIdx: number;
  onDone: () => void;
}

export default function RouletteWheel({ segments, spinning, targetIdx, onDone }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const angleRef  = useRef(0);
  const ballRef   = useRef({ angle: -Math.PI / 4, r: R_SEG - 14 });
  const doneRef   = useRef(false);

  const n = segments.length;

  const render = useCallback(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    drawWheel(ctx, angleRef.current, segments, ballRef.current.angle, ballRef.current.r);
  }, [segments]);

  useEffect(() => { render(); }, [render]);

  useEffect(() => {
    if (!spinning) { doneRef.current = false; return; }
    doneRef.current = false;
    cancelAnimationFrame(rafRef.current);

    const segStep    = (Math.PI * 2) / n;
    const baseTarget = -Math.PI / 2 - (targetIdx * segStep + segStep / 2);
    const extraTurns = Math.PI * 2 * (12 + Math.floor(Math.random() * 5));
    const totalDelta = baseTarget - angleRef.current - extraTurns;
    const startAngle = angleRef.current;
    const endAngle   = startAngle + totalDelta;

    const startBallAngle = ballRef.current.angle;
    const FRAMES = 240;
    let f = 0;

    const tick = () => {
      f++;
      const t = Math.min(f / FRAMES, 1);
      const eased = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

      angleRef.current = startAngle + totalDelta * eased;

      const ballSpeed = t < 0.55
        ? 0.21 * (1 - t * 0.25)
        : 0.21 * (1 - 0.55 * 0.25) * Math.pow(1 - (t - 0.55) / 0.45, 1.6);
      ballRef.current.angle = startBallAngle - (startBallAngle - ballRef.current.angle) + (startBallAngle - (startBallAngle + ballSpeed * FRAMES * t * 0.8));
      ballRef.current.angle -= ballSpeed;

      if (t > 0.55) {
        const prog = (t - 0.55) / 0.45;
        ballRef.current.r = (R_SEG - 14) - prog * ((R_SEG - 14) - 92);
      }

      render();

      if (f >= FRAMES) {
        angleRef.current = endAngle;
        ballRef.current.r = 92;
        render();
        if (!doneRef.current) { doneRef.current = true; onDone(); }
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [spinning, targetIdx, n, render, onDone]);

  return (
    <div className="relative flex items-center justify-center select-none">
      <div className="absolute rounded-full pointer-events-none"
        style={{
          width: SIZE + 40, height: SIZE + 40,
          top: -20, left: -20,
          background: "radial-gradient(circle at 35% 30%, #2a1a00, #120d00 55%, #060400)",
          boxShadow: "0 0 0 5px #c8a000, 0 0 0 8px #7a5c00, 0 0 60px rgba(200,160,0,0.25), inset 0 0 40px rgba(0,0,0,0.9)",
          zIndex: 0,
        }} />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (Math.PI * 2 * i) / 16 - Math.PI / 2;
        const r = SIZE / 2 + 14;
        return (
          <div key={i} className="absolute w-2 h-2 rounded-full z-20 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 40% 35%, #ffe066, #7a5c00)",
              boxShadow: "0 0 4px rgba(200,160,0,0.6)",
              left: CX + Math.cos(a) * r - 4,
              top:  CY + Math.sin(a) * r - 4,
            }} />
        );
      })}
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        className="relative z-10 rounded-full cursor-pointer"
        style={{ filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.9))" }}
        onClick={() => {}}
      />
    </div>
  );
}
