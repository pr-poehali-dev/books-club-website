export default function Divider() {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-dim opacity-40" />
      <span className="text-gold-dim text-lg leading-none">✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-dim opacity-40" />
    </div>
  );
}
