import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";
import { pickFiltered, BOOKS, type Mood, type Era, type Volume, type Genre, type Book } from "@/data/randomizerConstants";
import SlotMachine from "@/components/roulette/SlotMachine";
import RandomizerFilters from "@/components/roulette/RandomizerFilters";
import BookResultCard from "@/components/roulette/BookResultCard";

export default function BookRandomizer() {
  const [mood,   setMood]   = useState<Mood   | null>(null);
  const [era,    setEra]    = useState<Era    | null>(null);
  const [volume, setVolume] = useState<Volume | null>(null);
  const [genre,  setGenre]  = useState<Genre  | null>(null);

  const [spinning,   setSpinning]   = useState(false);
  const [results,    setResults]    = useState<[Book, Book, Book] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [winGlow,    setWinGlow]    = useState(false);
  const [targets,    setTargets]    = useState<[number, number, number]>([0, 1, 2]);
  const [isFallback, setIsFallback] = useState(false);

  const pool      = pickFiltered(mood, era, volume, genre);
  const hasFilters = !!(mood || era || volume || genre);
  const slotBooks  = pool.length >= 8 ? pool : [...pool, ...BOOKS].slice(0, Math.max(pool.length, 8));

  const handleSpin = () => {
    if (spinning) return;
    setShowResult(false);
    setWinGlow(false);

    // Pick 3 distinct random indices from the pool
    const indices = new Set<number>();
    while (indices.size < Math.min(3, slotBooks.length)) {
      indices.add(Math.floor(Math.random() * slotBooks.length));
    }
    const [i0, i1, i2] = Array.from(indices);
    const t: [number, number, number] = [i0, i1 ?? i0, i2 ?? i0];

    setTargets(t);
    setResults([slotBooks[t[0]], slotBooks[t[1]], slotBooks[t[2]]]);
    setIsFallback(pool === BOOKS && hasFilters);
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
        <SectionTitle sub="Что почитать?">Книжный автомат</SectionTitle>

        <RandomizerFilters
          mood={mood} era={era} volume={volume} genre={genre}
          onMood={setMood} onEra={setEra} onVolume={setVolume} onGenre={setGenre}
          onReset={handleReset}
        />

        <div className="flex flex-col xl:flex-row items-start justify-center gap-10 xl:gap-14">

          {/* Slot machine + button */}
          <div className="w-full xl:w-auto xl:min-w-[560px] flex flex-col items-center gap-6 relative">
            <SlotMachine
              books={slotBooks}
              targets={targets}
              spinning={spinning}
              onDone={handleDone}
            />

            <button
              onClick={handleSpin}
              disabled={spinning}
              className={`px-14 py-4 rounded-2xl font-body font-semibold text-sm tracking-wide transition-all duration-200 min-w-[220px]
                ${spinning
                  ? "bg-white/5 text-muted-foreground cursor-not-allowed"
                  : "bg-gold text-ink hover:bg-gold/90 hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5 active:scale-95"}`}
              style={!spinning ? { boxShadow: "0 0 20px rgba(218,165,32,0.4), 0 4px 16px rgba(0,0,0,0.5)" } : {}}>
              {spinning ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-muted-foreground border-t-parchment rounded-full animate-spin inline-block" />
                  Крутится…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Shuffle" size={15} />
                  {showResult ? "Крутить ещё" : "Крутить автомат"}
                </span>
              )}
            </button>
          </div>

          {/* Result panel */}
          <div className="flex-1 w-full xl:max-w-lg">
            {!showResult && (
              <div className="flex flex-col items-center justify-center gap-4 py-20 opacity-40">
                <div className="text-gold text-5xl animate-pulse">◈</div>
                <p className="text-muted-foreground font-body text-base">Нажмите — автомат выберет три книги</p>
              </div>
            )}

            {showResult && results && (
              <BookResultCard
                books={results}
                isFallback={isFallback}
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
