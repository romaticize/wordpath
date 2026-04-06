export default function HelpModal({ maxGuesses, show, onToggle }) {
  return (
    <>
      <button onClick={onToggle} style={{
        display: "block", margin: "0 auto 6px", background: "none", border: "none",
        color: "#8b7355", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
        textDecoration: "underline",
      }}>
        {show ? "hide rules" : "how to play"}
      </button>

      {show && (
        <div style={{
          background: "rgba(255,255,255,0.6)", borderRadius: 12, padding: "16px 18px",
          marginBottom: 18, border: "1px solid #c4b5a0", fontSize: 14,
          color: "#5a4a3a", lineHeight: 1.7,
        }}>
          <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: 15, color: "#2c1810" }}>
            Find the hidden 4-letter word.
          </p>

          <p style={{ margin: "0 0 8px" }}>
            You start at a given word with a theme hint. The target word is <strong>hidden</strong> — use the hint and color clues to figure it out.
          </p>

          <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#2c1810" }}>How to move:</p>
          <p style={{ margin: "0 0 8px" }}>
            Type a real 4-letter word that differs by <strong>exactly one letter</strong> from your current word. This is a <strong>chain move</strong> — it advances your position and reveals color feedback.
          </p>

          <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#2c1810" }}>Color clues:</p>
          <div style={{ display: "flex", gap: 8, margin: "4px 0 4px", alignItems: "center" }}>
            <span style={{ width: 24, height: 24, borderRadius: 5, background: "#6aaa64", display: "inline-block", flexShrink: 0 }} />
            <span><strong>Green</strong> — correct letter in the correct spot</span>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "4px 0 4px", alignItems: "center" }}>
            <span style={{ width: 24, height: 24, borderRadius: 5, background: "#c9b458", display: "inline-block", flexShrink: 0 }} />
            <span><strong>Yellow</strong> — letter is in the target but in a different spot</span>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "4px 0 8px", alignItems: "center" }}>
            <span style={{ width: 24, height: 24, borderRadius: 5, background: "#787c7e", display: "inline-block", flexShrink: 0 }} />
            <span><strong>Grey</strong> — letter is not in the target word</span>
          </div>

          <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#2c1810" }}>Direct guess:</p>
          <p style={{ margin: "0 0 8px" }}>
            You can type <strong>any</strong> valid word, even if it's not one letter away. If it's the answer, you win. If it's wrong, you lose a turn and get <strong>no color feedback</strong> — the tiles go dark.
          </p>

          <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#2c1810" }}>Strategy:</p>
          <p style={{ margin: "0 0 0" }}>
            Use chain moves to gather information from colors. When you're confident you know the target, go for a direct guess. You have <strong>{maxGuesses} guesses</strong> total.
          </p>

          <p style={{ margin: "8px 0 0", fontStyle: "italic", color: "#8b7355", fontSize: 13 }}>
            A new puzzle appears every day at midnight UTC.
          </p>
        </div>
      )}
    </>
  );
}
