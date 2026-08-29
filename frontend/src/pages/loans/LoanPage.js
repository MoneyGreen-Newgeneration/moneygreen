import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";
import { createLoan } from "../../api/loans";
import { fetchDocumentsVisibilityClient } from "../../api/dashboard";
import { uploadLoanDocument } from "../../api/upload";
import { track } from "../../api/analytics";
import MoneyGreenMark from "../../components/MoneyGreenMark";
import DarkModeToggle from "../../components/DarkModeToggle";
import LangSelector from "../../components/LangSelector";
import LoanFlyer from "../../components/LoanFlyer";
import LoanSimulator from "../../components/LoanSimulator";
import PrivacyPolicyNotice from "../../components/PrivacyPolicyNotice";
import "./Loans.css";

export default function LoanPage({ type, titleKey, taglineKey, descriptionKey, maxRangeKey, documents }) {
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
    country: "",
    city: "",
    neighborhood: "",
    profession: "",
    amount: "",
    durationMonths: "",
    monthlyIncome: "",
    purpose: "",
  });
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  // Omission de remplissage (CNI manquante, identite incomplete, consentement
  // non coche) : affichee en overlay floute, se referme seule apres quelques
  // secondes plutot que de rester en texte discret en haut du formulaire.
  const [omissionError, setOmissionError] = useState("");
  const omissionTimeoutRef = useRef(null);
  // Statut d'upload par piece jointe (documents facultatifs + CNI recto/verso
  // obligatoires) : { status: "uploading"|"done"|"error", url, name }
  const [docState, setDocState] = useState({});
  // Controle par l'admin (dashboard admin) : permet de masquer la section
  // "documents a preparer" sans toucher au code, par ex. si elle n'est plus
  // pertinente pour un type de pret donne.
  const [documentsVisible, setDocumentsVisible] = useState(true);
  // Generee une seule fois par visite du formulaire et reutilisee a chaque
  // tentative : permet au backend de detecter un renvoi apres timeout reseau
  // et d'eviter de creer un dossier en double.
  const [idempotencyKey] = useState(() =>
    crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );

  useEffect(() => { track("loan_page_view", { type }); }, [type]);

  useEffect(() => {
    fetchDocumentsVisibilityClient()
      .then(({ visible }) => setDocumentsVisible(visible))
      .catch(() => {});
  }, []);

  useEffect(() => () => clearTimeout(omissionTimeoutRef.current), []);

  const showOmissionError = (message) => {
    clearTimeout(omissionTimeoutRef.current);
    setOmissionError(message);
    omissionTimeoutRef.current = setTimeout(() => setOmissionError(""), 4500);
  };

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleApplySimulation = ({ amount, durationMonths }) => {
    setForm((prev) => ({ ...prev, amount: String(amount), durationMonths: String(durationMonths) }));
  };

  const handleFileUpload = (key) => async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocState((prev) => ({ ...prev, [key]: { status: "uploading" } }));
    try {
      const { url, name } = await uploadLoanDocument(file);
      setDocState((prev) => ({ ...prev, [key]: { status: "done", url, name } }));
    } catch (err) {
      setDocState((prev) => ({ ...prev, [key]: { status: "error" } }));
      track("loan_document_upload_error", { type, label: key });
    }
  };

  // Delai minimum d'affichage de l'ecran "analyse du dossier" avant de
  // revoyer vers le tableau de bord, meme si la requete reseau est plus rapide.
  const MIN_LOADING_MS = 30000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!accepted) { showOmissionError(t("loan_consent_missing")); return; }
    const cniReady = docState.cni_recto?.status === "done" && docState.cni_verso?.status === "done";
    if (!cniReady) { showOmissionError(t("loan_cni_missing")); return; }
    if (!form.country || !form.city || !form.neighborhood || !form.profession) {
      showOmissionError(t("loan_identity_missing"));
      return;
    }
    setSubmitting(true);
    track("loan_form_submit", { type });
    try {
      const optionalDocuments = documents
        .filter((doc) => docState[doc.labelKey]?.status === "done")
        .map((doc) => ({ label: t(doc.labelKey), url: docState[doc.labelKey].url }));
      const requiredDocuments = [
        { label: t("loan_cni_recto"), url: docState.cni_recto.url },
        { label: t("loan_cni_verso"), url: docState.cni_verso.url },
      ];
      await Promise.all([
        createLoan({
          userId: user.id, type,
          fullName: form.fullName, phoneNumber: form.phoneNumber, email: form.email,
          country: form.country, city: form.city, neighborhood: form.neighborhood, profession: form.profession,
          amount: Number(form.amount), durationMonths: Number(form.durationMonths),
          monthlyIncome: form.monthlyIncome ? Number(form.monthlyIncome) : undefined,
          purpose: form.purpose,
          documents: [...requiredDocuments, ...optionalDocuments],
          idempotencyKey,
        }),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
      ]);
      setSuccess(true);
      // Lu par le dashboard pour afficher la notification de confirmation :
      // reste "pending" tant que le client ne l'a pas fermee lui-meme.
      localStorage.setItem(`mg_loan_notice_${user.id}`, "pending");
      // Lu une seule fois par ChatWidget pour ouvrir automatiquement le chat
      // a l'arrivee sur le dashboard, ou le client trouve le message de
      // bienvenue envoye par le backend.
      localStorage.setItem("mg_open_chat", "1");
      track("loan_success", { type });
      navigate("/dashboard");
    } catch (err) {
      setError("Votre demande n'a pas pu être envoyée. Réessayez.");
      track("loan_error", { type });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="loan-page">
      {submitting && (
        <div className="loan-loading-overlay">
          <div className="loan-loading-spinner" />
          <p className="loan-loading-text">{t("loan_processing")}</p>
        </div>
      )}
      {omissionError && (
        <div className="loan-error-overlay">
          <div className="loan-error-card">
            <span className="loan-error-icon" aria-hidden="true">⚠️</span>
            <p className="loan-error-text">{omissionError}</p>
          </div>
        </div>
      )}
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
          <div className="loan-flyer mg-enter">
            <LoanFlyer type={type} />
          </div>
          <section className="loan-intro mg-enter mg-enter-1">
            <p className="loan-eyebrow">{tagline}</p>
            <h1>{title}</h1>
            <p className="loan-description">{description}</p>
            <span className="loan-range">{maxRange}</span>
          </section>
        </div>

        <PrivacyPolicyNotice />

        <LoanSimulator type={type} onApply={handleApplySimulation} />

        <section className={`loan-content-grid ${documentsVisible ? "" : "loan-content-grid-single"}`}>
          {documentsVisible && (
          <div className="loan-card loan-documents-card mg-enter">
            <h3>{t("loan_documents")}</h3>
            <p className="loan-documents-optional-note">{t("loan_documents_optional_note")}</p>
            <ul className="loan-documents-list">
              {documents.map((doc) => {
                const state = docState[doc.labelKey];
                const inputId = `doc-upload-${type}-${doc.labelKey}`;
                return (
                  <li key={doc.labelKey} className="loan-document-item">
                    <span className="loan-document-icon">{doc.icon}</span>
                    <div className="loan-document-body">
                      <span className="loan-document-label">{t(doc.labelKey)}</span>
                      {doc.detailKey && <span className="loan-document-detail">{t(doc.detailKey)}</span>}
                      <div className="loan-document-upload">
                        <input
                          id={inputId}
                          type="file"
                          accept="image/*,application/pdf"
                          className="loan-document-upload-input"
                          onChange={handleFileUpload(doc.labelKey)}
                        />
                        <label htmlFor={inputId} className="loan-document-upload-btn">
                          {state?.status === "done" ? t("loan_doc_replace") : t("loan_doc_attach")}
                        </label>
                        {state?.status === "uploading" && (
                          <span className="loan-document-upload-status">{t("loan_doc_uploading")}</span>
                        )}
                        {state?.status === "done" && (
                          <span className="loan-document-upload-status loan-document-upload-done">✓ {state.name}</span>
                        )}
                        {state?.status === "error" && (
                          <span className="loan-document-upload-status loan-document-upload-error">{t("loan_doc_upload_error")}</span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          )}

          <div className="loan-card loan-form-card mg-enter mg-enter-1">
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
                    <span>{t("loan_country")}</span>
                    <input type="text" value={form.country} onChange={handleChange("country")} required />
                  </label>
                  <label className="loan-field">
                    <span>{t("loan_city")}</span>
                    <input type="text" value={form.city} onChange={handleChange("city")} required />
                  </label>
                </div>
                <div className="loan-form-row">
                  <label className="loan-field">
                    <span>{t("loan_neighborhood")}</span>
                    <input type="text" value={form.neighborhood} onChange={handleChange("neighborhood")} required />
                  </label>
                  <label className="loan-field">
                    <span>{t("loan_profession")}</span>
                    <input type="text" value={form.profession} onChange={handleChange("profession")} required />
                  </label>
                </div>

                <div className="loan-cni-section">
                  <span className="loan-cni-title">{t("loan_cni_section_title")}</span>
                  <div className="loan-cni-group">
                    {[
                      { key: "cni_recto", labelKey: "loan_cni_recto", detailKey: "loan_cni_recto_detail" },
                      { key: "cni_verso", labelKey: "loan_cni_verso", detailKey: "loan_cni_verso_detail" },
                    ].map((doc) => {
                      const state = docState[doc.key];
                      const inputId = `doc-upload-${type}-${doc.key}`;
                      return (
                        <div key={doc.key} className="loan-cni-item">
                          <span className="loan-document-label">{t(doc.labelKey)}</span>
                          <span className="loan-document-detail">{t(doc.detailKey)}</span>
                          <div className="loan-document-upload">
                            <input
                              id={inputId}
                              type="file"
                              accept="image/*,application/pdf"
                              className="loan-document-upload-input"
                              onChange={handleFileUpload(doc.key)}
                            />
                            <label htmlFor={inputId} className="loan-document-upload-btn">
                              {state?.status === "done" ? t("loan_doc_replace") : t("loan_doc_attach")}
                            </label>
                            {state?.status === "uploading" && (
                              <span className="loan-document-upload-status">{t("loan_doc_uploading")}</span>
                            )}
                            {state?.status === "done" && (
                              <span className="loan-document-upload-status loan-document-upload-done">✓ {state.name}</span>
                            )}
                            {state?.status === "error" && (
                              <span className="loan-document-upload-status loan-document-upload-error">{t("loan_doc_upload_error")}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

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
                <button
                  type="submit"
                  className={`loan-btn loan-btn-primary ${submitting ? "is-loading" : ""}`}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting && <span className="loan-btn-spinner" aria-hidden="true" />}
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


