import { useState, useRef, useEffect } from "react";
import { useLang } from "../context/LangContext";
import "./LangSelector.css";
import Flag from "./Flag";

export default function LangSelector() {
  const { lang, setLang, LANGS } = useLang();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, right: "auto" });
  const ref = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const dropdownWidth = 140;
      let left = rect.right - dropdownWidth;
      if (left < 8) left = 8;
      if (left + dropdownWidth > window.innerWidth - 8) {
        left = window.innerWidth - dropdownWidth - 8;
      }
      setCoords({ top: rect.bottom + 8, left });
    };
    if (open) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
    }
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const current = LANGS.find(l => l.code === lang);

  return (
    <div className="lang-selector" ref={ref}>
      <button ref={btnRef} className="lang-btn" onClick={() => setOpen(o => !o)}>
        <Flag code={current.code} />
        <span>{current.label}</span>
        <span className="lang-arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div
          className="lang-dropdown"
          style={{ position: "fixed", top: coords.top, left: coords.left }}
        >
          {LANGS.map(l => (
            <button
              key={l.code}
              className={`lang-option ${l.code === lang ? "active" : ""}`}
              onClick={() => { setLang(l.code); setOpen(false); }}
            >
              <Flag code={l.code} />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

