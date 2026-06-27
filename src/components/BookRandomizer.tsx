import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import { pickFiltered, BOOKS, type Mood, type Era, type Volume, type Genre, type Book } from "@/data/randomizerConstants";
import RouletteWheel from "@/components/roulette/RouletteWheel";
import RandomizerFilters from "@/components/roulette/RandomizerFilters";
import BookResultCard from "@/components/roulette/BookResultCard";

export default function BookRandomizer() {
  const [mood,   setMood]   = useState<Mood   | null>(null);
  const [era,    setEra]    = useState<Era    | null>(null);
  const [volume, setVolume] = useState<Volume | null>(null);
  const [genre,  setGenre]  = useState<Genre  | null>(null);

  const [spinning,   setSpinning]   = useState(false);
  const [result,     setResult]     = useState<{book: Book; isFallback: boolean} | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [winGlow,    setWinGlow]    = useState(false);
  const [targetIdx,  setTargetIdx]  = useState(0);

  const pool       = pickFiltered(mood, era, volume, genre);
  const hasFilters = !!(mood || era || volume || genre);
  const isFallback = pool === BOOKS && hasFilters;
  const wheelBooks = pool.slice(0, 16);
  const segments   = wheelBooks.map(b => `${b.emoji}|${b.title}`);

  const handleSpin = () => {
    if (spinning) return;
    setShowResult(false);
    setWinGlow(false);
    const idx = Math.floor(Math.random() * wheelBooks.length);
    setTargetIdx(idx);
    setResult({ book: wheelBooks[idx], isFallback: !!isFallback });
    setSpinning(true);
  };

  const handleDone = useCallback(() => {
    setSpinning(false);
    setShowResult(true);
    setWinGlow(true);
    setTimeout(() => setWinGlow(false), 1400);
  }, []);

  const handleReset = () => {
    setMood(null);
    setEra(null);
    setVolume(null);
    setGenre(null);
  };

  return (
    <section id="randomizer" className="py-20 overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <div className="px-6 max-w-6xl mx-auto">
        <SectionTitle sub="Что почитать?">Книжная рулетка</SectionTitle>

        <RandomizerFilters
          mood={mood}   era={era}   volume={volume}   genre={genre}
          onMood={setMood} onEra={setEra} onVolume={setVolume} onGenre={setGenre}
          onReset={handleReset}
        />

        <div className="flex flex-col lg:flex-row items-center justify-center gap-14 lg:gap-20">

          <div className="flex flex-col items-center gap-8">
            <RouletteWheel
              segments={segments}
              spinning={spinning}
              targetIdx={targetIdx}
              onDone={handleDone}
            />
            <button onClick={handleSpin} disabled={spinning}
              className={`px-12 py-3.5 rounded-2xl font-body font-medium text-sm transition-all duration-200 min-w-[220px]
                ${spinning
                  ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                  : "bg-gold text-ink hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/25 hover:-translate-y-0.5 active:scale-95"}`}>
              {spinning ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-muted-foreground border-t-parchment rounded-full animate-spin inline-block" />
                  Вращается…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Shuffle" size={15} />
                  {showResult ? "Крутить ещё" : "Крутить колесо"}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 w-full lg:max-w-md">
            {!showResult && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 opacity-40">
                <div className="text-gold text-5xl animate-pulse">◈</div>
                <p className="text-muted-foreground font-body text-base">Нажмите — колесо выберет</p>
              </div>
            )}

            {showResult && result && (
              <BookResultCard
                result={result}
                winGlow={winGlow}
                spinning={spinning}
                onSpin={handleSpin}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
