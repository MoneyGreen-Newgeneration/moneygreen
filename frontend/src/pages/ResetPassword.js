import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import LangSelector from "../components/LangSelector";
import DarkModeToggle from "../components/DarkModeToggle";
import { resetPasswordByPhone } from "../api/auth";

export default function ResetPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { applySession } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError(t("reset_mismatch"));
      return;
    }

    setLoading(true);
    try {
      const data = await resetPasswordByPhone(phoneNumber, newPassword);
      applySession(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message || "Une erreur est survenue. Réessayez.";
      setError(message);
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
        <h2 style={styles.heading}>{t("reset_title")}</h2>
        {error && <p style={styles.error}>{error}</p>}
        <label style={styles.label}>
          {t("login_phone")}
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required style={styles.input} placeholder="+237 6XX XXX XXX" />
        </label>
        <label style={styles.label}>
          {t("reset_new_password")}
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} style={styles.input} />
        </label>
        <label style={styles.label}>
          {t("reset_confirm_password")}
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} style={styles.input} />
        </label>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={loading ? "mg-btn-loading" : ""}
          style={{ ...styles.button, opacity: loading ? 0.85 : 1, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading && <span className="mg-btn-spinner" aria-hidden="true" />}
          {loading ? t("reset_submitting") : t("reset_submit")}
        </button>
        <p style={styles.text}>
          <Link to="/login" style={styles.link}>{t("forgot_back_to_login")}</Link>
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
