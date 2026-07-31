import { useTheme } from "../context/ThemeContext";
import "./DarkModeToggle.css";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      className="dark-toggle"
      onClick={toggleDarkMode}
      title={darkMode ? "Mode clair" : "Mode sombre"}
      aria-label="Changer le theme"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
