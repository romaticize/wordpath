import { useState } from "react";

export default function ShareButton({ shareText }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <button onClick={handleShare} style={{
      padding: "12px 40px", background: copied ? "#2c1810" : "#6aaa64", color: "#fff",
      border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
      fontSize: 16, fontWeight: 700, letterSpacing: 1,
      transition: "background 0.2s", display: "inline-flex", alignItems: "center", gap: 8,
    }}>
      {copied ? "COPIED!" : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          SHARE
        </>
      )}
    </button>
  );
}
