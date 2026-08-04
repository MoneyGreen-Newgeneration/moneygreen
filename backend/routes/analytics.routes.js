const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const { track, getFunnelSummary } = require("../controllers/analytics.controller");

router.post("/track", track);
router.get("/funnel", protect, isAdmin, getFunnelSummary);

module.exports = router;
