import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";
import {
  fetchStats,
  fetchAllUsers,
  fetchAllLoans,
  fetchAllTransactions,
  updateLoanStatus,
  toggleAdmin,
  createTransactionAdmin,
  requestLoanPayment,
  confirmLoanPayment,
  fetchPaymentInfo,
  updatePaymentInfo,
} from "../../api/admin";
import MoneyGreenMark from "../../components/MoneyGreenMark";
import DarkModeToggle from "../../components/DarkModeToggle";
import AdminChat from "../../components/chat/AdminChat";
import TeamChat from "../../components/chat/TeamChat";
import LangSelector from "../../components/LangSelector";
import { useLang } from "../../context/LangContext";
import { API_URL, SOCKET_URL } from "../../config";
import "./Admin.css";

let adminSocket;

export default function Admin() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("loans");
  const [teamMessages, setTeamMessages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [expandedLoanId, setExpandedLoanId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({ mtnNumber: "", mtnName: "", orangeNumber: "", orangeName: "", accountNumber: "", accountName: "", montant: 10000 });
  const [paymentMsg, setPaymentMsg] = useState("");

  // --- CHAT (centralisé ici pour que le badge reste à jour même hors de l'onglet Chat) ---
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const selectedUserIdRef = useRef(null);
  useEffect(() => { selectedUserIdRef.current = selectedUserId; }, [selectedUserId]);
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineMap, setOnlineMap] = useState({});

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    adminSocket = io(SOCKET_URL, { auth: { token } });
    adminSocket.emit("join_admin");

    fetch(`${API_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setConversations(Array.isArray(data) ? data : []));

    // Etat de presence des clients : liste initiale envoyee juste apres join_admin,
    // puis mises a jour en temps reel a chaque connexion/deconnexion.
    adminSocket.on("online_users", (userIds) => {
      setOnlineMap(prev => {
        const next = { ...prev };
        userIds.forEach(uid => { next[uid] = { online: true, lastSeen: next[uid]?.lastSeen }; });
        return next;
      });
    });

    adminSocket.on("user_status", ({ userId, online, lastSeen }) => {
      setOnlineMap(prev => ({ ...prev, [userId]: { online, lastSeen: lastSeen || prev[userId]?.lastSeen } }));
    });

    adminSocket.on("new_message", (msg) => {
      const uid = msg.userId?._id?.toString() || msg.userId?.toString();
      setChatMessages(prev => (uid === selectedUserIdRef.current ? [...prev, msg] : prev));
      setConversations(prev => {
        const exists = prev.find(c => c.userId === uid);
        if (exists) {
          return prev.map(c => c.userId === uid
            ? { ...c, lastMessage: msg.text, lastAt: msg.createdAt, unread: msg.sender === "client" ? c.unread + 1 : c.unread }
            : c);
        }
        return prev;
      });
    });

    adminSocket.on("messages_read", ({ userId, reader }) => {
      if (reader === "admin") {
        setConversations(prev => prev.map(c => c.userId === userId ? { ...c, unread: 0 } : c));
      }
    });

    adminSocket.on("loan_created", (loan) => {
      setLoans(prev => [loan, ...prev]);
    });

    adminSocket.on("loan_updated", (loan) => {
      setLoans(prev => prev.map(l => l._id === loan._id ? loan : l));
    });

    adminSocket.on("new_team_message", (msg) => {
      setTeamMessages(prev => [...prev, msg]);
    });

    return () => adminSocket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, usersData, loansData, txData, paymentData] = await Promise.all([
        fetchStats(),
        fetchAllUsers(),
        fetchAllLoans(),
        fetchAllTransactions(),
        fetchPaymentInfo(),
      ]);
      setStats(statsData);
      setPaymentInfo(paymentData);
      setUsers(usersData);
      setLoans(loansData);
      setTransactions(txData);
    } catch {
      setError(t("adm_load_error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const buildWhatsAppLink = (u) => {
    if (!u.phoneNumber) return null;
    const digits = u.phoneNumber.replace(/[^\d]/g, "");
    const message = encodeURIComponent(
      `Bonjour ${u.username}, c'est la reception administrative MoneyGreen ! Nous vous attendons sur la plateforme pour un entretien. https://moneygreeny.vercel.app`
    );
    return `https://wa.me/${digits}?text=${message}`;
  };

  // Message pre-rempli adapte au statut actuel du dossier, pour relancer le
  // client sur WhatsApp en un clic plutot que de retaper le message a la main.
  const loanWhatsAppMessages = {
    pending: (loan, type) => `Bonjour ${loan.fullName}, nous avons bien recu votre demande de pret ${type}. Nous revenons vers vous sous 24 a 48h.`,
    payment_required: (loan, type) => `Bonjour ${loan.fullName}, votre dossier de pret ${type} avance : des frais d'enrolement sont requis pour continuer le traitement. Connectez-vous a votre espace MoneyGreen pour voir les modalites de paiement.`,
    payment_done: (loan, type) => `Bonjour ${loan.fullName}, nous confirmons la reception de votre paiement pour votre pret ${type}. Votre dossier est en cours de validation finale.`,
    approved: (loan, type) => `Bonjour ${loan.fullName}, bonne nouvelle : votre demande de pret ${type} a ete approuvee ! Notre equipe va vous contacter pour la suite.`,
    rejected: (loan, type) => `Bonjour ${loan.fullName}, nous sommes au regret de vous informer que votre demande de pret ${type} n'a pas ete approuvee a ce stade.`,
  };

  const buildLoanWhatsAppLink = (loan) => {
    if (!loan.phoneNumber) return null;
    const digits = loan.phoneNumber.replace(/[^\d]/g, "");
    const type = typeLabel[loan.type] || loan.type;
    const builder = loanWhatsAppMessages[loan.status] || loanWhatsAppMessages.pending;
    return `https://wa.me/${digits}?text=${encodeURIComponent(builder(loan, type))}`;
  };

  const handleToggleAdmin = async (id) => {
    setUpdating(id);
    try {
      await toggleAdmin(id);
      await loadAll();
    } catch {
      setError(t("adm_update_error"));
    } finally {
      setUpdating(null);
    }
  };

  const handleStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateLoanStatus(id, status);
      await loadAll();
    } catch {
      setError(t("adm_update_error"));
    } finally {
      setUpdating(null);
    }
  };

  const [txForm, setTxForm] = useState({ userId: "", type: "expense", amount: "", category: "general", description: "" });
  const [txError, setTxError] = useState("");
  const [txSuccess, setTxSuccess] = useState("");
  const [txSubmitting, setTxSubmitting] = useState(false);

  const handleTxSubmit = async () => {
    setTxError("");
    setTxSuccess("");
    if (!txForm.userId || !txForm.amount || Number(txForm.amount) <= 0) {
      setTxError(t("adm_tx_select_valid"));
      return;
    }
    setTxSubmitting(true);
    try {
      await createTransactionAdmin({
        userId: txForm.userId,
        type: txForm.type,
        amount: Number(txForm.amount),
        category: txForm.category,
        description: txForm.description,
      });
      setTxSuccess(t("adm_tx_added"));
      setTxForm({ userId: "", type: "expense", amount: "", category: "general", description: "" });
      await loadAll();
    } catch {
      setTxError(t("adm_tx_add_error"));
    } finally {
      setTxSubmitting(false);
    }
  };

  const handleRequestPayment = async (id) => {
    setUpdating(id);
    try {
      await requestLoanPayment(id);
      await loadAll();
    } catch {
      setError(t("adm_payment_req_error"));
    } finally {
      setUpdating(null);
    }
  };

  const handleConfirmPayment = async (id) => {
    setUpdating(id);
    try {
      await confirmLoanPayment(id);
      await loadAll();
    } catch {
      setError(t("adm_payment_confirm_error"));
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdatePaymentInfo = async () => {
    try {
      const updated = await updatePaymentInfo(paymentInfo);
      setPaymentInfo(updated.value);
      setPaymentMsg(t("adm_payment_updated"));
      setTimeout(() => setPaymentMsg(""), 3000);
    } catch {
      setError(t("adm_payment_update_error"));
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const statusLabel = {
    pending: t("adm_status_pending"),
    payment_required: t("adm_status_payment_required"),
    payment_done: t("adm_status_payment_done"),
    approved: t("adm_status_approved"),
    rejected: t("adm_status_rejected"),
  };
  const statusClass = { pending: "pill-pending", payment_required: "pill-payment", payment_done: "pill-payment-done", approved: "pill-approved", rejected: "pill-rejected" };
  const typeLabel = {
    auto: t("prod_auto_label"),
    immobilier: t("prod_immo_label"),
    scolaire: t("prod_sco_label"),
    personnel: t("prod_per_label"),
  };

  const loanCounts = {
    total: loans.length,
    pending: loans.filter(l => l.status === "pending").length,
    approved: loans.filter(l => l.status === "approved").length,
    rejected: loans.filter(l => l.status === "rejected").length,
  };

  const tabs = [
    { key: "loans", label: t("adm_tab_loans") },
    { key: "users", label: t("adm_tab_users") },
    { key: "transactions", label: t("adm_tab_tx") },
    { key: "addtx", label: "➕ " + t("adm_tab_addtx") },
    { key: "payment", label: "💳 " + t("adm_tab_payment") },
    { key: "chat", label: "💬 " + t("adm_tab_chat") },
    { key: "team", label: "👥 Equipe" },
  ];

  return (
    <div className="adm">
      <header className="adm-header">
        <div className="adm-container adm-navbar">
          <Link to="/" className="adm-logo">
            <MoneyGreenMark size={28} />
            <span>Money<strong>Green</strong></span>
            <span className="adm-badge">Admin</span>
          </Link>
          <div className="adm-user">
            <LangSelector />
            <DarkModeToggle />
            <span>{user?.username}</span>
            <button onClick={handleLogout} className="adm-btn-ghost">{t("nav_logout")}</button>
          </div>
          <span className="adm-username-mobile">{user?.username}</span>
          <button
            type="button"
            className={`adm-burger ${menuOpen ? "is-open" : ""}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span /><span /><span />
          </button>
        </div>
        <div className={`adm-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <LangSelector />
          <DarkModeToggle />
          <span className="adm-mobile-username">{user?.username}</span>
          <button onClick={handleLogout} className="adm-btn-ghost">{t("nav_logout")}</button>
        </div>
      </header>

      <main className="adm-container adm-main">
        {error && <p className="adm-alert">{error}</p>}

        {/* STATS */}
        <div className="adm-stats">
          {[
            { label: t("adm_stat_users"), value: stats?.totalUsers ?? "…" },
            { label: t("adm_stat_loans"), value: loanCounts.total, accent: true },
            { label: t("adm_stat_approved"), value: loanCounts.approved, green: true },
            { label: t("adm_stat_pending"), value: loanCounts.pending, amber: true },
            { label: t("adm_stat_rejected"), value: loanCounts.rejected, red: true },
            { label: t("adm_stat_tx"), value: stats?.totalTransactions ?? "…" },
          ].map((s) => (
            <div key={s.label} className="adm-stat">
              <span className="adm-stat-label">{s.label}</span>
              <span className={`adm-stat-value ${s.green ? "green" : s.amber ? "amber" : s.red ? "red" : ""}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>

        {/* ONGLETS */}
        <div className="adm-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`adm-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.key === "chat" && totalUnread > 0 && (
                <span className="adm-tab-badge">{totalUnread > 9 ? "9+" : totalUnread}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="adm-loading">{t("adm_loading")}</p>
        ) : (
          <>
            {/* TABLEAU PRETS */}
            {activeTab === "loans" && (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>{t("adm_th_client")}</th>
                      <th>{t("adm_th_type")}</th>
                      <th>{t("adm_th_amount")}</th>
                      <th>{t("adm_th_duration")}</th>
                      <th>{t("adm_th_status")}</th>
                      <th>{t("adm_th_actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.length === 0 ? (
                      <tr><td colSpan="6" className="adm-empty">{t("adm_no_request")}</td></tr>
                    ) : loans.map((loan) => (
                      <Fragment key={loan._id}>
                      <tr>
                        <td>
                          <span className="adm-name">{loan.userId?.username || loan.fullName}</span>
                          <span className="adm-sub">{loan.userId?.email || loan.email}</span>
                        </td>
                        <td>{typeLabel[loan.type] || loan.type}</td>
                        <td>{Number(loan.amount).toLocaleString("fr-FR")} FCFA</td>
                        <td>{loan.durationMonths} {t("home_sim_duration")}</td>
                        <td>
                          <span className={`adm-pill ${statusClass[loan.status]}`}>
                            {statusLabel[loan.status]}
                          </span>
                        </td>
                        <td>
                          <div className="adm-actions">
                            {loan.status === "pending" && (
                              <button
                                className="adm-btn-payment"
                                disabled={updating === loan._id}
                                onClick={() => handleRequestPayment(loan._id)}
                              >
                                {t("adm_btn_ask_fee")}
                              </button>
                            )}
                            {loan.status === "payment_required" && (
                              <button
                                className="adm-btn-approve"
                                disabled={updating === loan._id}
                                onClick={() => handleConfirmPayment(loan._id)}
                              >
                                {t("adm_btn_payment_received")}
                              </button>
                            )}
                            {loan.status === "payment_done" && (
                              <button
                                className="adm-btn-approve"
                                disabled={updating === loan._id}
                                onClick={() => handleStatus(loan._id, "approved")}
                              >
                                {t("adm_btn_approve")}
                              </button>
                            )}
                            {(loan.status === "payment_done" || loan.status === "payment_required") && (
                              <button
                                className="adm-btn-reject"
                                disabled={updating === loan._id}
                                onClick={() => handleStatus(loan._id, "rejected")}
                              >
                                {t("adm_btn_reject")}
                              </button>
                            )}
                            {buildLoanWhatsAppLink(loan) ? (
                              <a
                                href={buildLoanWhatsAppLink(loan)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="adm-btn-whatsapp"
                              >
                                {t("adm_btn_whatsapp")}
                              </a>
                            ) : (
                              <button className="adm-btn-whatsapp" disabled title="Aucun numero WhatsApp">
                                {t("adm_btn_whatsapp")}
                              </button>
                            )}
                            <button
                              className="adm-btn-details"
                              onClick={() => setExpandedLoanId((id) => (id === loan._id ? null : loan._id))}
                            >
                              {expandedLoanId === loan._id ? t("adm_btn_hide_details") : t("adm_btn_details")}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedLoanId === loan._id && (
                        <tr className="adm-details-row">
                          <td colSpan="6">
                            <div className="adm-loan-details">
                              <div className="adm-loan-details-grid">
                                <div><span className="adm-details-label">{t("adm_th_phone")}</span><span>{loan.phoneNumber || "—"}</span></div>
                                <div><span className="adm-details-label">{t("adm_th_email")}</span><span>{loan.email || "—"}</span></div>
                                <div><span className="adm-details-label">{t("loan_country")}</span><span>{loan.country || "—"}</span></div>
                                <div><span className="adm-details-label">{t("loan_city")}</span><span>{loan.city || "—"}</span></div>
                                <div><span className="adm-details-label">{t("loan_neighborhood")}</span><span>{loan.neighborhood || "—"}</span></div>
                                <div><span className="adm-details-label">{t("loan_profession")}</span><span>{loan.profession || "—"}</span></div>
                              </div>
                              <div className="adm-loan-documents">
                                <span className="adm-details-label">{t("adm_th_documents")}</span>
                                {loan.documents?.length > 0 ? (
                                  <div className="adm-loan-documents-list">
                                    {loan.documents.map((doc, idx) => (
                                      <a key={idx} href={doc.url} target="_blank" rel="noopener noreferrer" className="adm-doc-link">
                                        {doc.label}
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="adm-sub">{t("adm_no_documents")}</span>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLEAU UTILISATEURS */}
            {activeTab === "users" && (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>{t("adm_th_name")}</th>
                      <th>{t("adm_th_email")}</th>
                      <th>{t("adm_th_phone")}</th>
                      <th>{t("adm_th_admin")}</th>
                      <th>{t("adm_th_registered")}</th>
                      <th>{t("adm_th_actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan="5" className="adm-empty">{t("adm_no_user")}</td></tr>
                    ) : users.map((u) => (
                      <tr key={u._id}>
                        <td><span className="adm-name">{u.username}</span></td>
                        <td>{u.email}</td>
                        <td>{u.phoneNumber || "—"}</td>
                        <td>
                          <span className={`adm-pill ${u.isAdmin ? "pill-approved" : "pill-pending"}`}>
                            {u.isAdmin ? t("adm_yes") : t("adm_no")}
                          </span>
                        </td>
                        <td className="adm-sub">
                          {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                        </td>
                        <td>
                          <button
                            className={u.isAdmin ? "adm-btn-reject" : "adm-btn-approve"}
                            disabled={updating === u._id || u._id === user?._id || u._id === user?.id}
                            onClick={() => handleToggleAdmin(u._id)}
                          >
                            {u.isAdmin ? t("adm_btn_remove_admin") : t("adm_btn_promote_admin")}
                          </button>
                          {buildWhatsAppLink(u) ? (
                            <a
                              href={buildWhatsAppLink(u)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="adm-btn-whatsapp"
                            >
                              {t("adm_btn_whatsapp")}
                            </a>
                          ) : (
                            <button className="adm-btn-whatsapp" disabled title="Aucun numero WhatsApp">
                              {t("adm_btn_whatsapp")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLEAU TRANSACTIONS */}
            {activeTab === "transactions" && (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>{t("adm_th_user")}</th>
                      <th>{t("adm_th_type")}</th>
                      <th>{t("adm_th_amount")}</th>
                      <th>{t("adm_th_category")}</th>
                      <th>{t("adm_th_description")}</th>
                      <th>{t("adm_th_date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr><td colSpan="6" className="adm-empty">{t("adm_no_tx")}</td></tr>
                    ) : transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td className="adm-sub">{tx.userId}</td>
                        <td>
                          <span className={`adm-pill ${tx.type === "income" ? "pill-approved" : "pill-rejected"}`}>
                            {tx.type === "income" ? t("dash_income_label") : t("dash_expense_label")}
                          </span>
                        </td>
                        <td>{Number(tx.amount).toLocaleString("fr-FR")} FCFA</td>
                        <td>{t("cat_" + tx.category)}</td>
                        <td>{tx.description || "—"}</td>
                        <td className="adm-sub">
                          {new Date(tx.date).toLocaleDateString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* CHAT */}
            {activeTab === "chat" && (
              <AdminChat
                users={users}
                conversations={conversations}
                socket={adminSocket}
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
                messages={chatMessages}
                setMessages={setChatMessages}
                onlineMap={onlineMap}
              />
            )}

            {activeTab === "team" && (
              <TeamChat
                socket={adminSocket}
                messages={teamMessages}
                setMessages={setTeamMessages}
              />
            )}

            {/* PAIEMENT */}
            {activeTab === "payment" && (
              <div className="dash-card adm-tx-form">
                <h3>{t("adm_payment_title")}</h3>
                <p style={{fontSize:".85rem",color:"rgba(26,29,27,.55)",marginBottom:"1.2rem"}}>
                  {t("adm_payment_desc")}
                </p>
                {paymentMsg && <p className="adm-success">{paymentMsg}</p>}

                <div className="adm-form-grid">
                  <label className="adm-field">
                    <span>{t("adm_payment_amount")}</span>
                    <input type="number" min="0" value={paymentInfo.montant} onChange={e => setPaymentInfo(p => ({...p, montant: e.target.value}))} />
                  </label>

                  <label className="adm-field">
                    <span>{t("adm_mtn_number")}</span>
                    <input type="text" placeholder="6XXXXXXXX" value={paymentInfo.mtnNumber} onChange={e => setPaymentInfo(p => ({...p, mtnNumber: e.target.value}))} />
                  </label>
                  <label className="adm-field">
                    <span>{t("adm_mtn_name")}</span>
                    <input type="text" placeholder="JEAN DUPONT" value={paymentInfo.mtnName} onChange={e => setPaymentInfo(p => ({...p, mtnName: e.target.value}))} />
                  </label>

                  <label className="adm-field">
                    <span>{t("adm_orange_number")}</span>
                    <input type="text" placeholder="6XXXXXXXX" value={paymentInfo.orangeNumber} onChange={e => setPaymentInfo(p => ({...p, orangeNumber: e.target.value}))} />
                  </label>
                  <label className="adm-field">
                    <span>{t("adm_orange_name")}</span>
                    <input type="text" placeholder="JEAN DUPONT" value={paymentInfo.orangeName} onChange={e => setPaymentInfo(p => ({...p, orangeName: e.target.value}))} />
                  </label>

                  <label className="adm-field">
                    <span>{t("adm_account_number")}</span>
                    <input type="text" placeholder="00000000000" value={paymentInfo.accountNumber} onChange={e => setPaymentInfo(p => ({...p, accountNumber: e.target.value}))} />
                  </label>
                  <label className="adm-field">
                    <span>{t("adm_account_name")}</span>
                    <input type="text" placeholder="MONEYGREEN SARL" value={paymentInfo.accountName} onChange={e => setPaymentInfo(p => ({...p, accountName: e.target.value}))} />
                  </label>
                </div>

                <button className="adm-btn-approve" style={{marginTop:"1.2rem",padding:"0.6rem 1.5rem",fontSize:"0.95rem"}} onClick={handleUpdatePaymentInfo}>
                  {t("adm_save_info")}
                </button>
              </div>
            )}

            {activeTab === "addtx" && (
              <div className="dash-card adm-tx-form">
                <h3>{t("adm_addtx_title")}</h3>
                {txError && <p className="adm-alert">{txError}</p>}
                {txSuccess && <p className="adm-success">{txSuccess}</p>}
                <div className="adm-form-grid">
                  <label className="adm-field">
                    <span>{t("adm_select_user_label")}</span>
                    <select value={txForm.userId} onChange={e => setTxForm(p => ({...p, userId: e.target.value}))}>
                      <option value="">{t("adm_select_user")}</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.username} ({u.email})</option>
                      ))}
                    </select>
                  </label>
                  <label className="adm-field">
                    <span>{t("dash_type")}</span>
                    <select value={txForm.type} onChange={e => setTxForm(p => ({...p, type: e.target.value}))}>
                      <option value="expense">{t("adm_type_expense")}</option>
                      <option value="income">{t("adm_type_income")}</option>
                    </select>
                  </label>
                  <label className="adm-field">
                    <span>{t("dash_amount")}</span>
                    <input type="number" min="0" value={txForm.amount} onChange={e => setTxForm(p => ({...p, amount: e.target.value}))} />
                  </label>
                  <label className="adm-field">
                    <span>{t("dash_category")}</span>
                    <select value={txForm.category} onChange={e => setTxForm(p => ({...p, category: e.target.value}))}>
                      {["general","logement","transport","alimentation","sante","education","loisirs","salaire","autre"].map(cat => (
                        <option key={cat} value={cat}>{t("cat_" + cat)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="adm-field" style={{gridColumn:"1/-1"}}>
                    <span>{t("dash_description")}</span>
                    <input type="text" value={txForm.description} onChange={e => setTxForm(p => ({...p, description: e.target.value}))} />
                  </label>
                </div>
                <button className="adm-btn-approve" style={{marginTop:"1rem",padding:"0.6rem 1.5rem",fontSize:"0.95rem"}} disabled={txSubmitting} onClick={handleTxSubmit}>
                  {txSubmitting ? t("adm_adding") : t("adm_add_tx_btn")}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}














