const express = require("express");
const router = express.Router();
const { protect, isAdmin } = require("../middleware/auth.middleware");
const { getTeamMessages } = require("../controllers/teamchat.controller");

router.get("/", protect, isAdmin, getTeamMessages);

module.exports = router;
