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
          <p style={{ margin: "0 0 8px" }}>You start at a word. The target word is <strong>hidden</strong>.</p>
          <p style={{ margin: "0 0 8px" }}>Each guess must be a real word, <strong>one letter different</strong> from your previous word.</p>
          <p style={{ margin: "0 0 8px" }}>After each guess, letters light up:</p>
          <div style={{ display: "flex", gap: 8, margin: "4px 0", alignItems: "center" }}>
            <span style={{ width: 24, height: 24, borderRadius: 5, background: "#6aaa64", display: "inline-block" }} />
            <span>In the target, correct spot</span>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "4px 0", alignItems: "center" }}>
            <span style={{ width: 24, height: 24, borderRadius: 5, background: "#c9b458", display: "inline-block" }} />
            <span>In the target, wrong spot</span>
          </div>
          <div style={{ display: "flex", gap: 8, margin: "4px 0", alignItems: "center" }}>
            <span style={{ width: 24, height: 24, borderRadius: 5, background: "#787c7e", display: "inline-block" }} />
            <span>Not in the target</span>
          </div>
          <p style={{ margin: "8px 0 0" }}>You have {maxGuesses} guesses to find the hidden word.</p>
          <p style={{ margin: "4px 0 0" }}><strong>Chain move</strong> (1 letter change) — you get full color feedback.</p>
          <p style={{ margin: "4px 0 0" }}><strong>Direct guess</strong> (any word) — right = you win. Wrong = you lose a turn with no colors.</p>
          <p style={{ margin: "4px 0 0", fontStyle: "italic", color: "#8b7355" }}>Chain to gather info. Guess when you're confident.</p>
        </div>
      )}
    </>
  );
}
