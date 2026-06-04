"use client";

import { useState } from "react";
import { useGameState } from "../hooks/useGameState";
import {
  dailyProgress,
  weeklyActivity,
  availableCoins,
  getLevelInfo,
  getLifetimeXp,
  isHabitComplete,
  getHabitEntry,
} from "../lib/game";
import ProgressBar from "./ProgressBar";
import HabitCard from "./HabitCard";
import WeeklyChart from "./WeeklyChart";
import BadgeGrid from "./BadgeGrid";
import RewardShop from "./RewardShop";
import HabitFormModal from "./HabitFormModal";
import RewardFormModal from "./RewardFormModal";
import ConfirmModal from "./ConfirmModal";
import TransactionHistory from "./TransactionHistory";

const TABS = [
  { id: "habits", label: "Quests", icon: "⚔️" },
  { id: "shop", label: "Shop", icon: "🛒" },
  { id: "history", label: "History", icon: "📜" },
  { id: "badges", label: "Badges", icon: "🏅" },
];

export default function Dashboard() {
  const {
    state,
    ready,
    toast,
    toggleHabit,
    buyReward,
    saveHabit,
    removeHabit,
    saveReward,
    removeReward,
    resetProgress,
  } = useGameState();

  const [tab, setTab] = useState("habits");
  const [habitModal, setHabitModal] = useState({ open: false, habit: null });
  const [rewardModal, setRewardModal] = useState({ open: false, reward: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#39ff14]/30 border-t-[#39ff14]" />
          <p className="font-mono text-sm text-zinc-500">Loading your save...</p>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(state);
  const progress = dailyProgress(state);
  const week = weeklyActivity(state);
  const coins = availableCoins(state);
  const lifetimeXp = getLifetimeXp(state);
  const habits = state.habits.filter((h) => h.enabled !== false);

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "habit") removeHabit(deleteTarget.id);
    else removeReward(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] pb-28 text-zinc-100">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#39ff14]/5 blur-[120px]" />

      {toast && (
        <div
          key={toast.id}
          className="xp-toast fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-2xl border border-[#39ff14]/50 bg-[#0a0a0a]/95 px-6 py-3 shadow-[0_0_30px_rgba(57,255,20,0.35)] backdrop-blur-md"
        >
          <p className="text-center text-sm text-zinc-300">{toast.message}</p>
          {toast.xp > 0 && (
            <div className="mt-1 space-y-0.5 text-center font-mono text-sm font-bold text-[#39ff14]">
              <p>+{toast.xp} Lifetime XP</p>
              <p>+{toast.coins} Coins</p>
            </div>
          )}
        </div>
      )}

      <header className="relative z-10 border-b border-[#1a1a1a]/80 bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#39ff14]">
                Life RPG
              </p>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Habit Command Center
              </h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-zinc-500">Level</p>
              <p className="font-mono text-3xl font-bold text-[#39ff14] glow-text">
                {levelInfo.level}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <section className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
          <StatPill label="Lifetime XP" value={lifetimeXp} accent />
          <StatPill label="Available Coins" value={`${coins} 🪙`} />
          <StatPill label="Current Level" value={levelInfo.level} />
          <StatPill
            label="Current Streak"
            value={`${state.streak?.current ?? 0} days`}
            mono={false}
          />
        </section>

        <section className="mb-6 rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a]/90 p-5 backdrop-blur animate-fade-in">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Daily Progress
              </h2>
              <p className="text-3xl font-bold text-white">
                {progress.percent}
                <span className="text-lg text-zinc-500">%</span>
              </p>
            </div>
            <p className="font-mono text-sm text-zinc-400">
              {progress.done}/{progress.total} quests
            </p>
          </div>
          <ProgressBar
            value={progress.percent}
            sublabel={`${progress.percent}%`}
          />
          <div className="mt-4">
            <ProgressBar
              label="Level progress"
              value={levelInfo.xpIntoLevel}
              max={levelInfo.xpToNext}
              sublabel={`${levelInfo.xpIntoLevel} / ${levelInfo.xpToNext} lifetime XP`}
            />
          </div>
        </section>

        <section className="mb-8">
          <WeeklyChart days={week} streak={state.streak} />
        </section>

        {tab === "habits" && (
          <section className="animate-fade-in space-y-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Today&apos;s Quests
              </h2>
              <button
                type="button"
                onClick={() => setHabitModal({ open: true, habit: null })}
                className="rounded-xl bg-[#39ff14] px-4 py-2 text-sm font-bold text-black shadow-[0_0_16px_rgba(57,255,20,0.35)] transition hover:bg-[#2dd40f] active:scale-[0.98]"
              >
                + Create Habit
              </button>
            </div>
            {habits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={isHabitComplete(state, habit)}
                entry={getHabitEntry(state, habit)}
                onToggle={toggleHabit}
                onEdit={(h) => setHabitModal({ open: true, habit: h })}
                onDelete={(h) =>
                  setDeleteTarget({
                    kind: "habit",
                    id: h.id,
                    name: h.name,
                  })
                }
                index={i}
              />
            ))}
          </section>
        )}

        {tab === "shop" && (
          <section className="animate-fade-in">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Reward Shop
            </h2>
            <RewardShop
              state={state}
              onRedeem={buyReward}
              onCreate={() => setRewardModal({ open: true, reward: null })}
              onEdit={(r) => setRewardModal({ open: true, reward: r })}
              onDelete={(r) =>
                setDeleteTarget({
                  kind: "reward",
                  id: r.id,
                  name: r.name,
                })
              }
            />
          </section>
        )}

        {tab === "history" && (
          <section className="animate-fade-in">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Transaction History
            </h2>
            <TransactionHistory transactions={state.transactions} />
          </section>
        )}

        {tab === "badges" && (
          <section className="animate-fade-in">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-500">
              Achievements
            </h2>
            <BadgeGrid unlocked={state.badges} />
          </section>
        )}

        <p className="mt-10 text-center">
          <button
            type="button"
            onClick={resetProgress}
            className="text-[11px] text-zinc-600 underline-offset-2 hover:text-zinc-400 hover:underline"
          >
            Reset all data
          </button>
        </p>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#1a1a1a] bg-[#050505]/95 px-4 py-3 backdrop-blur-xl safe-bottom">
        <div className="mx-auto flex max-w-lg justify-around gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition-all ${
                tab === t.id
                  ? "bg-[#39ff14]/15 text-[#39ff14] shadow-[0_0_20px_rgba(57,255,20,0.15)]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <HabitFormModal
        open={habitModal.open}
        habit={habitModal.habit}
        onClose={() => setHabitModal({ open: false, habit: null })}
        onSave={(payload) => {
          saveHabit(payload, habitModal.habit?.id);
          setHabitModal({ open: false, habit: null });
        }}
      />

      <RewardFormModal
        open={rewardModal.open}
        reward={rewardModal.reward}
        onClose={() => setRewardModal({ open: false, reward: null })}
        onSave={(payload) => {
          saveReward(payload, rewardModal.reward?.id);
          setRewardModal({ open: false, reward: null });
        }}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete item?"
        message={
          deleteTarget
            ? `Remove "${deleteTarget.name}" permanently?`
            : ""
        }
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

function StatPill({ label, value, accent, mono = true }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-[#39ff14]/30 bg-gradient-to-br from-[#39ff14]/10 to-[#0a0a0a]"
          : "border-[#1f1f1f] bg-[#0a0a0a]"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${accent ? "text-[#39ff14] glow-text" : "text-white"} ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
