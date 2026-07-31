import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { createLoan } from "../../api/loans";
import MoneyGreenMark from "../../components/MoneyGreenMark";
import DarkModeToggle from "../../components/DarkModeToggle";
import LangSelector from "../../components/LangSelector";
import LoanIllustration from "../../components/LoanIllustration";
import LoanSimulator from "../../components/LoanSimulator";
import PrivacyPolicyNotice from "../../components/PrivacyPolicyNotice";
import "./Loans.css";

export default function LoanPage({ type, titleKey, taglineKey, descriptionKey, maxRangeKey, documents, flyerImg }) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLang();
  const title = t(titleKey);
  const tagline = t(taglineKey);
  const description = t(descriptionKey);
  const maxRange = t(maxRangeKey);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.username || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    amount: "",
    durationMonths: "",
    monthlyIncome: "",
    purpose: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleApplySimulation = ({ amount, durationMonths }) => {
    setForm((prev) => ({ ...prev, amount: String(amount), durationMonths: String(durationMonths) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!accepted) { setError("Vous devez accepter les conditions pour continuer."); return; }
    setSubmitting(true);
    try {
      await createLoan({
        userId: user.id, type,
        fullName: form.fullName, phoneNumber: form.phoneNumber, email: form.email,
        amount: Number(form.amount), durationMonths: Number(form.durationMonths),
        monthlyIncome: form.monthlyIncome ? Number(form.monthlyIncome) : undefined,
        purpose: form.purpose,
      });
      setSuccess(true);
    } catch (err) {
      setError("Votre demande n'a pas pu être envoyée. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loan-page">
      <header className="loan-header">
        <div className="loan-container loan-navbar">
          <Link to="/" className="loan-logo">
            <MoneyGreenMark size={30} />
            <span>Money<strong>Green</strong></span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <LangSelector />
            <DarkModeToggle />
            <Link to="/" className="loan-back">{t("nav_back")}</Link>
          </div>
        </div>
      </header>

      <main className="loan-container loan-main">
        <div className="loan-hero-grid">
          {flyerImg ? (
            <div className="loan-flyer">
              <img src={flyerImg} alt={title} />
            </div>
          ) : (
            <div className="loan-illustration"><LoanIllustration type={type} /></div>
          )}
          <section className="loan-intro">
            <p className="loan-eyebrow">{tagline}</p>
            <h1>{title}</h1>
            <p className="loan-description">{description}</p>
            <span className="loan-range">{maxRange}</span>
          </section>
        </div>

        <PrivacyPolicyNotice />

        <LoanSimulator type={type} onApply={handleApplySimulation} />

        <section className="loan-content-grid">
          <div className="loan-card loan-documents-card">
            <h3>{t("loan_documents")}</h3>
            <ul className="loan-documents-list">
              {documents.map((doc) => (
                <li key={doc.labelKey} className="loan-document-item">
                  <span className="loan-document-icon">{doc.icon}</span>
                  <div>
                    <span className="loan-document-label">{t(doc.labelKey)}</span>
                    {doc.detailKey && <span className="loan-document-detail">{t(doc.detailKey)}</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="loan-card loan-form-card">
            <h3>{t("loan_form_title")}</h3>
            {success ? (
              <div className="loan-success">
                <p>{t("loan_success_text")}</p>
                <Link to="/dashboard" className="loan-btn loan-btn-primary">{t("loan_success_back")}</Link>
              </div>
            ) : (
              <form className="loan-form" onSubmit={handleSubmit}>
                {error && <p className="loan-form-error">{error}</p>}
                {!isAuthenticated && (
                  <p className="loan-form-hint">Vous devrez vous connecter pour finaliser votre demande.</p>
                )}
                <div className="loan-form-row">
                  <label className="loan-field">
                    <span>{t("loan_fullname")}</span>
                    <input type="text" value={form.fullName} onChange={handleChange("fullName")} required />
                  </label>
                  <label className="loan-field">
                    <span>{t("loan_phone")}</span>
                    <input type="tel" value={form.phoneNumber} onChange={handleChange("phoneNumber")} required />
                  </label>
                </div>
                <label className="loan-field">
                  <span>{t("loan_email")}</span>
                  <input type="email" value={form.email} onChange={handleChange("email")} required />
                </label>
                <div className="loan-form-row">
                  <label className="loan-field">
                    <span>{t("loan_amount")}</span>
                    <input type="number" min="0" value={form.amount} onChange={handleChange("amount")} required />
                  </label>
                  <label className="loan-field">
                    <span>{t("loan_duration")}</span>
                    <input type="number" min="1" value={form.durationMonths} onChange={handleChange("durationMonths")} required />
                  </label>
                </div>
                <label className="loan-field">
                  <span>{t("loan_income")}</span>
                  <input type="number" min="0" value={form.monthlyIncome} onChange={handleChange("monthlyIncome")} />
                </label>
                <label className="loan-field">
                  <span>{t("loan_purpose")}</span>
                  <textarea rows="3" value={form.purpose} onChange={handleChange("purpose")} />
                </label>
                <label className="loan-checkbox">
                  <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                  <span>{t("loan_consent")}</span>
                </label>
                <button type="submit" className="loan-btn loan-btn-primary" disabled={submitting}>
                  {submitting ? t("loan_submitting") : t("loan_submit")}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}


