import api from "./axios";

export async function uploadLoanDocument(file) {
  const formData = new FormData();
  formData.append("document", file);
  const response = await api.post("/upload/loan-document", formData);
  return response.data; // { url, name }
}
