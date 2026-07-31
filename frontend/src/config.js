// Configuration centralisée des URLs API / Socket.io.
// En développement, on retombe sur localhost si les variables
// d'environnement REACT_APP_* ne sont pas définies.
export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const SOCKET_URL =
  process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
