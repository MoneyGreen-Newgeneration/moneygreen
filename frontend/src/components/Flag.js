const FLAGS = {
  fr: (
    <svg viewBox="0 0 3 2" width="20" height="14">
      <rect width="1" height="2" fill="#002395"/>
      <rect x="1" width="1" height="2" fill="#fff"/>
      <rect x="2" width="1" height="2" fill="#ED2939"/>
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 30" width="20" height="14">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="2"/>
      <path d="M30,0 30,30 M0,15 60,15" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 30,30 M0,15 60,15" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  ),
  es: (
    <svg viewBox="0 0 3 2" width="20" height="14">
      <rect width="3" height="2" fill="#AA151B"/>
      <rect y="0.5" width="3" height="1" fill="#F1BF00"/>
    </svg>
  ),
  pt: (
    <svg viewBox="0 0 3 2" width="20" height="14">
      <rect width="1.2" height="2" fill="#006600"/>
      <rect x="1.2" width="1.8" height="2" fill="#FF0000"/>
    </svg>
  ),
  de: (
    <svg viewBox="0 0 3 2" width="20" height="14">
      <rect width="3" height="0.667" fill="#000"/>
      <rect y="0.667" width="3" height="0.667" fill="#DD0000"/>
      <rect y="1.333" width="3" height="0.667" fill="#FFCE00"/>
    </svg>
  ),
  ar: (
    <svg viewBox="0 0 3 2" width="20" height="14">
      <rect width="3" height="2" fill="#006C35"/>
      <text x="1.5" y="1.1" fontSize="0.4" fill="#fff" textAnchor="middle">السعودية</text>
    </svg>
  ),
  zh: (
    <svg viewBox="0 0 30 20" width="20" height="14">
      <rect width="30" height="20" fill="#DE2910"/>
      <polygon points="5,3 6,6 9,6 6.5,7.5 7.5,10.5 5,8.5 2.5,10.5 3.5,7.5 1,6 4,6" fill="#FFDE00"/>
    </svg>
  ),
};

export default function Flag({ code }) {
  return FLAGS[code] || null;
}
