"use client";

import { useState } from "react";
import { availableCoins } from "../lib/game";
import ConfirmModal from "./ConfirmModal";

export default function RewardShop({
  state,
  onRedeem,
  onCreate,
  onEdit,
  onDelete,
}) {
  const [error, setError] = useState(null);
  const [pendingReward, setPendingReward] = useState(null);
  const coins = availableCoins(state);
  const rewards = state.rewards || [];

  const handleRedeemClick = (reward) => {
    if (coins < reward.cost) {
      setError("Not enough coins");
      setTimeout(() => setError(null), 2500);
      return;
    }
    setPendingReward(reward);
  };

  const confirmRedeem = () => {
    if (!pendingReward) return;
    const err = onRedeem(pendingReward.id);
    setError(err || null);
    setPendingReward(null);
    if (!err) setTimeout(() => setError(null), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[200px] flex-1 rounded-2xl border border-[#39ff14]/20 bg-gradient-to-br from-[#39ff14]/10 to-transparent px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-zinc-500">
            Available Coins
          </p>
          <p className="font-mono text-4xl font-bold text-[#39ff14]">
            {coins} 🪙
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-xl bg-[#39ff14] px-5 py-3 text-sm font-bold text-black shadow-[0_0_16px_rgba(57,255,20,0.35)] transition hover:bg-[#2dd40f] active:scale-[0.98]"
        >
          + Create Reward
        </button>
      </div>

      {error && (
        <p className="animate-slide-up rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {rewards.map((reward) => {
          const canAfford = coins >= reward.cost;
          return (
            <div
              key={reward.id}
              className={`rounded-2xl border p-4 transition-all ${
                canAfford
                  ? "border-[#2a2a2a] bg-[#0c0c0c] hover:border-[#39ff14]/40"
                  : "border-[#1a1a1a] bg-[#080808] opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl">🎁</span>
                <span className="font-mono text-sm text-[#39ff14]">
                  {reward.cost} 🪙
                </span>
              </div>
              <h3 className="mt-3 font-semibold text-white">{reward.name}</h3>
              <button
                type="button"
                disabled={!canAfford}
                onClick={() => handleRedeemClick(reward)}
                className={`mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                  canAfford
                    ? "bg-[#39ff14] text-black hover:bg-[#2dd40f] shadow-[0_0_16px_rgba(57,255,20,0.35)]"
                    : "cursor-not-allowed bg-[#1a1a1a] text-zinc-600"
                }`}
              >
                Redeem Reward
              </button>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(reward)}
                  className="flex-1 rounded-lg border border-[#2a2a2a] py-1.5 text-xs text-zinc-400 hover:border-[#39ff14]/40 hover:text-[#39ff14]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(reward)}
                  className="flex-1 rounded-lg border border-[#2a2a2a] py-1.5 text-xs text-zinc-400 hover:border-red-500/40 hover:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <p className="py-8 text-center text-sm text-zinc-500">
          No rewards yet. Create your first reward!
        </p>
      )}

      <ConfirmModal
        open={!!pendingReward}
        onClose={() => setPendingReward(null)}
        onConfirm={confirmRedeem}
        title="Redeem Reward?"
        message={
          pendingReward
            ? `Spend ${pendingReward.cost} coins for "${pendingReward.name}"? Your lifetime XP will not change.`
            : ""
        }
        confirmLabel="Redeem Reward"
      />
    </div>
  );
}
