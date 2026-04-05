import { useState } from "react";
import { getDailyPuzzle, getPuzzleForDay, PUZZLES } from "./lib/puzzles.js";
import { loadStats } from "./lib/storage.js";
import Game from "./components/Game.jsx";
import StatsModal from "./components/StatsModal.jsx";
import "./App.css";

export default function App() {
  const daily = getDailyPuzzle();
  const [dayOverride, setDayOverride] = useState(null);
  const [dayInput, setDayInput] = useState("");
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showHeaderStats, setShowHeaderStats] = useState(false);
  const [headerStats, setHeaderStats] = useState(loadStats);

  const activeDayNumber = dayOverride ?? daily.dayNumber;
  const puzzle = getPuzzleForDay(activeDayNumber);
  const isCurated = activeDayNumber >= 0 && activeDayNumber < PUZZLES.length;

  const openStats = () => {
    setHeaderStats(loadStats());
    setShowHeaderStats(true);
  };

  const jumpToDay = () => {
    const num = parseInt(dayInput, 10);
    if (!isNaN(num) && num >= 0) {
      setDayOverride(num);
      setShowDayPicker(false);
    }
  };

  const resetToToday = () => {
    setDayOverride(null);
    setDayInput("");
    setShowDayPicker(false);
  };

  return (
    <div className="app-container">
      <div className="app-inner">
        {/* Header */}
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

        {/* Day indicator — click to open day picker */}
        <p
          onClick={() => setShowDayPicker(!showDayPicker)}
          style={{ textAlign: "center", margin: "2px 0 4px", fontSize: 11, color: "#8b7355", cursor: "pointer" }}
        >
          Day {activeDayNumber} {isCurated ? "(curated)" : "(generated)"}
          {dayOverride !== null && " — tap to change"}
        </p>

        {/* Day picker for dev/testing */}
        {showDayPicker && (
          <div style={{
            display: "flex", justifyContent: "center", gap: 6, margin: "4px 0 8px", alignItems: "center",
          }}>
            <input
              value={dayInput}
              onChange={(e) => setDayInput(e.target.value.replace(/[^0-9]/g, ""))}
              onKeyDown={(e) => { if (e.key === "Enter") jumpToDay(); }}
              placeholder="day #"
              style={{
                width: 70, padding: "4px 8px", fontSize: 12, fontFamily: "inherit",
                border: "1px solid #c4b5a0", borderRadius: 6, textAlign: "center",
                background: "rgba(255,255,255,0.7)", color: "#2c1810",
              }}
            />
            <button onClick={jumpToDay} style={{
              padding: "4px 10px", fontSize: 11, fontFamily: "inherit", cursor: "pointer",
              background: "#2c1810", color: "#fdf6e3", border: "none", borderRadius: 6,
            }}>Go</button>
            {dayOverride !== null && (
              <button onClick={resetToToday} style={{
                padding: "4px 10px", fontSize: 11, fontFamily: "inherit", cursor: "pointer",
                background: "transparent", color: "#8b7355", border: "1px solid #c4b5a0", borderRadius: 6,
              }}>Today</button>
            )}
          </div>
        )}

        {/* Hint badge */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span className="hint-badge">
            {puzzle.hint.toUpperCase()}
          </span>
        </div>

        <Game key={`${puzzle.start}-${puzzle.end}-${activeDayNumber}`} puzzle={puzzle} />

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
