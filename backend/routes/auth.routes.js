const express = require("express");
const router = express.Router();

const { register, login, resetPasswordByPhone } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password-by-phone", resetPasswordByPhone);

module.exports = router;