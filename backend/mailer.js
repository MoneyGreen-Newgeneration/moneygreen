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

module.exports = { sendLoanNotification };

