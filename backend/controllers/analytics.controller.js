const jwt = require("jsonwebtoken");
const Event = require("../models/Event");

// Le tracking doit fonctionner avant connexion (vue de la page d'inscription,
// par exemple) donc cette route n'est pas protegee par le middleware `protect`.
// On decode quand meme le token s'il est present, pour relier l'evenement a
// un utilisateur connu quand c'est possible.
function extractUserId(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return undefined;
  try {
    const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return undefined;
  }
}

const track = async (req, res) => {
  try {
    const { name, anonId, metadata } = req.body;
    if (!name || !anonId) {
      return res.status(400).json({ message: "name et anonId requis." });
    }
    const userId = extractUserId(req);
    await Event.create({ name, anonId, userId, metadata });
    res.status(201).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vue d'ensemble du funnel : nombre d'evenements et de visiteurs uniques
// (anonId distincts) par nom d'evenement, sur les 30 derniers jours.
const getFunnelSummary = async (req, res) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const rows = await Event.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: "$name",
          count: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$anonId" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" },
        },
      },
      { $sort: { uniqueVisitors: -1 } },
    ]);
    res.json({ since, events: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { track, getFunnelSummary };
