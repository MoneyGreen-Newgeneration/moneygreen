const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const streamUpload = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadChatImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé." });
    }
    const result = await streamUpload(req.file.buffer, { folder: "moneygreen/chat" });
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pieces justificatives jointes a une demande de pret (CNI, bulletins de
// salaire, releves bancaires...). Stockees a part du chat, dans un dossier
// dedie, et acceptees en resource_type "auto" car ce sont parfois des PDF.
const uploadLoanDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier envoyé." });
    }
    const result = await streamUpload(req.file.buffer, {
      folder: "moneygreen/loan-documents",
      resource_type: "auto",
    });
    res.json({ url: result.secure_url, name: req.file.originalname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadChatImage, uploadLoanDocument };
