// Règles de taux par type de prêt et par palier de montant.
// Le taux indique est un taux ANNUEL, proratise mensuellement pour le
// calcul d'amortissement (taux mensuel = taux annuel / 12).
// La durée maximale est exprimée en mois et s'applique au palier
// correspondant au montant demande.

export const LOAN_RATES = {
  auto: [
    { min: 50000, max: 150000, rate: 55, maxDurationMonths: 4 },
    { min: 150000, max: 300000, rate: 50, maxDurationMonths: 12 },
    { min: 300000, max: 1000000, rate: 45, maxDurationMonths: 24 },
    { min: 1000000, max: 15000000, rate: 40, maxDurationMonths: 120 },
  ],
  immobilier: [
    { min: 10000000, max: 15000000, rate: 55, maxDurationMonths: 12 },
    { min: 15000000, max: 30000000, rate: 50, maxDurationMonths: 24 },
    { min: 30000000, max: 50000000, rate: 45, maxDurationMonths: 120 },
    { min: 50000000, max: 100000000, rate: 40, maxDurationMonths: 240 },
  ],
  scolaire: [
    { min: 100000, max: 500000, rate: 55, maxDurationMonths: 6 },
    { min: 500000, max: 1000000, rate: 50, maxDurationMonths: 12 },
    { min: 1000000, max: 2000000, rate: 45, maxDurationMonths: 24 },
    { min: 2000000, max: 5000000, rate: 40, maxDurationMonths: 48 },
  ],
  personnel: [
    { min: 100000, max: 500000, rate: 55, maxDurationMonths: 6 },
    { min: 500000, max: 1000000, rate: 50, maxDurationMonths: 12 },
    { min: 1000000, max: 2000000, rate: 45, maxDurationMonths: 24 },
    { min: 2000000, max: 5000000, rate: 40, maxDurationMonths: 48 },
  ],
};

// Retourne le palier applicable pour un type de prêt et un montant donnés.
export function getTierForAmount(type, amount) {
  const tiers = LOAN_RATES[type];
  if (!tiers || !amount || amount <= 0) return null;
  return tiers.find((tier) => amount >= tier.min && amount <= tier.max) || null;
}

// Retourne la plage de montant simulable pour un type de prêt (montant
// minimum du premier palier, montant maximum du dernier palier).
export function getRangeForType(type) {
  const tiers = LOAN_RATES[type];
  if (!tiers || tiers.length === 0) return null;
  return { min: tiers[0].min, max: tiers[tiers.length - 1].max };
}

// Calcul d'amortissement reel (annuite constante), a partir d'un taux
// annuel proratise en taux mensuel.
export function calculateMonthlyPayment(amount, annualRatePercent, durationMonths) {
  const monthlyRate = annualRatePercent / 100 / 12;
  if (monthlyRate === 0) return amount / durationMonths;
  const factor = Math.pow(1 + monthlyRate, durationMonths);
  return (amount * monthlyRate * factor) / (factor - 1);
}

// Simule un prêt : détermine le palier, vérifie la durée, calcule la
// mensualité. Retourne un statut explicite pour l'affichage côté UI.
export function simulateLoan(type, amount, durationMonths) {
  const tier = getTierForAmount(type, amount);

  if (!tier) {
    return { status: "out_of_range", range: getRangeForType(type) };
  }

  if (durationMonths > tier.maxDurationMonths) {
    return {
      status: "duration_exceeded",
      maxDurationMonths: tier.maxDurationMonths,
      appliedRate: tier.rate,
    };
  }

  const monthlyPayment = calculateMonthlyPayment(amount, tier.rate, durationMonths);
  const roundedMonthlyPayment = Math.round(monthlyPayment);
  const totalCost = roundedMonthlyPayment * durationMonths;
  const totalInterest = totalCost - amount;

  return {
    status: "ok",
    monthlyPayment: roundedMonthlyPayment,
    totalCost,
    totalInterest,
    appliedRate: tier.rate,
  };
}