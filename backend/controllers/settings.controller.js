const Settings = require("../models/Settings");

const getPaymentInfo = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: "paymentInfo" });
    const defaultInfo = {
      mtnNumber: "",
      mtnName: "",
      orangeNumber: "",
      orangeName: "",
      waveNumber: "",
      waveName: "",
      accountNumber: "",
      accountName: "",
      mtnLogoUrl: "",
      orangeLogoUrl: "",
      waveLogoUrl: "",
      montant: 10000,
    };
    res.json(setting ? setting.value : defaultInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePaymentInfo = async (req, res) => {
  try {
    const { mtnNumber, mtnName, orangeNumber, orangeName, waveNumber, waveName, accountNumber, accountName, mtnLogoUrl, orangeLogoUrl, waveLogoUrl, montant } = req.body;
    const value = {
      mtnNumber, mtnName, orangeNumber, orangeName, waveNumber, waveName, accountNumber, accountName,
      mtnLogoUrl, orangeLogoUrl, waveLogoUrl,
      montant: Number(montant) || 10000,
    };
    await Settings.findOneAndUpdate(
      { key: "paymentInfo" },
      { value },
      { upsert: true, new: true }
    );
    res.json({ message: "Informations de paiement mises à jour.", value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDocumentsVisibility = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: "documentsVisibility" });
    res.json({ visible: setting ? setting.value.visible : true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDocumentsVisibility = async (req, res) => {
  try {
    const value = { visible: !!req.body.visible };
    await Settings.findOneAndUpdate(
      { key: "documentsVisibility" },
      { value },
      { upsert: true, new: true }
    );
    res.json({ message: "Visibilité de la section documents mise à jour.", value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getPaymentInfo, updatePaymentInfo, getDocumentsVisibility, updateDocumentsVisibility };
