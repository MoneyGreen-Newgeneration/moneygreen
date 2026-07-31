const express = require("express");
const router = express.Router();
const { protect, ownerOrAdmin } = require("../middleware/auth.middleware");

const {
  getBalance,
  getSummary,
} = require("../controllers/dashboard.controller");

router.get("/balance/:userId", protect, ownerOrAdmin(), getBalance);
router.get("/summary/:userId", protect, ownerOrAdmin(), getSummary);

module.exports = router;
