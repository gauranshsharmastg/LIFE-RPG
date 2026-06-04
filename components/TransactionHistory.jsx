"use client";

const TYPE_LABELS = {
  earn: { label: "Coins earned", className: "text-[#39ff14]" },
  earn_reversal: { label: "Quest undone", className: "text-amber-400" },
  purchase: { label: "Reward purchase", className: "text-violet-400" },
  adjustment: { label: "Adjustment", className: "text-zinc-400" },
};

export default function TransactionHistory({ transactions }) {
  const list = [...(transactions || [])].reverse();

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-8 text-center">
        <p className="text-sm text-zinc-500">No transactions yet.</p>
        <p className="mt-1 text-xs text-zinc-600">
          Complete quests to earn coins and XP.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] overflow-hidden">
      <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr] gap-2 border-b border-[#1a1a1a] bg-[#080808] px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        <span>Date</span>
        <span>Activity</span>
        <span className="text-right">Coins</span>
        <span className="text-right">Balance</span>
      </div>
      <ul className="max-h-[min(60vh,520px)] overflow-y-auto divide-y divide-[#1a1a1a]">
        {list.map((tx) => {
          const meta = TYPE_LABELS[tx.type] || TYPE_LABELS.adjustment;
          const isPositive = tx.coinsDelta > 0;
          return (
            <li
              key={tx.id}
              className="px-4 py-4 transition hover:bg-[#111] sm:grid sm:grid-cols-[1fr_1fr_1fr_1fr] sm:gap-2 sm:items-center"
            >
              <div className="mb-2 sm:mb-0">
                <p className="font-mono text-sm text-zinc-300">{tx.date}</p>
                <p className="text-[10px] text-zinc-600">
                  {new Date(tx.time).toLocaleTimeString("en", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="mb-2 sm:mb-0">
                <p className={`text-xs font-medium uppercase tracking-wide ${meta.className}`}>
                  {meta.label}
                </p>
                <p className="mt-0.5 text-sm text-zinc-200">{tx.description}</p>
                {tx.lifetimeXpDelta > 0 && (
                  <p className="mt-0.5 text-[10px] text-zinc-500">
                    +{tx.lifetimeXpDelta} lifetime XP
                  </p>
                )}
              </div>
              <p
                className={`font-mono text-sm sm:text-right ${
                  isPositive ? "text-[#39ff14]" : "text-red-400"
                }`}
              >
                {isPositive ? "+" : ""}
                {tx.coinsDelta} 🪙
              </p>
              <p className="font-mono text-sm text-zinc-400 sm:text-right">
                {tx.balanceAfter} 🪙
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
