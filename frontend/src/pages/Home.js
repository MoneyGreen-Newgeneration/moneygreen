import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { Link } from "react-router-dom";
import MoneyGreenMark from "../components/MoneyGreenMark";
import DarkModeToggle from "../components/DarkModeToggle";
import LangSelector from "../components/LangSelector";
import "./Home.css";
import PromoBanner from "../components/PromoBanner";
import AgencyGallery from "../components/AgencyGallery";
import CompanyPresentation from "../components/CompanyPresentation";

const PRODUCT_IDS = ["auto","immobilier","scolaire","personnel"];
const TESTI_IDS = Array.from({ length: 25 }, (_, i) => i + 1);
const TESTI_INITIAL_VISIBLE = 4;

const ELIGIBLE_COUNTRIES = [
  { name: "Sénégal", code: "sn" },
  { name: "Côte d'Ivoire", code: "ci" },
  { name: "Mali", code: "ml" },
  { name: "Burkina Faso", code: "bf" },
  { name: "Niger", code: "ne" },
  { name: "Guinée", code: "gn" },
  { name: "Cameroun", code: "cm" },
  { name: "Congo", code: "cg" },
  { name: "Gabon", code: "ga" },
];

function CountryFlag({ code }) {
  const common = { viewBox: "0 0 30 20", preserveAspectRatio: "xMidYMid slice", className: "home-flag-svg" };
  switch (code) {
    case "sn":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#00853F" />
          <rect x="10" width="10" height="20" fill="#FDEF42" />
          <rect x="20" width="10" height="20" fill="#E31B23" />
        </svg>
      );
    case "ci":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#F77F00" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#009A44" />
        </svg>
      );
    case "ml":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#14B53A" />
          <rect x="10" width="10" height="20" fill="#FCD116" />
          <rect x="20" width="10" height="20" fill="#CE1126" />
        </svg>
      );
    case "bf":
      return (
        <svg {...common}>
          <rect width="30" height="10" fill="#EF2B2D" />
          <rect y="10" width="30" height="10" fill="#009E49" />
          <polygon points="15,7 16,10 19,10 16.5,12 17.5,15 15,13 12.5,15 13.5,12 11,10 14,10" fill="#FCD116" />
        </svg>
      );
    case "ne":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#FFFFFF" />
          <rect width="30" height="6.66" fill="#E05206" />
          <rect y="13.34" width="30" height="6.66" fill="#0DB02B" />
          <circle cx="15" cy="10" r="2.6" fill="#E05206" />
        </svg>
      );
    case "gn":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#CE1126" />
          <rect x="10" width="10" height="20" fill="#FCD116" />
          <rect x="20" width="10" height="20" fill="#009460" />
        </svg>
      );
    case "cm":
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#007A5E" />
          <rect x="10" width="10" height="20" fill="#CE1126" />
          <rect x="20" width="10" height="20" fill="#FCD116" />
          <polygon points="15,7 16,10 19,10 16.5,12 17.5,15 15,13 12.5,15 13.5,12 11,10 14,10" fill="#FCD116" />
        </svg>
      );
    case "cg":
      return (
        <svg {...common}>
          <polygon points="0,0 30,0 0,20" fill="#009543" />
          <polygon points="30,0 30,20 0,20" fill="#DC241F" />
          <polygon points="0,20 0,17 27,0 30,0 30,3 3,20" fill="#FBDE4A" />
        </svg>
      );
    case "ga":
      return (
        <svg {...common}>
          <rect width="30" height="6.66" fill="#009E60" />
          <rect y="6.66" width="30" height="6.68" fill="#FCD116" />
          <rect y="13.34" width="30" height="6.66" fill="#3A75C4" />
        </svg>
      );
    default:
      return null;
  }
}

const PARTNER_BANKS = [
  "Banque de l'Habitat du Sénégal",
  "Ecobank Transnational",
  "Bank of Africa",
  "Société Générale Côte d'Ivoire",
];

function PartnerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="home-partner-icon-svg" aria-hidden="true">
      <rect x="2" y="6" width="20" height="13" rx="2.2" fill="none" stroke="#ffffff" strokeWidth="1.8" />
      <rect x="2" y="9" width="20" height="3" fill="#ffffff" />
      <rect x="5" y="14.5" width="6" height="2" rx="1" fill="#ffffff" />
    </svg>
  );
}

// Pour afficher une vraie photo a la place des initiales, ajoute une entree
// ici : { 1: "/avatars/testi1.jpg" }. Sans entree, les initiales sont utilisees.
const TESTI_PHOTOS = {
  1: "/avatars/testi1.jpg",
  2: "/avatars/testi2.jpg",
  3: "/avatars/testi3.jpg",
  4: "/avatars/testi4.jpg",
  5: "/avatars/testi5.jpg",
  6: "/avatars/testi6.jpg",
  7: "/avatars/testi7.jpg",
  8: "/avatars/testi8.jpg",
  9: "/avatars/testi9.jpg",
  10: "/avatars/testi10.jpg",
  11: "/avatars/testi11.jpg",
  12: "/avatars/testi12.jpg",
  13: "/avatars/testi13.jpg",
  14: "/avatars/testi14.jpg",
  15: "/avatars/testi15.jpg",
  16: "/avatars/testi16.jpg",
  17: "/avatars/testi17.jpg",
  18: "/avatars/testi18.jpg",
  19: "/avatars/testi19.jpg",
  20: "/avatars/testi20.jpg",
  21: "/avatars/testi21.jpg",
  22: "/avatars/testi22.jpg",
  23: "/avatars/testi23.jpg",
  24: "/avatars/testi24.jpg",
  25: "/avatars/testi25.jpg",
};

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Home() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [testiVisible, setTestiVisible] = useState(TESTI_INITIAL_VISIBLE);
  const { user } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % PRODUCT_IDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const products = [
    { id: "auto", label: t("prod_auto_label"), eyebrow: t("prod_auto_eyebrow"), description: t("prod_auto_desc"), range: t("prod_auto_range") },
    { id: "immobilier", label: t("prod_immo_label"), eyebrow: t("prod_immo_eyebrow"), description: t("prod_immo_desc"), range: t("prod_immo_range") },
    { id: "scolaire", label: t("prod_sco_label"), eyebrow: t("prod_sco_eyebrow"), description: t("prod_sco_desc"), range: t("prod_sco_range") },
    { id: "personnel", label: t("prod_per_label"), eyebrow: t("prod_per_eyebrow"), description: t("prod_per_desc"), range: t("prod_per_range") },
  ];

  const testimonials = TESTI_IDS.map((id) => ({
    id,
    name: t(`testi${id}_name`),
    country: t(`testi${id}_country`),
    tag: t(`testi${id}_tag`),
    quote: t(`testi${id}_quote`),
    photo: TESTI_PHOTOS[id] || null,
  }));

  const news = [t("home_ticker1"), t("home_ticker2"), t("home_ticker3"), t("home_ticker4"), t("home_ticker5")];

  const steps = [
    { title: t("home_step1_title"), detail: t("home_step1_desc") },
    { title: t("home_step2_title"), detail: t("home_step2_desc") },
    { title: t("home_step3_title"), detail: t("home_step3_desc") },
    { title: t("home_step4_title"), detail: t("home_step4_desc") },
  ];

  return (
    <div className="home">
      <header className="home-header">
        <div className="home-container home-navbar">
          <div className="home-logo">
            <MoneyGreenMark size={34} />
            <span>Money<strong>Green</strong></span>
          </div>
          <nav className="home-nav-links">
            <a href="#produits">{t("nav_products")}</a>
            <a href="#processus">{t("nav_process")}</a>
            <a href="#contact">{t("nav_contact")}</a>
          </nav>
          <div className="home-nav-actions">
            <LangSelector />
            <DarkModeToggle />
            <Link to="/login" className="home-link-ghost">{t("nav_login")}</Link>
            <Link to="/register" className="home-btn home-btn-primary">{t("nav_loan")}</Link>
          </div>
          <button
            type="button"
            className={`home-burger ${menuOpen ? "is-open" : ""}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`home-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <nav className="home-mobile-links">
            <a href="#produits" onClick={() => setMenuOpen(false)}>{t("nav_products")}</a>
            <a href="#processus" onClick={() => setMenuOpen(false)}>{t("nav_process")}</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>{t("nav_contact")}</a>
          </nav>
          <div className="home-mobile-actions">
            <LangSelector />
            <DarkModeToggle />
            <Link to="/login" className="home-btn home-btn-outline-dark" onClick={() => setMenuOpen(false)}>{t("nav_login")}</Link>
            <Link to="/register" className="home-btn home-btn-primary" onClick={() => setMenuOpen(false)}>{t("nav_loan")}</Link>
          </div>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-bg" aria-hidden="true">
          <div className="home-hero-shape home-hero-shape-1" />
          <div className="home-hero-shape home-hero-shape-2" />
        </div>
        <div className="home-container home-hero-grid">
          <div className="home-hero-content">
            <p className="home-eyebrow">{t("home_eyebrow")}</p>
            <h1>{t("home_hero_title")}</h1>
            <p className="home-hero-lede">{t("home_hero_sub")}</p>
            <div className="home-hero-actions">
              <Link to="/register" className="home-btn home-btn-primary">{t("home_hero_cta")}</Link>
              <a href="#produits" className="home-btn home-btn-outline">{t("home_hero_link")}</a>
            </div>
          </div>
          <div className="home-hero-card" aria-live="polite">
            <span className="home-hero-card-label">{t("home_now")}</span>
            <span className="home-hero-card-product">{products[activeProduct].label}</span>
            <p className="home-hero-card-desc">{products[activeProduct].description}</p>
            <span className="home-hero-card-range">{products[activeProduct].range}</span>
            <div className="home-hero-card-dots">
              {products.map((p, i) => (
                <button key={p.id} aria-label={p.label} className={i === activeProduct ? "active" : ""} onClick={() => setActiveProduct(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <PromoBanner />

      <section className="home-ticker" aria-label="Actualites MoneyGreen">
        <div className="home-ticker-track">
          {[...news, ...news].map((item, i) => <span key={i}>{item}</span>)}
        </div>
      </section>

      <section id="produits" className="home-section">
        <div className="home-container">
          <div className="home-section-title">
            <p className="home-eyebrow">{t("home_products_eyebrow")}</p>
            <h2>{t("home_products_title")}</h2>
          </div>
          <div className="home-products-grid">
            {products.map((p) => (
              <Link key={p.id} to={`/prets/${p.id}`} className="home-product-card">
                <span className="home-product-eyebrow">{p.eyebrow}</span>
                <h3>{p.label}</h3>
                <p>{p.description}</p>
                <span className="home-product-range">{p.range}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="processus" className="home-section">
        <div className="home-container">
          <div className="home-section-title">
            <p className="home-eyebrow">{t("home_process_eyebrow")}</p>
            <h2>{t("home_process_title")}</h2>
          </div>
          <ol className="home-steps">
            {steps.map((step, i) => (
              <li key={i} className="home-step">
                <span className="home-step-number">{String(i + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section home-section-alt">
        <div className="home-container">
          <div className="home-section-title">
            <p className="home-eyebrow">{t("home_testi_eyebrow")}</p>
            <h2>{t("home_testi_title")}</h2>
          </div>
          <div className="home-testimonials-grid">
            {testimonials.slice(0, testiVisible).map((item) => (
              <figure key={item.id} className="home-testimonial-card">
                <div className="home-testimonial-head">
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} className="home-testimonial-avatar" />
                  ) : (
                    <span className={`home-testimonial-avatar home-avatar-c${item.id % 5}`}>
                      {getInitials(item.name)}
                    </span>
                  )}
                  <div className="home-testimonial-identity">
                    <figcaption>{item.name}</figcaption>
                    <span className="home-testimonial-country">{item.country}</span>
                  </div>
                </div>
                <span className="home-testimonial-tag">{item.tag}</span>
                <blockquote>{item.quote}</blockquote>
              </figure>
            ))}
          </div>
          <div className="home-testimonials-more">
            <button
              type="button"
              className="home-btn home-btn-outline"
              onClick={() =>
                setTestiVisible((prev) =>
                  prev < testimonials.length ? testimonials.length : TESTI_INITIAL_VISIBLE
                )
              }
            >
              {testiVisible < testimonials.length ? t("home_testi_more") : t("home_testi_less")}
            </button>
          </div>
        </div>
      </section>

      <section className="home-section" aria-label="Pays eligibles">
        <div className="home-container">
          <div className="home-section-title">
            <p className="home-eyebrow">{t("home_countries_eyebrow")}</p>
            <h2>{t("home_countries_title")}</h2>
            <p className="home-section-subtitle">{t("home_countries_sub")}</p>
          </div>
          <div className="home-countries-grid">
            {ELIGIBLE_COUNTRIES.map((country) => (
              <div key={country.name} className="home-country-card">
                <span className="home-country-dot" aria-hidden="true">
                  <CountryFlag code={country.code} />
                </span>
                <span>{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section-alt" aria-label="Nos partenaires">
        <div className="home-container">
          <div className="home-section-title">
            <p className="home-eyebrow">{t("home_partners_eyebrow")}</p>
            <h2>{t("home_partners_title")}</h2>
          </div>
          <div className="home-partners-grid">
            {PARTNER_BANKS.map((bank) => (
              <div key={bank} className="home-partner-card">
                <span className="home-partner-icon" aria-hidden="true">
                  <PartnerIcon />
                </span>
                <span>{bank}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CompanyPresentation />

      <section id="contact" className="home-section">
        <div className="home-container home-contact-grid">
          <div>
            <p className="home-eyebrow">{t("home_contact_eyebrow")}</p>
            <h2>{t("home_contact_title")}</h2>
            <div className="home-contact-info">
              <p>Abidjan, Cote d'Ivoire</p>
              <p>+225 05 66 85 14 66</p>
              <p>UK / Royaume Unie</p>
              <p>+44 74 76 59 85 61</p>
              <p>moneygreen@gmail.com</p>
            </div>
          </div>
          <form className="home-contact-form" onSubmit={(e) => e.preventDefault()}>
            <label className="home-field">
              <span>{t("home_contact_name")}</span>
              <input type="text" required />
            </label>
            <label className="home-field">
              <span>{t("home_contact_email")}</span>
              <input type="email" required />
            </label>
            <label className="home-field">
              <span>{t("home_contact_msg")}</span>
              <textarea rows="4" required />
            </label>
            <button type="submit" className="home-btn home-btn-primary">{t("home_contact_send")}</button>
          </form>
        </div>
      </section>

      <AgencyGallery />

            <footer className="home-footer">
        <div className="home-container home-footer-grid">
          <div className="home-footer-brand">
            <div className="home-footer-logo">
              <MoneyGreenMark size={30} />
              <span>MoneyGreen</span>
            </div>
            <p className="home-footer-desc">Votre partenaire financier de confiance. Ensemble, construisons votre avenir.</p>
            <div className="home-footer-social">

              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-6.6L4.8 22H1.7l8.1-9.3L1 2h7l4.9 6.1L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.55.55.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.44 2.54c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.72.36-1.03.67-.31.31-.51.61-.67 1.03-.12.31-.26.78-.3 1.65C4.26 8.76 4.25 9.08 4.25 11.75v.5c0 2.67.01 2.99.06 4.04.04.87.18 1.34.3 1.65.16.42.36.72.67 1.03.31.31.61.51 1.03.67.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.72-.36 1.03-.67.31-.31.51-.61.67-1.03.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.04v-.5c0-2.67-.01-2.99-.06-4.04-.04-.87-.18-1.34-.3-1.65a2.75 2.75 0 0 0-.67-1.03 2.75 2.75 0 0 0-1.03-.67c-.31-.12-.78-.26-1.65-.3C14.99 3.81 14.67 3.8 12 3.8Zm0 3.05a5.15 5.15 0 1 1 0 10.3 5.15 5.15 0 0 1 0-10.3Zm0 1.8a3.35 3.35 0 1 0 0 6.7 3.35 3.35 0 0 0 0-6.7Zm5.35-2a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"/></svg>
              </a>
            </div>
          </div>

          <div className="home-footer-col">
            <h4>Navigation</h4>
            <a href="#produits">Nos offres</a>
            <a href="#processus">Notre processus</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="home-footer-col">
            <h4>Offres</h4>
            <Link to="/prets/auto">Prêt auto</Link>
            <Link to="/prets/immobilier">Prêt immobilier</Link>
            <Link to="/prets/scolaire">Prêt scolaire</Link>
            <Link to="/prets/personnel">Prêt personnel</Link>
          </div>

          <div className="home-footer-col">
            <h4>Compte</h4>
            <Link to="/login">Connexion</Link>
            <Link to="/register">Creer un compte</Link>
            {user?.isAdmin && <Link to="/admin" className="home-admin-link">Administration</Link>}
          </div>
        </div>

        <div className="home-footer-bottom">
          <p className="home-footer-copy">&copy; {new Date().getFullYear()} MoneyGreen &mdash; {t("home_footer_rights")}</p>
        </div>
      </footer>
    </div>
  );
}








