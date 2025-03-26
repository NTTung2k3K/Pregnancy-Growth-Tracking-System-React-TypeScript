import axios from "axios";
import { CookiesTokenService } from "./cookies.service";

export const BASE_URL = "https://babycare.up.railway.app/api";
// export const BASE_URL = "https://localhost:7286/api";

export const configHeaders = () => {
  return {
    Authorization: `Bearer ${CookiesTokenService.get()}`,
    "Content-Type": "application/json",
  };
};

export const https = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = CookiesTokenService.get()
      const currentPath = window.location.pathname; // Lấy URL của frontend

      // Nếu frontend URL chứa "dashboard" hoặc "admin" thì gắn token vào API request
      if (token && (currentPath.includes("dashboard") || currentPath.includes("admin"))) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
