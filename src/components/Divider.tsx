export default function Divider() {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-dim/30 to-gold-dim/50" />
      <span className="text-gold-dim/50 text-xs leading-none">◆</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold-dim/30 to-gold-dim/50" />
    </div>
  );
}