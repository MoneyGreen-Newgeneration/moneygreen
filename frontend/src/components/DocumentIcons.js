function IconBase({ children, size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconIdCard({ size }) {
  return (
    <IconBase size={size}>
      <rect x="4" y="12" width="40" height="26" rx="4" stroke="#1e8a3e" strokeWidth="2.2" />
      <circle cx="15" cy="23" r="4" stroke="#1e8a3e" strokeWidth="2.2" />
      <path d="M9 32c1.5-3 4.5-4.5 6-4.5s4.5 1.5 6 4.5" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="27" y1="20" x2="39" y2="20" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="27" y1="26" x2="39" y2="26" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="27" y1="32" x2="34" y2="32" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconPayslip({ size }) {
  return (
    <IconBase size={size}>
      <rect x="10" y="5" width="28" height="38" rx="3" stroke="#1e8a3e" strokeWidth="2.2" />
      <line x1="16" y1="14" x2="32" y2="14" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="20" x2="32" y2="20" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="16" y1="26" x2="26" y2="26" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="35" r="4.5" stroke="#3fc466" strokeWidth="2.2" />
      <line x1="22.5" y1="35" x2="25.5" y2="35" stroke="#3fc466" strokeWidth="1.8" />
    </IconBase>
  );
}

export function IconBankStatement({ size }) {
  return (
    <IconBase size={size}>
      <rect x="6" y="9" width="36" height="30" rx="3" stroke="#1e8a3e" strokeWidth="2.2" />
      <path d="M6 17h36" stroke="#1e8a3e" strokeWidth="2.2" />
      <line x1="12" y1="24" x2="22" y2="24" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="12" y1="30" x2="26" y2="30" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 28l4 4 6-7" stroke="#3fc466" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  );
}

export function IconResidenceProof({ size }) {
  return (
    <IconBase size={size}>
      <path d="M6 22 24 8l18 14" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 19v20h26V19" stroke="#1e8a3e" strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="20" y="29" width="8" height="10" stroke="#3fc466" strokeWidth="2" />
    </IconBase>
  );
}

export function IconVehicleQuote({ size }) {
  return (
    <IconBase size={size}>
      <path
        d="M7 29l3-9c.6-1.8 2.3-3 4.2-3h19.6c1.9 0 3.6 1.2 4.2 3l3 9"
        stroke="#1e8a3e"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5" y="29" width="38" height="8" rx="3" stroke="#1e8a3e" strokeWidth="2.2" />
      <circle cx="14" cy="37" r="2.6" fill="#1e8a3e" />
      <circle cx="34" cy="37" r="2.6" fill="#1e8a3e" />
      <line x1="13" y1="24" x2="35" y2="24" stroke="#3fc466" strokeWidth="2" />
    </IconBase>
  );
}

export function IconPropertyTitle({ size }) {
  return (
    <IconBase size={size}>
      <rect x="8" y="6" width="32" height="36" rx="3" stroke="#1e8a3e" strokeWidth="2.2" />
      <path d="M14 16h20" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 22h20" stroke="#1e8a3e" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="32" r="5.5" stroke="#3fc466" strokeWidth="2.2" />
      <path d="M24 29.5v5l3 2" stroke="#3fc466" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconSchoolAdmission({ size }) {
  return (
    <IconBase size={size}>
      <path
        d="M24 10 4 18l20 8 20-8-20-8Z"
        stroke="#1e8a3e"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M12 22v10c0 3 5.4 6 12 6s12-3 12-6V22" stroke="#1e8a3e" strokeWidth="2.2" />
      <line x1="40" y1="18" x2="40" y2="30" stroke="#3fc466" strokeWidth="2.2" strokeLinecap="round" />
    </IconBase>
  );
}

export function IconBusinessPlan({ size }) {
  return (
    <IconBase size={size}>
      <rect x="8" y="6" width="32" height="36" rx="3" stroke="#1e8a3e" strokeWidth="2.2" />
      <path d="M15 32V24" stroke="#1e8a3e" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 32V19" stroke="#1e8a3e" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M29 32V27" stroke="#3fc466" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M14 17h12" stroke="#1e8a3e" strokeWidth="2" strokeLinecap="round" />
    </IconBase>
  );
}
