const Loan = require("../models/Loan");
const { sendLoanNotification } = require("../mailer");

// CREATE LOAN REQUEST
const createLoan = async (req, res) => {
  try {
    const {
      type,
      fullName,
      phoneNumber,
      email,
      amount,
      durationMonths,
      monthlyIncome,
      purpose,
    } = req.body;

    // On ne fait jamais confiance a un userId envoye par le client :
    // on prend l'identite verifiee par le token JWT.
    const userId = req.user.id;

    if (!userId || !type || !fullName || !phoneNumber || !email || !amount || !durationMonths) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    const loan = new Loan({
      userId,
      type,
      fullName,
      phoneNumber,
      email,
      amount,
      durationMonths,
      monthlyIncome,
      purpose,
    });
    await loan.save();

    const populatedLoan = await Loan.findById(loan._id).populate("userId", "username email phoneNumber");

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("loan_created", populatedLoan);
    }
    await sendLoanNotification(populatedLoan);

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
