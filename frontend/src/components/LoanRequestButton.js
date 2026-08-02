import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import "./LoanRequestButton.css";

export default function LoanRequestButton() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loanTypes = [
    { to: "/prets/auto", label: t("loan_auto_title") },
    { to: "/prets/immobilier", label: t("loan_immo_title") },
    { to: "/prets/scolaire", label: t("loan_sco_title") },
    { to: "/prets/personnel", label: t("loan_per_title") },
  ];

  return (
    <div className="loan-request-widget" ref={wrapperRef}>
      {open && (
        <div className="loan-request-menu">
          <span className="loan-request-menu-title">{t("home_hero_cta")}</span>
          {loanTypes.map((loan) => (
            <Link
              key={loan.to}
              to={loan.to}
              className="loan-request-menu-item"
              onClick={() => setOpen(false)}
            >
              {loan.label}
            </Link>
          ))}
        </div>
      )}
      <button
        className="loan-request-bubble"
        onClick={() => setOpen((o) => !o)}
        title={t("home_hero_cta")}
      >
        <span className="loan-request-icon" aria-hidden="true">+</span>
        <span className="loan-request-label">{t("home_hero_cta")}</span>
      </button>
    </div>
  );
}