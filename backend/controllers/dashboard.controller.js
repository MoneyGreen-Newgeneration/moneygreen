const Transaction = require("../models/Transaction");

// TOTAL BALANCE
const getBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId });

    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    res.json({
      income,
      expense,
      balance: income - expense,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TRANSACTIONS SUMMARY (for charts)
const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId });

    const summary = {};

    transactions.forEach(t => {
      if (!summary[t.category]) {
        summary[t.category] = 0;
      }
      summary[t.category] += t.amount;
    });

    res.json(summary);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getBalance, getSummary };