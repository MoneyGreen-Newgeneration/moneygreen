export default function MoneyGreenMark({ size = 36, bg = "#1E8A3E", fg = "#FFFFFF" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="100" height="100" rx="14" fill={bg} />
      {/* Billet */}
      <rect x="34" y="22" width="38" height="30" rx="3" fill={fg} />
      <text
        x="53"
        y="44"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill={bg}
      >
        $
      </text>
      {/* Main stylisée */}
      <path
        d="M16 64 C 26 56, 40 56, 50 60 L 66 60 C 71 60, 71 67, 66 67 L 52 67
           C 60 69, 70 68, 78 63 C 84 60, 88 62, 84 67
           C 76 78, 60 84, 46 84 C 32 84, 22 76, 16 64 Z"
        fill={fg}
      />
    </svg>
  );
}
