"use client";

import { useCallback, useEffect, useState } from "react";
import { loadState, saveState } from "../lib/storage";
import {
  completeHabit,
  uncompleteHabit,
  redeemReward,
  isHabitComplete,
  getLifetimeXp,
} from "../lib/game";
import {
  addHabit,
  updateHabit,
  deleteHabit,
  addReward,
  updateReward,
  deleteReward,
} from "../lib/entities";

export function useGameState() {
  const [state, setState] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const persist = useCallback((next) => {
    setState(next);
    saveState(next);
  }, []);

  const showToast = useCallback((message, earned = 0) => {
    setToast({ message, xp: earned, coins: earned, id: Date.now() });
    setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleHabit = useCallback(
    (habitId, quantity = 1) => {
      if (!state) return;
      const habit = state.habits.find((h) => h.id === habitId);
      if (!habit) return;

      if (isHabitComplete(state, habit)) {
        persist(uncompleteHabit(state, habitId));
        showToast(`${habit.name} undone`, 0);
        return;
      }

      const next = completeHabit(state, habitId, quantity);
      const earned = getLifetimeXp(next) - getLifetimeXp(state);
      persist(next);
      showToast(`${habit.name} complete!`, earned);
    },
    [state, persist, showToast],
  );

  const buyReward = useCallback(
    (rewardId) => {
      if (!state) return "Unknown error";
      const { state: next, error } = redeemReward(state, rewardId);
      if (error) return error;
      persist(next);
      showToast("Reward redeemed!", 0);
      return null;
    },
    [state, persist, showToast],
  );

  const saveHabit = useCallback(
    (payload, habitId) => {
      if (!state) return;
      const next = habitId
        ? updateHabit(state, habitId, payload)
        : addHabit(state, payload);
      persist(next);
      showToast(habitId ? "Habit updated" : "Habit created", 0);
    },
    [state, persist, showToast],
  );

  const removeHabit = useCallback(
    (habitId) => {
      if (!state) return;
      persist(deleteHabit(state, habitId));
      showToast("Habit deleted", 0);
    },
    [state, persist, showToast],
  );

  const saveReward = useCallback(
    (payload, rewardId) => {
      if (!state) return;
      const next = rewardId
        ? updateReward(state, rewardId, payload)
        : addReward(state, payload);
      persist(next);
      showToast(rewardId ? "Reward updated" : "Reward created", 0);
    },
    [state, persist, showToast],
  );

  const removeReward = useCallback(
    (rewardId) => {
      if (!state) return;
      persist(deleteReward(state, rewardId));
      showToast("Reward deleted", 0);
    },
    [state, persist, showToast],
  );

  const resetProgress = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!confirm("Reset all Life RPG data? This cannot be undone.")) return;
    localStorage.removeItem("life-rpg-v2");
    localStorage.removeItem("life-rpg-v1");
    setState(loadState());
  }, []);

  return {
    state,
    ready: state !== null,
    toast,
    toggleHabit,
    buyReward,
    saveHabit,
    removeHabit,
    saveReward,
    removeReward,
    resetProgress,
  };
}
