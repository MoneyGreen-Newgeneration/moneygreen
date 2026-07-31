import api from "./axios";

export async function fetchBalance(userId) {
  const res = await api.get(`/dashboard/balance/${userId}`);
  return res.data;
}

export async function fetchSummary(userId) {
  const res = await api.get(`/dashboard/summary/${userId}`);
  return res.data;
}

export async function fetchTransactions(userId) {
  const res = await api.get(`/transactions/${userId}`);
  return res.data;
}

export async function createTransaction({ userId, type, amount, category, description }) {
  const res = await api.post("/transactions", {
    userId,
    type,
    amount,
    category,
    description,
  });
  return res.data;
}

export async function fetchUserLoans(userId) {
  const res = await api.get(`/loans/${userId}`);
  return res.data;
}

export async function fetchPaymentInfoClient() {
  const res = await api.get(`/loans/payment-info/view`);
  return res.data;
}
