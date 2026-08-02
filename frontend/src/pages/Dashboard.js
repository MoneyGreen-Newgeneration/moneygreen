import { useState, useEffect, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import {
  fetchBalance, fetchSummary, fetchTransactions,
  fetchUserLoans,
} from "../api/dashboard";
import MoneyGreenMark from "../components/MoneyGreenMark";
import DarkModeToggle from "../components/DarkModeToggle";
import LangSelector from "../components/LangSelector";
import ChatWidget from "../components/chat/ChatWidget";
import LoanRequestButton from "../components/LoanRequestButton";
import { SOCKET_URL } from "../config";
import "./Dashboard.css";

const CATEGORY_COLORS = ["#1e8a3e","#3fc466","#15602b","#7bd9a0","#0d3d1d","#a8e8bd"];

function formatFCFA(value) {
  return `${Math.round(value || 0).toLocaleString("fr-FR")} FCFA`;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const [balance, setBalance] = useState({ income: 0, expense: 0, balance: 0 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = user?.id;

  const loadData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const [balanceData, summaryData, transactionsData, loansData] = await Promise.all([
        fetchBalance(userId), fetchSummary(userId),
        fetchTransactions(userId), fetchUserLoans(userId),
      ]);
      setBalance(balanceData);
      setSummary(summaryData);
      setTransactions(transactionsData);
      setLoans(loansData);
    } catch (err) {
      setError("Impossible de charger vos donnÃƒÆ’Ã‚Â©es pour le moment.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("token");
    // Le serveur exige un JWT valide (io.use middleware) : sans lui, la
    // connexion est rejetÃƒÆ’Ã‚Â©e et les mises ÃƒÆ’Ã‚Â  jour temps rÃƒÆ’Ã‚Â©el des prÃƒÆ’Ã‚Âªts
    // n'arrivent jamais. Le userId est de toute faÃƒÆ’Ã‚Â§on dÃƒÆ’Ã‚Â©rivÃƒÆ’Ã‚Â© du token
    // cÃƒÆ’Ã‚Â´tÃƒÆ’Ã‚Â© serveur (socket.user.id), donc pas besoin de le passer ÃƒÆ’Ã‚Â  "join".
    const dashSocket = io(SOCKET_URL, { auth: { token } });
    dashSocket.emit("join");

    dashSocket.on("loan_updated", (loan) => {
      setLoans(prev => prev.map(l => l._id === loan._id ? loan : l));
    });

    return () => dashSocket.disconnect();
  }, [userId]);

  const pieData = useMemo(
    () => Object.entries(summary).map(([category, total]) => ({ name: category, value: total })),
    [summary]
  );

  const barData = useMemo(() => [
    { name: t("dash_income"), montant: balance.income },
    { name: t("dash_expense"), montant: balance.expense },
  ], [balance, t]);

  const handleLogout = () => { logout(); window.location.href = "/"; };

  const loanLabel = { auto: "Automobile", immobilier: "Immobilier", scolaire: "Scolaire", personnel: "Personnel" };

  const loanStatusLabel = (status) => {
    if (status === "approved") return t("dash_status_approved");
    if (status === "rejected") return t("dash_status_rejected");
    if (status === "payment_required") return t("dash_status_payment");
    if (status === "payment_done") return t("dash_status_paid");
    return t("dash_status_pending");
  };

  const loanStatusClass = (status) => {
    if (status === "approved") return "status-approved";
    if (status === "rejected") return "status-rejected";
    if (status === "payment_required") return "status-payment";
    if (status === "payment_done") return "status-paid";
    return "status-pending";
  };

  return (
    <div className="dash">
      <Link to="/" className="dash-home-fab" aria-label="Retour à l'accueil">
  ÃƒÂ¢Ã¢â‚¬Â Ã‚Â
      </Link>
      <header className="dash-header">
        <div className="dash-container dash-navbar">
          <Link to="/" className="dash-logo">
            <MoneyGreenMark size={30} />
            <span>Money<strong>Green</strong></span>
          </Link>
          <div className="dash-user">
            <span>{t("dash_greeting")}, {user?.username}</span>
            <LangSelector />
            <DarkModeToggle />
            <button onClick={handleLogout} className="dash-btn-ghost">{t("nav_logout")}</button>
          </div>
          <span className="dash-username-mobile">{user?.username}</span>
          <button
            type="button"
            className={`dash-burger ${menuOpen ? "is-open" : ""}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`dash-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <LangSelector />
          <DarkModeToggle />
          <button onClick={handleLogout} className="dash-btn-ghost">{t("nav_logout")}</button>
        </div>
      </header>

      <div className="dash-body">
      <main className="dash-container dash-main">
        {error && <p className="dash-alert">{error}</p>}

        <section className="dash-balance-grid">
          <div className="dash-card dash-card-balance">
            <span className="dash-card-label">{t("dash_balance")}</span>
            <span className="dash-card-value">{loading ? "..." : formatFCFA(balance.balance)}</span>
          </div>
          <div className="dash-card">
            <span className="dash-card-label">{t("dash_income")}</span>
            <span className="dash-card-value dash-value-income">{loading ? "..." : formatFCFA(balance.income)}</span>
          </div>
          <div className="dash-card">
            <span className="dash-card-label">{t("dash_expense")}</span>
            <span className="dash-card-value dash-value-expense">{loading ? "..." : formatFCFA(balance.expense)}</span>
          </div>
        </section>

        <section className="dash-charts-grid">
          <div className="dash-card dash-chart-card">
            <h3>{t("dash_chart_pie")}</h3>
            {pieData.length === 0 ? (
              <p className="dash-empty">{t("dash_no_tx_yet")}</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name }) => name}>
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatFCFA(value)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="dash-card dash-chart-card">
            <h3>{t("dash_chart_bar")}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e8e6" />
                <XAxis dataKey="name" stroke="#1a1d1b" />
                <YAxis stroke="#1a1d1b" />
                <Tooltip formatter={(value) => formatFCFA(value)} />
                <Bar dataKey="montant" radius={[6, 6, 0, 0]}>
                  <Cell fill="#1e8a3e" />
                  <Cell fill="#1c1f1d" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {loans.length > 0 && (
          <section className="dash-card dash-loans-section">
            <h3>{t("dash_my_loans")}</h3>
            <ul className="dash-loans-list">
              {loans.map((loan) => (
                <li key={loan._id} className="dash-loan-item">
                  <div className="dash-loan-info">
                    <span className="dash-loan-type">{loanLabel[loan.type] || loan.type}</span>
                    <span className="dash-loan-amount">
                      {Number(loan.amount).toLocaleString("fr-FR")} FCFA - {loan.durationMonths} mois
                    </span>
                  </div>
                  <div className="dash-loan-right">
                    <span className={`dash-loan-status ${loanStatusClass(loan.status)}`}>
                      {loanStatusLabel(loan.status)}
                    </span>
                    {loan.status === "payment_required" && (
                      <Link to="/paiement-infos" className="dash-pay-notif">
                        {t("dash_payment_link")}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}


        <section className="dash-card dash-tx-section">
          <h3>{t("dash_tx_recent")}</h3>
          {transactions.length === 0 ? (
            <p className="dash-empty">{t("dash_no_tx")}</p>
          ) : (
            <ul className="dash-tx-list">
              {transactions.slice(0, 10).map((tx) => (
                <li key={tx._id} className="dash-tx-item">
                  <span className="dash-tx-cat">{t("cat_" + tx.category)}</span>
                  <span className="dash-tx-desc">{tx.description || "-"}</span>
                  <span className={`dash-tx-amount ${tx.type === "income" ? "dash-value-income" : "dash-value-expense"}`}>
                    {tx.type === "income" ? "+" : "-"}{formatFCFA(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      </div>
      <LoanRequestButton />
      <ChatWidget />
    </div>
  );
}
