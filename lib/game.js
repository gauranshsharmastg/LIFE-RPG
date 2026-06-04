import { levelFromTotalXp } from "./constants";
import {
  todayKey,
  weekKey,
  getDayCompletions,
  getWeeklyCompletions,
} from "./storage";
import { appendTransaction } from "./transactions";

function hasActivityOnDate(state, dateKey) {
  const day = state.completions[dateKey];
  if (day && Object.values(day).some((e) => e?.done)) return true;
  for (const week of Object.values(state.weeklyCompletions || {})) {
    for (const entry of Object.values(week)) {
      if (entry?.done && entry.completedDate === dateKey) return true;
    }
  }
  return false;
}

export function isReadingHabit(habit) {
  return habit.type === "reading";
}

export function habitXp(habit, quantity = 1) {
  if (isReadingHabit(habit)) return Math.max(1, quantity);
  return habit.points;
}

export function getLifetimeXp(state) {
  return state.lifetimeXp ?? state.totalXp ?? 0;
}

export function availableCoins(state) {
  return state.coins ?? 0;
}

export function getLevelInfo(state) {
  return levelFromTotalXp(getLifetimeXp(state));
}

export function getHabitEntry(state, habit) {
  if (habit.frequency === "weekly") {
    return getWeeklyCompletions(state)[habit.id];
  }
  return getDayCompletions(state)[habit.id];
}

export function isHabitComplete(state, habit) {
  return !!getHabitEntry(state, habit)?.done;
}

export function getActiveHabits(state) {
  return state.habits.filter((h) => h.enabled !== false);
}

export function completeHabit(state, habitId, quantity = 1) {
  const habit = state.habits.find((h) => h.id === habitId);
  if (!habit || isHabitComplete(state, habit)) return state;

  const amount = habitXp(habit, quantity);
  const entry = {
    done: true,
    quantity: isReadingHabit(habit) ? quantity : 1,
    xp: amount,
    completedDate: todayKey(),
  };

  let completions = state.completions;
  let weeklyCompletions = state.weeklyCompletions || {};

  if (habit.frequency === "weekly") {
    const wk = weekKey();
    weeklyCompletions = {
      ...weeklyCompletions,
      [wk]: { ...getWeeklyCompletions(state, wk), [habitId]: entry },
    };
  } else {
    const date = todayKey();
    completions = {
      ...completions,
      [date]: { ...getDayCompletions(state, date), [habitId]: entry },
    };
  }

  let stats = { pagesRead: 0, wakeCount: 0, ...state.stats };
  if (isReadingHabit(habit)) stats.pagesRead += quantity;
  if (habit.id === "wake-5am") stats.wakeCount += 1;

  let next = {
    ...state,
    completions,
    weeklyCompletions,
    lifetimeXp: getLifetimeXp(state) + amount,
    stats,
  };

  next = appendTransaction(next, {
    type: "earn",
    date: todayKey(),
    description: habit.name,
    coinsDelta: amount,
    lifetimeXpDelta: amount,
  });

  return applyStreakAndBadges(next);
}

export function uncompleteHabit(state, habitId) {
  const habit = state.habits.find((h) => h.id === habitId);
  if (!habit) return state;

  const entry = getHabitEntry(state, habit);
  if (!entry?.done) return state;

  const amount = entry.xp ?? habitXp(habit, entry.quantity || 1);
  let completions = state.completions;
  let weeklyCompletions = state.weeklyCompletions || {};

  if (habit.frequency === "weekly") {
    const wk = weekKey();
    const w = { ...getWeeklyCompletions(state, wk) };
    delete w[habitId];
    weeklyCompletions = { ...weeklyCompletions, [wk]: w };
  } else {
    const date = todayKey();
    const day = { ...getDayCompletions(state, date) };
    delete day[habitId];
    completions = { ...completions, [date]: day };
  }

  let stats = { pagesRead: 0, wakeCount: 0, ...state.stats };
  if (isReadingHabit(habit)) {
    stats.pagesRead = Math.max(0, stats.pagesRead - (entry.quantity || 1));
  }
  if (habit.id === "wake-5am") {
    stats.wakeCount = Math.max(0, stats.wakeCount - 1);
  }

  let next = {
    ...state,
    completions,
    weeklyCompletions,
    stats,
  };

  next = appendTransaction(next, {
    type: "earn_reversal",
    date: todayKey(),
    description: `Undid: ${habit.name}`,
    coinsDelta: -amount,
    lifetimeXpDelta: 0,
  });

  return applyStreakAndBadges(next);
}

export function redeemReward(state, rewardId) {
  const reward = state.rewards?.find((r) => r.id === rewardId);
  if (!reward) return { state, error: "Reward not found" };
  if (availableCoins(state) < reward.cost) {
    return { state, error: "Not enough coins" };
  }

  let next = appendTransaction(state, {
    type: "purchase",
    date: todayKey(),
    description: reward.name,
    coinsDelta: -reward.cost,
    lifetimeXpDelta: 0,
  });

  return {
    state: applyStreakAndBadges(next),
    error: null,
  };
}

export function dailyProgress(state) {
  const habits = getActiveHabits(state);
  if (habits.length === 0) {
    return { percent: 0, done: 0, total: 0, xpToday: 0, coinsToday: 0 };
  }

  let done = 0;
  let xpToday = 0;
  const date = todayKey();

  for (const h of habits) {
    if (isHabitComplete(state, h)) done += 1;
    const entry = getHabitEntry(state, h);
    if (entry?.done && entry.completedDate === date) {
      const earned = entry.xp ?? habitXp(h, entry.quantity || 1);
      xpToday += earned;
    }
  }

  return {
    percent: Math.round((done / habits.length) * 100),
    done,
    total: habits.length,
    xpToday,
    coinsToday: xpToday,
  };
}

export function weeklyActivity(state) {
  const days = [];
  const now = new Date();
  const habits = getActiveHabits(state);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const day = state.completions[key] || {};
    const done = habits.filter(
      (h) => h.frequency === "daily" && day[h.id]?.done,
    ).length;
    const dailyCount = habits.filter((h) => h.frequency === "daily").length;
    const pct = dailyCount ? Math.round((done / dailyCount) * 100) : 0;
    days.push({
      key,
      label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 2),
      percent: pct,
      active: done > 0,
    });
  }
  return days;
}

function applyStreakAndBadges(state) {
  const streak = calcStreak(state);
  return {
    ...state,
    streak,
    badges: calcBadges({ ...state, streak }),
  };
}

function calcStreak(state) {
  const today = todayKey();
  let current = 0;
  const check = new Date();

  if (!hasActivityOnDate(state, today)) {
    check.setDate(check.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const key = check.toISOString().slice(0, 10);
    if (hasActivityOnDate(state, key)) {
      current += 1;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  return {
    current,
    longest: Math.max(state.streak?.longest || 0, current),
    lastDate: today,
  };
}

function calcBadges(state) {
  const unlocked = new Set(state.badges || []);
  const lifetimeXp = getLifetimeXp(state);
  const { level } = levelFromTotalXp(lifetimeXp);
  const habits = getActiveHabits(state);
  const anyDone = habits.some((h) => isHabitComplete(state, h));
  const allDone =
    habits.length > 0 && habits.every((h) => isHabitComplete(state, h));
  const hasPurchase = (state.transactions || []).some(
    (t) => t.type === "purchase",
  );

  if (anyDone) unlocked.add("first-quest");
  if ((state.stats?.wakeCount || 0) >= 5) unlocked.add("early-bird");
  if (state.streak.current >= 3) unlocked.add("streak-3");
  if (state.streak.current >= 7) unlocked.add("streak-7");
  if (state.streak.current >= 14) unlocked.add("streak-14");
  if (level >= 5) unlocked.add("level-5");
  if (level >= 10) unlocked.add("level-10");
  if (lifetimeXp >= 500) unlocked.add("xp-500");
  if (lifetimeXp >= 1000) unlocked.add("xp-1000");
  if (allDone) unlocked.add("perfect-day");
  if (hasPurchase) unlocked.add("shopper");
  if ((state.stats?.pagesRead || 0) >= 50) unlocked.add("reader-50");

  return [...unlocked];
}
