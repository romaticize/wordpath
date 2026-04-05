import { useState, useEffect } from "react";

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnightUTC());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeUntilMidnightUTC()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid #e8dfd0" }}>
      <p style={{ margin: "0 0 4px", fontSize: 11, color: "#8b7355", fontWeight: 600 }}>Next puzzle in</p>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#2c1810", letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>
        {timeLeft}
      </p>
    </div>
  );
}

function getTimeUntilMidnightUTC() {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const diff = midnight - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function StatsModal({ stats, show, onClose, lastGuessCount, gameOver }) {
  if (!show) return null;

  const winPct = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  const dist = stats.guessDistribution || {};
  const maxVal = Math.max(1, ...Object.values(dist));

  const distKeys = Object.keys(dist).map(Number).sort((a, b) => a - b);
  const minKey = distKeys.length > 0 ? Math.min(...distKeys) : 1;
  const maxKey = distKeys.length > 0 ? Math.max(...distKeys) : 6;
  const range = [];
  for (let i = Math.min(minKey, 1); i <= Math.max(maxKey, 6); i++) {
    range.push(i);
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.65)", borderRadius: 14,
      border: "1px solid #c4b5a0", padding: "18px 16px", marginTop: 16,
      animation: "slideUp 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, color: "#2c1810", fontSize: 17, fontWeight: 700 }}>Statistics</h2>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#8b7355", cursor: "pointer",
          fontSize: 18, fontFamily: "inherit", padding: "0 4px", lineHeight: 1,
        }}>x</button>
      </div>

      {/* Stat boxes */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
        {[
          { value: stats.gamesPlayed, label: "Played" },
          { value: winPct, label: "Win %" },
          { value: stats.currentStreak, label: "Current\nStreak" },
          { value: stats.maxStreak, label: "Max\nStreak" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: 50 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#2c1810" }}>{s.value}</div>
            <div style={{ fontSize: 10, color: "#8b7355", whiteSpace: "pre-line", lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Guess distribution */}
      <h3 style={{ margin: "0 0 8px", fontSize: 13, color: "#2c1810", fontWeight: 600 }}>Guess Distribution</h3>
      {range.map(n => {
        const count = dist[String(n)] || 0;
        const width = count > 0 ? Math.max(20, (count / maxVal) * 100) : 20;
        const isCurrentGame = gameOver && lastGuessCount === n && count > 0;
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{ fontSize: 12, color: "#2c1810", width: 12, textAlign: "right", fontWeight: isCurrentGame ? 700 : 400 }}>{n}</span>
            <div style={{
              height: 20, borderRadius: 3,
              background: isCurrentGame ? "#6aaa64" : count > 0 ? "#787c7e" : "#c4b5a0",
              width: `${width}%`, minWidth: 20,
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: 6,
              transition: "width 0.4s ease",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{count}</span>
            </div>
          </div>
        );
      })}

      {/* Countdown to next puzzle */}
      {gameOver && <Countdown />}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
