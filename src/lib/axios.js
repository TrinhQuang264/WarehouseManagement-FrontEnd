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
    
    // Nếu gặp lỗi 401 (Hết hạn hoặc sai token)
    if (status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      
      // Nếu không phải đang ở trang login thì redirect
      if (!window.location.pathname.includes('/login')) {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(err);
  }
);

export default api;