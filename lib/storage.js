import { STORAGE_KEY, DEFAULT_HABITS, DEFAULT_REWARDS } from "./constants";
import { migrateEconomy } from "./transactions";

const LEGACY_KEY = "life-rpg-v1";

export function createDefaultState() {
  return {
    version: 3,
    lifetimeXp: 0,
    coins: 0,
    habits: DEFAULT_HABITS.map((h) => ({ ...h, enabled: true })),
    rewards: DEFAULT_REWARDS.map((r) => ({ ...r })),
    completions: {},
    weeklyCompletions: {},
    streak: { current: 0, longest: 0, lastDate: null },
    transactions: [],
    badges: [],
    stats: { pagesRead: 0, wakeCount: 0 },
  };
}

function normalizeHabit(h) {
  const type =
    h.type === "reading" || h.unit === "page" ? "reading" : "standard";
  return {
    ...h,
    enabled: h.enabled !== false,
    frequency: h.frequency === "weekly" ? "weekly" : "daily",
    type,
    points: type === "reading" ? 1 : Number(h.points) || 0,
  };
}

function migrate(parsed) {
  const base = createDefaultState();
  const economy = migrateEconomy(parsed);

  const state = {
    ...base,
    ...parsed,
    version: 3,
    lifetimeXp: economy.lifetimeXp,
    coins: economy.coins,
    transactions: economy.transactions,
    habits: (parsed.habits || base.habits).map(normalizeHabit),
    rewards:
      parsed.rewards?.length > 0
        ? parsed.rewards
        : DEFAULT_REWARDS.map((r) => ({ ...r })),
    weeklyCompletions: parsed.weeklyCompletions || {},
    badges: parsed.badges || [],
    stats: { ...base.stats, ...parsed.stats },
  };

  delete state.totalXp;
  delete state.spentXp;
  delete state.redeemed;

  return state;
}

export function loadState() {
  if (typeof window === "undefined") return createDefaultState();
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        raw = legacy;
        const migrated = migrate(JSON.parse(legacy));
        saveState(migrated);
        return migrated;
      }
      return createDefaultState();
    }
    return migrate(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

export function saveState(state) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function weekKey(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  return monday.toISOString().slice(0, 10);
}

export function getDayCompletions(state, date = todayKey()) {
  return state.completions[date] || {};
}

export function getWeeklyCompletions(state, week = weekKey()) {
  return state.weeklyCompletions?.[week] || {};
}
