const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const { track, getFunnelSummary, getRecentVisitors } = require("../controllers/analytics.controller");

router.post("/track", track);
router.get("/funnel", protect, isAdmin, getFunnelSummary);
router.get("/recent-visitors", protect, isAdmin, getRecentVisitors);

module.exports = router;
