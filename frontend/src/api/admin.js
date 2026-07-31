import api from "./axios";

export const fetchStats = () => api.get("/admin/stats").then(r => r.data);
export const fetchAllUsers = () => api.get("/admin/users").then(r => r.data);
export const fetchAllLoans = () => api.get("/admin/loans").then(r => r.data);
export const fetchAllTransactions = () => api.get("/admin/transactions").then(r => r.data);
export const updateLoanStatus = (id, status) =>
  api.patch(`/admin/loans/${id}/status`, { status }).then(r => r.data);
export const toggleAdmin = (id) =>
  api.patch(`/admin/users/${id}/toggle-admin`).then(r => r.data);
export const createTransactionAdmin = (data) =>
  api.post("/admin/transactions", data).then(r => r.data);
export const requestLoanPayment = (id) =>
  api.patch(`/admin/loans/${id}/request-payment`).then(r => r.data);
export const confirmLoanPayment = (id) =>
  api.patch(`/admin/loans/${id}/confirm-payment`).then(r => r.data);
export const fetchPaymentInfo = () =>
  api.get("/admin/payment-info").then(r => r.data);
export const updatePaymentInfo = (data) =>
  api.patch("/admin/payment-info", data).then(r => r.data);
