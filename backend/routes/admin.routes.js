const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const {
  getStats,
  getAllUsers,
  getAllLoans,
  updateLoanStatus,
  getAllTransactions,
  toggleAdmin,
  createTransaction,
  requestPayment,
  confirmPayment,
} = require("../controllers/admin.controller");
const { getPaymentInfo, updatePaymentInfo, getDocumentsVisibility, updateDocumentsVisibility } = require("../controllers/settings.controller");

router.use(protect, isAdmin);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.get("/loans", getAllLoans);
router.patch("/loans/:id/status", updateLoanStatus);
router.get("/transactions", getAllTransactions);
router.patch("/users/:id/toggle-admin", toggleAdmin);
router.post("/transactions", createTransaction);
router.patch("/loans/:id/request-payment", requestPayment);
router.patch("/loans/:id/confirm-payment", confirmPayment);
router.get("/payment-info", getPaymentInfo);
router.patch("/payment-info", updatePaymentInfo);
router.get("/documents-visibility", getDocumentsVisibility);
router.patch("/documents-visibility", updateDocumentsVisibility);

module.exports = router;
