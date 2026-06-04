import { generateId } from "./id";

function earnAmount(habit, entry) {
  if (!entry?.done) return 0;
  if (entry.xp != null) return entry.xp;
  if (!habit) return 0;
  if (habit.type === "reading" || habit.unit === "page") {
    return Math.max(1, entry.quantity || 1);
  }
  return habit.points ?? 0;
}

export function appendTransaction(state, partial) {
  const coinsDelta = partial.coinsDelta ?? 0;
  const newCoins = Math.max(0, (state.coins ?? 0) + coinsDelta);
  const tx = {
    id: partial.id || generateId("tx"),
    type: partial.type,
    date: partial.date,
    time: partial.time || new Date().toISOString(),
    description: partial.description,
    coinsDelta,
    lifetimeXpDelta: partial.lifetimeXpDelta ?? 0,
    balanceAfter: newCoins,
  };

  return {
    ...state,
    coins: newCoins,
    transactions: [...(state.transactions || []), tx],
  };
}

export function rebuildLedger(parsed) {
  const events = [];
  const habits = parsed.habits || [];

  const addEarn = (habitId, entry, date, sortTime) => {
    if (!entry?.done) return;
    const habit = habits.find((h) => h.id === habitId);
    const amount = earnAmount(habit, entry);
    events.push({
      type: "earn",
      date: entry.completedDate || date,
      time: sortTime,
      description: habit?.name || "Habit completed",
      coinsDelta: amount,
      lifetimeXpDelta: amount,
    });
  };

  for (const [date, day] of Object.entries(parsed.completions || {})) {
    for (const [habitId, entry] of Object.entries(day)) {
      addEarn(habitId, entry, date, `${date}T12:00:00.000Z`);
    }
  }

  for (const [weekStart, week] of Object.entries(parsed.weeklyCompletions || {})) {
    for (const [habitId, entry] of Object.entries(week)) {
      addEarn(
        habitId,
        entry,
        entry?.completedDate || weekStart,
        entry?.completedDate
          ? `${entry.completedDate}T12:00:00.000Z`
          : `${weekStart}T12:00:00.000Z`,
      );
    }
  }

  for (const r of parsed.redeemed || []) {
    events.push({
      type: "purchase",
      date: r.date,
      time: r.time || `${r.date}T18:00:00.000Z`,
      description: r.name || "Reward",
      coinsDelta: -(r.cost || 0),
      lifetimeXpDelta: 0,
    });
  }

  events.sort((a, b) => a.time.localeCompare(b.time));

  let balance = 0;
  const transactions = events.map((e, i) => {
    balance += e.coinsDelta;
    return {
      id: `tx-migrated-${i}`,
      ...e,
      balanceAfter: balance,
    };
  });

  return transactions;
}

export function migrateEconomy(parsed) {
  if (
    parsed.version >= 3 &&
    parsed.lifetimeXp !== undefined &&
    parsed.coins !== undefined
  ) {
    return {
      lifetimeXp: parsed.lifetimeXp,
      coins: parsed.coins,
      transactions: parsed.transactions || [],
    };
  }

  const lifetimeXp =
    parsed.lifetimeXp ??
    parsed.totalXp ??
    0;

  let coins = parsed.coins;
  if (coins === undefined || coins === null) {
    coins = Math.max(
      0,
      (parsed.totalXp ?? 0) - (parsed.spentXp ?? 0),
    );
  }

  let transactions = parsed.transactions;
  if (!transactions?.length) {
    transactions = rebuildLedger(parsed);
    if (transactions.length > 0) {
      const lastBalance = transactions[transactions.length - 1].balanceAfter;
      if (lastBalance !== coins) {
        transactions.push({
          id: generateId("tx"),
          type: "adjustment",
          date: new Date().toISOString().slice(0, 10),
          time: new Date().toISOString(),
          description: "Balance sync (migration)",
          coinsDelta: coins - lastBalance,
          lifetimeXpDelta: 0,
          balanceAfter: coins,
        });
      }
    }
  }

  return { lifetimeXp, coins, transactions: transactions || [] };
}
