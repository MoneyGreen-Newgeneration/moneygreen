import { useState } from "react";
import { simulateLoan, getRangeForType } from "../utils/loanRates";
import "./LoanSimulator.css";

// Simulateur de pret adapte au type (auto / immobilier / scolaire / personnel).
// Bloc independant : il ne modifie pas le formulaire de demande tant que
// l'utilisateur ne clique pas sur "Utiliser cette simulation".
export default function LoanSimulator({ type, onApply }) {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState(null);

  const handleSimulate = (e) => {
    e.preventDefault();
    const amountValue = Number(amount);
    const durationValue = Number(duration);
    if (!amountValue || !durationValue) return;
    setResult(simulateLoan(type, amountValue, durationValue));
  };

  const handleApply = () => {
    if (!result || result.status !== "ok" || !onApply) return;
    onApply({ amount: Number(amount), durationMonths: Number(duration) });
  };

  const range = getRangeForType(type);

  return (
    <section className="loan-simulator">
      <h3 className="loan-simulator-title">Simulez votre prêt</h3>
      {range && (
        <p className="loan-simulator-hint">
          Simulation disponible de {range.min.toLocaleString("fr-FR")} à{" "}
          {range.max.toLocaleString("fr-FR")} FCFA
        </p>
      )}

      <form className="loan-simulator-form" onSubmit={handleSimulate}>
        <label className="loan-simulator-field">
          <span>Montant souhaité (FCFA)</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label className="loan-simulator-field">
          <span>Durée souhaitée (mois)</span>
          <input
            type="number"
            min="1"
            step="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="loan-simulator-btn">Simuler</button>
      </form>

      {result && result.status === "ok" && (
        <div className="loan-simulator-result loan-simulator-result-ok">
          <div className="loan-simulator-result-info">
            <div>
              <span className="loan-simulator-result-label">Mensualité estimée</span>
              <span className="loan-simulator-result-value">
                {result.monthlyPayment.toLocaleString("fr-FR")} FCFA / mois
              </span>
            </div>
            <div className="loan-simulator-result-secondary">
              <span className="loan-simulator-result-label">Coût total du crédit (intérêts inclus)</span>
              <span className="loan-simulator-result-value-secondary">
                {result.totalCost.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
          </div>
          <button type="button" className="loan-simulator-apply-btn" onClick={handleApply}>
            Utiliser cette simulation
          </button>
        </div>
      )}

      {result && result.status === "duration_exceeded" && (
        <div className="loan-simulator-result loan-simulator-result-warning">
          Pour ce montant, la durée ne peut pas dépasser {result.maxDurationMonths} mois.
          Merci d'ajuster la durée souhaitée.
        </div>
      )}

      {result && result.status === "out_of_range" && (
        <div className="loan-simulator-result loan-simulator-result-warning">
          {result.range
            ? `Le montant simulable pour ce type de prêt doit être compris entre ${result.range.min.toLocaleString("fr-FR")} et ${result.range.max.toLocaleString("fr-FR")} FCFA.`
            : "Ce montant est en dehors des plafonds autorisés pour ce type de prêt."}
        </div>
      )}
    </section>
  );
}