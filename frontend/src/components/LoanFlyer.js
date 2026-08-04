import { useLang } from "../context/LangContext";
import MoneyGreenMark from "./MoneyGreenMark";
import "./LoanFlyer.css";

function FlyerFrame({ theme, badge, children }) {
  const dark = theme === "dark";
  return (
    <div className={`loan-flyer-frame ${dark ? "loan-flyer-dark" : "loan-flyer-light"}`}>
      <div className="loan-flyer-header">
        <MoneyGreenMark size={22} bg={dark ? "#3fc466" : "#1e8a3e"} fg={dark ? "#0d1210" : "#ffffff"} />
        <span className="loan-flyer-brand">Money<strong>Green</strong></span>
      </div>
      <div className="loan-flyer-stage">{children}</div>
      <div className="loan-flyer-footer">
        <span className="loan-flyer-badge">{badge}</span>
      </div>
    </div>
  );
}

function AutoFlyer({ badge }) {
  return (
    <FlyerFrame theme="dark" badge={badge}>
      <svg viewBox="0 0 300 260" className="loan-flyer-svg" aria-hidden="true">
        <defs>
          <radialGradient id="autoGlow" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#2aa84e" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2aa84e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="autoBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2fb055" />
            <stop offset="100%" stopColor="#15602b" />
          </linearGradient>
        </defs>
        <ellipse cx="150" cy="118" rx="140" ry="110" fill="url(#autoGlow)" />

        {/* jauge de financement */}
        <g className="lf-gauge" transform="translate(228,54)">
          <circle r="30" fill="#12151a" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
          <circle
            r="30"
            fill="none"
            stroke="#e8c53a"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="188.5"
            className="lf-gauge-arc"
            transform="rotate(-90)"
          />
          <text x="0" y="5" textAnchor="middle" fontFamily="Archivo,Inter,sans-serif" fontSize="15" fontWeight="800" fill="#f3f6f4">100%</text>
        </g>

        {/* route */}
        <rect x="0" y="208" width="300" height="52" fill="#0d0f0d" />
        <line x1="0" y1="208" x2="300" y2="208" stroke="#2a2e2b" strokeWidth="2" />
        <line x1="-20" y1="222" x2="320" y2="222" stroke="#e8c53a" strokeWidth="3" strokeDasharray="20 16" className="lf-road-line" />

        {/* voiture */}
        <g className="lf-car">
          <ellipse cx="150" cy="205" rx="88" ry="10" fill="#000" opacity="0.35" />
          <rect x="66" y="150" width="168" height="44" rx="14" fill="url(#autoBody)" />
          <path d="M96,150 L112,120 Q118,112 130,112 L172,112 Q184,112 190,120 L206,150 Z" fill="#2fb055" />
          <path d="M118,118 L128,148 L172,148 L182,118 Z" fill="#0d1210" opacity="0.55" />
          <line x1="150" y1="118" x2="150" y2="148" stroke="#12151a" strokeWidth="2" opacity=".5" />
          <circle className="lf-headlight" cx="72" cy="168" r="6" fill="#ffe9a8" />
          <rect x="222" y="163" width="14" height="7" rx="2" fill="#ff6b57" opacity=".9" />
          <circle cx="104" cy="196" r="18" fill="#0d1210" />
          <circle cx="104" cy="196" r="8" fill="#3a3e3b" />
          <circle cx="196" cy="196" r="18" fill="#0d1210" />
          <circle cx="196" cy="196" r="8" fill="#3a3e3b" />
        </g>
      </svg>
    </FlyerFrame>
  );
}

function ImmoFlyer({ badge }) {
  return (
    <FlyerFrame theme="light" badge={badge}>
      <svg viewBox="0 0 300 260" className="loan-flyer-svg" aria-hidden="true">
        <defs>
          <linearGradient id="immoSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e7f3ea" />
            <stop offset="100%" stopColor="#cfe6d6" />
          </linearGradient>
          <linearGradient id="immoRoof" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2aa84e" />
            <stop offset="100%" stopColor="#15602b" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="300" height="260" fill="url(#immoSky)" />
        <circle className="lf-sun" cx="248" cy="46" r="26" fill="#e8c53a" />
        <circle cx="248" cy="46" r="17" fill="#f3d878" />

        <rect x="0" y="222" width="300" height="38" fill="#bcdac6" />

        {/* maison */}
        <g className="lf-house">
          <rect x="82" y="140" width="136" height="82" rx="4" fill="#ffffff" />
          <polygon points="70,140 150,88 230,140" fill="url(#immoRoof)" />
          <rect x="135" y="176" width="30" height="46" rx="2" fill="#0d3d1d" />
          <circle className="lf-door-knob" cx="158" cy="200" r="2.4" fill="#e8c53a" />
          <rect x="96" y="156" width="26" height="22" rx="2" fill="#dff0e4" stroke="#1e8a3e" strokeWidth="1.5" />
          <rect x="178" y="156" width="26" height="22" rx="2" fill="#dff0e4" stroke="#1e8a3e" strokeWidth="1.5" />
          <line x1="109" y1="156" x2="109" y2="178" stroke="#1e8a3e" strokeWidth="1.2" />
          <line x1="96" y1="167" x2="122" y2="167" stroke="#1e8a3e" strokeWidth="1.2" />
          <line x1="191" y1="156" x2="191" y2="178" stroke="#1e8a3e" strokeWidth="1.2" />
          <line x1="178" y1="167" x2="204" y2="167" stroke="#1e8a3e" strokeWidth="1.2" />
        </g>

        {/* tampon "approuve" */}
        <g className="lf-stamp" transform="translate(226,168)">
          <circle r="28" fill="none" stroke="#1e8a3e" strokeWidth="3" />
          <path d="M-11,0 L-3,9 L13,-10" fill="none" stroke="#1e8a3e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* barres de valorisation */}
        <g transform="translate(28,222)">
          <rect className="lf-bar lf-bar-1" x="0" y="-24" width="12" height="24" fill="#1e8a3e" />
          <rect className="lf-bar lf-bar-2" x="18" y="-34" width="12" height="34" fill="#2aa84e" />
          <rect className="lf-bar lf-bar-3" x="36" y="-44" width="12" height="44" fill="#3fc466" />
        </g>
      </svg>
    </FlyerFrame>
  );
}

function ScolaireFlyer({ badge }) {
  return (
    <FlyerFrame theme="dark" badge={badge}>
      <svg viewBox="0 0 300 260" className="loan-flyer-svg" aria-hidden="true">
        <defs>
          <linearGradient id="scoBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#12151a" />
            <stop offset="100%" stopColor="#1c1f1d" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="300" height="260" fill="url(#scoBg)" />

        <circle className="lf-star lf-star-1" cx="52" cy="48" r="2.4" fill="#e8c53a" />
        <circle className="lf-star lf-star-2" cx="90" cy="30" r="1.8" fill="#f3f6f4" />
        <circle className="lf-star lf-star-3" cx="230" cy="40" r="2.2" fill="#3fc466" />
        <circle className="lf-star lf-star-4" cx="256" cy="80" r="1.6" fill="#e8c53a" />
        <circle className="lf-star lf-star-5" cx="40" cy="100" r="1.6" fill="#f3f6f4" />

        {/* badge etoile */}
        <g className="lf-medal" transform="translate(232,166)">
          <circle r="30" fill="#e8c53a" />
          <text x="0" y="9" textAnchor="middle" fontSize="26" fontWeight="900" fill="#1c1f1d">★</text>
        </g>

        {/* livre ouvert */}
        <g className="lf-book" transform="translate(150,150)">
          <path d="M0,-14 C-38,-30 -78,-24 -90,-16 L-90,54 C-78,46 -38,40 0,54 Z" fill="#1e8a3e" />
          <path d="M0,-14 C38,-30 78,-24 90,-16 L90,54 C78,46 38,40 0,54 Z" fill="#2aa84e" />
          <line x1="0" y1="-14" x2="0" y2="54" stroke="#0d3d1d" strokeWidth="2" />
          <line x1="-70" y1="-4" x2="-14" y2="4" stroke="#f3f6f4" strokeWidth="1.4" opacity=".55" />
          <line x1="-70" y1="8" x2="-14" y2="16" stroke="#f3f6f4" strokeWidth="1.4" opacity=".55" />
          <line x1="-70" y1="20" x2="-30" y2="26" stroke="#f3f6f4" strokeWidth="1.4" opacity=".55" />
          <line x1="14" y1="4" x2="70" y2="-4" stroke="#f3f6f4" strokeWidth="1.4" opacity=".55" />
          <line x1="14" y1="16" x2="70" y2="8" stroke="#f3f6f4" strokeWidth="1.4" opacity=".55" />
          <line x1="30" y1="26" x2="70" y2="20" stroke="#f3f6f4" strokeWidth="1.4" opacity=".55" />
        </g>

        {/* chapeau diplome flottant */}
        <g className="lf-cap" transform="translate(78,86)">
          <polygon points="0,-10 34,4 0,18 -34,4" fill="#f3f6f4" />
          <rect x="-8" y="4" width="16" height="14" fill="#dfe3e0" />
          <line x1="26" y1="0" x2="26" y2="24" stroke="#e8c53a" strokeWidth="2" />
          <circle cx="26" cy="26" r="2.6" fill="#e8c53a" />
        </g>
      </svg>
    </FlyerFrame>
  );
}

function PersonnelFlyer({ badge }) {
  return (
    <FlyerFrame theme="light" badge={badge}>
      <svg viewBox="0 0 300 260" className="loan-flyer-svg" aria-hidden="true">
        <defs>
          <linearGradient id="perBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3f6f4" />
            <stop offset="100%" stopColor="#e2eee6" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="300" height="260" fill="url(#perBg)" />

        <circle className="lf-coin lf-coin-1" cx="54" cy="70" r="12" fill="#e8c53a" />
        <text className="lf-coin lf-coin-1" x="54" y="75" textAnchor="middle" fontSize="12" fontWeight="800" fill="#8a6d00">₣</text>
        <circle className="lf-coin lf-coin-2" cx="244" cy="150" r="9" fill="#3fc466" />
        <circle className="lf-coin lf-coin-3" cx="230" cy="60" r="6" fill="#1e8a3e" opacity=".7" />

        {/* courbe de croissance */}
        <path
          className="lf-trend"
          d="M40,196 Q90,160 120,168 T190,110 T256,54"
          fill="none"
          stroke="#1e8a3e"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength="1"
        />
        <circle className="lf-trend-dot" cx="256" cy="54" r="7" fill="#3fc466" />

        <line x1="40" y1="210" x2="270" y2="210" stroke="#1c1f1d" strokeOpacity=".18" strokeWidth="1.5" />
        <line x1="40" y1="40" x2="40" y2="210" stroke="#1c1f1d" strokeOpacity=".18" strokeWidth="1.5" />

        {/* badge central */}
        <g className="lf-check" transform="translate(96,160)">
          <circle r="26" fill="#1e8a3e" />
          <path d="M-10,0 L-2,9 L13,-9" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </FlyerFrame>
  );
}

export default function LoanFlyer({ type }) {
  const { t } = useLang();
  if (type === "auto") return <AutoFlyer badge={t("flyer_auto_badge")} />;
  if (type === "immobilier") return <ImmoFlyer badge={t("flyer_immo_badge")} />;
  if (type === "scolaire") return <ScolaireFlyer badge={t("flyer_sco_badge")} />;
  return <PersonnelFlyer badge={t("flyer_per_badge")} />;
}
