import { useState } from "react";
import { getDailyPuzzle, PUZZLES } from "./lib/puzzles.js";
import { loadStats } from "./lib/storage.js";
import Game from "./components/Game.jsx";
import StatsModal from "./components/StatsModal.jsx";
import "./App.css";

export default function App() {
  // For dev: allow puzzle picker. For prod: use getDailyPuzzle() only.
  const daily = getDailyPuzzle();
  const [idx, setIdx] = useState(daily.idx);
  const puzzle = { ...PUZZLES[idx], idx, dayNumber: daily.dayNumber };
  const [showHeaderStats, setShowHeaderStats] = useState(false);
  const [headerStats, setHeaderStats] = useState(loadStats);

  const openStats = () => {
    setHeaderStats(loadStats());
    setShowHeaderStats(true);
  };

  return (
    <div className="app-container">
      <div className="app-inner">
        {/* Header with title and stats icon */}
        <div className="app-header">
          <div className="header-spacer" />
          <h1 className="app-title">WordPath</h1>
          <button onClick={openStats} className="stats-btn" aria-label="Statistics">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </button>
        </div>

        {/* Puzzle day indicator */}
        <p style={{ textAlign: "center", margin: "2px 0 4px", fontSize: 11, color: "#8b7355" }}>
          Puzzle #{idx + 1} of {PUZZLES.length}
        </p>

        {/* Hint badge */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span className="hint-badge">
            {puzzle.hint.toUpperCase()}
          </span>
        </div>

        <Game key={`${puzzle.start}-${puzzle.end}`} puzzle={puzzle} />

        {/* Header-level stats modal (viewable anytime) */}
        <StatsModal
          stats={headerStats}
          show={showHeaderStats}
          onClose={() => setShowHeaderStats(false)}
          lastGuessCount={null}
          gameOver={false}
        />
      </div>
    </div>
  );
}
