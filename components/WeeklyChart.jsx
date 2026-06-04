export default function WeeklyChart({ days, streak }) {
  return (
    <div className="rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a]/80 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Weekly Activity
          </h2>
          <p className="mt-0.5 text-2xl font-bold text-white">
            <span className="text-[#39ff14]">{streak.current}</span>
            <span className="text-lg font-normal text-zinc-500"> day streak</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Best</p>
          <p className="font-mono text-lg text-[#39ff14]">{streak.longest}</p>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2">
        {days.map((d) => (
          <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
            <div className="relative flex h-28 w-full items-end justify-center rounded-lg bg-[#111] ring-1 ring-[#1a1a1a]">
              <div
                className={`bar-grow w-[70%] max-w-8 rounded-t-md transition-all ${
                  d.active
                    ? "bg-gradient-to-t from-[#2dd40f] to-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.4)]"
                    : "bg-[#2a2a2a]"
                }`}
                style={{ height: `${Math.max(8, d.percent)}%` }}
              />
            </div>
            <span className="text-[10px] font-medium uppercase text-zinc-500">
              {d.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
