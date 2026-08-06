import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SOCKET_URL } from "../config";

const SocketContext = createContext(null);

// Connexion socket unique, montee une seule fois pour toute l'application
// (au-dessus des routes) plutot que par page : avant ca, un visiteur
// "disparaissait" de la presence en direct de l'admin des qu'il changeait de
// page, chaque page ouvrant/fermant sa propre connexion independamment.
export function SocketProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = isAuthenticated ? io(SOCKET_URL, { auth: { token } }) : io(SOCKET_URL);
    if (isAuthenticated) s.emit("join");
    setSocket(s);
    return () => s.disconnect();
  }, [isAuthenticated, token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
