import api from "./axios";

export async function createLoan(payload) {
  const res = await api.post("/loans", payload);
  return res.data;
}

export async function fetchUserLoans(userId) {
  const res = await api.get(`/loans/${userId}`);
  return res.data;
}
