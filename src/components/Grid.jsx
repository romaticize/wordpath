const tileColors = {
  green:  { bg: "#6aaa64", border: "#5a9a54", color: "#fff" },
  yellow: { bg: "#c9b458", border: "#b5a24c", color: "#fff" },
  grey:   { bg: "#787c7e", border: "#6a6e70", color: "#fff" },
  miss:   { bg: "#3a3a3c", border: "#2c2c2e", color: "#555" },
  empty:  { bg: "rgba(255,255,255,0.6)", border: "#c4b5a0", color: "#2c1810" },
  active: { bg: "rgba(255,255,255,0.8)", border: "#2c1810", color: "#2c1810" },
};

function Tile({ letter, feedback }) {
  const tc = tileColors[feedback] || tileColors.empty;
  return (
    <div style={{
      width: 44, height: 48, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: 20, fontWeight: 700,
      textTransform: "uppercase", borderRadius: 6, fontFamily: "inherit",
      background: tc.bg, border: `2px solid ${tc.border}`, color: tc.color,
      transition: "all 0.3s",
    }}>
      {letter}
    </div>
  );
}

function TileRow({ word, feedbacks, label, dimmed }) {
  return (
    <div style={{
      display: "flex", gap: 4, justifyContent: "center",
      opacity: dimmed ? 0.5 : 1,
    }}>
      {word.split("").map((l, i) => (
        <Tile key={i} letter={l} feedback={feedbacks[i]} />
      ))}
      {label && (
        <div style={{ display: "flex", alignItems: "center", fontSize: 9, color: "#c0392b", marginLeft: 2 }}>
          {label}
        </div>
      )}
    </div>
  );
}

function InputRow({ input }) {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {[0, 1, 2, 3].map(i => {
        const l = input[i] || "";
        const feedback = l ? "active" : "empty";
        return <Tile key={i} letter={l} feedback={feedback} />;
      })}
    </div>
  );
}

function EmptyRow() {
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
      {[0, 1, 2, 3].map(j => (
        <div key={j} style={{
          width: 44, height: 48, borderRadius: 6,
          border: "1.5px solid #e8dfd0",
          background: "rgba(0,0,0,0.01)",
        }} />
      ))}
    </div>
  );
}

export default function Grid({ startWord, startFeedback, guesses, input, maxGuesses, gameOver }) {
  const emptyRows = Math.max(0, maxGuesses - guesses.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      {/* Start word */}
      <TileRow word={startWord} feedbacks={startFeedback} />

      {/* Guessed rows */}
      {guesses.map((g, i) => (
        <TileRow
          key={i}
          word={g.word}
          feedbacks={g.feedback}
          label={g.type === "miss" ? "miss" : null}
          dimmed={g.type === "miss"}
        />
      ))}

      {/* Current input row */}
      {!gameOver && <InputRow input={input} />}

      {/* Empty future rows */}
      {!gameOver && Array.from({ length: emptyRows - 1 }, (_, i) => (
        <EmptyRow key={`e${i}`} />
      ))}
    </div>
  );
}
