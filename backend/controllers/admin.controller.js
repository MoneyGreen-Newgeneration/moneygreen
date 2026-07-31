const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Loan = require("../models/Loan");

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLoans = await Loan.countDocuments();
    const pendingLoans = await Loan.countDocuments({ status: "pending" });
    const approvedLoans = await Loan.countDocuments({ status: "approved" });
    const rejectedLoans = await Loan.countDocuments({ status: "rejected" });
    const totalTransactions = await Transaction.countDocuments();
    res.json({ totalUsers, totalLoans, pendingLoans, approvedLoans, rejectedLoans, totalTransactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("userId", "username email phoneNumber").sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }
    const loan = await Loan.findByIdAndUpdate(id, { status }, { new: true }).populate("userId", "username email phoneNumber");
    if (!loan) return res.status(404).json({ message: "Demande introuvable." });

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("loan_updated", loan);
      io.to(loan.userId._id.toString()).emit("loan_updated", loan);
    }

    res.json({ message: "Statut mis à jour", loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({ message: `Statut admin mis à jour`, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { userId, type, amount, category, description } = req.body;
    if (!userId || !type || !amount) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }
    const transaction = new Transaction({ userId, type, amount, category, description, date: new Date() });
    await transaction.save();
    res.status(201).json({ message: "Transaction ajoutée.", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByIdAndUpdate(
      id,
      { status: "payment_required" },
      { new: true }
    ).populate("userId", "username email phoneNumber");
    if (!loan) return res.status(404).json({ message: "Demande introuvable." });

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("loan_updated", loan);
      io.to(loan.userId._id.toString()).emit("loan_updated", loan);
    }

    res.json({ message: "Acces au paiement accorde.", loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByIdAndUpdate(
      id,
      { status: "payment_done" },
      { new: true }
    ).populate("userId", "username email phoneNumber");
    if (!loan) return res.status(404).json({ message: "Demande introuvable." });

    const io = req.app.get("io");
    if (io) {
      io.to("admin").emit("loan_updated", loan);
      io.to(loan.userId._id.toString()).emit("loan_updated", loan);
    }

    res.json({ message: "Paiement confirme.", loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getStats, getAllUsers, getAllLoans, updateLoanStatus, getAllTransactions, toggleAdmin, createTransaction, requestPayment, confirmPayment };
