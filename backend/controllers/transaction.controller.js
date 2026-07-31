const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// CREATE TRANSACTION
// Note defense-en-profondeur : cette route est protegee par les middlewares
// `protect` puis `isAdmin` (voir transaction.routes.js), donc seul un admin
// authentifie peut l'appeler. On revalide quand meme ici pour que ce
// controller reste sur sans danger meme s'il etait un jour monte sur une
// route different mal protegee.
const createTransaction = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Acces reserve aux administrateurs." });
    }

    const { userId, type, amount, category, description } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId invalide." });
    }
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "type invalide (income ou expense attendu)." });
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "amount invalide (nombre positif attendu)." });
    }

    const transaction = new Transaction({
      userId,
      type,
      amount,
      category,
      description,
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction created",
      transaction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER TRANSACTIONS
const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "userId invalide." });
    }

    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTransaction, getTransactions };