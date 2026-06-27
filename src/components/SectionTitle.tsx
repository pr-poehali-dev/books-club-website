import Divider from "@/components/Divider";

interface SectionTitleProps {
  children: React.ReactNode;
  sub?: string;
}

export default function SectionTitle({ children, sub }: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      {sub && (
        <span className="inline-block text-gold text-xs font-body font-medium tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full bg-gold/10">
          {sub}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-parchment font-semibold">{children}</h2>
      <Divider />
    </div>
  );
}