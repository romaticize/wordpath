import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { WORDS } from "../lib/words.js";
import { bfsPath, countDiff } from "../lib/bfs.js";
import { getFeedback } from "../lib/feedback.js";
import { loadGameState, saveGameState, recordGameResult, loadStats } from "../lib/storage.js";
import Grid from "./Grid.jsx";
import HelpModal from "./HelpModal.jsx";
import ShareButton from "./ShareButton.jsx";
import StatsModal from "./StatsModal.jsx";

export default function Game({ puzzle }) {
  const { start, end, hint, idx, dayNumber, optimalSteps } = puzzle;

  const optPath = useMemo(() => bfsPath(start, end), [start, end]);
  const optDist = optimalSteps || (optPath ? optPath.length - 1 : 5);
  const maxGuesses = optDist + 4;

  // Load saved state for today's puzzle
  const savedState = useMemo(() => loadGameState(dayNumber), [dayNumber]);

  const [guesses, setGuesses] = useState(savedState?.guesses || []);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(loadStats);
  const [statsRecorded, setStatsRecorded] = useState(savedState?.statsRecorded || false);
  const inputRef = useRef(null);

  // Chain position only advances on chain moves and wins
  const chainPosition = useMemo(() => {
    let w = start;
    for (const g of guesses) {
      if (g.isChain || g.word === end) w = g.word;
    }
    return w;
  }, [guesses, start, end]);

  const solved = guesses.length > 0 && guesses[guesses.length - 1].word === end;
  const outOfGuesses = !solved && guesses.length >= maxGuesses;
  const gameOver = solved || outOfGuesses;

  // Persist game state after every guess
  useEffect(() => {
    saveGameState({
      dayNumber,
      guesses,
      chainPosition,
      solved,
      statsRecorded,
    });
  }, [guesses, dayNumber, chainPosition, solved, statsRecorded]);

  // Record stats once when game ends
  useEffect(() => {
    if (gameOver && !statsRecorded) {
      const updatedStats = recordGameResult(solved, guesses.length);
      setStats(updatedStats);
      setStatsRecorded(true);
      setShowStats(true);
    }
  }, [gameOver, statsRecorded, solved, guesses.length]);

  // Reset on puzzle change (different puzzle selected via picker)
  const prevPuzzleRef = useRef(`${start}-${end}`);
  useEffect(() => {
    const key = `${start}-${end}`;
    if (key !== prevPuzzleRef.current) {
      prevPuzzleRef.current = key;
      const saved = loadGameState(dayNumber);
      if (saved) {
        setGuesses(saved.guesses);
        setStatsRecorded(saved.statsRecorded || false);
      } else {
        setGuesses([]);
        setStatsRecorded(false);
      }
      setInput("");
      setError("");
      setShowStats(false);
    }
  }, [start, end, dayNumber]);

  // Auto-focus input after each guess
  useEffect(() => {
    if (!gameOver) setTimeout(() => inputRef.current?.focus(), 50);
  }, [guesses, gameOver]);

  const doShake = useCallback((msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  const handleSubmit = () => {
    const word = input.toLowerCase().trim();
    if (!word) return;
    if (word.length !== 4) { doShake("Need 4 letters"); return; }
    if (!WORDS.has(word)) { doShake("Not a word"); return; }
    if (word === chainPosition || guesses.some(g => g.word === word) || word === start) {
      doShake("Already used"); return;
    }

    const isChain = countDiff(chainPosition, word) === 1;

    let newGuess;
    if (word === end) {
      const feedback = getFeedback(word, end);
      newGuess = { word, feedback, isChain, type: "win" };
    } else if (isChain) {
      const feedback = getFeedback(word, end);
      newGuess = { word, feedback, isChain, type: "chain" };
    } else {
      const feedback = ["miss", "miss", "miss", "miss"];
      newGuess = { word, feedback, isChain: false, type: "miss" };
    }

    setGuesses(prev => [...prev, newGuess]);
    setInput("");
    setError("");
  };

  // Share text
  const emojiMap = { green: "\u{1f7e9}", yellow: "\u{1f7e8}", grey: "\u2b1c", miss: "\u2b1b" };
  const startFB = getFeedback(start, end);
  const shareRows = [
    startFB.map(f => emojiMap[f]).join(""),
    ...guesses.map(g => g.feedback.map(f => emojiMap[f]).join(""))
  ].join("\n");
  const shareText = `WordPath #${idx + 1} ${solved ? `${guesses.length}/${maxGuesses}` : "X/" + maxGuesses}\n${hint}\n\n${shareRows}\n\nwordpath-gilt.vercel.app`;

  return (
    <div>
      <HelpModal maxGuesses={maxGuesses} show={showHelp} onToggle={() => setShowHelp(!showHelp)} />

      <Grid
        startWord={start}
        startFeedback={startFB}
        guesses={guesses}
        input={input}
        maxGuesses={maxGuesses}
        gameOver={gameOver}
      />

      {/* Input area */}
      {!gameOver && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <p style={{ fontSize: 11, color: "#8b7355", margin: 0 }}>
            chain from <strong>{chainPosition.toUpperCase()}</strong> or guess the answer
          </p>
          <div style={{
            display: "flex", gap: 6, alignItems: "center",
            animation: shake ? "shake 0.4s ease" : "none",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value.slice(0, 4).toLowerCase().replace(/[^a-z]/g, ""));
                setError("");
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              placeholder="type word..."
              maxLength={4}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              style={{
                width: 140, padding: "10px 12px", fontSize: 20, fontFamily: "inherit",
                textAlign: "center", border: `2px solid ${error ? "#c0392b" : "#c4b5a0"}`,
                borderRadius: 8, outline: "none", background: "rgba(255,255,255,0.7)",
                color: "#2c1810", textTransform: "uppercase", letterSpacing: 5,
              }}
            />
            <button onClick={handleSubmit} style={{
              width: 44, height: 44, background: "#2c1810", color: "#fdf6e3", border: "none",
              borderRadius: 8, cursor: "pointer", fontSize: 18, fontWeight: 700,
            }}>
              →
            </button>
          </div>
          {error && <span style={{ color: "#c0392b", fontSize: 12, fontWeight: 500 }}>{error}</span>}
        </div>
      )}

      {/* Loss screen */}
      {outOfGuesses && (
        <div style={{
          textAlign: "center", marginTop: 16, padding: "16px 16px",
          background: "rgba(192,57,43,0.06)", borderRadius: 14,
          border: "1px solid rgba(192,57,43,0.15)",
        }}>
          <h2 style={{ margin: "0 0 4px", color: "#2c1810", fontSize: 17 }}>Out of guesses</h2>
          <p style={{ margin: "0 0 4px", color: "#2c1810", fontSize: 15, fontWeight: 700 }}>
            The word was {end.toUpperCase()}
          </p>
          {optPath && (
            <div style={{
              background: "rgba(255,255,255,0.5)", borderRadius: 8, padding: "10px 12px",
              margin: "10px auto", maxWidth: 260, border: "1px solid #c4b5a0",
            }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, color: "#8b7355", fontWeight: 600 }}>
                Optimal path ({optDist} steps):
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "#2c1810", fontWeight: 600, letterSpacing: 1, lineHeight: 1.6 }}>
                {optPath.map(w => w.toUpperCase()).join(" → ")}
              </p>
            </div>
          )}
          <ShareButton shareText={shareText} />
        </div>
      )}

      {/* Win screen */}
      {solved && (
        <div style={{
          textAlign: "center", marginTop: 16, padding: "18px 16px",
          background: "rgba(255,255,255,0.65)", borderRadius: 14,
          border: "1px solid #c4b5a0",
        }}>
          <h2 style={{ margin: "0 0 2px", color: "#2c1810", fontSize: 18, fontWeight: 700 }}>
            {guesses.length <= optDist ? "Perfect path!" : guesses.length <= optDist + 1 ? "Great job!" : "Solved!"}
          </h2>
          <p style={{ margin: "2px 0 14px", color: "#8b7355", fontSize: 14 }}>
            {guesses.length}/{maxGuesses}
            {optDist != null && guesses.length > optDist && ` · optimal was ${optDist}`}
          </p>
          <ShareButton shareText={shareText} />
        </div>
      )}

      {/* Stats toggle — always visible after game over */}
      {gameOver && !showStats && (
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <button onClick={() => { setStats(loadStats()); setShowStats(true); }} style={{
            background: "none", border: "none", color: "#8b7355", cursor: "pointer",
            fontFamily: "inherit", fontSize: 13, textDecoration: "underline",
          }}>show stats</button>
        </div>
      )}

      <StatsModal
        stats={stats}
        show={showStats}
        onClose={() => setShowStats(false)}
        lastGuessCount={solved ? guesses.length : null}
        gameOver={gameOver}
      />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        input::placeholder {
          color: #c4b5a0; text-transform: none; letter-spacing: 0; font-size: 15px;
        }
      `}</style>
    </div>
  );
}
