const Settings = require("../models/Settings");

const getPaymentInfo = async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: "paymentInfo" });
    const defaultInfo = {
      mtnNumber: "",
      mtnName: "",
      orangeNumber: "",
      orangeName: "",
      accountNumber: "",
      accountName: "",
      montant: 10000,
    };
    res.json(setting ? setting.value : defaultInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePaymentInfo = async (req, res) => {
  try {
    const { mtnNumber, mtnName, orangeNumber, orangeName, accountNumber, accountName, montant } = req.body;
    const value = { mtnNumber, mtnName, orangeNumber, orangeName, accountNumber, accountName, montant: Number(montant) || 10000 };
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

module.exports = { getPaymentInfo, updatePaymentInfo };
