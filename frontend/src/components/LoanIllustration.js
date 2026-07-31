export default function LoanIllustration({ type }) {
  if (type === "auto") return (
    <svg width="100%" viewBox="0 0 400 160" aria-hidden="true" style={{display:"block"}}>
      <rect x="0" y="0" width="400" height="160" rx="12" fill="#1c1f1d"/>
      <rect x="0" y="128" width="400" height="32" fill="#2a2e2b"/>
      <line x1="0" y1="144" x2="400" y2="144" stroke="#e8c53a" strokeWidth="2" strokeDasharray="18 10"/>
      <rect x="90" y="88" width="200" height="52" rx="8" fill="#1e8a3e"/>
      <rect x="120" y="63" width="130" height="36" rx="6" fill="#2aa84e"/>
      <rect x="128" y="68" width="48" height="24" rx="3" fill="#1c1f1d" opacity=".7"/>
      <rect x="182" y="68" width="48" height="24" rx="3" fill="#1c1f1d" opacity=".7"/>
      <circle cx="125" cy="143" r="16" fill="#1c1f1d"/><circle cx="125" cy="143" r="8" fill="#3a3e3b"/>
      <circle cx="255" cy="143" r="16" fill="#1c1f1d"/><circle cx="255" cy="143" r="8" fill="#3a3e3b"/>
      <rect x="88" y="100" width="14" height="8" rx="2" fill="#e8c53a"/>
      <rect x="298" y="100" width="14" height="8" rx="2" fill="#e8c53a"/>
    </svg>
  );

  if (type === "immobilier") return (
    <svg width="100%" viewBox="0 0 400 160" aria-hidden="true" style={{display:"block"}}>
      <rect x="0" y="0" width="400" height="160" rx="12" fill="#f3f6f4"/>
      <rect x="0" y="128" width="400" height="32" fill="#dde8e0"/>
      <rect x="130" y="90" width="140" height="70" rx="4" fill="#1e8a3e"/>
      <polygon points="110,90 200,45 290,90" fill="#15602b"/>
      <rect x="185" y="112" width="30" height="48" rx="3" fill="#0d3d1d"/>
      <circle cx="212" cy="137" r="3" fill="#3fc466"/>
      <rect x="138" y="102" width="30" height="24" rx="2" fill="#f3f6f4" opacity=".85"/>
      <rect x="232" y="102" width="30" height="24" rx="2" fill="#f3f6f4" opacity=".85"/>
      <line x1="153" y1="102" x2="153" y2="126" stroke="#1e8a3e" strokeWidth="1.5"/>
      <line x1="138" y1="114" x2="168" y2="114" stroke="#1e8a3e" strokeWidth="1.5"/>
      <line x1="247" y1="102" x2="247" y2="126" stroke="#1e8a3e" strokeWidth="1.5"/>
      <line x1="232" y1="114" x2="262" y2="114" stroke="#1e8a3e" strokeWidth="1.5"/>
      <circle cx="50" cy="50" r="28" fill="#e8c53a" opacity=".9"/>
      <circle cx="50" cy="50" r="20" fill="#f0d060"/>
    </svg>
  );

  if (type === "scolaire") return (
    <svg width="100%" viewBox="0 0 400 160" aria-hidden="true" style={{display:"block"}}>
      <rect x="0" y="0" width="400" height="160" rx="12" fill="#1c1f1d"/>
      <rect x="110" y="60" width="80" height="75" rx="4" fill="#1e8a3e"/>
      <rect x="190" y="60" width="80" height="75" rx="4" fill="#2aa84e"/>
      <line x1="190" y1="60" x2="190" y2="135" stroke="#0d3d1d" strokeWidth="2"/>
      <line x1="122" y1="82" x2="178" y2="82" stroke="#3fc466" strokeWidth="1.5"/>
      <line x1="122" y1="94" x2="178" y2="94" stroke="#3fc466" strokeWidth="1.5"/>
      <line x1="122" y1="106" x2="165" y2="106" stroke="#3fc466" strokeWidth="1.5"/>
      <line x1="200" y1="82" x2="260" y2="82" stroke="#f3f6f4" strokeWidth="1.5" opacity=".7"/>
      <line x1="200" y1="94" x2="260" y2="94" stroke="#f3f6f4" strokeWidth="1.5" opacity=".7"/>
      <line x1="200" y1="106" x2="248" y2="106" stroke="#f3f6f4" strokeWidth="1.5" opacity=".7"/>
      <circle cx="320" cy="72" r="30" fill="#e8c53a"/>
      <text x="320" y="81" fontFamily="Inter,sans-serif" fontSize="26" fontWeight="900" textAnchor="middle" fill="#1c1f1d">★</text>
    </svg>
  );

  return (
    <svg width="100%" viewBox="0 0 400 160" aria-hidden="true" style={{display:"block"}}>
      <rect x="0" y="0" width="400" height="160" rx="12" fill="#f3f6f4"/>
      <circle cx="200" cy="62" r="26" fill="#1e8a3e"/>
      <path d="M155,155 Q200,118 245,155" fill="#1e8a3e"/>
      <polyline points="60,145 95,120 135,127 175,100 215,80 260,62 305,45 350,30" fill="none" stroke="#1e8a3e" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="350" cy="30" r="7" fill="#3fc466"/>
      <line x1="58" y1="28" x2="58" y2="150" stroke="#1c1f1d" strokeWidth="1.5" opacity=".25"/>
      <line x1="58" y1="150" x2="365" y2="150" stroke="#1c1f1d" strokeWidth="1.5" opacity=".25"/>
    </svg>
  );
}
