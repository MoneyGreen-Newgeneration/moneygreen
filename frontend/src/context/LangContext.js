import { createContext, useContext, useState } from "react";
import translations from "./translations";

const LangContext = createContext();

const LANGS = [
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "pt", label: "PT", flag: "🇵🇹" },
  { code: "de", label: "DE", flag: "🇩🇪" },
];

export function LangProvider({ children }) {
  const [lang, setLang] = useState("fr");

  const t = (key) => translations[lang]?.[key] ?? translations["fr"][key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t, LANGS }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
