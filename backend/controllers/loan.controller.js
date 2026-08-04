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
    } = req.body;

    // On ne fait jamais confiance a un userId envoye par le client :
    // on prend l'identite verifiee par le token JWT.
    const userId = req.user.id;

    if (!userId || !type || !fullName || !phoneNumber || !email || !country || !city || !neighborhood || !profession || !amount || !durationMonths) {
      return res.status(400).json({ message: "Champs requis manquants." });
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
    });
    await loan.save();

    const populatedLoan = await Loan.findById(loan._id).populate("userId", "username email phoneNumber");

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("loan_created", populatedLoan);
    }
    await sendLoanNotification(populatedLoan);
    await sendLoanReceivedEmail(populatedLoan);

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
