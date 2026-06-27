import { BOOKS, type Mood, type Era, type Volume, type Genre, type Book } from "@/data/books";

export type { Mood, Era, Volume, Genre, Book };
export { BOOKS };

export const MOOD_OPTIONS: { id: Mood; label: string; emoji: string }[] = [
  { id: "romance",  label: "Романтика",   emoji: "🌹" },
  { id: "comedy",   label: "Комедия",     emoji: "😄" },
  { id: "tragedy",  label: "Трагедия",    emoji: "😭" },
  { id: "lyric",    label: "Лирика",      emoji: "🎵" },
  { id: "heroic",   label: "Героическое", emoji: "⚡" },
  { id: "drama",    label: "Драма",       emoji: "🎭" },
];

export const ERA_OPTIONS: { id: Era; label: string; emoji: string; hint: string }[] = [
  { id: "antique",  label: "Античность",    emoji: "🏛️", hint: "Гомер, Платон, Овидий" },
  { id: "medieval", label: "Средневековье", emoji: "🏰", hint: "Данте, Шекспир, Боккаччо" },
  { id: "xix",      label: "XIX век",       emoji: "🪶", hint: "Толстой, Пушкин, Достоевский" },
  { id: "xx",       label: "XX век",        emoji: "📻", hint: "Булгаков, Камю, Оруэлл" },
  { id: "modern",   label: "Современность", emoji: "💻", hint: "Мураками, Харари, Коэльо" },
];

export const VOLUME_OPTIONS: { id: Volume; label: string; emoji: string; hint: string }[] = [
  { id: "sketch",  label: "Очерк / рассказ / новелла", emoji: "📄", hint: "Чехов, Гоголь, Хемингуэй" },
  { id: "story",   label: "Рассказ",                   emoji: "📝", hint: "Чехов, Бунин, По" },
  { id: "novella", label: "Новелла / повесть",          emoji: "📋", hint: "Булгаков, Камю, Голдинг" },
  { id: "tale",    label: "Повесть",                   emoji: "📕", hint: "Лермонтов, Тургенев" },
  { id: "novel",   label: "Роман",                     emoji: "📗", hint: "Достоевский, Мураками" },
  { id: "epic",    label: "Роман-эпопея",              emoji: "📖", hint: "Толстой, Гомер, Данте" },
];

export const GENRE_OPTIONS: { id: Genre; label: string; emoji: string }[] = [
  { id: "fiction",    label: "Художественная проза", emoji: "✍️" },
  { id: "philosophy", label: "Философия",            emoji: "🧠" },
  { id: "nonfiction", label: "Нон-фикшн",            emoji: "📰" },
  { id: "drama",      label: "Пьеса / драма",        emoji: "🎬" },
  { id: "poetry",     label: "Поэзия",               emoji: "🌿" },
];

export const ERA_LABEL:    Record<Era,    string> = { antique: "Античность", medieval: "Средневековье", xix: "XIX век", xx: "XX век", modern: "Современность" };
export const VOLUME_LABEL: Record<Volume, string> = { sketch: "Очерк", story: "Рассказ", novella: "Новелла / повесть", tale: "Повесть", novel: "Роман", epic: "Роман-эпопея" };
export const MOOD_LABEL:   Record<Mood,   string> = { romance: "Романтика", comedy: "Комедия", tragedy: "Трагедия", lyric: "Лирика", heroic: "Героическое", drama: "Драма" };
export const GENRE_LABEL:  Record<Genre,  string> = { fiction: "Проза", philosophy: "Философия", nonfiction: "Нон-фикшн", drama: "Пьеса", poetry: "Поэзия" };

export function pickFiltered(mood: Mood|null, era: Era|null, volume: Volume|null, genre: Genre|null): Book[] {
  const f = BOOKS.filter(b =>
    (mood   ? b.moods.includes(mood) : true) &&
    (era    ? b.era    === era        : true) &&
    (volume ? b.volume === volume     : true) &&
    (genre  ? b.genre  === genre      : true)
  );
  return f.length >= 4 ? f : BOOKS;
}
