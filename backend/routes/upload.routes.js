const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect, isAdmin } = require("../middleware/auth.middleware");
const { uploadChatImage, uploadLoanDocument, uploadPaymentLogo } = require("../controllers/upload.controller");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Seules les images sont autorisées."));
  },
});

const uploadDocument = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Seules les images et les fichiers PDF sont autorisés."));
  },
});

router.post("/chat-image", protect, upload.single("image"), uploadChatImage);
router.post("/loan-document", protect, uploadDocument.single("document"), uploadLoanDocument);
router.post("/payment-logo", protect, isAdmin, upload.single("image"), uploadPaymentLogo);

module.exports = router;
