import { useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import SectionTitle from "@/components/SectionTitle";

const API_URL = "https://functions.poehali.dev/976c0130-c3e8-40de-af33-aa27a75d84c0";

export default function BookSuggestForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Укажите название книги");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, comment }),
      });
      if (!res.ok) throw new Error("Request failed");

      toast.success("Спасибо! Ваше предложение отправлено");
      setTitle("");
      setAuthor("");
      setComment("");
    } catch {
      toast.error("Не удалось отправить предложение, попробуйте позже");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="suggest-book" className="py-24 px-6 max-w-3xl mx-auto">
      <SectionTitle sub="Ваш голос важен">Предложить книгу месяца</SectionTitle>
      <p className="text-center text-muted-foreground font-body text-lg mb-10 max-w-xl mx-auto">
        Знаете книгу, которую стоит обсудить всем клубом? Расскажите нам о ней.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col gap-5"
      >
        <div>
          <label className="block text-xs font-body font-medium tracking-wider uppercase text-gold-dim mb-2">
            Название книги *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например, «Мастер и Маргарита»"
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-muted-foreground focus:outline-none focus:border-gold-dim transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-body font-medium tracking-wider uppercase text-gold-dim mb-2">
            Автор
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Например, Михаил Булгаков"
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-muted-foreground focus:outline-none focus:border-gold-dim transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-body font-medium tracking-wider uppercase text-gold-dim mb-2">
            Примечания
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Почему стоит выбрать именно эту книгу?"
            rows={4}
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-parchment font-body placeholder:text-muted-foreground focus:outline-none focus:border-gold-dim transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-7 py-3 bg-gold text-ink font-body font-medium text-sm rounded-xl hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting ? "Отправляем…" : "Отправить предложение"}
          </button>
          <Link
            to="/suggestions"
            className="text-sm font-body text-gold-dim hover:text-gold transition-colors flex items-center gap-1.5"
          >
            Смотреть все предложения <Icon name="ArrowRight" size={14} />
          </Link>
        </div>
      </form>
    </section>
  );
}
