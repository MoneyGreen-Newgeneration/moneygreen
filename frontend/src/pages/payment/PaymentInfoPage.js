import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchPaymentInfoClient } from "../../api/dashboard";
import { useLang } from "../../context/LangContext";
import MoneyGreenMark from "../../components/MoneyGreenMark";
import DarkModeToggle from "../../components/DarkModeToggle";
import LangSelector from "../../components/LangSelector";
import "./Payment.css";
import { ENROLLMENT_FEES_TITLE_FR, ENROLLMENT_FEES_BODY_FR } from "../../data/enrollmentFeesContent";

export default function PaymentInfoPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPaymentInfoClient()
      .then(setInfo)
      .catch(() => setError("Impossible de charger les informations de paiement."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pay-page">
      <header className="pay-header">
        <div className="pay-container pay-navbar">
          <Link to="/dashboard" className="pay-logo">
            <MoneyGreenMark size={28} />
            <span>Money<strong>Green</strong></span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <LangSelector />
            <DarkModeToggle />
          </div>
        </div>
      </header>
      <main className="pay-container pay-main">
        <div className="pay-card">
          <h2>{ENROLLMENT_FEES_TITLE_FR}</h2>
          <div className="pay-enrollment-content">
            {ENROLLMENT_FEES_BODY_FR.map((block, idx) => {
              if (block.type === "p") {
                return <p key={idx} className="pay-enrollment-p">{block.text}</p>;
              }
              if (block.type === "h4") {
                return <h4 key={idx} className="pay-enrollment-h4">{block.text}</h4>;
              }
              if (block.type === "ul") {
                return (
                  <ul key={idx} className="pay-enrollment-list">
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }
              return null;
            })}
          </div>
          {error && <p className="pay-error">{error}</p>}
          {loading ? (
            <p className="pay-loading">Chargement...</p>
          ) : info && (
            <>
              <div className="pay-amount">
                <span className="pay-amount-label">{t("pay_amount_label")}</span>
                <span className="pay-amount-value">{Number(info.montant).toLocaleString("fr-FR")} FCFA</span>
              </div>
              <div className="pay-info-list">
                {info.mtnNumber && (
                  <div className="pay-info-card pay-info-mtn">
                    <div className="pay-info-card-head">
                      <span className="pay-info-tag">{t("pay_mtn")}</span>
                    </div>
                    <p className="pay-info-number">{info.mtnNumber}</p>
                    {info.mtnName && <p className="pay-info-name">{info.mtnName}</p>}
                  </div>
                )}
                {info.orangeNumber && (
                  <div className="pay-info-card pay-info-orange">
                    <div className="pay-info-card-head">
                      <span className="pay-info-tag">{t("pay_orange")}</span>
                    </div>
                    <p className="pay-info-number">{info.orangeNumber}</p>
                    {info.orangeName && <p className="pay-info-name">{info.orangeName}</p>}
                  </div>
                )}
                {info.accountNumber && (
                  <div className="pay-info-card pay-info-account">
                    <div className="pay-info-card-head">
                      <span className="pay-info-tag">{t("pay_account")}</span>
                    </div>
                    <p className="pay-info-number">{info.accountNumber}</p>
                    {info.accountName && <p className="pay-info-name">{info.accountName}</p>}
                  </div>
                )}
              </div>
              <div className="pay-note">{t("pay_note")}</div>
              <button className="pay-btn" onClick={() => navigate("/dashboard")}>{t("pay_back")}</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
