import api from "./axios";

const ANON_ID_KEY = "mg_anon_id";

function getAnonId() {
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `anon-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

// Best-effort : le tracking ne doit jamais casser ou ralentir le parcours
// utilisateur, donc on avale silencieusement les erreurs reseau.
export function track(name, metadata = {}) {
  api.post("/analytics/track", { name, anonId: getAnonId(), metadata }).catch(() => {});
}
