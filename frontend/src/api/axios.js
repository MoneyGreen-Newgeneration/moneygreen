import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  // Sans timeout, une reponse reseau perdue laisse la requete en attente
  // indefiniment cote client (l'overlay de chargement ne se ferme alors
  // jamais, meme si le serveur a deja bien enregistre la demande).
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
