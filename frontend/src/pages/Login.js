import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import LangSelector from "../components/LangSelector";
import DarkModeToggle from "../components/DarkModeToggle";
import { track } from "../api/analytics";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  useEffect(() => { track("login_view"); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    track("login_submit");
    try {
      await login(email, password);
      track("login_success");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue. Réessayez.";
      setError(message);
      track("login_error", { message });
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <LangSelector />
        <DarkModeToggle />
      </div>
      <form className="mg-enter" style={styles.form} onSubmit={handleSubmit}>
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
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={loading ? "mg-btn-loading" : ""}
          style={{ ...styles.button, opacity: loading ? 0.85 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading && <span className="mg-btn-spinner" aria-hidden="true" />}
          {loading ? t("login_loading") : t("login_btn")}
        </button>
        <p style={styles.text}>
          {t("login_no_account")} <Link to="/register" style={styles.link}>{t("login_register")}</Link>
        </p>
      </form>
    </div>
  );
}

function getStyles() {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "var(--mg-bg)",
      gap: "1rem",
    },
    topBar: {
      display: "flex",
      gap: "0.75rem",
      alignItems: "center",
    },
    form: {
      backgroundColor: "var(--mg-surface)",
      padding: "2rem",
      borderRadius: "var(--mg-radius-md)",
      boxShadow: "var(--mg-shadow-sm)",
      width: "320px",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    },
    heading: { color: "var(--mg-ink)", margin: 0, fontFamily: "var(--mg-display)" },
    label: {
      display: "flex",
      flexDirection: "column",
      fontSize: "0.9rem",
      gap: "0.25rem",
      color: "var(--mg-ink)",
    },
    input: {
      padding: "0.6rem 0.7rem",
      borderRadius: "var(--mg-radius-sm)",
      border: "1.5px solid var(--mg-line)",
      backgroundColor: "var(--mg-input-bg)",
      color: "var(--mg-ink)",
      transition: "border-color var(--mg-duration-fast) var(--mg-ease)",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.7rem",
      borderRadius: "var(--mg-radius-sm)",
      border: "none",
      backgroundColor: "var(--mg-green)",
      color: "var(--mg-white)",
      marginTop: "0.5rem",
      transition: "transform var(--mg-duration-fast) var(--mg-ease), background var(--mg-duration-fast) var(--mg-ease), opacity var(--mg-duration-fast) var(--mg-ease)",
    },
    error: { color: "var(--mg-red)", fontSize: "0.85rem" },
    text: { color: "var(--mg-ink)" },
    link: { color: "var(--mg-accent)" },
  };
}
