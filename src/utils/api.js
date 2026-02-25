import axios from "axios";

const baseURL = "https://localhost:7161/api";

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); 
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    console.log("API ERROR:", status, data || err.message);
    return Promise.reject(err);
  }
);

export default api;