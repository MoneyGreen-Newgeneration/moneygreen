import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LangContext";
import LangSelector from "../components/LangSelector";
import DarkModeToggle from "../components/DarkModeToggle";
import { track } from "../api/analytics";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { darkMode } = useTheme();
  const { t } = useLang();
  const navigate = useNavigate();

  useEffect(() => { track("signup_view"); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    track("signup_submit");
    try {
      await register(username, email, phoneNumber, password);
      setSuccess(true);
      track("signup_success");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue. Réessayez.";
      setError(message);
      track("signup_error", { message });
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
        <h2 style={styles.heading}>{t("register_title")}</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{t("register_success")}</p>}
        <label style={styles.label}>
          {t("register_username")}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={styles.input} />
        </label>
        <label style={styles.label}>
          {t("register_email")}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </label>
        <label style={styles.label}>
          {t("register_phone")}
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={styles.input} required placeholder="+237 6XX XXX XXX" />
          <small style={styles.hint}>{t("register_phone_hint")}</small>
        </label>
        <label style={styles.label}>
          {t("register_password")}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </label>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? t("register_loading") : t("register_btn")}
        </button>
        <p style={styles.text}>
          {t("register_have_account")} <Link to="/login" style={styles.link}>{t("register_login")}</Link>
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
    hint: { fontSize: ".78rem", opacity: .7, fontWeight: 400, marginTop: 4, display: "block" },
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
    success: { color: darkMode ? "#3fc466" : "#2e7d32", fontSize: "0.85rem" },
    text: { color: darkMode ? "#e6e8ea" : "#1a1d1b" },
    link: { color: darkMode ? "#3fc466" : "#2e7d32" },
  };
}

