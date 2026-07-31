import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LangContext";
import LangSelector from "../components/LangSelector";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode } = useTheme();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue. Réessayez.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(darkMode);

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <LangSelector />
        <DarkModeToggle />
      </div>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.heading}>{t("login_title")}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>
          {t("login_email")}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </label>
        <label style={styles.label}>
          {t("login_password")}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </label>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? t("login_loading") : t("login_btn")}
        </button>
        <p style={styles.text}>
          {t("login_no_account")} <Link to="/register" style={styles.link}>{t("login_register")}</Link>
        </p>
      </form>
    </div>
  );
}

function getStyles(darkMode) {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: darkMode ? "#14171a" : "#f4f6f8",
      gap: "1rem",
    },
    topBar: {
      display: "flex",
      gap: "0.75rem",
      alignItems: "center",
    },
    form: {
      backgroundColor: darkMode ? "#1e2226" : "#fff",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: darkMode ? "0 2px 8px rgba(0,0,0,0.4)" : "0 2px 8px rgba(0,0,0,0.1)",
      width: "320px",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    heading: { color: darkMode ? "#e6e8ea" : "#1a1d1b", margin: 0 },
    label: {
      display: "flex",
      flexDirection: "column",
      fontSize: "0.9rem",
      gap: "0.25rem",
      color: darkMode ? "#e6e8ea" : "#1a1d1b",
    },
    input: {
      padding: "0.5rem",
      borderRadius: "4px",
      border: darkMode ? "1px solid #444" : "1px solid #ccc",
      backgroundColor: darkMode ? "#262b30" : "#fff",
      color: darkMode ? "#e6e8ea" : "#1a1d1b",
    },
    button: {
      padding: "0.6rem",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#2e7d32",
      color: "#fff",
      cursor: "pointer",
      marginTop: "0.5rem",
    },
    error: { color: darkMode ? "#ff8a80" : "#c62828", fontSize: "0.85rem" },
    text: { color: darkMode ? "#e6e8ea" : "#1a1d1b" },
    link: { color: darkMode ? "#3fc466" : "#2e7d32" },
  };
}
