import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/976c0130-c3e8-40de-af33-aa27a75d84c0";

interface Suggestion {
  id: number;
  title: string;
  author: string;
  comment: string;
  created_at: string;
}

export default function BookSuggestions() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setSuggestions(data.suggestions || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="font-display text-xl text-gold font-semibold hover:opacity-80 transition-opacity">
            Литературный клуб
          </Link>
          <Link
            to="/"
            className="text-sm font-body text-muted-foreground hover:text-parchment transition-colors flex items-center gap-1.5"
          >
            <Icon name="ArrowLeft" size={16} /> На главную
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-gold text-xs font-body font-medium tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full bg-gold/10">
            От читателей
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-parchment font-semibold mb-4">
            Предложенные книги
          </h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            Здесь собраны книги, которые читатели предлагают выбрать книгой месяца.
          </p>
        </div>

        {loading && (
          <p className="text-center text-muted-foreground font-body">Загружаем предложения…</p>
        )}

        {!loading && error && (
          <p className="text-center text-muted-foreground font-body">
            Не удалось загрузить список. Попробуйте обновить страницу позже.
          </p>
        )}

        {!loading && !error && suggestions.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl border border-white/5">
            <Icon name="BookOpen" size={32} className="text-gold-dim mx-auto mb-4" />
            <p className="text-parchment font-body font-medium mb-1">Пока пусто</p>
            <p className="text-muted-foreground font-body text-sm">
              Никто ещё не предложил книгу — станьте первым.
            </p>
          </div>
        )}

        {!loading && !error && suggestions.length > 0 && (
          <div className="flex flex-col gap-3">
            {suggestions.map((s) => (
              <div
                key={s.id}
                className="bg-card rounded-2xl p-6 border border-white/5 flex flex-col gap-2"
              >
                <h3 className="font-display text-lg text-parchment font-semibold">{s.title}</h3>
                {s.author && <p className="text-gold text-xs font-body italic">{s.author}</p>}
                {s.comment && (
                  <p className="text-muted-foreground font-body text-sm leading-relaxed mt-1">
                    {s.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}