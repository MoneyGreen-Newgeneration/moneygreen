const TeamMessage = require("../models/TeamMessage");
const getTeamMessages = async (req, res) => {
  try {
    const messages = await TeamMessage.find().sort({ createdAt: 1 }).limit(200);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getTeamMessages };
