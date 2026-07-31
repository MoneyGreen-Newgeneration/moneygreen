const express = require("express");
const router = express.Router();
const { protect, isAdmin, ownerOrAdmin } = require("../middleware/auth.middleware");
const { getMessages, getAllConversations, markAsRead } = require("../controllers/chat.controller");

router.get("/conversations", protect, isAdmin, getAllConversations);
router.get("/:userId", protect, ownerOrAdmin(), getMessages);
router.patch("/:userId/read", protect, ownerOrAdmin(), markAsRead);

module.exports = router;
