const express = require("express");
const router = express.Router();
const { protect, ownerOrAdmin } = require("../middleware/auth.middleware");
const { createLoan, getUserLoans } = require("../controllers/loan.controller");
const { getPaymentInfo } = require("../controllers/settings.controller");

router.post("/", protect, createLoan);
router.get("/:userId", protect, ownerOrAdmin(), getUserLoans);
router.get("/payment-info/view", protect, getPaymentInfo);

module.exports = router;
