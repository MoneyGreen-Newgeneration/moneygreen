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

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const countUniqueVisitors = async (since) => {
  const rows = await Event.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: null, uniqueVisitors: { $addToSet: "$anonId" } } },
    { $project: { _id: 0, uniqueVisitors: { $size: "$uniqueVisitors" } } },
  ]);
  return rows[0]?.uniqueVisitors || 0;
};

// Vue d'ensemble du funnel : nombre d'evenements et de visiteurs uniques
// (anonId distincts) par nom d'evenement sur 30 jours, plus le total de
// visiteurs uniques sur trois fenetres (24h / 7j / 30j) pour la vue admin.
const getFunnelSummary = async (req, res) => {
  try {
    const since30 = daysAgo(30);
    const [byEvent, last24h, last7d, last30d] = await Promise.all([
      Event.aggregate([
        { $match: { createdAt: { $gte: since30 } } },
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
      ]),
      countUniqueVisitors(daysAgo(1)),
      countUniqueVisitors(daysAgo(7)),
      countUniqueVisitors(daysAgo(30)),
    ]);
    res.json({ events: byEvent, uniqueVisitors: { last24h, last7d, last30d } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Liste des derniers visiteurs distincts (un par anonId), avec leur nom si
// l'evenement le plus recent est rattache a un compte connu, sinon marque
// comme anonyme - on ne peut pas connaitre l'identite de quelqu'un qui n'a
// pas encore cree de compte.
const getRecentVisitors = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .limit(300)
      .populate("userId", "username")
      .lean();

    const seen = new Set();
    const visitors = [];
    for (const e of events) {
      if (seen.has(e.anonId)) continue;
      seen.add(e.anonId);
      visitors.push({
        anonId: e.anonId,
        name: e.userId?.username || null,
        lastEvent: e.name,
        at: e.createdAt,
      });
      if (visitors.length >= 30) break;
    }
    res.json({ visitors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { track, getFunnelSummary, getRecentVisitors };
