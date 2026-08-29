import api from "./axios";

export const resetPasswordByPhone = (phoneNumber, newPassword) =>
  api.post("/auth/reset-password-by-phone", { phoneNumber, newPassword }).then((r) => r.data);
