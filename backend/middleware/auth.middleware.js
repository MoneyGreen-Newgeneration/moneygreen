const jwt = require("jsonwebtoken");

// Verifie le token JWT envoye par le frontend (header Authorization: Bearer <token>)
// et attache l'utilisateur decode a req.user
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non authentifie." });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, isAdmin: decoded.isAdmin };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Session invalide ou expirée." });
  }
};

// A utiliser APRES protect : bloque les non-admins
const isAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Acces reserve aux administrateurs." });
  }
  next();
};

// A utiliser APRES protect sur des routes /:userId :
// autorisé seulement le propriétaire des données ou un admin
const ownerOrAdmin = (paramName = "userId") => (req, res, next) => {
  const targetId = req.params[paramName];
  if (req.user.isAdmin || req.user.id === targetId) {
    return next();
  }
  return res.status(403).json({ message: "Accès non autorisé." });
};

module.exports = { protect, isAdmin, ownerOrAdmin };
