import { BADGES } from "../lib/constants";

export default function BadgeGrid({ unlocked }) {
  const set = new Set(unlocked || []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {BADGES.map((badge, i) => {
        const on = set.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`badge-tile rounded-2xl border p-4 text-center transition-all duration-300 ${
              on
                ? "border-[#39ff14]/40 bg-[#39ff14]/5 shadow-[0_0_16px_rgba(57,255,20,0.12)]"
                : "border-[#1a1a1a] bg-[#0a0a0a] opacity-50 grayscale"
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="mb-2 text-3xl">{badge.icon}</div>
            <h3 className="text-sm font-semibold text-zinc-100">{badge.name}</h3>
            <p className="mt-1 text-[11px] leading-snug text-zinc-500">{badge.desc}</p>
            {on && (
              <span className="mt-2 inline-block rounded-full bg-[#39ff14]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#39ff14]">
                Unlocked
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
