import { useEffect, useState } from "react";
import "./ChatTypingHint.css";

export default function ChatTypingHint({ text }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let i = 0;
    let deleting = false;
    let timeoutId;

    function tick() {
      if (!deleting) {
        i++;
        setDisplayText(text.slice(0, i));
        if (i === text.length) {
          timeoutId = setTimeout(() => { deleting = true; tick(); }, 1800);
          return;
        }
        timeoutId = setTimeout(tick, 55);
      } else {
        i--;
        setDisplayText(text.slice(0, i));
        if (i === 0) {
          deleting = false;
          timeoutId = setTimeout(tick, 900);
          return;
        }
        timeoutId = setTimeout(tick, 28);
      }
    }

    timeoutId = setTimeout(tick, 500);
    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <div className="chat-typing-hint">
      {displayText}
      <span className="chat-typing-cursor">|</span>
    </div>
  );
}