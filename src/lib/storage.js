const GAME_STATE_KEY = "wordpath_gameState";
const STATS_KEY = "wordpath_stats";

// --- Game State ---

export function loadGameState(dayNumber) {
  try {
    const raw = localStorage.getItem(GAME_STATE_KEY);
    if (!raw) return null;
    const state = JSON.parse(raw);
    // Only return if it's today's puzzle
    if (state.dayNumber !== dayNumber) return null;
    return state;
  } catch {
    return null;
  }
}

export function saveGameState(state) {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — silent fail
  }
}

// --- Stats ---

function defaultStats() {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {},
  };
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    return defaultStats();
  }
}

export function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // silent fail
  }
}

export function recordGameResult(won, numGuesses) {
  const stats = loadStats();
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
    const key = String(numGuesses);
    stats.guessDistribution[key] = (stats.guessDistribution[key] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }
  saveStats(stats);
  return stats;
}
