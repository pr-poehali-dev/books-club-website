import Divider from "@/components/Divider";

interface SectionTitleProps {
  children: React.ReactNode;
  sub?: string;
}

export default function SectionTitle({ children, sub }: SectionTitleProps) {
  return (
    <div className="text-center mb-12">
      {sub && (
        <p className="text-gold-dim text-sm tracking-[0.3em] uppercase mb-3 font-body">{sub}</p>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-parchment font-light">{children}</h2>
      <Divider />
    </div>
  );
}
