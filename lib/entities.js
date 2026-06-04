import { generateId } from "./id";

const ICON_BY_TYPE = {
  reading: "book",
  standard: "star",
};

export function createHabitPayload({ name, points, frequency, type }) {
  const isReading = type === "reading";
  return {
    id: generateId("habit"),
    name: name.trim(),
    points: isReading ? 1 : Math.max(0, Number(points) || 0),
    frequency: frequency === "weekly" ? "weekly" : "daily",
    type: isReading ? "reading" : "standard",
    icon: ICON_BY_TYPE[isReading ? "reading" : "standard"],
    enabled: true,
  };
}

export function updateHabitPayload(habit, { name, points, frequency, type }) {
  const isReading = type === "reading";
  return {
    ...habit,
    name: name.trim(),
    points: isReading ? 1 : Math.max(0, Number(points) || 0),
    frequency: frequency === "weekly" ? "weekly" : "daily",
    type: isReading ? "reading" : "standard",
    icon: isReading ? "book" : habit.icon || "star",
  };
}

export function createRewardPayload({ name, cost }) {
  return {
    id: generateId("reward"),
    name: name.trim(),
    cost: Math.max(1, Number(cost) || 0),
    icon: "gift",
  };
}

export function updateRewardPayload(reward, { name, cost }) {
  return {
    ...reward,
    name: name.trim(),
    cost: Math.max(1, Number(cost) || 0),
  };
}

export function addHabit(state, payload) {
  const habit = createHabitPayload(payload);
  return { ...state, habits: [...state.habits, habit] };
}

export function updateHabit(state, habitId, payload) {
  return {
    ...state,
    habits: state.habits.map((h) =>
      h.id === habitId ? updateHabitPayload(h, payload) : h,
    ),
  };
}

export function deleteHabit(state, habitId) {
  const completions = { ...state.completions };
  for (const date of Object.keys(completions)) {
    if (completions[date]?.[habitId]) {
      const day = { ...completions[date] };
      delete day[habitId];
      completions[date] = day;
    }
  }
  const weeklyCompletions = { ...state.weeklyCompletions };
  for (const week of Object.keys(weeklyCompletions)) {
    if (weeklyCompletions[week]?.[habitId]) {
      const w = { ...weeklyCompletions[week] };
      delete w[habitId];
      weeklyCompletions[week] = w;
    }
  }
  return {
    ...state,
    habits: state.habits.filter((h) => h.id !== habitId),
    completions,
    weeklyCompletions,
  };
}

export function addReward(state, payload) {
  return { ...state, rewards: [...state.rewards, createRewardPayload(payload)] };
}

export function updateReward(state, rewardId, payload) {
  return {
    ...state,
    rewards: state.rewards.map((r) =>
      r.id === rewardId ? updateRewardPayload(r, payload) : r,
    ),
  };
}

export function deleteReward(state, rewardId) {
  return {
    ...state,
    rewards: state.rewards.filter((r) => r.id !== rewardId),
  };
}
