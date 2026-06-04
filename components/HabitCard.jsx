"use client";

import { useState } from "react";
import { habitXp, isReadingHabit } from "../lib/game";

const ICONS = {
  sunrise: (
    <path d="M12 3v2m0 14v2M4.2 4.2l1.4 1.4m13.2 13.2 1.4 1.4M3 12h2m14 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z" />
  ),
  dumbbell: (
    <path d="M6.5 6.5h2v11h-2zm9 0h2v11h-2zM8.5 10h7v4h-7z" />
  ),
  book: (
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
  ),
  language: (
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 014 18 15 15 0 01-4-18 15 15 0 01-4 18 15 15 0 014-18z" />
  ),
  flask: (
    <path d="M9 3h6v5l5 9a4 4 0 01-3.5 6H7.5A4 4 0 014 17l5-9V3z" />
  ),
  briefcase: (
    <path d="M4 7h16v12H4zM9 7V5h6v2M4 11h16" />
  ),
  science: (
    <path d="M9 3h6l3 7-6 11-6-11 3-7zM12 14v3" />
  ),
  star: (
    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
  ),
};

export default function HabitCard({
  habit,
  completed,
  entry,
  onToggle,
  onEdit,
  onDelete,
  index,
}) {
  const [pages, setPages] = useState(10);
  const [showPages, setShowPages] = useState(false);
  const reading = isReadingHabit(habit);

  const xpLabel = reading
    ? "+1 XP / page"
    : `+${habit.points} XP`;

  const handleClick = () => {
    if (completed) {
      onToggle(habit.id);
      return;
    }
    if (reading) {
      setShowPages(true);
      return;
    }
    onToggle(habit.id);
  };

  const confirmPages = () => {
    onToggle(habit.id, Math.max(1, parseInt(pages, 10) || 1));
    setShowPages(false);
  };

  return (
    <article
      className={`habit-card group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 sm:p-5 ${
        completed
          ? "border-[#39ff14]/50 bg-[#39ff14]/5 shadow-[0_0_24px_rgba(57,255,20,0.15)]"
          : "border-[#1f1f1f] bg-[#0c0c0c] hover:border-[#39ff14]/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.08)]"
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#39ff14]/5 blur-2xl" />

      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors ${
            completed
              ? "border-[#39ff14] bg-[#39ff14]/20 text-[#39ff14]"
              : "border-[#2a2a2a] bg-[#141414] text-zinc-500 group-hover:text-[#39ff14]"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
          >
            {ICONS[habit.icon] || ICONS.star}
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold tracking-tight text-zinc-100">
              {habit.name}
            </h3>
            <span className="rounded-full bg-[#141414] px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500 ring-1 ring-[#2a2a2a]">
              {habit.frequency || "daily"}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#141414] px-2.5 py-0.5 font-mono text-xs text-[#39ff14] ring-1 ring-[#39ff14]/20">
              {xpLabel}
            </span>
          </div>
          {completed && entry && (
            <p className="mt-1 font-mono text-xs text-[#39ff14]/80">
              +{entry.xp ?? habitXp(habit, entry.quantity)} XP earned
              {reading && entry.quantity ? ` · ${entry.quantity} pages` : ""}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          aria-pressed={completed}
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 transition-all duration-300 active:scale-95 ${
            completed
              ? "border-[#39ff14] bg-[#39ff14] text-black"
              : "border-[#2a2a2a] bg-[#111] text-zinc-600 hover:border-[#39ff14]/60 hover:text-[#39ff14]"
          }`}
        >
          {completed && (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 animate-check-pop"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M5 12l5 5L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {showPages && !completed && (
        <div className="mt-4 animate-slide-up rounded-xl border border-[#39ff14]/30 bg-[#0a0a0a] p-3">
          <label className="mb-2 block text-xs text-zinc-400">
            How many pages did you read?
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#111] px-3 py-2 font-mono text-sm text-white outline-none focus:border-[#39ff14]"
            />
            <button
              type="button"
              onClick={confirmPages}
              className="rounded-lg bg-[#39ff14] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#2dd40f]"
            >
              Log
            </button>
            <button
              type="button"
              onClick={() => setShowPages(false)}
              className="rounded-lg border border-[#2a2a2a] px-3 py-2 text-sm text-zinc-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2 border-t border-[#1a1a1a] pt-3">
        <button
          type="button"
          onClick={() => onEdit(habit)}
          className="flex-1 rounded-lg border border-[#2a2a2a] py-1.5 text-xs font-medium text-zinc-400 transition hover:border-[#39ff14]/40 hover:text-[#39ff14]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(habit)}
          className="flex-1 rounded-lg border border-[#2a2a2a] py-1.5 text-xs font-medium text-zinc-400 transition hover:border-red-500/40 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
