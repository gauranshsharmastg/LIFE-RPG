export const STORAGE_KEY = "life-rpg-v2";

export const THEME = {
  neon: "#39ff14",
  neonDim: "#2dd40f",
  bg: "#050505",
  panel: "#0f0f0f",
  panelBorder: "#1a1a1a",
  grey: "#2a2a2a",
  greyLight: "#3d3d3d",
  muted: "#6b7280",
};

export const DEFAULT_HABITS = [
  {
    id: "wake-5am",
    name: "Wake up at 5 AM",
    points: 20,
    icon: "sunrise",
    frequency: "daily",
    type: "standard",
  },
  {
    id: "workout",
    name: "Workout",
    points: 10,
    icon: "dumbbell",
    frequency: "daily",
    type: "standard",
  },
  {
    id: "chinese",
    name: "Chinese Class",
    points: 10,
    icon: "language",
    frequency: "daily",
    type: "standard",
  },
  {
    id: "office",
    name: "Office Work",
    points: 15,
    icon: "briefcase",
    frequency: "daily",
    type: "standard",
  },
  {
    id: "chem-eng",
    name: "Chemical Engineering Study",
    points: 10,
    icon: "science",
    frequency: "daily",
    type: "standard",
  },
  {
    id: "protein",
    name: "Protein Shake",
    points: 5,
    icon: "flask",
    frequency: "daily",
    type: "standard",
  },
  {
    id: "reading",
    name: "Reading",
    points: 1,
    icon: "book",
    frequency: "daily",
    type: "reading",
  },
];

export const DEFAULT_REWARDS = [
  { id: "shoes", name: "Shoes", cost: 1500, icon: "gift" },
  { id: "perfume", name: "Perfume", cost: 1000, icon: "gift" },
  { id: "bike-trip", name: "Bike Trip", cost: 3000, icon: "gift" },
];

export const BADGES = [
  { id: "first-quest", name: "First Quest", desc: "Complete your first habit", icon: "⚔️" },
  { id: "early-bird", name: "Early Bird", desc: "Wake at 5AM five times", icon: "🌅" },
  { id: "streak-3", name: "On Fire", desc: "3-day streak", icon: "🔥" },
  { id: "streak-7", name: "Unstoppable", desc: "7-day streak", icon: "💫" },
  { id: "streak-14", name: "Legend", desc: "14-day streak", icon: "👑" },
  { id: "level-5", name: "Rising Hero", desc: "Reach level 5", icon: "⭐" },
  { id: "level-10", name: "Champion", desc: "Reach level 10", icon: "🏆" },
  { id: "xp-500", name: "Grinder", desc: "Earn 500 total XP", icon: "💎" },
  { id: "xp-1000", name: "Elite", desc: "Earn 1000 total XP", icon: "🚀" },
  { id: "perfect-day", name: "Perfect Day", desc: "Complete all habits in one day", icon: "✨" },
  { id: "shopper", name: "Spender", desc: "Redeem your first reward", icon: "🛒" },
  { id: "reader-50", name: "Scholar", desc: "Read 50 pages total", icon: "📚" },
];

export function xpForLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function levelFromTotalXp(totalXp) {
  let level = 1;
  let xpNeeded = xpForLevel(level);
  let accumulated = 0;
  while (accumulated + xpNeeded <= totalXp) {
    accumulated += xpNeeded;
    level += 1;
    xpNeeded = xpForLevel(level);
  }
  return {
    level,
    xpIntoLevel: totalXp - accumulated,
    xpToNext: xpNeeded,
    progress: (totalXp - accumulated) / xpNeeded,
  };
}
