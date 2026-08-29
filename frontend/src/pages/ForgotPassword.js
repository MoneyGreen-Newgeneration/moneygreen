import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import LangSelector from "../components/LangSelector";
import DarkModeToggle from "../components/DarkModeToggle";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useLang();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
    } catch {
      // Reponse volontairement generique cote backend : on affiche le succes
      // meme en cas d'erreur pour ne pas divulguer l'existence d'un compte.
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <LangSelector />
        <DarkModeToggle />
      </div>
      <div className="mg-enter" style={styles.form}>
        <h2 style={styles.heading}>{t("forgot_title")}</h2>
        {sent ? (
          <p style={styles.text}>{t("forgot_success")}</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={styles.text}>{t("forgot_instructions")}</p>
            <label style={styles.label}>
              {t("register_email")}
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
            </label>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={loading ? "mg-btn-loading" : ""}
              style={{ ...styles.button, opacity: loading ? 0.85 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading && <span className="mg-btn-spinner" aria-hidden="true" />}
              {loading ? t("forgot_sending") : t("forgot_submit")}
            </button>
          </form>
        )}
        <p style={styles.text}>
          <Link to="/login" style={styles.link}>{t("forgot_back_to_login")}</Link>
        </p>
      </div>
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
    text: { color: "var(--mg-ink)" },
    link: { color: "var(--mg-accent)" },
  };
}
