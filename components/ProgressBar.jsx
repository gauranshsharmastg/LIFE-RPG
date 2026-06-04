export default function ProgressBar({ value, max = 100, label, sublabel, glow = true }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="mb-2 flex items-end justify-between text-xs">
          {label && <span className="font-medium text-zinc-400">{label}</span>}
          {sublabel && (
            <span className="font-mono text-[#39ff14]">{sublabel}</span>
          )}
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-[#1a1a1a] ring-1 ring-[#2a2a2a]">
        <div
          className={`progress-fill h-full rounded-full bg-gradient-to-r from-[#2dd40f] to-[#39ff14] ${glow ? "shadow-[0_0_12px_rgba(57,255,20,0.5)]" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
