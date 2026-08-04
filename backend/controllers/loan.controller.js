const Loan = require("../models/Loan");
const { sendLoanNotification, sendLoanReceivedEmail } = require("../mailer");

// CREATE LOAN REQUEST
const createLoan = async (req, res) => {
  try {
    const {
      type,
      fullName,
      phoneNumber,
      email,
      country,
      city,
      neighborhood,
      profession,
      amount,
      durationMonths,
      monthlyIncome,
      purpose,
      documents,
      idempotencyKey,
    } = req.body;

    // On ne fait jamais confiance a un userId envoye par le client :
    // on prend l'identite verifiee par le token JWT.
    const userId = req.user.id;

    if (!userId || !type || !fullName || !phoneNumber || !email || !country || !city || !neighborhood || !profession || !amount || !durationMonths) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    // Si le frontend retente l'envoi apres un timeout reseau (le serveur avait
    // peut-etre deja enregistre la demande la premiere fois), on renvoie le
    // dossier existant au lieu d'en creer un doublon.
    if (idempotencyKey) {
      const existingLoan = await Loan.findOne({ idempotencyKey, userId }).populate("userId", "username email phoneNumber");
      if (existingLoan) {
        return res.status(200).json({ message: "Demande de prêt déjà enregistrée", loan: existingLoan });
      }
    }

    const cleanDocuments = Array.isArray(documents)
      ? documents.filter((d) => d && typeof d.url === "string" && typeof d.label === "string")
      : [];

    // Le recto et le verso de la CNI sont les seuls documents obligatoires
    // (les autres pieces justificatives sont facultatives a ce stade pour ne
    // pas bloquer les clients qui ne les ont pas encore sous la main).
    if (cleanDocuments.length < 2) {
      return res.status(400).json({ message: "Le recto et le verso de la CNI sont requis." });
    }

    const loan = new Loan({
      userId,
      type,
      fullName,
      phoneNumber,
      email,
      country,
      city,
      neighborhood,
      profession,
      amount,
      durationMonths,
      monthlyIncome,
      purpose,
      documents: cleanDocuments,
      idempotencyKey,
    });

    try {
      await loan.save();
    } catch (err) {
      // Deux requetes portant la meme cle sont arrivees en meme temps : celle
      // qui a perdu la course renvoie le dossier cree par l'autre.
      if (err.code === 11000 && idempotencyKey) {
        const concurrentLoan = await Loan.findOne({ idempotencyKey, userId }).populate("userId", "username email phoneNumber");
        if (concurrentLoan) {
          return res.status(200).json({ message: "Demande de prêt déjà enregistrée", loan: concurrentLoan });
        }
      }
      throw err;
    }

    const populatedLoan = await Loan.findById(loan._id).populate("userId", "username email phoneNumber");

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("loan_created", populatedLoan);
    }
    // Ne jamais faire attendre la reponse HTTP sur l'envoi des emails : une
    // lenteur SMTP retarderait (ou ferait echouer via le timeout client) une
    // demande deja bien enregistree. sendLoanNotification/sendLoanReceivedEmail
    // geren deja leurs propres erreurs en interne (elles ne rejettent jamais).
    sendLoanNotification(populatedLoan);
    sendLoanReceivedEmail(populatedLoan);

    res.status(201).json({
      message: "Demande de prêt envoyée",
      loan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER LOANS
const getUserLoans = async (req, res) => {
  try {
    const { userId } = req.params;
    const loans = await Loan.find({ userId }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createLoan, getUserLoans };
