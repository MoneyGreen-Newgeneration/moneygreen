import api from "./axios";

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email }).then((r) => r.data);

export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword }).then((r) => r.data);
