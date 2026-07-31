const express = require("express");
const router = express.Router();
const { protect, isAdmin, ownerOrAdmin } = require("../middleware/auth.middleware");

const {
  createTransaction,
  getTransactions,
} = require("../controllers/transaction.controller");

// Seul un admin peut créer une transaction pour un utilisateur (crédit/débit de compte)
router.post("/", protect, isAdmin, createTransaction);
router.get("/:userId", protect, ownerOrAdmin(), getTransactions);

module.exports = router;
