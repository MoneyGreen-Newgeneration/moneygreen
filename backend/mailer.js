const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Meme origine que celle autorisee en CORS : c'est l'URL du frontend en prod
// comme en local, donc on la reutilise pour construire les liens dans les emails
// plutot que d'ajouter une variable d'environnement dediee.
const FRONTEND_URL = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",")[0].trim();

const LOAN_TYPE_LABELS = {
  auto: "Automobile",
  immobilier: "Immobilier",
  scolaire: "Scolaire",
  personnel: "Personnel",
};

const sendLoanNotification = async (loan) => {
  try {
    const User = require("./models/User");
    const admins = await User.find({ isAdmin: true }).select("email");
    if (!admins.length) return;

    const adminEmails = admins.map(a => a.email).join(",");

    await transporter.sendMail({
      from: `"MoneyGreen" <${process.env.EMAIL_FROM}>`,
      to: adminEmails,
      subject: "Nouvelle demande de prêt",
      html: `
        <h2>Nouvelle demande de prêt reçue</h2>
        <p><strong>Nom :</strong> ${loan.fullName}</p>
        <p><strong>Email :</strong> ${loan.email}</p>
        <p><strong>Téléphone :</strong> ${loan.phoneNumber}</p>
        <p><strong>Type :</strong> ${loan.type}</p>
        <p><strong>Montant :</strong> ${loan.amount} FCFA</p>
        <p><strong>Durée :</strong> ${loan.durationMonths} mois</p>
        <p><strong>Objet :</strong> ${loan.purpose || "Non précisé"}</p>
      `,
    });

    console.log("Email de notification envoyé aux admins");
  } catch (err) {
    console.error("Erreur envoi email:", err.message);
  }
};

// Accuse de reception envoye au client des la soumission de sa demande.
// Jusqu'ici seuls les admins etaient notifies par email ; le client n'avait
// aucune confirmation que sa demande etait bien partie.
const sendLoanReceivedEmail = async (loan) => {
  try {
    await transporter.sendMail({
      from: `"MoneyGreen" <${process.env.EMAIL_FROM}>`,
      to: loan.email,
      subject: "Votre demande de prêt a bien été reçue",
      html: `
        <h2>Bonjour ${loan.fullName},</h2>
        <p>Nous avons bien reçu votre demande de prêt <strong>${LOAN_TYPE_LABELS[loan.type] || loan.type}</strong> de <strong>${Number(loan.amount).toLocaleString("fr-FR")} FCFA</strong> sur ${loan.durationMonths} mois.</p>
        <p>Notre équipe va étudier votre dossier. Vous recevrez un email à chaque étape de son traitement, et pouvez suivre son statut à tout moment depuis votre tableau de bord :</p>
        <p><a href="${FRONTEND_URL}/dashboard">${FRONTEND_URL}/dashboard</a></p>
      `,
    });
    console.log("Email d'accuse de reception envoye au client");
  } catch (err) {
    console.error("Erreur envoi email accuse de reception:", err.message);
  }
};

// Notification au client a chaque changement de statut de son dossier.
// Avant cette fonction, le client n'etait informe des changements que via
// socket.io (donc uniquement s'il avait l'app ouverte au bon moment) : il
// n'avait sinon aucune raison de revenir sur la plateforme.
const sendLoanStatusEmail = async (loan) => {
  const dashboardLink = `<p><a href="${FRONTEND_URL}/dashboard">${FRONTEND_URL}/dashboard</a></p>`;
  const typeLabel = LOAN_TYPE_LABELS[loan.type] || loan.type;

  let subject;
  let html;

  if (loan.status === "payment_required") {
    let montant = 10000;
    try {
      const Settings = require("./models/Settings");
      const setting = await Settings.findOne({ key: "paymentInfo" });
      if (setting?.value?.montant) montant = setting.value.montant;
    } catch {
      // si le montant n'est pas disponible, on garde la valeur par defaut
    }
    subject = "Votre dossier avance : frais d'enrôlement requis";
    html = `
      <h2>Bonjour ${loan.fullName},</h2>
      <p>Votre demande de prêt ${typeLabel} a été examinée. Pour poursuivre le traitement de votre dossier, des frais d'enrôlement de <strong>${Number(montant).toLocaleString("fr-FR")} FCFA</strong> sont requis.</p>
      <p>Les modalités de paiement sont disponibles dans votre espace client :</p>
      ${dashboardLink}
    `;
  } else if (loan.status === "payment_done") {
    subject = "Paiement confirmé — dossier en cours de finalisation";
    html = `
      <h2>Bonjour ${loan.fullName},</h2>
      <p>Nous confirmons la bonne réception de votre paiement pour votre demande de prêt ${typeLabel}. Votre dossier est maintenant en cours de validation finale.</p>
      ${dashboardLink}
    `;
  } else if (loan.status === "approved") {
    subject = "Votre demande de prêt a été approuvée";
    html = `
      <h2>Bonjour ${loan.fullName},</h2>
      <p>Bonne nouvelle : votre demande de prêt ${typeLabel} de ${Number(loan.amount).toLocaleString("fr-FR")} FCFA a été <strong>approuvée</strong>. Notre équipe va vous contacter pour la suite.</p>
      ${dashboardLink}
    `;
  } else if (loan.status === "rejected") {
    subject = "Mise à jour de votre demande de prêt";
    html = `
      <h2>Bonjour ${loan.fullName},</h2>
      <p>Nous sommes au regret de vous informer que votre demande de prêt ${typeLabel} n'a pas pu être approuvée à ce stade.</p>
      ${dashboardLink}
    `;
  } else {
    return;
  }

  try {
    await transporter.sendMail({
      from: `"MoneyGreen" <${process.env.EMAIL_FROM}>`,
      to: loan.email,
      subject,
      html,
    });
    console.log(`Email de statut (${loan.status}) envoye au client`);
  } catch (err) {
    console.error("Erreur envoi email statut:", err.message);
  }
};

// Lien de reinitialisation de mot de passe. sendMail peut echouer/etre lent :
// on ne l'attend jamais dans le chemin de reponse HTTP (voir auth.controller.js).
const sendPasswordResetEmail = async (user, resetLink) => {
  try {
    await transporter.sendMail({
      from: `"MoneyGreen" <${process.env.EMAIL_FROM}>`,
      to: user.email,
      subject: "Réinitialisez votre mot de passe MoneyGreen",
      html: `
        <h2>Bonjour ${user.username},</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour en choisir un nouveau :</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.</p>
      `,
    });
    console.log("Email de reinitialisation envoye");
  } catch (err) {
    console.error("Erreur envoi email de reinitialisation:", err.message);
  }
};

module.exports = { sendLoanNotification, sendLoanReceivedEmail, sendLoanStatusEmail, sendPasswordResetEmail, FRONTEND_URL };

