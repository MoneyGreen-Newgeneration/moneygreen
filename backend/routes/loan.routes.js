const express = require("express");
const router = express.Router();
const { protect, ownerOrAdmin } = require("../middleware/auth.middleware");
const { createLoan, getUserLoans } = require("../controllers/loan.controller");
const { getPaymentInfo, getDocumentsVisibility } = require("../controllers/settings.controller");

router.post("/", protect, createLoan);
router.get("/:userId", protect, ownerOrAdmin(), getUserLoans);
router.get("/payment-info/view", protect, getPaymentInfo);
router.get("/documents-visibility/view", protect, getDocumentsVisibility);

module.exports = router;
