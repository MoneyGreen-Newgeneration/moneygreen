// Limiteur en memoire, sans dependance externe : suffisant pour une seule
// instance de serveur et evite d'ajouter un paquet pour un seul endpoint.
const attempts = new Map();

function isRateLimited(key, maxAttempts, windowMs) {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.start > windowMs) {
    attempts.set(key, { count: 1, start: now });
    return false;
  }

  entry.count += 1;
  return entry.count > maxAttempts;
}

module.exports = { isRateLimited };
