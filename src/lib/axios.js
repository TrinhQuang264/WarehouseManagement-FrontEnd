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
  async (err) => {
    const originalConfig = err.config;
    const status = err?.response?.status;
    const data = err?.response?.data;
    
    // Nếu lỗi 401 và chưa từng thử refresh token (tránh lặp vô hạn)
    if (status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      
      try {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) {
          throw new Error("Không có refresh token");
        }

        // Gọi API sử dụng axios mặc định (không qua api instance) để tránh kẹt trong interceptor đang lỗi 401 này
        const response = await axios.post(`${baseURL}/Authentication/refresh-token`, {
          refreshToken: storedRefreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        if (newAccessToken) {
          // Lưu token mới
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Gắn token mới vào request bị lỗi và thử gọi lại (retry)
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalConfig);
        }
      } catch (refreshError) {
        console.error("Lỗi khi refresh token:", refreshError);
        // Refresh token cũng hết hạn hoặc không hợp lệ -> Xóa toàn bộ và bắt đăng nhập lại
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Nếu lỗi không phải 401, hoặc đã retry mà vẫn lỗi thì log ra và trả về lỗi
    console.log("API ERROR:", status, data || err.message);
    if (status === 401) {
      // Đảm bảo xóa session nếu bị 401 lần thứ 2
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;